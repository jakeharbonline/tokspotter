import { NextRequest, NextResponse } from 'next/server';
import { TikTokScraper } from '@/lib/services/tiktok-scraper';
import { FirestoreService } from '@/lib/services/firestore-service';
import { TrendCalculator } from '@/lib/services/trend-calculator';

/**
 * Populate database with real TikTok Shop products
 * Uses ScraperAPI (1,000 free requests/month)
 *
 * AUTOMATIC DISCOVERY:
 * - Scrapes TikTok Shop category pages
 * - Discovers product URLs automatically
 * - No manual URL entry required!
 */

// TikTok Shop category URLs - will auto-discover products from these
const CATEGORY_URLS: Record<string, string> = {
  'Beauty & Personal Care': 'https://www.tiktok.com/shop/category/beauty-personal-care',
  'Fashion & Accessories': 'https://www.tiktok.com/shop/category/fashion',
  'Home & Garden': 'https://www.tiktok.com/shop/category/home-garden',
  'Electronics': 'https://www.tiktok.com/shop/category/electronics',
  'Health & Fitness': 'https://www.tiktok.com/shop/category/health-fitness',
  'Toys & Hobbies': 'https://www.tiktok.com/shop/category/toys',
  'Sports & Outdoors': 'https://www.tiktok.com/shop/category/sports',
  'Baby & Kids': 'https://www.tiktok.com/shop/category/baby',
  'Food & Beverages': 'https://www.tiktok.com/shop/category/food',
  'Pets': 'https://www.tiktok.com/shop/category/pets',
};

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Security check
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const scraper = new TikTokScraper();
  const db = new FirestoreService();

  const results = {
    total: 0,
    successful: 0,
    failed: 0,
    categories: {} as Record<string, number>,
  };

  try {
    console.log('🚀 Starting TikTok Shop scraping with auto-discovery...');

    for (const [category, categoryUrl] of Object.entries(CATEGORY_URLS)) {
      console.log(`\n📦 Processing ${category}...`);
      results.categories[category] = 0;

      // Step 1: Discover product URLs from category page
      console.log(`🔍 Discovering products from category page...`);
      const productUrls = await scraper.discoverProducts(categoryUrl, 50);

      if (productUrls.length === 0) {
        console.log(`⚠️  No products found in ${category}`);
        continue;
      }

      console.log(`✅ Found ${productUrls.length} products in ${category}`);

      // Step 2: Scrape each discovered product
      for (const url of productUrls) {
        results.total++;

        try {
          // Scrape product
          const product = await scraper.scrapeProduct(url);

          if (!product) {
            console.log(`❌ Failed to scrape: ${url}`);
            results.failed++;
            continue;
          }

          // Set category
          product.category = category;

          // Calculate trend metrics (simplified for initial scrape)
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
          console.error(`❌ Error processing ${url}:`, error);
          results.failed++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Scraped ${results.successful} products from ${Object.keys(results.categories).length} categories`,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Fatal error during scraping:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to scrape products',
        details: String(error),
        partial_results: results,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to populate database with real TikTok Shop products',
    note: 'Requires CRON_SECRET authorization header and SCRAPERAPI_KEY env variable',
    info: {
      scraper: 'ScraperAPI',
      free_tier: '1,000 requests/month',
      signup: 'https://www.scraperapi.com',
    },
  });
}
