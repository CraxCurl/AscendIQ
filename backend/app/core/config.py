from typing import Optional

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "AscendIQ"

    # Database
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "ascendiq"

    # Firebase
    FIREBASE_SERVICE_ACCOUNT_PATH: Optional[str] = None

    # AI Keys
    GEMINI_API_KEY: str = ""

    GROQ_API_KEY: Optional[str] = Field(
        default=None,
        validation_alias=AliasChoices("GROQ_API_KEY", "API_KEY")
    )

    GROQ_MODEL: str = "llama-3.3-70b-versatile"

    OPENAI_API_KEY: Optional[str] = None

    # JWT
    JWT_SECRET_KEY: str = Field(
        default="change-this-secret-key",
        validation_alias=AliasChoices("JWT_SECRET_KEY", "JWT_SECRET")
    )

    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()