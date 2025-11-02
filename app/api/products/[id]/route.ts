import { NextRequest, NextResponse } from 'next/server';
import { FirestoreService } from '@/lib/services/firestore-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    const db = new FirestoreService();

    const product = await db.getProduct(productId);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get snapshots
    const snapshots = await db.getSnapshots(productId, 30);

    // Build price and sales history
    const priceHistory = snapshots.map((s) => ({
      date: s.timestamp,
      price: s.price,
    }));

    const salesHistory = snapshots.map((s) => ({
      date: s.timestamp,
      sold_count: s.sold_count,
    }));

    const productDetail = {
      ...product,
      snapshots,
      price_history: priceHistory,
      sales_history: salesHistory,
    };

    return NextResponse.json(productDetail);
  } catch (error) {
    console.error('Error in /api/products/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product detail' },
      { status: 500 }
    );
  }
}
