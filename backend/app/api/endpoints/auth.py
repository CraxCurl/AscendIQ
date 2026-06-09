from datetime import datetime, timedelta, timezone
import bcrypt
import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field

from app.core.config import settings
from app.services import storage

router = APIRouter()
security = HTTPBearer()


class AuthRequest(BaseModel):
    email: str = Field(..., pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    password: str = Field(..., min_length=8)


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class SignupResponse(BaseModel):
    message: str
    user: dict


class TokenPayload(BaseModel):
    sub: str
    exp: int


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(email: str) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": email, "exp": expires_at}
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def public_user(user: dict) -> dict:
    return {"email": user["email"]}


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        token = TokenPayload(**payload)
    except jwt.ExpiredSignatureError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        ) from exc
    except (jwt.InvalidTokenError, ValueError) as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        ) from exc

    user = storage.get_user(token.sub)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer exists",
        )
    return user

@router.post("/login")
async def login(credentials: AuthRequest):
    user = storage.get_user(credentials.email.lower())
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return AuthResponse(access_token=create_access_token(user["email"]), user=public_user(user))

@router.post("/signup")
async def signup(credentials: AuthRequest):
    email = credentials.email.lower()
    if storage.get_user(email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    user = storage.create_user(email, hash_password(credentials.password))
    return SignupResponse(message="Account created. Please log in to continue.", user=public_user(user))


@router.get("/me")
async def me(current_user: dict = Depends(get_current_user)):
    return {"user": public_user(current_user)}
