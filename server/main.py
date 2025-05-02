from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, List
from datetime import datetime, timedelta
from bson import ObjectId
from db import test_connection, setup_indexes, users_collection, scores_collection


app = FastAPI()

app.mount("/assets", StaticFiles(directory="./build_Files/assets"), name="assets")

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
# users_collection: Dict[str, Dict] = {}
# scores: List[Dict] = []

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

async def get_user(email: str) -> Optional[Dict]:
    return await users_collection.find_one({"email": email})

async def authenticate_user(email: str, password: str) -> Optional[Dict]:
    user = await users_collection.find_one({"email": email})
    if user and verify_password(password, user["hashed_password"]):
        return user
    return None

async def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        user = await users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

@app.on_event("startup")
async def startup_event():
    print("Starting the application...")
    await test_connection()  # Run the test query to verify MongoDB connection
    await setup_indexes()
# ─── Auth & User Routes ─────────────────────────────────────────────────────────
@app.get("/")   
async def root():
    return FileResponse  ("../client/dist/index.html")

# @app.api_route ("/{full_path:path}")
# async def serve_react():
#     return FileResponse ("../client/dist/index.html")

@app.post("/api/signup", response_model=User, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate):
    existing_user = await users_collection.find_one({"email": user.email})
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already taken")
    
    user_doc = {
        "email": user.email,
        "hashed_password": get_password_hash(user.password),
        "bio": user.bio,
        "favorite_ship": user.favorite_ship
    }

    # Insert the user into the database
    result = await users_collection.insert_one(user_doc)
    user_doc["_id"] = str(result.inserted_id)  # Convert ObjectId to string for JSON serialization

    return User(bio=user_doc["bio"], favorite_ship=user_doc["favorite_ship"])

@app.post("/api/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
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

    # Persist the changes to the database
    await users_collection.update_one(
        {"email": current_user["email"]},
        {"$set": {"bio": update.bio, "favorite_ship": update.favorite_ship}}
    )

    return User(**current_user)

# ─── Leaderboard Routes ─────────────────────────────────────────────────────────
@app.post("/scores", response_model=ScoreOut, status_code=status.HTTP_201_CREATED)
async def submit_score(payload: ScoreIn, current_user: Dict = Depends(get_current_user)):
    entry = {
        "email": current_user["email"],
        "score": payload.score,
        "timestamp": datetime.utcnow()
    }
    result = await scores_collection.insert_one(entry)
    entry["_id"] = str(result.inserted_id)  # Convert ObjectId to string for JSON serialization
    return entry

@app.get("/scores/leaderboard", response_model=List[ScoreOut])
async def get_leaderboard():
    cursor = scores_collection.find().sort("score", -1).limit(10)
    top10 = await cursor.to_list(length=10)
    return [ScoreOut(**score) for score in top10]

from fastapi.staticfiles import StaticFiles

# serve React’s build/ as the root
app.mount(
    "/", 
    StaticFiles(directory="../client/dist", html=True), 
    name="client"
)
