import { NextRequest, NextResponse } from 'next/server';
import { TikTokScraper } from '@/lib/services/tiktok-scraper';

/**
 * Test endpoint to scrape a single TikTok Shop product
 * Usage: POST /api/scrape/test with body: { "url": "https://www.tiktok.com/view/product/..." }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'Missing "url" in request body' },
        { status: 400 }
      );
    }

    console.log(`🧪 Testing scraper with: ${url}`);

    const scraper = new TikTokScraper();
    const product = await scraper.scrapeProduct(url);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to scrape product',
          url,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully scraped product',
      product,
    });
  } catch (error) {
    console.error('❌ Test scrape error:', error);
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST a TikTok Shop product URL to test the scraper',
    example: {
      method: 'POST',
      body: {
        url: 'https://www.tiktok.com/view/product/1234567890',
      },
    },
    requirements: {
      env: 'SCRAPERAPI_KEY must be set',
      signup: 'https://www.scraperapi.com (1,000 free requests/month)',
    },
  });
}
