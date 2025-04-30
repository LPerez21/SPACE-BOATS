from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, List
from datetime import datetime, timedelta
from db import users_collection, scores_collection

app = FastAPI()

# ─── CORS ────────────────────────────────────────────────────────────────────────
# Allow all origins during development (so you can hit via localhost or LAN IP)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for production, lock this down to your frontend URL(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── In-Memory “Databases” ───────────────────────────────────────────────────────
# fake_users_db: Dict[str, Dict] = {}
users_collection = {}
scores_collection = {}
# In-memory list to store scores
scores: List[Dict] = []

# ─── Security Setup ──────────────────────────────────────────────────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# ─── Pydantic Schemas ────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    bio: Optional[str] = None
    favorite_ship: Optional[str] = None

class User(BaseModel):
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

# ─── Helper Functions ────────────────────────────────────────────────────────────
def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Fetch user by email
async def get_user(email: str) -> Optional[Dict]:
    user = await users_collection.find_one({"email": email})
    return user

# Create a new user
async def create_user(user_data: Dict) -> Dict:
    await users_collection.insert_one(user_data)
    return user_data

def authenticate_user(email: str, password: str) -> Optional[Dict]:
    user = get_user(email)
    if user and verify_password(password, user["hashed_password"]):
        return user
    return None

async def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        user = await get_user(email)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# ─── Auth & User Routes ─────────────────────────────────────────────────────────
@app.post("/signup", response_model=User, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate):
    existing_user = await get_user(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already taken")
    user_data[user.email] = {
        "email": user.email,
        "hashed_password": get_password_hash(user.password),
        "bio": user.bio,
        "favorite_ship": user.favorite_ship
    }
    await create_user(user_data)
    return User(**user_data)

@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    token = create_access_token(data={"sub": user["email"]})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/profile/me", response_model=User)
async def read_profile(current_user: Dict = Depends(get_current_user)):
    return User(**current_user)

@app.put("/profile/me", response_model=User)
async def update_profile(update: UserCreate, current_user: Dict = Depends(get_current_user)):
    await users_collection.update_one(
        {"email": current_user["email"]},
        {"$set": {"bio": update.bio, "favorite_ship": update.favorite_ship}}
    )
    updated_user = await get_user(current_user["email"])
    return User(**updated_user)

# ─── Leaderboard Routes ─────────────────────────────────────────────────────────
@app.post("/scores", response_model=ScoreOut, status_code=status.HTTP_201_CREATED)
async def submit_score(payload: ScoreIn, current_user: Dict = Depends(get_current_user)):
    entry = ScoreOut(
        email=current_user["email"],
        score=payload.score,
        timestamp=datetime.utcnow()
    )
    await scores_collection.insert_one(entry)
    return ScoreOut(**entry)

@app.get("/scores/leaderboard", response_model=List[ScoreOut])
async def get_leaderboard():
    top10 = await scores_collection.find().sort("score", -1).limit(10).to_list(10)
    return [ScoreOut(**score) for score in top10]
