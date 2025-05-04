# server/main.py
import sys
import traceback
from pathlib import Path
from datetime import datetime, timedelta
from typing import Optional, Dict, List

from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from passlib.context import CryptContext
from jose import jwt
from pydantic import BaseModel, EmailStr

from .settings import settings
from .db     import test_connection, setup_indexes, users_collection, scores_collection
from .utils  import verify_password  # your existing helper
                                          # (which uses settings.pwd_context)

# ─── App & Router ────────────────────────────────────────────────────────────────
app = FastAPI()
api = APIRouter(prefix="/api")

# ─── CORS ─────────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # dev only! lock this down in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Exception handlers (always JSON!) ────────────────────────────────────────────
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse({"detail": exc.detail}, status_code=exc.status_code)

@app.exception_handler(Exception)
async def all_exception_handler(request: Request, exc: Exception):
    # print full traceback to your logs
    traceback.print_exc()
    return JSONResponse({"detail": "Internal server error"}, status_code=500)

# ─── Password & JWT helpers ───────────────────────────────────────────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

# ─── Startup Hook ────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def on_startup():
    print("🚀 Starting application…", file=sys.stderr)
    await test_connection()
    await setup_indexes()

# ─── Pydantic Schemas ────────────────────────────────────────────────────────────
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

# ─── Auth & User Routes ───────────────────────────────────────────────────────────
@api.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate):
    if await users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already taken")

    hashed = pwd_context.hash(user.password)
    await users_collection.insert_one({
        "email": user.email,
        "hashed_password": hashed,
        "bio": user.bio,
        "favorite_ship": user.favorite_ship,
    })
    return UserOut(email=user.email, bio=user.bio, favorite_ship=user.favorite_ship)

@api.post("/login", response_model=Token)
async def login(payload: LoginRequest):
    # log to console so you can see it
    print("🔥 Login attempt for:", payload.username, file=sys.stderr)

    user = await users_collection.find_one({"email": payload.username})
    if not user or not pwd_context.verify(payload.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    token = create_access_token(data={"sub": user["email"]})
    return {"access_token": token, "token_type": "bearer"}

# ─── Protected Profile Routes ───────────────────────────────────────────────────
from fastapi.security import OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict:
    from jose import JWTError
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        user = await users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@api.get("/profile/me", response_model=UserOut)
async def read_profile(current_user: Dict = Depends(get_current_user)):
    return UserOut(email=current_user["email"], bio=current_user.get("bio"), favorite_ship=current_user.get("favorite_ship"))

@api.put("/profile/me", response_model=UserOut)
async def update_profile(update: UserOut, current_user: Dict = Depends(get_current_user)):
    await users_collection.update_one(
        {"email": current_user["email"]},
        {"$set": {"bio": update.bio, "favorite_ship": update.favorite_ship}}
    )
    return update

# ─── Leaderboard Routes ─────────────────────────────────────────────────────────
@api.post("/scores", response_model=ScoreOut, status_code=status.HTTP_201_CREATED)
async def submit_score(payload: ScoreIn, current_user: Dict = Depends(get_current_user)):
    entry = {"email": current_user["email"], "score": payload.score, "timestamp": datetime.utcnow()}
    await scores_collection.insert_one(entry)
    return ScoreOut(**entry)

@api.get("/scores/leaderboard", response_model=List[ScoreOut])
async def get_leaderboard():
    docs = await scores_collection.find().sort("score", -1).to_list(length=10)
    return [ScoreOut(**d) for d in docs]

# ─── Mount & SPA Fallback ─────────────────────────────────────────────────────────
app.include_router(api)

BASE_DIR   = Path(__file__).resolve().parent
REACT_DIST = BASE_DIR.parent / "client" / "dist"
if not REACT_DIST.exists():
    raise RuntimeError(f"React build not found at {REACT_DIST}")

app.mount("/", StaticFiles(directory=REACT_DIST, html=True), name="client")

@app.get("/{full_path:path}", include_in_schema=False)
async def spa_fallback(full_path: str):
    return FileResponse(REACT_DIST / "index.html")
