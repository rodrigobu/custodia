from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from ninja_jwt.tokens import RefreshToken

User = get_user_model()


def register_user(data: dict) -> dict:
    email = data["email"].lower().strip()

    if User.objects.filter(email=email).exists():
        raise ValueError("Este email já está cadastrado.")

    try:
        validate_password(data["password"])
    except ValidationError as e:
        raise ValueError(" ".join(e.messages))

    user = User.objects.create_user(
        username=email,
        email=email,
        password=data["password"],
        first_name=data.get("first_name", ""),
        last_name=data.get("last_name", ""),
    )

    refresh = RefreshToken.for_user(user)
    return {
        "user": user,
        "tokens": {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        },
    }


def authenticate_user(email: str, password: str) -> dict:
    email = email.lower().strip()

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        raise ValueError("Email ou senha inválidos.")

    if not user.check_password(password):
        raise ValueError("Email ou senha inválidos.")

    if not user.is_active:
        raise ValueError("Conta desativada.")

    refresh = RefreshToken.for_user(user)
    return {
        "user": user,
        "tokens": {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        },
    }


def refresh_access_token(refresh_token: str) -> dict:
    try:
        refresh = RefreshToken(refresh_token)
        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
    except Exception:
        raise ValueError("Token inválido ou expirado.")
