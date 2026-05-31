from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import login_view, profile_view
from .ai_views import analyze_symptoms, ai_chat

urlpatterns = [
    # Auth Endpoints
    path('auth/login/', login_view, name='login'),
    path('auth/me/', profile_view, name='profile'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # AI Engine Endpoints
    path('ai/analyze-symptoms/', analyze_symptoms, name='analyze_symptoms'),
    path('ai/chat/', ai_chat, name='ai_chat'),
]
