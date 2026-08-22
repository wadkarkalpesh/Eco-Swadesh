from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/v1/logistics", tags=["IoT Logistics & Freight"])

class FreightQuoteRequest(BaseModel):
    originCity: str
    destinationCity: str
    quantityTons: float
    coldChainRequired: bool = False

@router.post("/quote")
def get_freight_quote(req: FreightQuoteRequest):
    base_rate = req.quantityTons * 1200
    cold_chain_addon = 2500 if req.coldChainRequired else 0
    total = base_rate + cold_chain_addon
    return {
        "success": True,
        "origin": req.originCity,
        "destination": req.destinationCity,
        "distanceKm": 480,
        "quantityTons": req.quantityTons,
        "coldChain": req.coldChainRequired,
        "estimatedFreightINR": total,
        "availableTrucks": 4,
    }

@router.get("/track/{shipment_id}")
def track_shipment(shipment_id: str):
    return {
        "success": True,
        "shipmentId": shipment_id,
        "status": "IN_TRANSIT",
        "currentLocation": "Solapur Highway Toll Plaza",
        "temperatureCelsius": 4.2 if "COLD" in shipment_id.upper() else 24.5,
        "humidityPercentage": 68.0,
        "estimatedArrival": "Tomorrow at 14:00 IST",
    }
