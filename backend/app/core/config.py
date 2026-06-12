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
    FIREBASE_PROJECT_ID: str = "ascendiq"

    # AI
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"

    PROFILE_AGENT_API_KEY: Optional[str] = Field(default=None, validation_alias=AliasChoices("PROFILE_AGENT_API_KEY", "AI_AGENT_1_API_KEY", "API_KEY_1"))
    SKILL_ROADMAP_AGENT_API_KEY: Optional[str] = Field(default=None, validation_alias=AliasChoices("SKILL_ROADMAP_AGENT_API_KEY", "AI_AGENT_2_API_KEY", "API_KEY_2"))
    RESUME_ATS_AGENT_API_KEY: Optional[str] = Field(default=None, validation_alias=AliasChoices("RESUME_ATS_AGENT_API_KEY", "AI_AGENT_3_API_KEY", "API_KEY_3"))
    OPPORTUNITY_INTERVIEW_AGENT_API_KEY: Optional[str] = Field(default=None, validation_alias=AliasChoices("OPPORTUNITY_INTERVIEW_AGENT_API_KEY", "AI_AGENT_4_API_KEY", "API_KEY_4"))
    LEETCODE_AGENT_API_KEY: Optional[str] = Field(default=None, validation_alias=AliasChoices("LEETCODE_AGENT_API_KEY", "AI_AGENT_5_API_KEY", "API_KEY_5"))
    MASTER_AGENT_API_KEY: Optional[str] = Field(default=None, validation_alias=AliasChoices("MASTER_AGENT_API_KEY", "AI_MASTER_API_KEY", "API_KEY_6"))

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

    # Proxycurl
    PROXYCURL_API_KEY: Optional[str] = None

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
        env_file=(".env", "backend/.env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
