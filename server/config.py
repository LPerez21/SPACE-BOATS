# server/config.py

import os
from pathlib import Path
from dotenv import load_dotenv

# ── Explicitly point to server/.env ─────────────────────────────────────────────
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

# MongoDB Configuration
MONGODB_URI = os.getenv(
    "MONGODB_URI",
    # fallback if not set in .env
    "mongodb://admin:password@localhost:27017/space-boats-db?authSource=admin"
)
DB_NAME = os.getenv("DB_NAME", "space-boats-db")

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "changeme")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
