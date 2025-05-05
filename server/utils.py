# server/utils.py

from passlib.context import CryptContext

# Set up bcrypt hasher (must match what you use to hash on signup)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Return True if the plain text password matches the stored hash.
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Hash a plain-text password for storage.
    """
    return pwd_context.hash(password)
