import { NextRequest, NextResponse } from 'next/server';
import { generateMockProducts } from '@/lib/data/mock-products';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;

    // Generate mock products and find the one matching the ID
    const products = generateMockProducts(200);
    const product = products.find(p => p.id === productId);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Return product with empty arrays for histories (client will generate mock data)
    const productDetail = {
      ...product,
      snapshots: [],
      price_history: [],
      sales_history: [],
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
