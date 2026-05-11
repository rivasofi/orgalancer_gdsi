"""Main FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_tables
from app.routers import freelancer, rates, chat
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="OrgaLancer API",
    description="API for freelancer financial management and AI assistant integration",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, set specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(freelancer.router)
app.include_router(rates.router)
app.include_router(chat.router)


@app.on_event("startup")
async def startup_event():
    """Create database tables on startup."""
    create_tables()
    print("✅ Database tables created")


@app.get("/")
async def root():
    """Root endpoint - API is running."""
    return {
        "message": "OrgaLancer API",
        "version": "0.1.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    
    # Get configuration from environment
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "False").lower() == "true"
    
    # Run the server
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug
    )
