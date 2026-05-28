from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import time

@api_view(['POST'])
@permission_classes([AllowAny])
def analyze_symptoms(request):
    """
    Mock AI Endpoint: Analyzes patient symptoms and returns diagnosis probabilities.
    In a real app, this would route to a TensorFlow/PyTorch model, or call an LLM API.
    """
    symptoms_text = request.data.get('symptoms', '').lower()
    
    # Simulate processing delay to mimic AI inference time
    time.sleep(1.2)
    
    if not symptoms_text:
        return Response({"error": "No symptoms provided."}, status=400)

    # Simulated AI logic
    if "chest pain" in symptoms_text or "shortness of breath" in symptoms_text:
        return Response({
            "severity": "CRITICAL",
            "confidence": "94%",
            "predictions": [
                {"condition": "Myocardial Infarction", "probability": 88},
                {"condition": "Pulmonary Embolism", "probability": 72},
                {"condition": "Severe Angina", "probability": 65}
            ],
            "recommendations": [
                "IMMEDIATE ER TRIAGE REQUIRED", 
                "Order STAT EKG and Troponin levels",
                "Administer Oxygen"
            ]
        })
        
    elif "fever" in symptoms_text and ("cough" in symptoms_text or "throat" in symptoms_text):
        return Response({
            "severity": "MODERATE",
            "confidence": "89%",
            "predictions": [
                {"condition": "Viral Upper Respiratory Infection", "probability": 85},
                {"condition": "Influenza", "probability": 60},
                {"condition": "Acute Bronchitis", "probability": 45}
            ],
            "recommendations": [
                "Recommend rest and hydration", 
                "Consider Rapid PCR Test",
                "Prescribe Antipyretics"
            ]
        })
        
    elif "headache" in symptoms_text and "vision" in symptoms_text:
        return Response({
            "severity": "HIGH",
            "confidence": "81%",
            "predictions": [
                {"condition": "Migraine with Aura", "probability": 78},
                {"condition": "Ocular Hypertension", "probability": 40}
            ],
            "recommendations": [
                "Conduct neurological exam",
                "Refer to Optometry/Neurology",
                "Dim lighting in exam room"
            ]
        })

    # Default fallback
    return Response({
        "severity": "LOW",
        "confidence": "60%",
        "predictions": [
            {"condition": "Generalized Fatigue / Idiopathic", "probability": 55}
        ],
        "recommendations": [
            "Order standard CBC blood panel",
            "Schedule follow-up in 48 hours"
        ]
    })
