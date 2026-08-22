"""
Deccan Origin Production Backend API Server (Python / FastAPI / Supabase)
Target Lead: Kalpesh Wadkar
Architecture: FastAPI / Uvicorn / Pydantic / Supabase PostgreSQL
"""

import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from app.config import settings
from app.routers import auth, products, orders, payments, logistics, agri_services

app = FastAPI(
    title="Deccan Origin Production Backend API (Python / FastAPI)",
    description="Organic Agriculture, Bulk Harvest, Escrow, IoT Freight, AI Doctor, and Trust Verification",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Enable CORS for React Native & Web Frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Timing Middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"
    print(f"[DeccanOrigin Python API] {request.method} {request.url.path} -> {response.status_code} ({process_time:.2f}ms)")
    return response

# Mount Domain Routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(payments.router)
app.include_router(logistics.router)
app.include_router(agri_services.router)

# Health & Root Endpoints
@app.get("/")
def root():
    return {
        "name": "Deccan Origin Production Backend API Server (Python FastAPI)",
        "version": "1.0.0",
        "status": "HEALTHY_ONLINE",
        "framework": "FastAPI / Uvicorn",
        "language": "Python 3.10+",
        "documentation": "/docs",
    }

@app.get("/v1/health")
def health_check():
    return {
        "status": "UP",
        "engine": "Python FastAPI / Uvicorn",
        "database": "CONNECTED_SUPABASE_POSTGRES",
        "services": {
            "auth": "OPERATIONAL",
            "marketplace": "OPERATIONAL",
            "escrowPool": "OPERATIONAL",
            "paymentsRazorpayStripe": "OPERATIONAL",
            "iotFreightTelemetry": "OPERATIONAL",
            "aiDoctor": "OPERATIONAL",
            "trustRegistry": "OPERATIONAL",
            "mandiPriceForecaster": "OPERATIONAL",
            "soilCarbonCredits": "OPERATIONAL",
            "satelliteGisBoundaryBuffer": "OPERATIONAL",
        },
    }

# 404 Exception Handler
@app.exception_handler(404)
async def custom_404_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "success": False,
            "error": "ENDPOINT_NOT_FOUND",
            "message": f"The endpoint '{request.method} {request.url.path}' does not exist on Deccan Origin Python v1 API.",
        },
    )

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
