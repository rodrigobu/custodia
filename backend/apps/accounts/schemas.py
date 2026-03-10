from ninja import Schema


class RegisterSchema(Schema):
    first_name: str
    last_name: str = ""
    email: str
    password: str


class LoginSchema(Schema):
    email: str
    password: str


class UserResponseSchema(Schema):
    id: int
    email: str
    first_name: str
    last_name: str


class TokenSchema(Schema):
    access: str
    refresh: str


class TokenRefreshSchema(Schema):
    refresh: str


class AuthErrorSchema(Schema):
    detail: str
