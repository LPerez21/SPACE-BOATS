from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, List
from datetime import datetime, timedelta
from db import test_connection, users_collection


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
users_collection: Dict[str, Dict] = {}
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
    # email: EmailStr
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

def get_user(email: str) -> Optional[Dict]:
    return users_collection.get(email)

def authenticate_user(email: str, password: str) -> Optional[Dict]:
    user = get_user(email)
    if user and verify_password(password, user["hashed_password"]):
        return user
    return None

async def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email or email not in users_collection:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return users_collection[email]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

@app.on_event("startup")
async def startup_event():
    print("Starting the application...")
    test_connection()  # Run the test query to verify MongoDB connection

# ─── Auth & User Routes ─────────────────────────────────────────────────────────
@app.post("/signup", response_model=User, status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate):
    if user.email in users_collection:
        raise HTTPException(status_code=400, detail="Email already taken")
    
    users_collection[user.email] = {
        "email": user.email,
        "hashed_password": get_password_hash(user.password),
        "bio": user.bio,
        "favorite_ship": user.favorite_ship
    }


    return User(**users_collection[user.email])

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
async def update_profile(update: User, current_user: Dict = Depends(get_current_user)):
    current_user["bio"] = update.bio
    current_user["favorite_ship"] = update.favorite_ship

    
    return User(**current_user)

# ─── Leaderboard Routes ─────────────────────────────────────────────────────────
@app.post("/scores", response_model=ScoreOut, status_code=status.HTTP_201_CREATED)
async def submit_score(payload: ScoreIn, current_user: Dict = Depends(get_current_user)):
    entry = ScoreOut(
        email=current_user["email"],
        score=payload.score,
        timestamp=datetime.utcnow()
    )
    scores.append(entry.dict())
    return entry

@app.get("/scores/leaderboard", response_model=List[ScoreOut])
async def get_leaderboard():
    top10 = sorted(scores, key=lambda s: s["score"], reverse=True)[:10]
    return [ScoreOut(**s) for s in top10]