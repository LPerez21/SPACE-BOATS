from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict
from datetime import datetime, timedelta

app = FastAPI()

# Enable CORS so your React app on localhost:3000 can call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy in-memory "database"
fake_users_db: Dict[str, Dict] = {}

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT config
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# Pydantic models
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


# Helper functions
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
    return fake_users_db.get(email)

def authenticate_user(email: str, password: str) -> Optional[Dict]:
    user = get_user(email)
    if user and verify_password(password, user["hashed_password"]):
        return user
    return None


# Routes

@app.post("/signup", response_model=User, status_code=201)
def signup(user: UserCreate):
    if user.email in fake_users_db:
        raise HTTPException(status_code=400, detail="Email already taken")
    hashed_pw = get_password_hash(user.password)
    fake_users_db[user.email] = {
        "email": user.email,
        "hashed_password": hashed_pw,
        "bio": user.bio,
        "favorite_ship": user.favorite_ship
    }
    return User(**fake_users_db[user.email])


@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    token = create_access_token(data={"sub": user["email"]})
    return {"access_token": token, "token_type": "bearer"}


async def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None or email not in fake_users_db:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return fake_users_db[email]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")


@app.get("/profile/me", response_model=User)
async def read_profile(current_user: Dict = Depends(get_current_user)):
    return User(**current_user)


@app.put("/profile/me", response_model=User)
async def update_profile(update: UserCreate, current_user: Dict = Depends(get_current_user)):
    # Only update bio and favorite_ship; keep email/password unchanged
    current_user["bio"] = update.bio
    current_user["favorite_ship"] = update.favorite_ship
    return User(**current_user)

