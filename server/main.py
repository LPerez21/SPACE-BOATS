# server/main.py

import sys
import traceback
from pathlib import Path
from datetime import datetime, timedelta
from typing import Optional, Dict, List

from fastapi import (
    FastAPI, APIRouter, Depends,
    HTTPException, Request, status
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer

from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr

# from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from db     import test_connection, setup_indexes, users_collection, scores_collection
from utils  import verify_password, get_password_hash

# ─── App & Router ────────────────────────────────────────────────────────────────
app = FastAPI()
api = APIRouter(prefix="/api")

# ─── CORS (dev only) ─────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Exception handlers (JSON) ───────────────────────────────────────────────────
@app.exception_handler(HTTPException)
async def http_exc_handler(request: Request, exc: HTTPException):
    return JSONResponse({"detail": exc.detail}, status_code=exc.status_code)

@app.exception_handler(Exception)
async def all_exc_handler(request: Request, exc: Exception):
    traceback.print_exc()
    return JSONResponse({"detail": "Internal server error"}, status_code=500)

# ─── JWT Helpers ─────────────────────────────────────────────────────────────────
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        user = await users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")

# ─── Startup Hook ────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def on_startup():
    print("🚀 Starting application…", file=sys.stderr)
    await test_connection()
    await setup_indexes()

# ─── Schemas ─────────────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    bio: Optional[str] = None
    favorite_ship: Optional[str] = None

class UserOut(BaseModel):
    email: EmailStr
    bio: Optional[str]
    favorite_ship: Optional[str]

class Token(BaseModel):
    access_token: str
    token_type: str

class ScoreIn(BaseModel):
    score: int

class ScoreOut(BaseModel):
    email: EmailStr
    score: int
    timestamp: datetime

class LoginRequest(BaseModel):
    username: str
    password: str

# ─── Auth & User Routes ──────────────────────────────────────────────────────────
@api.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate):
    if await users_collection.find_one({"email": user.email}):
        raise HTTPException(400, "Email already taken")
    hashed = get_password_hash(user.password)
    await users_collection.insert_one({
        "email": user.email,
        "hashed_password": hashed,
        "bio": user.bio,
        "favorite_ship": user.favorite_ship,
    })
    return UserOut(email=user.email, bio=user.bio, favorite_ship=user.favorite_ship)

@api.post("/login", response_model=Token)
async def login(payload: LoginRequest):
    user = await users_collection.find_one({"email": payload.username})
    hashed_pw = user.get("hashed_password") if user else None
    if not user or not hashed_pw or not verify_password(payload.password, hashed_pw):
        raise HTTPException(400, "Incorrect email or password")
    token = create_access_token({"sub": user["email"]})
    return {"access_token": token, "token_type": "bearer"}

# ─── Profile Routes ──────────────────────────────────────────────────────────────
@app.get("/profile/me", response_model=UserOut)
async def read_profile(current_user: Dict = Depends(get_current_user)):
    return UserOut(
        email=current_user["email"],
        bio=current_user.get("bio"),
        favorite_ship=current_user.get("favorite_ship")
    )

@app.put("/profile/me", response_model=UserOut)
async def update_profile(update: UserOut, current_user: Dict = Depends(get_current_user)):
    print(f"Updated profile for {current_user['email']}: {update.bio}, {update.favorite_ship}")
    await users_collection.update_one(
        {"email": current_user["email"]},
        {"$set": {"bio": update.bio, "favorite_ship": update.favorite_ship}}
    )
    return update

# ─── Leaderboard Routes ──────────────────────────────────────────────────────────
@api.post("/scores", response_model=ScoreOut, status_code=status.HTTP_201_CREATED)
async def submit_score(payload: ScoreIn, current_user: Dict = Depends(get_current_user)):
    entry = {
        "email": current_user["email"],
        "score": payload.score,
        "timestamp": datetime.utcnow()
    }
    await scores_collection.insert_one(entry)
    return ScoreOut(**entry)

@api.get("/scores/leaderboard", response_model=List[ScoreOut])
async def get_leaderboard():
    docs = await scores_collection.find().sort("score", -1).to_list(length=10)
    return [ScoreOut(**d) for d in docs]

# ─── Mount the API & SPA ─────────────────────────────────────────────────────────
app.include_router(api)  # ← include all /api routes

BASE_DIR   = Path(__file__).resolve().parent
REACT_DIST = BASE_DIR.parent / "client" / "dist"
if not REACT_DIST.exists():
    raise RuntimeError(f"React build not found at {REACT_DIST}")

# Static files for SPA
app.mount("/", StaticFiles(directory=REACT_DIST, html=True), name="client")

# Fallback to index.html on any other GET
@app.get("/{full_path:path}", include_in_schema=False)
async def spa_fallback(full_path: str):
    return FileResponse(REACT_DIST / "index.html")
