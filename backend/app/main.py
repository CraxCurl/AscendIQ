from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import auth, profile, agents, roadmap, opportunities
from app.core.config import settings
from app.services import storage

app = FastAPI(title="AscendIQ API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
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

@app.on_event("startup")
async def startup_event():
    storage.init_db()

@app.get("/")
async def root():
    return {"message": "Welcome to AscendIQ AI Career Operating System API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
