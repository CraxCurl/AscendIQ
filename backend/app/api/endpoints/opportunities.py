from fastapi import APIRouter

router = APIRouter()

@router.get("/match")
async def match_opportunities():
    return {"opportunities": []}
