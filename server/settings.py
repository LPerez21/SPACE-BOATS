# server/settings.py

from pydantic import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    MONGO_URI: str
    DB_NAME: str = "spaceboats"

    class Config:
        env_file = ".env"    # tells Pydantic to load values from server/.env

settings = Settings()
