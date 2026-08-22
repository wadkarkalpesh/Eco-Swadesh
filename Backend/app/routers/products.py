from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
from app.data.mock_data import PRODUCTS_DATA

router = APIRouter(prefix="/v1/products", tags=["Products Catalog"])

class ProductCreateRequest(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    category: str = "fertilizers"
    retailPrice: Optional[float] = None
    price: Optional[float] = None
    retailUnit: Optional[str] = "Kg"
    unit: Optional[str] = None
    sellerName: Optional[str] = "Malwa Organic Farmers Producer Co."
    origin: Optional[str] = "Madhya Pradesh, India"
    description: Optional[str] = "100% Certified Organic Farm Input"
    bulkAvailable: bool = False
    bulkPricePerTon: Optional[float] = None
    bulkMinTons: Optional[int] = None
    certScheme: Optional[str] = "NPOP_INDIA"
    certNumber: Optional[str] = "NPOP/NAB/0014/2026"
    certifiedOrganic: bool = True

@router.get("")
@router.get("/")
def get_products(
    category: Optional[str] = Query(None),
    certifiedType: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
):
    results = PRODUCTS_DATA

    if category and category != "all" and category != "ALL":
        results = [p for p in results if p.get("category") == category]

    if certifiedType and certifiedType != "ALL":
        results = [p for p in results if p.get("certifiedType") == certifiedType]

    if search:
        query = search.lower()
        results = [
            p for p in results
            if query in p.get("name", "").lower()
            or query in p.get("sellerName", "").lower()
            or query in p.get("origin", "").lower()
        ]

    return {
        "success": True,
        "total": len(results),
        "products": results,
    }

@router.get("/commodity-trends")
def get_commodity_trends():
    from app.data.mock_data import MANDI_PRICES_DATA
    return {
        "success": True,
        "trends": MANDI_PRICES_DATA,
    }

@router.get("/{product_id}")
def get_product_by_id(product_id: str):
    product = next((p for p in PRODUCTS_DATA if p.get("id") == product_id), None)
    if not product:
        # Fallback to first product if demo ID not found
        product = PRODUCTS_DATA[0]
    return {
        "success": True,
        "product": product,
    }

@router.post("")
@router.post("/")
def create_product(req: ProductCreateRequest):
    product_name = req.name or req.title or "Organic Bio-Input"
    resolved_price = req.retailPrice if req.retailPrice is not None else (req.price if req.price is not None else 450.0)
    resolved_unit = req.retailUnit or req.unit or "Kg"

    new_product = {
        "id": f"prod-{len(PRODUCTS_DATA) + 1}",
        "name": product_name,
        "title": product_name,
        "category": req.category,
        "retailPrice": resolved_price,
        "price": resolved_price,
        "retailUnit": resolved_unit,
        "unit": resolved_unit,
        "sellerName": req.sellerName or "Malwa Organic Farmers Producer Co.",
        "origin": req.origin or "Madhya Pradesh, India",
        "description": req.description or "100% Certified Organic Farm Input",
        "bulkAvailable": req.bulkAvailable,
        "bulkPricePerTon": req.bulkPricePerTon or 0,
        "bulkMinTons": req.bulkMinTons or 1,
        "certifiedType": "NATIONAL",
        "certScheme": req.certScheme or "NPOP_INDIA",
        "certNumber": req.certNumber or "NPOP/NAB/0014/2026",
        "certifiedOrganic": req.certifiedOrganic,
        "rating": 5.0,
        "reviewsCount": 1,
        "image": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
        "inStock": True,
    }
    PRODUCTS_DATA.append(new_product)
    return {
        "success": True,
        "message": "Product listed successfully on Deccan Origin",
        "product": new_product,
    }
