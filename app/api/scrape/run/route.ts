import { NextRequest, NextResponse } from 'next/server';
import { TikTokScraper } from '@/lib/services/tiktok-scraper';
import { FirestoreService } from '@/lib/services/firestore-service';
import { TrendCalculator } from '@/lib/services/trend-calculator';

export async function POST(request: NextRequest) {
  try {
    // Get URLs from request body
    const body = await request.json();
    const { productUrls, categoryUrl } = body;

    if (!productUrls && !categoryUrl) {
      return NextResponse.json(
        { error: 'Either productUrls array or categoryUrl is required' },
        { status: 400 }
      );
    }

    const scraper = new TikTokScraper();
    const db = new FirestoreService();

    await scraper.initialize();

    const results = {
      success: 0,
      failed: 0,
      products: [] as any[],
    };

    try {
      let urlsToScrape: string[] = [];

      // If category URL provided, get product URLs from category
      if (categoryUrl) {
        console.log(`Scraping category: ${categoryUrl}`);
        urlsToScrape = await scraper.scrapeCategory(categoryUrl, 20);
        console.log(`Found ${urlsToScrape.length} product URLs`);
      } else {
        urlsToScrape = productUrls;
      }

      // Scrape each product
      for (const url of urlsToScrape) {
        try {
          console.log(`Scraping product: ${url}`);
          const product = await scraper.scrapeProduct(url);

          if (product) {
            // Calculate initial TrendScore (will need historical data for accurate scores)
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

            // Save to Firestore
            await db.saveProduct(product);

            // Save snapshot
            await db.saveSnapshot(product.id, {
              timestamp: new Date().toISOString(),
              price: product.current_price,
              sold_count: product.sold_count,
              review_count: product.review_count,
              rating: product.rating,
              in_stock: product.in_stock,
            });

            results.success++;
            results.products.push({
              id: product.id,
              title: product.title,
              trend_score: product.trend_score,
            });

            console.log(`✅ Saved: ${product.title}`);
          } else {
            results.failed++;
          }
        } catch (error) {
          console.error(`Failed to process ${url}:`, error);
          results.failed++;
        }
      }
    } finally {
      await scraper.close();
    }

    return NextResponse.json({
      message: 'Scraping completed',
      results,
    });
  } catch (error) {
    console.error('Error in scraper:', error);
    return NextResponse.json(
      { error: 'Failed to run scraper', details: String(error) },
      { status: 500 }
    );
  }
}

// GET endpoint for testing/triggering without body
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'TokSpotter Scraper API',
    usage: 'Send POST request with either productUrls array or categoryUrl',
    example: {
      productUrls: [
        'https://www.tiktok.com/@shop/product/1234567890',
        'https://www.tiktok.com/@shop/product/0987654321',
      ],
      categoryUrl: 'https://www.tiktok.com/shop/category/fashion',
    },
    note: 'This endpoint requires valid TikTok Shop URLs',
  });
}
