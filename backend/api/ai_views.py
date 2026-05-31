from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .gemini_service import (
    analyze_symptoms_with_gemini,
    chat_with_gemini,
    mock_analyze_symptoms,
)


@api_view(['POST'])
@permission_classes([AllowAny])
def analyze_symptoms(request):
    """Analyze patient symptoms — uses Google Gemini when API key is configured."""
    symptoms_text = request.data.get('symptoms', '').strip()

    if not symptoms_text:
        return Response({"error": "No symptoms provided."}, status=status.HTTP_400_BAD_REQUEST)

    result = analyze_symptoms_with_gemini(symptoms_text)
    if result:
        return Response(result)

    return Response(mock_analyze_symptoms(symptoms_text))


@api_view(['POST'])
@permission_classes([AllowAny])
def ai_chat(request):
    """General AI assistant chat (sidebar overlay, doctor workspace)."""
    message = request.data.get('message', '').strip()
    history = request.data.get('history', [])
    context = request.data.get('context', 'general')

    if not message:
        return Response({"error": "No message provided."}, status=status.HTTP_400_BAD_REQUEST)

    reply = chat_with_gemini(message, history=history, context=context)
    if reply:
        return Response({"reply": reply, "source": "gemini"})

    return Response(
        {
            "reply": (
                "AI is not configured or temporarily unavailable. "
                "Add GOOGLE_GEMINI_API_KEY to backend/.env and restart the server."
            ),
            "source": "fallback",
        }
    )
