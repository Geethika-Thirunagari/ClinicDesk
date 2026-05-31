"""
Google Gemini integration for ClinicDesk AI features.
Set GOOGLE_GEMINI_API_KEY in backend/.env (never commit the real key).
"""
import json
import logging
import re
from typing import List, Optional

from django.conf import settings
from google import genai


logger = logging.getLogger(__name__)

SYMPTOM_JSON_SCHEMA = """
{
  "severity": "LOW or MODERATE or HIGH or CRITICAL",
  "confidence": "e.g. 85%",
  "predictions": [{"condition": "name", "probability": 0-100}],
  "recommendations": ["clear actionable step", "..."]
}
"""


FALLBACK_MODELS = (
    "gemini-2.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
)


def _generate_with_fallback(prompt: str) -> str:
    if not settings.GOOGLE_GEMINI_API_KEY:
        raise ValueError("GOOGLE_GEMINI_API_KEY not configured")

    client = genai.Client(api_key=settings.GOOGLE_GEMINI_API_KEY)
    models = [settings.GEMINI_MODEL, *FALLBACK_MODELS]
    seen = set()
    last_error = None

    for model_name in models:
        if not model_name or model_name in seen:
            continue
        seen.add(model_name)
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            return response.text
        except Exception as exc:
            last_error = exc
            logger.warning("Gemini model %s failed: %s", model_name, exc)

    if last_error:
        raise last_error
    raise RuntimeError("No Gemini model available")


def _parse_json_response(text: str) -> dict:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)
    return json.loads(cleaned)


def mock_analyze_symptoms(symptoms_text: str) -> dict:
    """Offline fallback when Gemini is unavailable."""
    symptoms = symptoms_text.lower()

    if "chest pain" in symptoms or "shortness of breath" in symptoms:
        return {
            "severity": "CRITICAL",
            "confidence": "94%",
            "predictions": [
                {"condition": "Myocardial Infarction", "probability": 88},
                {"condition": "Pulmonary Embolism", "probability": 72},
                {"condition": "Severe Angina", "probability": 65},
            ],
            "recommendations": [
                "IMMEDIATE ER TRIAGE REQUIRED",
                "Order STAT EKG and Troponin levels",
                "Administer Oxygen",
            ],
        }

    if (
        "cold" in symptoms
        or "cough" in symptoms
        or "sore throat" in symptoms
        or "runny" in symptoms
        or "congestion" in symptoms
        or "sneez" in symptoms
        or "throat" in symptoms
        or ("fever" in symptoms and ("cough" in symptoms or "throat" in symptoms))
    ):
        return {
            "severity": "MODERATE",
            "confidence": "89%",
            "predictions": [
                {"condition": "Viral Upper Respiratory Infection", "probability": 85},
                {"condition": "Influenza", "probability": 60},
                {"condition": "Acute Bronchitis", "probability": 45},
            ],
            "recommendations": [
                "Rest, fluids, and monitor temperature",
                "Consider rapid strep or flu test if fever persists",
                "Use saline nasal spray or steam for congestion",
                "OTC acetaminophen or ibuprofen for fever and aches",
            ],
        }

    if "headache" in symptoms and "vision" in symptoms:
        return {
            "severity": "HIGH",
            "confidence": "81%",
            "predictions": [
                {"condition": "Migraine with Aura", "probability": 78},
                {"condition": "Ocular Hypertension", "probability": 40},
            ],
            "recommendations": [
                "Conduct neurological exam",
                "Refer to Optometry/Neurology",
                "Dim lighting in exam room",
            ],
        }

    return {
        "severity": "LOW",
        "confidence": "60%",
        "predictions": [
            {"condition": "Generalized Fatigue / Idiopathic", "probability": 55}
        ],
        "recommendations": [
            "Order standard CBC blood panel",
            "Schedule follow-up in 48 hours",
            "Continue monitoring symptoms during teleconsult",
        ],
    }


def analyze_symptoms_with_gemini(symptoms_text: str) -> Optional[dict]:
    if not settings.GOOGLE_GEMINI_API_KEY:
        return None

    prompt = f"""You are a clinical triage assistant for a telemedicine demo (ClinicDesk).
Analyze the patient's symptoms and return ONLY valid JSON matching this schema (no markdown):
{SYMPTOM_JSON_SCHEMA}

Rules:
- severity CRITICAL for possible heart attack, stroke, severe breathing difficulty
- Give 2-4 predictions with probability integers 0-100
- Give 3-5 practical recommendations for doctor and patient
- This is educational; remind urgent cases to seek emergency care

Patient symptoms:
{symptoms_text.strip()}
"""

    try:
        text = _generate_with_fallback(prompt)
        return _parse_json_response(text)
    except Exception as exc:
        logger.warning("Gemini symptom analysis failed: %s", exc)
        return None


def chat_with_gemini(
    message: str, history: Optional[List] = None, context: str = "general"
) -> Optional[str]:
    if not settings.GOOGLE_GEMINI_API_KEY:
        return None

    context_hints = {
        "clinic_admin": "You help clinic administrators with operations, revenue, staffing, and scheduling insights.",
        "doctor": "You help doctors with clinical reasoning, differential diagnosis ideas, and teleconsult guidance.",
        "teleconsult": "You support live video visits: clear, empathetic, actionable advice for patients and doctors.",
        "general": "You assist ClinicDesk healthcare staff.",
    }
    hint = context_hints.get(context, context_hints["general"])

    history_lines = []
    for item in (history or [])[-12:]:
        role = item.get("role", "user")
        text = item.get("text", "")
        if text:
            history_lines.append(f"{role}: {text}")

    conversation = "\n".join(history_lines)
    prompt = f"""You are ClinicDesk AI assistant. {hint}
Be concise (2-5 sentences unless more detail is needed). Professional and warm.
For medical questions: educational guidance only; advise seeing a licensed provider for diagnosis.
Do not claim to be a substitute for emergency services.

Previous messages:
{conversation or "(none)"}

User: {message.strip()}

Assistant:"""

    try:
        return _generate_with_fallback(prompt).strip()
    except Exception as exc:
        logger.warning("Gemini chat failed: %s", exc)
        return None
