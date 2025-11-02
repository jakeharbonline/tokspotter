import { NextResponse } from 'next/server';
import { TikTokApiScraper } from '@/lib/services/tiktok-api-scraper';

/**
 * Test endpoint for new API scraper
 * GET /api/scrape/test
 */
export async function GET() {
  try {
    const scraper = new TikTokApiScraper();

    // Test with a simple search
    console.log('Testing TikTok API scraper...');

    const productUrls = await scraper.searchProducts('beauty', 5);

    if (productUrls.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No products found - API may have changed structure',
        urls: [],
      });
    }

    return NextResponse.json({
      success: true,
      message: `Found ${productUrls.length} products`,
      urls: productUrls,
      note: 'API scraper is working!',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: String(error),
        message: 'API scraper test failed',
      },
      { status: 500 }
    );
  }
}
