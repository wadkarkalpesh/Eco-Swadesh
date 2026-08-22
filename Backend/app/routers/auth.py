from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from app.data.mock_data import USERS_DB

router = APIRouter(prefix="/v1/auth", tags=["Authentication"])

class RegisterRequest(BaseModel):
    fullName: str
    phoneOrEmail: str
    selectedPersona: str = "farmer"
    stateName: Optional[str] = "Maharashtra"
    district: Optional[str] = "Pune"

class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = None

@router.post("/register")
def register(req: RegisterRequest):
    user_id = f"usr_{req.selectedPersona}_2026"
    token = f"jwt_token_{user_id}"
    user_info = {
        "id": user_id,
        "name": req.fullName,
        "email": req.phoneOrEmail,
        "persona": req.selectedPersona,
        "state": req.stateName,
        "district": req.district,
    }
    return {
        "success": True,
        "message": "User registered successfully on Deccan Origin Platform",
        "token": token,
        "user": user_info,
    }

@router.post("/login")
def login(req: LoginRequest):
    user = USERS_DB.get(req.email.lower())
    if not user:
        # Default fallback response for testing
        user = {
            "id": "usr_demo_01",
            "name": "Deccan Organic Member",
            "email": req.email,
            "persona": "farmer",
            "token": "jwt_token_demo_01",
        }
    return {
        "success": True,
        "token": user.get("token", "jwt_token_demo_01"),
        "user": user,
    }

@router.post("/buyer-login")
def buyer_login(req: LoginRequest):
    return {
        "success": True,
        "token": "jwt_token_buyer_portal_2026",
        "user": {
            "id": "usr_buyer_99",
            "name": "Verified Bulk Buyer",
            "email": req.email,
            "persona": "bulkBuyer",
        },
    }

@router.post("/seller-login")
def seller_login(req: LoginRequest):
    return {
        "success": True,
        "token": "jwt_token_seller_portal_2026",
        "user": {
            "id": "usr_seller_99",
            "name": "Certified Bio-Manufacturer",
            "email": req.email,
            "persona": "seller",
        },
    }

@router.get("/me")
def get_current_user():
    return {
        "success": True,
        "user": {
            "id": "usr_farmer_01",
            "name": "Ramesh Patel",
            "email": "farmer@deccan.com",
            "persona": "farmer",
            "certifiedMember": True,
        },
    }

class OTPVerificationRequest(BaseModel):
    phoneOrEmail: Optional[str] = None
    otpCode: Optional[str] = "123456"

@router.post("/verify-otp")
def verify_otp(req: OTPVerificationRequest):
    return {
        "success": True,
        "message": "OTP verified successfully",
        "token": "jwt_token_otp_verified_2026",
        "user": {
            "id": "usr_farmer_01",
            "name": "Ramesh Patel",
            "persona": "farmer",
        },
    }

class PersonaSwitchRequest(BaseModel):
    persona: str = "farmer"

@router.put("/switch-persona")

@router.post("/switch-persona")
def switch_persona(req: PersonaSwitchRequest):
    return {
        "success": True,
        "persona": req.persona,
        "message": f"Switched to {req.persona} role successfully",
    }
