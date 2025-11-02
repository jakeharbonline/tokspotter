"""
API endpoints for product operations.
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from enum import Enum

from ..models.product import Product, ProductDetail, TrendCategory, ViabilityGrade
from ..db.firestore_service import FirestoreService

router = APIRouter(prefix="/api/products", tags=["products"])
db = FirestoreService()


class SortBy(str, Enum):
    """Sorting options for products."""
    TREND_SCORE = "trend_score"
    ORDERS = "orders_3d_delta"
    PRICE_LOW = "price_low"
    PRICE_HIGH = "price_high"
    RATING = "rating"


@router.get("/trending", response_model=List[Product])
async def get_trending_products(
    limit: int = Query(50, ge=1, le=100, description="Number of products to return"),
    category: Optional[str] = Query(None, description="Filter by category"),
    trend_category: Optional[TrendCategory] = Query(None, description="Filter by trend type"),
    min_score: float = Query(0.0, ge=0, le=100, description="Minimum trend score"),
    viability_grade: Optional[ViabilityGrade] = Query(None, description="Filter by viability grade"),
):
    """
    Get trending products with optional filters.

    Returns products sorted by trend score (highest first).
    """
    try:
        products = await db.get_trending_products(
            limit=limit,
            category=category,
            trend_category=trend_category,
            min_score=min_score
        )

        # Additional filtering for viability grade
        if viability_grade:
            products = [p for p in products if p.viability_grade == viability_grade]

        return products

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{product_id}", response_model=ProductDetail)
async def get_product_detail(product_id: str):
    """
    Get detailed information about a specific product.

    Includes historical data and snapshots.
    """
    try:
        product = await db.get_product(product_id)

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        # Get snapshots
        snapshots = await db.get_snapshots(product_id, days=30)

        # Build price and sales history
        price_history = [
            {"date": s.timestamp.isoformat(), "price": s.price}
            for s in snapshots
        ]

        sales_history = [
            {"date": s.timestamp.isoformat(), "sold_count": s.sold_count}
            for s in snapshots
        ]

        # Create detailed response
        product_detail = ProductDetail(
            **product.model_dump(),
            snapshots=snapshots,
            price_history=price_history,
            sales_history=sales_history
        )

        return product_detail

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/search/query", response_model=List[Product])
async def search_products(
    q: str = Query(..., min_length=2, description="Search query"),
    limit: int = Query(20, ge=1, le=50)
):
    """
    Search products by title.

    Note: This is a basic implementation. For production, consider
    using a dedicated search service like Algolia or Elasticsearch.
    """
    try:
        products = await db.search_products(q, limit=limit)
        return products

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/categories/list", response_model=List[str])
async def get_categories():
    """
    Get list of available product categories.
    """
    # TODO: Implement dynamic category extraction from database
    # For now, return common TikTok Shop categories
    categories = [
        "Electronics",
        "Fashion",
        "Beauty",
        "Home & Living",
        "Sports & Outdoors",
        "Toys & Games",
        "Books & Media",
        "Food & Beverage",
        "Health & Wellness",
        "Automotive",
        "Pet Supplies",
        "Baby & Kids",
        "Office Supplies",
        "Garden & Outdoor",
        "Arts & Crafts"
    ]
    return categories
