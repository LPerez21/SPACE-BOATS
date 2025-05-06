from jose import JWTError, jwt  # Import the necessary functions from the jose library for JWT encoding and decoding
from datetime import datetime, timedelta  # For handling token expiration and time
from typing import Optional  # For optional type hinting

# Secret key for signing the JWT (ensure this is kept secret and secure)
SECRET_KEY = "your-secret-key"
# Algorithm used for signing the JWT
ALGORITHM = "HS256"
# Default expiration time for the access token (30 minutes)
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Function to create a JWT access token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Creates a JWT access token with the provided data. The token will expire after the given time.
    If no expiration time is provided, it defaults to 30 minutes.
    """
    to_encode = data.copy()  # Copy the input data to avoid modifying the original data
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))  # Set the expiration time
    to_encode.update({"exp": expire})  # Add the expiration time to the payload
    # Encode the data with the secret key and specified algorithm, returning the encoded JWT
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Function to decode a JWT token and extract its payload
def decode_access_token(token: str) -> dict:
    """
    Decodes the JWT token and returns the payload. Raises an error if the token is invalid.
    """
    try:
        # Decode the token using the secret key and algorithm
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # Return the decoded payload (typically includes the user's data)
    except JWTError:
        # If an error occurs during decoding (invalid token, expired, etc.), raise an exception
        raise Exception("Could not validate token")
