"""
Product data models for TikTok Shop products.
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class TrendCategory(str, Enum):
    """Product trend categories."""
    BREAKOUT = "breakout"  # New spike in orders
    SUSTAINED = "sustained"  # Steady growth
    DISCOUNT_DRIVEN = "discount_driven"  # Price drop driven


class ViabilityGrade(str, Enum):
    """Product viability rating (A-E scale)."""
    A_PLUS = "A+"  # Outstanding opportunity
    A = "A"  # Excellent opportunity
    A_MINUS = "A-"  # Very good opportunity
    B_PLUS = "B+"  # Good opportunity
    B = "B"  # Above average
    B_MINUS = "B-"  # Decent opportunity
    C_PLUS = "C+"  # Fair opportunity
    C = "C"  # Average
    C_MINUS = "C-"  # Below average
    D = "D"  # Poor opportunity
    E = "E"  # Very poor opportunity


class ProductSnapshot(BaseModel):
    """Single snapshot of product data at a point in time."""
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    price: float
    original_price: Optional[float] = None
    sold_count: int  # "X sold" number
    rating: float
    review_count: int
    in_stock: bool = True


class Product(BaseModel):
    """TikTok Shop product with trend data."""
    id: str  # TikTok product ID
    title: str
    image_url: str
    category: str
    shop_id: str
    shop_name: str

    # Current data
    current_price: float
    original_price: Optional[float] = None
    sold_count: int
    rating: float
    review_count: int
    in_stock: bool = True

    # URLs
    product_url: str
    shop_url: str

    # Trend metrics
    trend_score: float = 0.0
    orders_3d_delta: int = 0
    orders_7d_delta: int = 0
    price_discount_rate: float = 0.0
    reviews_3d_delta: int = 0
    velocity_3d: float = 0.0  # orders per day
    acceleration: float = 0.0  # change in velocity

    # Classification
    trend_category: Optional[TrendCategory] = None
    viability_grade: Optional[ViabilityGrade] = None
    viability_summary: str = ""  # Plain-English summary of PVS
    confidence_score: float = 0.0  # 0-1 confidence in trend data

    # PVS Components (0-100 percentiles)
    pv_demand_momentum: float = 0.0  # 35% - TrendScore percentile
    pv_sustained_interest: float = 0.0  # 20% - 28d orders trend
    pv_price_stability: float = 0.0  # 15% - Margin potential
    pv_saturation: float = 0.0  # 15% - Low duplicate listings
    pv_sentiment: float = 0.0  # 10% - Rating & review growth
    pv_seasonality: float = 0.0  # 5% - (Optional later)

    # Commission (if available)
    commission_rate: Optional[float] = None
    has_affiliate_program: bool = False

    # Metadata
    first_seen: datetime = Field(default_factory=datetime.utcnow)
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    snapshot_count: int = 0  # Number of data points collected

    class Config:
        json_schema_extra = {
            "example": {
                "id": "1234567890",
                "title": "Wireless Bluetooth Earbuds",
                "image_url": "https://example.com/image.jpg",
                "category": "Electronics",
                "shop_id": "shop123",
                "shop_name": "Tech Store",
                "current_price": 29.99,
                "original_price": 49.99,
                "sold_count": 15420,
                "rating": 4.7,
                "review_count": 3421,
                "product_url": "https://tiktok.com/@shop/product/1234567890",
                "shop_url": "https://tiktok.com/@shop",
                "trend_score": 87.5,
                "orders_3d_delta": 1250,
                "velocity_3d": 416.7,
                "trend_category": "breakout",
                "viability_grade": "A"
            }
        }


class ProductDetail(Product):
    """Extended product model with historical data."""
    snapshots: List[ProductSnapshot] = []
    price_history: List[dict] = []  # {date, price}
    sales_history: List[dict] = []  # {date, sold_count}


class Shop(BaseModel):
    """TikTok Shop seller information."""
    id: str
    name: str
    url: str
    rating: float
    total_products: int
    followers: Optional[int] = None
    badges: List[str] = []
    response_rate: Optional[float] = None
    ship_on_time_rate: Optional[float] = None

    # Top products
    top_products: List[str] = []  # Product IDs

    # Metadata
    first_seen: datetime = Field(default_factory=datetime.utcnow)
    last_updated: datetime = Field(default_factory=datetime.utcnow)
