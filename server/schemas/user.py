# server/schemas/user.py

from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ProfileIn(BaseModel):
    username: str
    bio: Optional[str] = None
    favorite_ship: Optional[str] = None

class ProfileOut(ProfileIn):
    email: EmailStr
