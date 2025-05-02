from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, List
from datetime import datetime, timedelta

from db import test_connection, setup_indexes, users_collection, scores_collection

# ─── App & CORS ────────────────────────────────────────────────────────────────
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Security & JWT setup ───────────────────────────────────────────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

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
            raise
        user = await users_collection.find_one({"email": email})
        if not user:
            raise
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# ─── Pydantic Schemas ───────────────────────────────────────────────────────────
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

# ─── Startup Event ──────────────────────────────────────────────────────────────
@app.on_event("startup")
async def on_startup():
    print("Starting application…")
    await test_connection()
    await setup_indexes()

# ─── Auth & User Routes ─────────────────────────────────────────────────────────
@app.post("/api/signup", response_model=User, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate):
    if await users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already taken")
    hashed = get_password_hash(user.password)
    doc = {"email": user.email, "hashed_password": hashed, "bio": user.bio, "favorite_ship": user.favorite_ship}
    res = await users_collection.insert_one(doc)
    return User(bio=user.bio, favorite_ship=user.favorite_ship)

@app.post("/api/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    token = create_access_token({"sub": user["email"]})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/profile/me", response_model=User)
async def read_profile(current_user: Dict = Depends(get_current_user)):
    return User(bio=current_user.get("bio"), favorite_ship=current_user.get("favorite_ship"))

@app.put("/profile/me", response_model=User)
async def update_profile(update: User, current_user: Dict = Depends(get_current_user)):
    await users_collection.update_one(
        {"email": current_user["email"]},
        {"$set": {"bio": update.bio, "favorite_ship": update.favorite_ship}}
    )
    return update

# ─── Leaderboard Routes ─────────────────────────────────────────────────────────
@app.post("/scores", response_model=ScoreOut, status_code=status.HTTP_201_CREATED)
async def submit_score(payload: ScoreIn, current_user: Dict = Depends(get_current_user)):
    entry = {"email": current_user["email"], "score": payload.score, "timestamp": datetime.utcnow()}
    res = await scores_collection.insert_one(entry)
    return ScoreOut(**entry)

@app.get("/scores/leaderboard", response_model=List[ScoreOut])
async def get_leaderboard():
    docs = await scores_collection.find().sort("score", -1).limit(10).to_list(10)
    return [ScoreOut(**d) for d in docs]

# ─── Serve React ────────────────────────────────────────────────────────────────
# Any path not caught by /api, /profile, /scores will fall through to your React app
app.mount("/", StaticFiles(directory="../client/dist", html=True), name="client")
