from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AscendIQ"
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "ascendiq"
    FIREBASE_SERVICE_ACCOUNT_PATH: Optional[str] = None
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: Optional[str] = None
    JWT_SECRET_KEY: str = "change-this-secret-key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"

settings = Settings()
