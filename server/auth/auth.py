from fastapi import APIRouter, Depends, HTTPException, status
from ..schemas import UserCreate, UserLogin
from ..jwt_handler import sign_jwt

router = APIRouter()

# Temporary in-memory "DB"
users_db = {}

@router.post("/register")
async def register(user: UserCreate):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Save user
    users_db[user.email] = {"email": user.email, "password": user.password}
    return {"msg": "User created"}

@router.post("/login")
async def login(user: UserLogin):
    db_user = users_db.get(user.email)
    if not db_user or db_user["password"] != user.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = sign_jwt(user.email)
    return token
