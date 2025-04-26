# models/user.py
from pydantic import BaseModel, EmailStr  # Import necessary classes from Pydantic
from typing import Optional  # Import Optional for optional fields

# Define a Pydantic model for user creation data
class UserCreate(BaseModel):
    email: EmailStr  # User's email address, validated as an email string
    password: str  # User's chosen password

# Define a Pydantic model representing a user stored in the database
# Inherits from UserCreate, adding the hashed password field
class UserInDB(UserCreate):
    hashed_password: str  # The user's password after hashing

# Define a Pydantic model for user login data
class UserLogin(BaseModel):
    username: str  # The username provided for login (which is actually the email)
    password: str  # The password provided for login

# Define a Pydantic model for user profile data
class UserProfile(BaseModel):
    username: str  # The user's username
    bio: Optional[str] = ''  # Optional user biography, defaults to empty string
    favorite_ship: Optional[str] = ''  # Optional user favorite ship, defaults to empty string