# models/user.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserInDB(UserCreate):
    hashed_password: str

class UserLogin(BaseModel):
    username: str  # this is actually the email
    password: str

class UserProfile(BaseModel):
    username: str
    bio: Optional[str] = ''
    favorite_ship: Optional[str] = ''