from passlib.context import CryptContext  # Import for password hashing and verification
from typing import Optional  # For type hinting, indicating optional return type
from db import users_collection  # Import the MongoDB users collection to interact with the database
from jwt_handler import create_access_token  # Import JWT-related functions for token handling (though not used here)
from fastapi import HTTPException  # For raising HTTP exceptions in FastAPI

# Initialize the CryptContext for bcrypt password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Function to verify if the given password matches the hashed one stored in the database
def verify_password(plain: str, hashed: str) -> bool:
    """
    Verifies if the given plain password matches the hashed password stored in the database.
    """
    return pwd_context.verify(plain, hashed)  # Returns True if the passwords match, False otherwise

# Function to hash a password before storing it in the database
def get_password_hash(password: str) -> str:
    """
    Hashes the given password using bcrypt and returns the hashed value.
    """
    return pwd_context.hash(password)  # Returns the hashed password

# Function to authenticate the user by checking if the provided email and password are correct
async def authenticate_user(email: str, password: str) -> Optional[dict]:
    """
    Authenticates a user by email and password. Returns the user document if valid, else None.
    """
    user = await users_collection.find_one({"email": email})  # Finds the user by email in the database
    if user and verify_password(password, user["hashed_password"]):  # If user exists and password is correct
        return user  # Return user document if authentication is successful
    return None  # Return None if authentication fails

# Function to get the current user based on the token (this can be moved to jwt_handler.py if preferred)
async def get_current_user(token: str) -> dict:
    """
    Decodes the provided JWT token and retrieves the current user from the database.
    """
    payload = decode_access_token(token)  # Decodes the access token (you'll need the `decode_access_token` function in jwt_handler.py)
    email: str = payload.get("sub")  # Extracts the email (subject) from the token payload
    
    if not email:  # If the email is not found in the token payload
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")  # Raise an authentication error
    
    user = await users_collection.find_one({"email": email})  # Find the user by email in the database
    if not user:  # If the user is not found
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")  # Raise an authentication error
    
    return user  # Return the user document if found
