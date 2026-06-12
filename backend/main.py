from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import auth, profile, agents, roadmap, opportunities, interview, leetcode
from app.core.config import settings
from app.services import storage

app = FastAPI(title="AscendIQ API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://localhost:3000",
        "https://ascend-iq-mu.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(profile.router, prefix="/api/profile", tags=["Profile"])
app.include_router(agents.router, prefix="/api/agents", tags=["AI Agents"])
app.include_router(roadmap.router, prefix="/api/roadmap", tags=["Roadmap"])
app.include_router(opportunities.router, prefix="/api/opportunities", tags=["Opportunities"])
app.include_router(interview.router, prefix="/api/interview", tags=["Interview Prep"])
app.include_router(leetcode.router, prefix="/api/leetcode", tags=["LeetCode"])
app.include_router(resume_builder.router, prefix="/api/resume_builder", tags=["Resume Builder"])

@app.on_event("startup")
async def startup_event():
    storage.init_db()

@app.get("/")
async def root():
    return {"message": "Welcome to AscendIQ AI Career Operating System API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
