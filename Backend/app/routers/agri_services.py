from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.data.mock_data import MANDI_PRICES_DATA

router = APIRouter(tags=["AgriTech & Analytics"])

class CropDiagnosisRequest(BaseModel):
    cropName: str
    symptoms: str
    imageUrl: Optional[str] = None

class GISBufferRequest(BaseModel):
    latitude: float
    longitude: float
    bufferMeters: float = 30.0

@router.get("/v1/mandi/prices")
def get_mandi_prices():
    return {
        "success": True,
        "timestamp": "2026-08-22T10:15:00Z",
        "mandiPrices": MANDI_PRICES_DATA,
    }

@router.post("/v1/ai/diagnose")
def diagnose_crop_disease(req: CropDiagnosisRequest):
    return {
        "success": True,
        "crop": req.cropName,
        "diagnosedIssue": "Early Leaf Blight (Fungal)",
        "confidenceScore": 0.94,
        "recommendedBioTreatment": "Spray Trichoderma Harzianum @ 5g/L or Cold-Pressed Neem Oil (10,000 PPM)",
        "organicDosage": "500ml per acre mixed with 200L water",
        "safetyIntervalDays": 0,
    }

@router.get("/v1/carbon/credits")
def get_carbon_credits():
    return {
        "success": True,
        "totalCO2SavedTons": 14890,
        "verraRegisteredPool": "VERRA-AGRI-ESG-2026-MH",
        "creditPricePerTonINR": 1850,
        "farmersParticipating": 4120,
    }

@router.post("/v1/farms/gis-buffer")
def calculate_gis_buffer(req: GISBufferRequest):
    return {
        "success": True,
        "latitude": req.latitude,
        "longitude": req.longitude,
        "bufferMeters": req.bufferMeters,
        "chemicalContaminationRisk": "ZERO_RESIDUE_SAFE",
        "organicBufferVerified": True,
    }

@router.get("/v1/credit/eligibility")
def check_kisan_credit_eligibility(landAcres: float = 5.0):
    max_loan = landAcres * 75000
    return {
        "success": True,
        "eligible": True,
        "maxLoanAmountINR": max_loan,
        "subsidizedInterestRate": "4.0% per annum (Kisan Credit Scheme)",
        "bankPartners": ["State Bank of India", "NABARD", "Bank of Maharashtra"],
    }

@router.get("/v1/verify")
@router.get("/v1/trust")
def verify_trust_registry(certLicense: str = "NPOP/NAB/0014/2025"):
    return {
        "success": True,
        "licenseNo": certLicense,
        "certifiedBody": "APEDA Jaivik Bharat NPOP Standard",
        "validUntil": "2027-12-31",
        "labPurityRating": "100% Pesticide-Residue Free (0.00 ppm)",
        "blockchainMerkleHash": "0x89aef41098bcae8841920acde817420194bc",
    }

@router.get("/v1/trust/certifications")
def get_certifications():
    return {
        "success": True,
        "certifications": [
            {
                "id": "cert-01",
                "name": "Jaivik Bharat NPOP Standard",
                "authority": "APEDA Ministry of Commerce",
                "type": "NATIONAL",
                "validCount": 1420,
            },
            {
                "id": "cert-02",
                "name": "PGS-India Green Local Organic",
                "authority": "Ministry of Agriculture",
                "type": "LOCAL_GOV",
                "validCount": 890,
            },
        ],
    }

@router.get("/v1/community/posts")
def get_community_posts():
    return {
        "success": True,
        "posts": [
            {
                "id": "post-01",
                "author": "Dr. Anita Roy",
                "title": "Bio-Fertilizer Application Timing during Monsoon",
                "category": "Agronomy",
                "likes": 42,
                "commentsCount": 15,
            }
        ],
    }

@router.get("/v1/admin/overview")
def get_admin_overview():
    return {
        "success": True,
        "gmvTotalINR": 14580000,
        "verifiedFarmersCount": 3840,
        "activeFposCount": 24,
        "escrowHoldingsINR": 842000,
    }

@router.get("/v1/procurement/group-pools")
def get_procurement_pools():
    return {
        "success": True,
        "pools": [
            {
                "id": "pool-01",
                "fpoName": "Malwa Narmada Organic Farmers Producer Co. Ltd.",
                "crop": "Organic Sharbati Wheat",
                "targetTons": 500,
                "pledgedTons": 380,
                "discountTierPct": 8.5,
            }
        ],
    }
