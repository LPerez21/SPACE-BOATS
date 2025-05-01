from passlib.context import CryptContext
from typing import Optional
from db import users_collection
from jwt_handler import create_access_token  # Keep the JWT logic in jwt_handler.py
from fastapi import HTTPException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Password verification
def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

# Password hashing
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# Authenticate User
async def authenticate_user(email: str, password: str) -> Optional[dict]:
    user = await users_collection.find_one({"email": email})
    if user and verify_password(password, user["hashed_password"]):
        return user
    return None

# Get current user from token (you can move this here from jwt_handler.py if you prefer)
async def get_current_user(token: str) -> dict:
    payload = decode_access_token(token)  # Using the decode method from jwt_handler.py
    email: str = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    return user
