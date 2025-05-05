# server/config.py

import os
from dotenv import load_dotenv

# Load env vars from server/.env
load_dotenv()

# MongoDB Configuration
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME      = os.getenv("DB_NAME", "space-boats-db")

# JWT Configuration
SECRET_KEY                = os.getenv("SECRET_KEY")
ALGORITHM                 = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))
