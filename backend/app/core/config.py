from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "SkillForge"
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "skillforge"
    FIREBASE_SERVICE_ACCOUNT_PATH: Optional[str] = None
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"

settings = Settings()
