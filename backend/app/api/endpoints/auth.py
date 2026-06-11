import asyncio
from datetime import datetime, timedelta, timezone
import bcrypt
import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field
from typing import Optional

from app.core.config import settings
from app.services.firebase_auth import verify_firebase_id_token
from app.services import storage
from app.services import otp_service

router = APIRouter()
security = HTTPBearer()

class AuthRequest(BaseModel):
    email: str = Field(..., pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    password: str = Field(..., min_length=8)

class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=1)
    email: str = Field(..., pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    password: str = Field(..., min_length=8)

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class SignupResponse(BaseModel):
    message: str
    user: dict

class OtpRequest(BaseModel):
    email: str = Field(..., pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

class OtpVerifyRequest(BaseModel):
    email: str = Field(..., pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    code: str = Field(..., min_length=6, max_length=6)

class ResetPasswordRequest(BaseModel):
    email: str = Field(..., pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    code: str = Field(..., min_length=6, max_length=6)
    new_password: str = Field(..., min_length=8)

class FirebaseLoginRequest(BaseModel):
    id_token: str = Field(..., min_length=20)

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
    return {
        "email": user["email"],
        "full_name": user.get("full_name"),
        "auth_provider": user.get("auth_provider"),
        "providers": user.get("providers", []),
        "photo_url": user.get("photo_url"),
    }

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
    hashed_password = (user or {}).get("hashed_password")
    if not user or not hashed_password or not verify_password(credentials.password, hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not user.get("is_verified"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in.",
        )
    storage.mark_login(user["email"])
    return AuthResponse(access_token=create_access_token(user["email"]), user=public_user(user))

@router.post("/firebase-login")
async def firebase_login(payload: FirebaseLoginRequest):
    try:
        claims = verify_firebase_id_token(payload.id_token)
    except Exception as exc:
        with open("firebase_error.txt", "w") as f:
            f.write(str(exc) + "\\n")
            import traceback
            f.write(traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Firebase login token") from exc

    email = (claims.get("email") or "").lower()
    if not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Firebase account does not include an email address")

    user = storage.upsert_firebase_user(
        email=email,
        firebase_uid=claims["sub"],
        full_name=claims.get("name") or email.split("@")[0],
        photo_url=claims.get("picture"),
    )
    return AuthResponse(access_token=create_access_token(user["email"]), user=public_user(user))

@router.post("/signup")
async def signup(credentials: AuthRequest):
    return await register(
        RegisterRequest(
            full_name=credentials.email.split("@")[0],
            email=credentials.email,
            password=credentials.password,
        )
    )

@router.post("/register")
async def register(credentials: RegisterRequest):
    email = credentials.email.lower()
    existing_user = storage.get_user(email)
    if existing_user and existing_user.get("is_verified"):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists")

    user = storage.replace_unverified_user(email, hash_password(credentials.password), credentials.full_name)
    code = otp_service.generate_code()
    storage.store_otp(email, code, "registration")
    try:
        await asyncio.to_thread(otp_service.send_otp_email, email, code, credentials.full_name, "registration")
    except Exception as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    return SignupResponse(
        message="We sent a one-time verification code to your email.",
        user=public_user(user),
    )

@router.post("/sandbox-login")
async def sandbox_login():
    demo_email = "sandbox@ascendiq.dev"
    user = storage.get_user(demo_email)
    if not user:
        user = storage.create_user(demo_email, hash_password("sandbox123"), "Demo User", is_verified=True)
    token = create_access_token(user["email"])
    return AuthResponse(access_token=token, user=public_user(user))

@router.post("/send-otp")
async def send_otp(payload: OtpRequest):
    email = payload.email.lower()
    user = storage.get_user(email)
    if not user:
        raise HTTPException(status_code=404, detail="Create an account before requesting a verification code.")
    if user.get("is_verified"):
        raise HTTPException(status_code=400, detail="This account is already verified. Please log in with your password.")

    code = otp_service.generate_code()
    storage.store_otp(email, code, "registration")
    try:
        await asyncio.to_thread(otp_service.send_otp_email, email, code, user.get("full_name"), "registration")
    except Exception as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    return {"message": "OTP sent", "email": email}

@router.post("/verify-otp")
async def verify_otp(payload: OtpVerifyRequest):
    email = payload.email.lower()
    if not storage.verify_registration_otp(email, payload.code):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    return {"message": "Email verified. Please log in to continue.", "verified": True}

@router.post("/forgot-password")
async def forgot_password(payload: OtpRequest):
    email = payload.email.lower()
    user = storage.get_user(email)
    if user and user.get("is_verified"):
        code = otp_service.generate_code()
        storage.store_otp(email, code, "password_reset")
        try:
            await asyncio.to_thread(otp_service.send_otp_email, email, code, user.get("full_name"), "password_reset")
        except Exception as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc

    return {"message": "If an account exists, a password reset code has been sent.", "email": email}

@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest):
    email = payload.email.lower()
    user = storage.get_user(email)
    if not user or not storage.verify_password_reset_otp(email, payload.code):
        raise HTTPException(status_code=400, detail="Invalid or expired reset code")

    storage.update_password(email, hash_password(payload.new_password))
    return {"message": "Password updated. Please log in with your new password."}

@router.get("/me")
async def me(current_user: dict = Depends(get_current_user)):
    return {"user": public_user(current_user)}
