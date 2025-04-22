import time
import jwt
from decouple import config

JWT_SECRET = config("JWT_SECRET", default="secret")
JWT_ALGORITHM = "HS256"

def sign_jwt(user_id: str) -> dict:
    payload = {
        "user_id": user_id,
        "expires": time.time() + 600  # 10 minutes
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return {"access_token": token}
