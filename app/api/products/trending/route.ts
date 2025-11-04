import { NextRequest, NextResponse } from 'next/server';
import { generateMockProducts } from '@/lib/data/mock-products';
import { TrendCategory } from '@/types/product';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '200');
    const category = searchParams.get('category') || undefined;
    const country = searchParams.get('country') || undefined;
    const trendCategory = searchParams.get('trend_category') as TrendCategory | undefined;
    const minScore = parseFloat(searchParams.get('min_score') || '0');

    // Generate mock products for demo
    let products = generateMockProducts(200);

    // Apply filters
    if (category) {
      products = products.filter(p => p.category === category);
    }
    if (country) {
      products = products.filter(p => p.country === country);
    }
    if (trendCategory) {
      products = products.filter(p => p.trend_category === trendCategory);
    }
    if (minScore > 0) {
      products = products.filter(p => p.trend_score >= minScore);
    }

    // Apply limit
    products = products.slice(0, limit);

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error in /api/products/trending:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending products' },
      { status: 500 }
    );
  }
}
