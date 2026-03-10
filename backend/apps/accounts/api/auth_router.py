from ninja import NinjaAPI
from ninja_jwt.authentication import JWTAuth

from apps.accounts.schemas import (
    AuthErrorSchema,
    LoginSchema,
    RegisterSchema,
    TokenRefreshSchema,
    TokenSchema,
    UserResponseSchema,
)
from apps.accounts.services.auth_service import (
    authenticate_user,
    refresh_access_token,
    register_user,
)

auth_api = NinjaAPI(title="Auth API", version="1.0.0", urls_namespace="auth")


@auth_api.post("/register", response={201: dict, 400: AuthErrorSchema})
def register(request, payload: RegisterSchema):
    try:
        result = register_user(payload.dict())
        return 201, {
            "user": {
                "id": result["user"].id,
                "email": result["user"].email,
                "first_name": result["user"].first_name,
                "last_name": result["user"].last_name,
            },
            "tokens": result["tokens"],
        }
    except ValueError as e:
        return 400, {"detail": str(e)}


@auth_api.post("/login", response={200: dict, 401: AuthErrorSchema})
def login(request, payload: LoginSchema):
    try:
        result = authenticate_user(payload.email, payload.password)
        return 200, {
            "user": {
                "id": result["user"].id,
                "email": result["user"].email,
                "first_name": result["user"].first_name,
                "last_name": result["user"].last_name,
            },
            "tokens": result["tokens"],
        }
    except ValueError as e:
        return 401, {"detail": str(e)}


@auth_api.post("/refresh", response={200: TokenSchema, 401: AuthErrorSchema})
def refresh(request, payload: TokenRefreshSchema):
    try:
        tokens = refresh_access_token(payload.refresh)
        return 200, tokens
    except ValueError as e:
        return 401, {"detail": str(e)}


@auth_api.get("/me", response={200: UserResponseSchema}, auth=JWTAuth())
def me(request):
    return request.auth
