from typing import Optional

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App
    PROJECT_NAME: str = "AscendIQ"

    # MongoDB
    MONGODB_URL: str
    DATABASE_NAME: str = "ascendiq"

    # Firebase (optional)
    FIREBASE_SERVICE_ACCOUNT_PATH: Optional[str] = None

    # AI
    GEMINI_API_KEY: str = ""

    GROQ_API_KEY: Optional[str] = Field(
        default=None,
        validation_alias=AliasChoices(
            "GROQ_API_KEY",
            "API_KEY"
        )
    )

    GROQ_MODEL: str = "llama-3.3-70b-versatile"

    OPENAI_API_KEY: Optional[str] = None

    # Resend
    RESEND_API_KEY: Optional[str] = None
    RESEND_FROM_EMAIL: str = "noreply@stigz.xyz"

    # JWT
    JWT_SECRET_KEY: str = Field(
        default="change-this-in-production",
        validation_alias=AliasChoices(
            "JWT_SECRET_KEY",
            "JWT_SECRET"
        )
    )

    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Environment
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()