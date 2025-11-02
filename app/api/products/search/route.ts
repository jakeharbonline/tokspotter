import { NextRequest, NextResponse } from 'next/server';
import { FirestoreService } from '@/lib/services/firestore-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters' },
        { status: 400 }
      );
    }

    const db = new FirestoreService();
    const products = await db.searchProducts(query, limit);

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error in /api/products/search:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
