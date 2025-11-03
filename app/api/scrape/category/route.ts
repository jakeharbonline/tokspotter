import { NextRequest, NextResponse } from 'next/server';
import { TikTokScraper } from '@/lib/services/tiktok-scraper';
import { FirestoreService } from '@/lib/services/firestore-service';
import { TrendCalculator } from '@/lib/services/trend-calculator';

/**
 * Scrape ONE category at a time (Vercel 60s timeout workaround)
 * POST with: { "category": "beauty" }
 */

const CATEGORIES: Record<string, { name: string; url: string }> = {
  beauty: {
    name: 'Beauty & Personal Care',
    url: 'https://www.tiktok.com/shop/category/beauty-personal-care',
  },
  fashion: {
    name: 'Fashion & Accessories',
    url: 'https://www.tiktok.com/shop/category/fashion',
  },
  home: {
    name: 'Home & Garden',
    url: 'https://www.tiktok.com/shop/category/home-garden',
  },
  electronics: {
    name: 'Electronics',
    url: 'https://www.tiktok.com/shop/category/electronics',
  },
  health: {
    name: 'Health & Fitness',
    url: 'https://www.tiktok.com/shop/category/health-fitness',
  },
};

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { category, limit = 10 } = body;

    if (!category || !CATEGORIES[category]) {
      return NextResponse.json(
        { error: `Invalid category. Choose: ${Object.keys(CATEGORIES).join(', ')}` },
        { status: 400 }
      );
    }

    const cat = CATEGORIES[category];
    const scraper = new TikTokScraper();
    const db = new FirestoreService();

    console.log(`🔍 Scraping ${cat.name} (limit: ${limit})...`);

    // Discover products
    const productUrls = await scraper.discoverProducts(cat.url, limit);

    if (productUrls.length === 0) {
      return NextResponse.json({
        success: false,
        message: `No products found in ${cat.name}`,
      });
    }

    const results = { successful: 0, failed: 0 };

    // Scrape each product
    for (const url of productUrls) {
      try {
        const product = await scraper.scrapeProduct(url);

        if (!product) {
          results.failed++;
          continue;
        }

        product.category = cat.name;

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
        await db.saveSnapshot(product.id, {
          timestamp: product.last_updated,
          price: product.current_price,
          sold_count: product.sold_count,
          review_count: product.review_count,
          rating: product.rating,
          in_stock: product.in_stock,
        });

        results.successful++;
        console.log(`✅ Saved: ${product.title.substring(0, 50)}...`);
      } catch (error) {
        console.error(`❌ Error:`, error);
        results.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      category: cat.name,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST with {"category": "beauty", "limit": 10}',
    available_categories: Object.keys(CATEGORIES),
  });
}
