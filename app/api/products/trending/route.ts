import { NextRequest, NextResponse } from 'next/server';
import { FirestoreService } from '@/lib/services/firestore-service';
import { TrendCategory } from '@/types/product';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category') || undefined;
    const country = searchParams.get('country') || undefined;
    const trendCategory = searchParams.get('trend_category') as TrendCategory | undefined;
    const minScore = parseFloat(searchParams.get('min_score') || '0');

    const db = new FirestoreService();
    const products = await db.getTrendingProducts({
      limit,
      category,
      country,
      trend_category: trendCategory,
      min_score: minScore,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error in /api/products/trending:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending products' },
      { status: 500 }
    );
  }
}
