import { NextRequest, NextResponse } from 'next/server';
import { TikTokScraper } from '@/lib/services/tiktok-scraper';
import { FirestoreService } from '@/lib/services/firestore-service';
import { TrendCalculator } from '@/lib/services/trend-calculator';

/**
 * Automated Daily Scraper - Runs via Vercel Cron
 * Scrapes TikTok Shop trending page and updates product database
 */

// Product URLs to scrape automatically
// These can be trending pages, category pages, or specific product lists
const SCRAPE_TARGETS = [
  // Category URLs (scraper will extract product links from these)
  // 'https://www.tiktok.com/shop/category/beauty',
  // 'https://www.tiktok.com/shop/category/home',
  // 'https://www.tiktok.com/shop/category/fashion',

  // Or specific product URLs
  // Add real TikTok Shop product URLs here
];

// Countries to scrape (can scrape different regional TikTok Shops)
const REGIONS = [
  { country: 'US', baseUrl: 'https://www.tiktok.com' },
  // { country: 'UK', baseUrl: 'https://shop-uk.tiktok.com' },
  // { country: 'CA', baseUrl: 'https://shop-ca.tiktok.com' },
];

export async function GET(request: NextRequest) {
  // Verify this is from Vercel Cron (security)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('🤖 Starting automated scrape job...');
  const startTime = Date.now();

  const scraper = new TikTokScraper();
  const db = new FirestoreService();

  const results = {
    success: 0,
    failed: 0,
    updated: 0,
    new: 0,
    errors: [] as string[],
  };

  try {
    await scraper.initialize();

    // If no targets configured, return early
    if (SCRAPE_TARGETS.length === 0) {
      return NextResponse.json({
        message: 'No scrape targets configured',
        note: 'Add URLs to SCRAPE_TARGETS in app/api/cron/scrape-daily/route.ts',
        setup_instructions: 'See QUICK_START_REAL_DATA.md for setup guide',
      });
    }

    for (const target of SCRAPE_TARGETS) {
      try {
        let productUrls: string[] = [];

        // Check if target is a category/listing page or direct product
        if (target.includes('/category/') || target.includes('/shop/')) {
          // Scrape category to get product URLs
          console.log(`📂 Scraping category: ${target}`);
          productUrls = await scraper.scrapeCategory(target, 20);
        } else {
          // Direct product URL
          productUrls = [target];
        }

        // Scrape each product
        for (const url of productUrls) {
          try {
            const product = await scraper.scrapeProduct(url);

            if (product) {
              // Check if product already exists
              const existing = await db.getProduct(product.id);

              // Calculate TrendScore
              const trendScore = TrendCalculator.calculateTrendScore(
                product.orders_3d_delta || 0,
                product.acceleration || 0,
                product.price_discount_rate || 0,
                product.reviews_3d_delta || 0,
                1.0,
                {
                  orders_3d: { mean: 100, std: 50 },
                  acceleration: { mean: 1.0, std: 0.5 },
                  discount: { mean: 0.15, std: 0.1 },
                  reviews_3d: { mean: 10, std: 5 },
                  stock: { mean: 1.0, std: 0.2 },
                }
              );

              product.trend_score = trendScore;

              // Save product
              await db.saveProduct(product);

              // Save snapshot for trend tracking
              await db.saveSnapshot(product.id, {
                timestamp: new Date().toISOString(),
                price: product.current_price,
                sold_count: product.sold_count,
                review_count: product.review_count,
                rating: product.rating,
                in_stock: product.in_stock,
              });

              if (existing) {
                results.updated++;
                console.log(`  ✅ Updated: ${product.title.substring(0, 40)}...`);
              } else {
                results.new++;
                console.log(`  ✨ New: ${product.title.substring(0, 40)}...`);
              }

              results.success++;
            } else {
              results.failed++;
              results.errors.push(`Failed to scrape: ${url}`);
            }

            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
          } catch (error) {
            results.failed++;
            const errorMsg = `Error scraping ${url}: ${error}`;
            results.errors.push(errorMsg);
            console.error(errorMsg);
          }
        }
      } catch (error) {
        const errorMsg = `Error processing target ${target}: ${error}`;
        results.errors.push(errorMsg);
        console.error(errorMsg);
      }
    }
  } catch (error) {
    console.error('Fatal error in scrape job:', error);
    return NextResponse.json(
      {
        error: 'Scrape job failed',
        details: String(error),
        partial_results: results,
      },
      { status: 500 }
    );
  } finally {
    await scraper.close();
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`✅ Scrape job complete in ${duration}s`);
  console.log(`   New: ${results.new}, Updated: ${results.updated}, Failed: ${results.failed}`);

  return NextResponse.json({
    message: 'Automated scrape completed',
    duration_seconds: parseFloat(duration),
    results: {
      total_processed: results.success + results.failed,
      new_products: results.new,
      updated_products: results.updated,
      successful: results.success,
      failed: results.failed,
    },
    errors: results.errors.length > 0 ? results.errors.slice(0, 10) : undefined,
    timestamp: new Date().toISOString(),
  });
}

// Allow manual trigger via POST (for testing)
export async function POST(request: NextRequest) {
  return GET(request);
}
