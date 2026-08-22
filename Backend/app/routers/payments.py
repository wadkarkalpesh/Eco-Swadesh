from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/v1/payments", tags=["Payments & Escrow"])

class EscrowVerificationRequest(BaseModel):
    orderId: str
    labCheckPassed: bool = True
    qrCodeSeal: str = "QR-DECCAN-SEAL-2026"

@router.get("/escrow-status")
def get_escrow_status(orderId: str = "ORD-2026-88912"):
    return {
        "success": True,
        "orderId": orderId,
        "status": "HELD_IN_ESCROW",
        "escrowAmountINR": 42000,
        "destinationLabCheck": "PENDING_DESTINATION_ARRIVAL",
        "guarantee": "100% Zero Commission Escrow Guarantee",
    }

@router.post("/verify")
def verify_payment(req: EscrowVerificationRequest):
    return {
        "success": True,
        "orderId": req.orderId,
        "paymentVerified": True,
        "escrowState": "RELEASED_TO_FARMER" if req.labCheckPassed else "HELD_FOR_DISPUTE",
    }
