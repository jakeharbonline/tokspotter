"""
TokSpotter FastAPI application.
Main entry point for the backend API.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .core.config import settings
from .core.firebase import firebase_client
from .api import products

# Initialize FastAPI app
app = FastAPI(
    title="TokSpotter API",
    description="The Radar for TikTok Shop Trends - API for product trend intelligence",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize services on startup."""
    print("🚀 TokSpotter API starting up...")
    print(f"📍 Environment: {settings.ENVIRONMENT}")
    print(f"🔥 Firebase Project: {settings.FIREBASE_PROJECT_ID}")
    print(f"✅ Startup complete")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    print("👋 TokSpotter API shutting down...")


@app.get("/")
async def root():
    """Root endpoint - API health check."""
    return {
        "service": "TokSpotter API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "firebase": "connected",
        "environment": settings.ENVIRONMENT
    }


# Include routers
app.include_router(products.router)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Handle unexpected errors gracefully."""
    print(f"❌ Unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error": str(exc) if settings.ENVIRONMENT == "development" else "An error occurred"
        }
    )
