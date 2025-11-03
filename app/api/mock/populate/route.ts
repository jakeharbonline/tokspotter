import { NextRequest, NextResponse } from 'next/server';
import { FirestoreService } from '@/lib/services/firestore-service';
import { generateMockProducts } from '@/lib/data/mock-products';

/**
 * Populate database with realistic mock TikTok Shop products
 * Use this while waiting for TikTok API approval
 */

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Security check
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { count = 100 } = body;

    console.log(`🚀 Populating database with ${count} mock products...`);

    const db = new FirestoreService();
    const products = generateMockProducts(count);

    let successful = 0;
    let failed = 0;
    const categoryCounts: Record<string, number> = {};

    for (const product of products) {
      try {
        // Save product
        await db.saveProduct(product);

        // Save initial snapshot
        await db.saveSnapshot(product.id, {
          timestamp: product.last_updated,
          price: product.current_price,
          sold_count: product.sold_count,
          review_count: product.review_count,
          rating: product.rating,
          in_stock: product.in_stock,
        });

        successful++;
        categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;

        if (successful % 10 === 0) {
          console.log(`✅ Progress: ${successful}/${products.length} products saved`);
        }
      } catch (error) {
        console.error(`❌ Error saving product ${product.id}:`, error);
        failed++;
      }
    }

    console.log(`\n✅ Population complete!`);
    console.log(`   Successful: ${successful}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Categories:`, categoryCounts);

    return NextResponse.json({
      success: true,
      message: `Populated ${successful} mock products across ${Object.keys(categoryCounts).length} categories`,
      results: {
        total: products.length,
        successful,
        failed,
        categories: categoryCounts,
      },
      timestamp: new Date().toISOString(),
      note: 'Using mock data. Replace with TikTok API once approved.',
    });
  } catch (error) {
    console.error('❌ Fatal error during mock population:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to populate mock products',
        details: String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to populate database with mock TikTok Shop products',
    note: 'Requires CRON_SECRET authorization header',
    usage: {
      method: 'POST',
      headers: {
        authorization: 'Bearer YOUR_CRON_SECRET',
      },
      body: {
        count: '100 (optional, default: 100)',
      },
    },
    info: 'This uses realistic mock data based on actual TikTok Shop trends. Replace with real API data once TikTok approves your app.',
  });
}
