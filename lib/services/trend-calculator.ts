import {
  Product,
  ProductSnapshot,
  TrendCategory,
  ViabilityGrade,
} from '@/types/product';

export class TrendCalculator {
  static zScore(value: number, mean: number, std: number): number {
    if (std === 0) return 0;
    return (value - mean) / std;
  }

  static calculateTrendScore(
    orders3dDelta: number,
    acceleration: number,
    priceDiscountRate: number,
    reviews3dDelta: number,
    stockStability: number,
    stats: {
      orders_3d: { mean: number; std: number };
      acceleration: { mean: number; std: number };
      discount: { mean: number; std: number };
      reviews_3d: { mean: number; std: number };
      stock: { mean: number; std: number };
    }
  ): number {
    // Calculate z-scores
    const zOrders = this.zScore(
      orders3dDelta,
      stats.orders_3d.mean,
      stats.orders_3d.std
    );
    const zAccel = this.zScore(
      acceleration,
      stats.acceleration.mean,
      stats.acceleration.std
    );
    const zDiscount = this.zScore(
      priceDiscountRate,
      stats.discount.mean,
      stats.discount.std
    );
    const zReviews = this.zScore(
      reviews3dDelta,
      stats.reviews_3d.mean,
      stats.reviews_3d.std
    );
    const stockStabilityInverse = 1.0 - stockStability;
    const zStock = this.zScore(
      stockStabilityInverse,
      stats.stock.mean,
      stats.stock.std
    );

    // Weighted sum
    const trendScore =
      zOrders * 0.45 +
      zAccel * 0.2 +
      zDiscount * 0.15 +
      zReviews * 0.1 +
      zStock * 0.1;

    // Normalize to 0-100
    const normalized = ((trendScore + 3) / 6) * 100;
    return Math.max(0, Math.min(100, normalized));
  }

  static calculateVelocity(snapshots: ProductSnapshot[], days: number = 3): number {
    if (snapshots.length < 2) return 0;

    const cutoffTime = new Date();
    cutoffTime.setDate(cutoffTime.getDate() - days);

    const recentSnapshots = snapshots.filter(
      (s) => new Date(s.timestamp) >= cutoffTime
    );

    if (recentSnapshots.length < 2) return 0;

    recentSnapshots.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const ordersDelta =
      recentSnapshots[recentSnapshots.length - 1].sold_count -
      recentSnapshots[0].sold_count;
    const timeDelta =
      (new Date(recentSnapshots[recentSnapshots.length - 1].timestamp).getTime() -
        new Date(recentSnapshots[0].timestamp).getTime()) /
      (1000 * 60 * 60 * 24);

    if (timeDelta === 0) return 0;
    return ordersDelta / timeDelta;
  }

  static calculateAcceleration(velocity3d: number, velocity7d: number): number {
    if (velocity7d === 0) return 0;
    return (velocity3d - velocity7d) / velocity7d;
  }

  static calculateDiscountRate(
    currentPrice: number,
    originalPrice?: number
  ): number {
    if (!originalPrice || originalPrice === 0) return 0;
    return (originalPrice - currentPrice) / originalPrice;
  }

  static classifyTrend(
    orders3dDelta: number,
    acceleration: number,
    priceDiscountRate: number,
    velocity3d: number
  ): TrendCategory {
    // Breakout: high recent growth with positive acceleration
    if (orders3dDelta > 500 && acceleration > 0.3) {
      return TrendCategory.BREAKOUT;
    }

    // Discount-driven: significant price drop with decent velocity
    if (priceDiscountRate > 0.25 && velocity3d > 50) {
      return TrendCategory.DISCOUNT_DRIVEN;
    }

    // Sustained: consistent velocity without major spikes
    if (velocity3d > 100 && Math.abs(acceleration) < 0.2) {
      return TrendCategory.SUSTAINED;
    }

    return TrendCategory.SUSTAINED;
  }

  static calculateViabilityGrade(
    trendScore: number,
    rating: number,
    reviewCount: number,
    confidenceScore: number
  ): ViabilityGrade {
    let score = trendScore;

    // Adjust for rating (0-5 scale)
    if (rating >= 4.5) score += 10;
    else if (rating >= 4.0) score += 5;
    else if (rating < 3.5) score -= 10;

    // Adjust for social proof
    if (reviewCount > 1000) score += 5;
    else if (reviewCount < 50) score -= 5;

    // Adjust for confidence
    if (confidenceScore < 0.5) score -= 10;

    // Assign grade
    if (score >= 85) return ViabilityGrade.A_PLUS;
    if (score >= 75) return ViabilityGrade.A;
    if (score >= 70) return ViabilityGrade.A_MINUS;
    if (score >= 65) return ViabilityGrade.B_PLUS;
    if (score >= 60) return ViabilityGrade.B;
    if (score >= 55) return ViabilityGrade.B_MINUS;
    if (score >= 50) return ViabilityGrade.C_PLUS;
    if (score >= 45) return ViabilityGrade.C;
    if (score >= 40) return ViabilityGrade.C_MINUS;
    if (score >= 30) return ViabilityGrade.D;
    return ViabilityGrade.E;
  }

  static generateViabilitySummary(product: Product): string {
    const parts: string[] = [];

    // Momentum
    if (product.orders_3d_delta > 500) {
      parts.push('strong 3d momentum');
    } else if (product.orders_3d_delta > 100) {
      parts.push('moderate momentum');
    }

    // Price stability
    if (product.price_discount_rate < 0.1) {
      parts.push('stable price');
    } else if (product.price_discount_rate > 0.3) {
      parts.push('heavy discount');
    }

    // Reviews
    if (product.reviews_3d_delta > 50) {
      parts.push('strong review growth');
    } else if (product.reviews_3d_delta < 10) {
      parts.push('watch review growth');
    }

    // Saturation (placeholder - would need market data)
    parts.push('low saturation');

    const grade = product.viability_grade || 'C';
    return `${grade}: ${parts.join(', ')}.`;
  }

  static calculateConfidence(snapshotCount: number, daysTracked: number): number {
    const idealSnapshots = 24 * 7; // hourly for a week
    const idealDays = 7;

    const snapshotScore = Math.min(snapshotCount / idealSnapshots, 1.0);
    const daysScore = Math.min(daysTracked / idealDays, 1.0);

    return snapshotScore * 0.6 + daysScore * 0.4;
  }

  static calculateStockStability(snapshots: ProductSnapshot[]): number {
    if (snapshots.length === 0) return 1.0;
    const inStockCount = snapshots.filter((s) => s.in_stock).length;
    return inStockCount / snapshots.length;
  }
}
