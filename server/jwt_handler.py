# server/jwt_handler.py

from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional

from .config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Creates a JWT access token with the provided payload. Expires after the
    given delta (in minutes) or defaults to ACCESS_TOKEN_EXPIRE_MINUTES.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> dict:
    """
    Decodes the JWT token and returns the payload dict.
    Raises JWTError if the token is invalid or expired.
    """
    # This will raise JWTError (or ExpiredSignatureError) on failure
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
