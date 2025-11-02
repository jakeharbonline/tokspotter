"""
TrendScore calculation engine.
Implements the scoring algorithm from the specification.
"""
import numpy as np
from typing import List, Dict
from datetime import datetime, timedelta
from ..models.product import Product, TrendCategory, ViabilityGrade, ProductSnapshot


class TrendCalculator:
    """Calculate trend scores and classifications for products."""

    @staticmethod
    def z_score(value: float, mean: float, std: float) -> float:
        """Calculate z-score with protection against zero std."""
        if std == 0:
            return 0.0
        return (value - mean) / std

    @staticmethod
    def calculate_trend_score(
        orders_3d_delta: int,
        acceleration: float,
        price_discount_rate: float,
        reviews_3d_delta: int,
        stock_stability: float,
        all_products_stats: Dict[str, Dict[str, float]]
    ) -> float:
        """
        Calculate TrendScore using z-score normalization.

        Formula:
        TrendScore =
          z(orders_3d_delta) * 0.45 +
          z(acceleration) * 0.20 +
          z(price_discount_rate) * 0.15 +
          z(reviews_3d_delta) * 0.10 +
          z(stock_stability_inverse) * 0.10
        """
        # Extract statistics
        stats = all_products_stats

        # Calculate z-scores for each component
        z_orders = TrendCalculator.z_score(
            orders_3d_delta,
            stats['orders_3d']['mean'],
            stats['orders_3d']['std']
        )

        z_accel = TrendCalculator.z_score(
            acceleration,
            stats['acceleration']['mean'],
            stats['acceleration']['std']
        )

        z_discount = TrendCalculator.z_score(
            price_discount_rate,
            stats['discount']['mean'],
            stats['discount']['std']
        )

        z_reviews = TrendCalculator.z_score(
            reviews_3d_delta,
            stats['reviews_3d']['mean'],
            stats['reviews_3d']['std']
        )

        # Stock stability (inverted - higher instability = worse)
        stock_stability_inverse = 1.0 - stock_stability
        z_stock = TrendCalculator.z_score(
            stock_stability_inverse,
            stats['stock']['mean'],
            stats['stock']['std']
        )

        # Weighted sum
        trend_score = (
            z_orders * 0.45 +
            z_accel * 0.20 +
            z_discount * 0.15 +
            z_reviews * 0.10 +
            z_stock * 0.10
        )

        # Normalize to 0-100 scale (approximately)
        # Z-scores typically range from -3 to +3
        normalized_score = ((trend_score + 3) / 6) * 100
        return max(0, min(100, normalized_score))

    @staticmethod
    def calculate_velocity(snapshots: List[ProductSnapshot], days: int = 3) -> float:
        """Calculate orders per day over the specified period."""
        if len(snapshots) < 2:
            return 0.0

        cutoff_time = datetime.utcnow() - timedelta(days=days)
        recent_snapshots = [s for s in snapshots if s.timestamp >= cutoff_time]

        if len(recent_snapshots) < 2:
            return 0.0

        # Sort by timestamp
        recent_snapshots.sort(key=lambda x: x.timestamp)

        # Calculate orders delta
        orders_delta = recent_snapshots[-1].sold_count - recent_snapshots[0].sold_count
        time_delta = (recent_snapshots[-1].timestamp - recent_snapshots[0].timestamp).total_seconds() / 86400

        if time_delta == 0:
            return 0.0

        return orders_delta / time_delta

    @staticmethod
    def calculate_acceleration(
        velocity_3d: float,
        velocity_7d: float
    ) -> float:
        """Calculate acceleration (change in velocity)."""
        if velocity_7d == 0:
            return 0.0
        return (velocity_3d - velocity_7d) / velocity_7d

    @staticmethod
    def calculate_discount_rate(current_price: float, original_price: float) -> float:
        """Calculate price discount rate."""
        if not original_price or original_price == 0:
            return 0.0
        return (original_price - current_price) / original_price

    @staticmethod
    def classify_trend(
        orders_3d_delta: int,
        acceleration: float,
        price_discount_rate: float,
        velocity_3d: float
    ) -> TrendCategory:
        """Classify product into trend category."""
        # Breakout: high recent growth with positive acceleration
        if orders_3d_delta > 500 and acceleration > 0.3:
            return TrendCategory.BREAKOUT

        # Discount-driven: significant price drop with decent velocity
        if price_discount_rate > 0.25 and velocity_3d > 50:
            return TrendCategory.DISCOUNT_DRIVEN

        # Sustained: consistent velocity without major spikes
        if velocity_3d > 100 and abs(acceleration) < 0.2:
            return TrendCategory.SUSTAINED

        # Default to sustained for moderate performers
        return TrendCategory.SUSTAINED

    @staticmethod
    def calculate_viability_grade(
        trend_score: float,
        rating: float,
        review_count: int,
        confidence_score: float
    ) -> ViabilityGrade:
        """
        Determine product viability grade based on multiple factors.
        """
        # Base score from trend
        score = trend_score

        # Adjust for rating (0-5 scale)
        if rating >= 4.5:
            score += 10
        elif rating >= 4.0:
            score += 5
        elif rating < 3.5:
            score -= 10

        # Adjust for social proof (review count)
        if review_count > 1000:
            score += 5
        elif review_count < 50:
            score -= 5

        # Adjust for confidence
        if confidence_score < 0.5:
            score -= 10

        # Assign grade
        if score >= 75:
            return ViabilityGrade.A
        elif score >= 60:
            return ViabilityGrade.B
        elif score >= 45:
            return ViabilityGrade.C
        else:
            return ViabilityGrade.D

    @staticmethod
    def calculate_confidence(snapshot_count: int, days_tracked: int) -> float:
        """
        Calculate confidence score based on data availability.
        More snapshots over more days = higher confidence.
        """
        # Ideal: 24 snapshots over 7+ days (hourly tracking for a week)
        ideal_snapshots = 24 * 7
        ideal_days = 7

        snapshot_score = min(snapshot_count / ideal_snapshots, 1.0)
        days_score = min(days_tracked / ideal_days, 1.0)

        # Weight both factors
        confidence = (snapshot_score * 0.6 + days_score * 0.4)
        return confidence

    @staticmethod
    def calculate_stock_stability(snapshots: List[ProductSnapshot]) -> float:
        """
        Calculate stock stability (0-1).
        1.0 = always in stock, 0.0 = frequently out of stock
        """
        if not snapshots:
            return 1.0

        in_stock_count = sum(1 for s in snapshots if s.in_stock)
        return in_stock_count / len(snapshots)
