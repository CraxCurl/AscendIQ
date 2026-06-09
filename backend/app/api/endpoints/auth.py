from fastapi import APIRouter

router = APIRouter()

@router.post("/login")
async def login():
    return {"message": "Login successful"}

@router.post("/signup")
async def signup():
    return {"message": "Signup successful"}
