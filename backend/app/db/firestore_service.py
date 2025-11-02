"""
Firestore database service for storing and retrieving product data.
"""
from typing import List, Optional, Dict
from datetime import datetime, timedelta
from google.cloud.firestore import Query

from ..core.firebase import firebase_client
from ..models.product import Product, Shop, ProductSnapshot, TrendCategory


class FirestoreService:
    """Service for interacting with Firestore database."""

    def __init__(self):
        self.db = firebase_client.get_db()

    # Product operations
    async def save_product(self, product: Product) -> bool:
        """Save or update a product in Firestore."""
        try:
            product_dict = product.model_dump()
            product_dict['last_updated'] = datetime.utcnow()

            self.db.collection('products').document(product.id).set(
                product_dict,
                merge=True
            )
            return True
        except Exception as e:
            print(f"Error saving product {product.id}: {e}")
            return False

    async def get_product(self, product_id: str) -> Optional[Product]:
        """Get a product by ID."""
        try:
            doc = self.db.collection('products').document(product_id).get()
            if doc.exists:
                return Product(**doc.to_dict())
            return None
        except Exception as e:
            print(f"Error getting product {product_id}: {e}")
            return None

    async def get_trending_products(
        self,
        limit: int = 50,
        category: Optional[str] = None,
        trend_category: Optional[TrendCategory] = None,
        min_score: float = 0.0
    ) -> List[Product]:
        """Get trending products with filters."""
        try:
            query = self.db.collection('products')

            # Apply filters
            if category:
                query = query.where('category', '==', category)
            if trend_category:
                query = query.where('trend_category', '==', trend_category.value)
            if min_score > 0:
                query = query.where('trend_score', '>=', min_score)

            # Order by trend score
            query = query.order_by('trend_score', direction=Query.DESCENDING)
            query = query.limit(limit)

            docs = query.stream()
            products = [Product(**doc.to_dict()) for doc in docs]
            return products

        except Exception as e:
            print(f"Error getting trending products: {e}")
            return []

    async def search_products(
        self,
        search_term: str,
        limit: int = 20
    ) -> List[Product]:
        """Search products by title."""
        try:
            # Firestore doesn't support full-text search, so we'll do simple filtering
            # For production, consider using Algolia or Elasticsearch
            query = self.db.collection('products').limit(100)
            docs = query.stream()

            products = []
            search_lower = search_term.lower()

            for doc in docs:
                product = Product(**doc.to_dict())
                if search_lower in product.title.lower():
                    products.append(product)
                if len(products) >= limit:
                    break

            return products

        except Exception as e:
            print(f"Error searching products: {e}")
            return []

    # Snapshot operations
    async def save_snapshot(self, product_id: str, snapshot: ProductSnapshot) -> bool:
        """Save a product snapshot."""
        try:
            snapshot_dict = snapshot.model_dump()
            snapshot_dict['timestamp'] = snapshot.timestamp

            self.db.collection('products').document(product_id).collection('snapshots').add(
                snapshot_dict
            )
            return True
        except Exception as e:
            print(f"Error saving snapshot for {product_id}: {e}")
            return False

    async def get_snapshots(
        self,
        product_id: str,
        days: int = 7
    ) -> List[ProductSnapshot]:
        """Get snapshots for a product."""
        try:
            cutoff = datetime.utcnow() - timedelta(days=days)

            query = (
                self.db.collection('products')
                .document(product_id)
                .collection('snapshots')
                .where('timestamp', '>=', cutoff)
                .order_by('timestamp', direction=Query.DESCENDING)
            )

            docs = query.stream()
            snapshots = [ProductSnapshot(**doc.to_dict()) for doc in docs]
            return snapshots

        except Exception as e:
            print(f"Error getting snapshots for {product_id}: {e}")
            return []

    # Shop operations
    async def save_shop(self, shop: Shop) -> bool:
        """Save or update a shop."""
        try:
            shop_dict = shop.model_dump()
            shop_dict['last_updated'] = datetime.utcnow()

            self.db.collection('shops').document(shop.id).set(
                shop_dict,
                merge=True
            )
            return True
        except Exception as e:
            print(f"Error saving shop {shop.id}: {e}")
            return False

    async def get_shop(self, shop_id: str) -> Optional[Shop]:
        """Get a shop by ID."""
        try:
            doc = self.db.collection('shops').document(shop_id).get()
            if doc.exists:
                return Shop(**doc.to_dict())
            return None
        except Exception as e:
            print(f"Error getting shop {shop_id}: {e}")
            return None

    # Statistics for trend calculation
    async def get_product_statistics(self) -> Dict[str, Dict[str, float]]:
        """
        Calculate statistics across all products for z-score normalization.
        Returns means and standard deviations for key metrics.
        """
        try:
            products_ref = self.db.collection('products').limit(1000)
            docs = products_ref.stream()

            orders_3d = []
            accelerations = []
            discounts = []
            reviews_3d = []
            stock_stabilities = []

            for doc in docs:
                data = doc.to_dict()
                orders_3d.append(data.get('orders_3d_delta', 0))
                accelerations.append(data.get('acceleration', 0))
                discounts.append(data.get('price_discount_rate', 0))
                reviews_3d.append(data.get('reviews_3d_delta', 0))

                # Stock stability inverse
                snapshots_count = data.get('snapshot_count', 1)
                stock_stabilities.append(1.0 - (1.0 / max(snapshots_count, 1)))

            import numpy as np

            return {
                'orders_3d': {
                    'mean': np.mean(orders_3d) if orders_3d else 0,
                    'std': np.std(orders_3d) if orders_3d else 1
                },
                'acceleration': {
                    'mean': np.mean(accelerations) if accelerations else 0,
                    'std': np.std(accelerations) if accelerations else 1
                },
                'discount': {
                    'mean': np.mean(discounts) if discounts else 0,
                    'std': np.std(discounts) if discounts else 1
                },
                'reviews_3d': {
                    'mean': np.mean(reviews_3d) if reviews_3d else 0,
                    'std': np.std(reviews_3d) if reviews_3d else 1
                },
                'stock': {
                    'mean': np.mean(stock_stabilities) if stock_stabilities else 0,
                    'std': np.std(stock_stabilities) if stock_stabilities else 1
                }
            }

        except Exception as e:
            print(f"Error calculating statistics: {e}")
            # Return default values
            return {
                'orders_3d': {'mean': 0, 'std': 1},
                'acceleration': {'mean': 0, 'std': 1},
                'discount': {'mean': 0, 'std': 1},
                'reviews_3d': {'mean': 0, 'std': 1},
                'stock': {'mean': 0, 'std': 1}
            }

    # Batch operations
    async def get_products_by_ids(self, product_ids: List[str]) -> List[Product]:
        """Get multiple products by IDs."""
        products = []
        for product_id in product_ids:
            product = await self.get_product(product_id)
            if product:
                products.append(product)
        return products
