from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(tags=["Orders & Escrow"])

class OrderItem(BaseModel):
    productId: str
    name: str
    quantity: float
    isBulk: bool = False
    unitPrice: float

class CreateOrderRequest(BaseModel):
    items: List[OrderItem]
    totalAmount: float
    orderMode: str = "RETAIL"
    shippingAddress: Optional[str] = "Pune, Maharashtra"

@router.post("/v1/orders")
def create_order(req: CreateOrderRequest):
    order_id = "ORD-2026-88912"
    return {
        "success": True,
        "message": "Order created successfully. B2B Escrow active.",
        "order": {
            "orderId": order_id,
            "totalAmount": req.totalAmount,
            "orderMode": req.orderMode,
            "escrowStatus": "HELD_IN_ESCROW",
            "estimatedDelivery": "3-5 Business Days",
        },
    }

@router.get("/v1/orders")
def get_user_orders():
    return {
        "success": True,
        "orders": [
            {
                "orderId": "ORD-2026-88912",
                "date": "2026-08-22",
                "totalAmount": 42000,
                "status": "IN_TRANSIT",
                "escrowStatus": "HELD_IN_ESCROW",
                "itemsCount": 1,
            }
        ],
    }
