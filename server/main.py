import sys
from pathlib import Path
from datetime import datetime, timedelta
from typing import Optional, Dict, List

from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr

from db import test_connection, setup_indexes, users_collection, scores_collection

# ─── App & API Setup ──────────────────────────────────────────────────────────────
app = FastAPI()
api = APIRouter(prefix="/api")

# CORS (open for development; tighten in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Security Helpers ─────────────────────────────────────────────────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# point the OAuth flow at /api/login
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        user = await users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        return user
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

# ─── Startup ──────────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def on_startup():
    print("🚀 Starting the application...", file=sys.stderr)
    await test_connection()
    await setup_indexes()

# ─── Pydantic Schemas ────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    bio: Optional[str] = None
    favorite_ship: Optional[str] = None

class User(BaseModel):
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

# ─── Auth & User Routes (under /api) ─────────────────────────────────────────────
@api.post("/signup", response_model=User, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate):
    if await users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already taken")
    hashed = get_password_hash(user.password)
    await users_collection.insert_one({
        "email": user.email,
        "hashed_password": hashed,
        "bio": user.bio,
        "favorite_ship": user.favorite_ship
    })
    return User(bio=user.bio, favorite_ship=user.favorite_ship)

@api.post("/login", response_model=Token)
async def login(form: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"email": form.username})
    if not user or not verify_password(form.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    token = create_access_token(data={"sub": user["email"]})
    return {"access_token": token, "token_type": "bearer"}

@api.get("/profile/me", response_model=User)
async def read_profile(current_user: Dict = Depends(get_current_user)):
    return User(**current_user)

@api.put("/profile/me", response_model=User)
async def update_profile(update: User, current_user: Dict = Depends(get_current_user)):
    await users_collection.update_one(
        {"email": current_user["email"]},
        {"$set": {"bio": update.bio, "favorite_ship": update.favorite_ship}},
    )
    return update

# ─── Leaderboard Routes ─────────────────────────────────────────────────────────
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
    cursor = scores_collection.find().sort("score", -1).limit(10)
    top10 = await cursor.to_list(length=10)
    return [ScoreOut(**doc) for doc in top10]

# include the /api router
app.include_router(api)

# ─── React SPA Static Serving ────────────────────────────────────────────────────
BASE_DIR   = Path(__file__).resolve().parent
REACT_DIST = BASE_DIR.parent / "client" / "dist"
print("🌎 Serving static files from:", REACT_DIST, file=sys.stderr)
if not REACT_DIST.exists():
    raise RuntimeError(f"React build directory not found: {REACT_DIST}")

# static assets (images/css/js)
app.mount("/assets", StaticFiles(directory=REACT_DIST / "assets"), name="assets")
# catch-all: serve index.html
app.mount("/", StaticFiles(directory=REACT_DIST, html=True), name="client")

@app.get("/{full_path:path}", include_in_schema=False)
async def spa_fallback(full_path: str):
    return FileResponse(REACT_DIST / "index.html")
