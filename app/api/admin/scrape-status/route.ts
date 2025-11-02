import { NextRequest, NextResponse } from 'next/server';
import { FirestoreService } from '@/lib/services/firestore-service';

/**
 * Admin endpoint to check scraping status and recent activity
 */

export async function GET(request: NextRequest) {
  try {
    const db = new FirestoreService();

    // Get recent products (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const allProducts = await db.getTrendingProducts({ limit: 1000 });

    const recentProducts = allProducts.filter(
      p => new Date(p.last_updated) > oneDayAgo
    );

    const newProducts = allProducts.filter(
      p => new Date(p.first_seen) > oneDayAgo
    );

    // Get categories breakdown
    const categoryCounts: Record<string, number> = {};
    allProducts.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    // Get country breakdown
    const countryCounts: Record<string, number> = {};
    allProducts.forEach(p => {
      const country = p.country || 'Unknown';
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });

    // Calculate average TrendScore
    const avgTrendScore = allProducts.length > 0
      ? allProducts.reduce((sum, p) => sum + p.trend_score, 0) / allProducts.length
      : 0;

    return NextResponse.json({
      status: 'operational',
      database: {
        total_products: allProducts.length,
        products_updated_24h: recentProducts.length,
        new_products_24h: newProducts.length,
        average_trend_score: Math.round(avgTrendScore * 10) / 10,
      },
      breakdown: {
        by_category: categoryCounts,
        by_country: countryCounts,
      },
      recent_products: recentProducts.slice(0, 10).map(p => ({
        id: p.id,
        title: p.title,
        trend_score: p.trend_score,
        last_updated: p.last_updated,
      })),
      next_scrape: 'Daily at 2:00 AM UTC',
      cron_endpoint: '/api/cron/scrape-daily',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: 'Failed to fetch status',
        details: String(error),
      },
      { status: 500 }
    );
  }
}
