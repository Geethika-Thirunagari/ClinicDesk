from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile


def get_tokens_for_user(user):
    """Generate JWT Access + Refresh token pair for a user."""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Real JWT Login: authenticates against Django's User database.
    Returns access + refresh tokens and the user's profile data.
    """
    email = request.data.get('email', '').strip()
    password = request.data.get('password', '').strip()

    if not email or not password:
        return Response(
            {"error": "Please provide both email and password."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Find the user by email
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {"error": "No account found with that email address."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Authenticate (check password hash)
    user = authenticate(request, username=user.username, password=password)
    if user is None:
        return Response(
            {"error": "Invalid password. Please try again."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Get or create the user's role profile
    try:
        profile = user.profile
        role = profile.role
    except UserProfile.DoesNotExist:
        # Default to 'admin' for superusers, 'patient' otherwise
        role = 'admin' if user.is_superuser else 'patient'

    tokens = get_tokens_for_user(user)

    return Response({
        "user": {
            "id": user.id,
            "name": user.get_full_name() or user.username,
            "email": user.email,
            "role": role,
        },
        "token": tokens['access'],
        "refresh": tokens['refresh'],
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """Returns the current user's profile. Requires a valid JWT token."""
    user = request.user
    try:
        role = user.profile.role
    except UserProfile.DoesNotExist:
        role = 'admin' if user.is_superuser else 'patient'

    return Response({
        "id": user.id,
        "name": user.get_full_name() or user.username,
        "email": user.email,
        "role": role,
    })
