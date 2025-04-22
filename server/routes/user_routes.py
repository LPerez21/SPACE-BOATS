# server/routes/user_routes.py

from fastapi import APIRouter, Depends, HTTPException, status
from schemas.user import ProfileIn, ProfileOut
from auth.auth import get_current_user
from database.config import db  # your Motor client

router = APIRouter()

@router.post("/profile", response_model=ProfileOut, status_code=201)
async def create_profile(data: ProfileIn, current_user=Depends(get_current_user)):
    # Merge with the user’s email from the token
    profile_doc = data.dict()
    profile_doc["email"] = current_user["email"]

    # Upsert into “profiles” collection
    await db.profiles.update_one(
        {"email": current_user["email"]},
        {"$set": profile_doc},
        upsert=True
    )
    return profile_doc

@router.get("/profile", response_model=ProfileOut)
async def read_profile(current_user=Depends(get_current_user)):
    doc = await db.profiles.find_one({"email": current_user["email"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Profile not found")
    return doc
