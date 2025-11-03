import { NextRequest, NextResponse } from 'next/server';
import { TikTokShopAPI } from '@/lib/services/tiktok-api';
import { FirestoreService } from '@/lib/services/firestore-service';
import { TrendCalculator } from '@/lib/services/trend-calculator';

/**
 * Populate database with real TikTok Shop products using Official API
 * No scraping - uses TikTok Shop API with your app credentials
 */

const CATEGORIES = [
  'Beauty & Personal Care',
  'Fashion & Accessories',
  'Home & Garden',
  'Electronics',
  'Health & Fitness',
  'Toys & Hobbies',
  'Sports & Outdoors',
  'Baby & Kids',
  'Food & Beverages',
  'Pets',
];

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Security check
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tiktokAPI = new TikTokShopAPI();
  const db = new FirestoreService();

  const results = {
    total: 0,
    successful: 0,
    failed: 0,
    categories: {} as Record<string, number>,
  };

  try {
    console.log('🚀 Starting TikTok Shop data sync via Official API...');

    // Get available categories from TikTok
    const apiCategories = await tiktokAPI.getCategories();
    console.log(`📁 Found ${apiCategories.length} TikTok Shop categories`);

    // Fetch trending products from each category
    for (const category of CATEGORIES) {
      console.log(`\n📦 Processing ${category}...`);
      results.categories[category] = 0;

      try {
        // Get trending products from this category
        const products = await tiktokAPI.getTrendingProducts(category, 50);

        if (products.length === 0) {
          console.log(`⚠️  No products found in ${category}`);
          continue;
        }

        console.log(`✅ Found ${products.length} products in ${category}`);

        // Save each product
        for (const product of products) {
          results.total++;

          try {
            // Set category
            product.category = category;

            // Calculate trend score
            product.trend_score = TrendCalculator.calculateTrendScore(
              product.orders_3d_delta,
              product.acceleration,
              product.price_discount_rate,
              product.reviews_3d_delta,
              1.0,
              {
                orders_3d: { mean: 1000, std: 500 },
                acceleration: { mean: 1.2, std: 0.5 },
                discount: { mean: 0.2, std: 0.1 },
                reviews_3d: { mean: 50, std: 25 },
                stock: { mean: 1.0, std: 0.2 },
              }
            );

            // Save to database
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

            results.successful++;
            results.categories[category]++;

            console.log(`✅ Saved: ${product.title.substring(0, 50)}...`);
          } catch (error) {
            console.error(`❌ Error saving product:`, error);
            results.failed++;
          }
        }
      } catch (error) {
        console.error(`❌ Error processing ${category}:`, error);
        results.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${results.successful} products from ${Object.keys(results.categories).length} categories`,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Fatal error during sync:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync products',
        details: String(error),
        partial_results: results,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to populate database with TikTok Shop products',
    note: 'Requires CRON_SECRET authorization header and TikTok API credentials',
    required_env_vars: {
      TIKTOK_APP_ID: 'Your TikTok App ID',
      TIKTOK_APP_SECRET: 'Your TikTok App Secret',
      TIKTOK_ACCESS_TOKEN: 'Your TikTok Access Token (optional - will be generated)',
      TIKTOK_REGION: 'US, UK, or SEA (default: US)',
    },
  });
}
