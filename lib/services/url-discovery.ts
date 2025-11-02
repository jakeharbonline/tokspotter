/**
 * Automated TikTok Shop URL Discovery
 * Finds trending products without manual URL collection
 */

import { chromium, Page } from 'playwright';

export class UrlDiscovery {
  private browser: any = null;

  async initialize() {
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  /**
   * Discover product URLs from TikTok Shop homepage/trending
   */
  async discoverTrendingUrls(limit: number = 20): Promise<string[]> {
    const page = await this.browser.newPage({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
    });

    const urls: string[] = [];

    try {
      // Visit TikTok Shop homepage
      await page.goto('https://www.tiktok.com/shop', {
        waitUntil: 'networkidle',
        timeout: 30000,
      });

      // Scroll to load more products
      for (let i = 0; i < 3; i++) {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(2000);
      }

      // Extract product links
      // These selectors need to be updated based on actual TikTok Shop structure
      const links = await page.$$('a[href*="/view/product/"]');

      for (const link of links.slice(0, limit)) {
        const href = await link.getAttribute('href');
        if (href && href.includes('/view/product/')) {
          const fullUrl = href.startsWith('http')
            ? href
            : `https://www.tiktok.com${href}`;
          urls.push(fullUrl);
        }
      }

      // Remove duplicates
      return Array.from(new Set(urls));
    } catch (error) {
      console.error('Error discovering URLs:', error);
      return [];
    } finally {
      await page.close();
    }
  }

  /**
   * Discover URLs from specific category
   */
  async discoverCategoryUrls(
    category: string,
    limit: number = 20
  ): Promise<string[]> {
    const categoryUrls: Record<string, string> = {
      beauty: 'https://www.tiktok.com/shop/c/beauty',
      home: 'https://www.tiktok.com/shop/c/home',
      fashion: 'https://www.tiktok.com/shop/c/fashion',
      electronics: 'https://www.tiktok.com/shop/c/electronics',
      kitchen: 'https://www.tiktok.com/shop/c/kitchen',
      toys: 'https://www.tiktok.com/shop/c/toys',
    };

    const categoryUrl = categoryUrls[category.toLowerCase()];
    if (!categoryUrl) {
      console.warn(`Unknown category: ${category}`);
      return [];
    }

    const page = await this.browser.newPage();
    const urls: string[] = [];

    try {
      await page.goto(categoryUrl, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });

      // Scroll to load products
      for (let i = 0; i < 3; i++) {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(2000);
      }

      // Extract product URLs
      const links = await page.$$('a[href*="/view/product/"]');

      for (const link of links.slice(0, limit)) {
        const href = await link.getAttribute('href');
        if (href && href.includes('/view/product/')) {
          const fullUrl = href.startsWith('http')
            ? href
            : `https://www.tiktok.com${href}`;
          urls.push(fullUrl);
        }
      }

      return Array.from(new Set(urls));
    } catch (error) {
      console.error(`Error discovering URLs for category ${category}:`, error);
      return [];
    } finally {
      await page.close();
    }
  }

  /**
   * Intercept TikTok Shop API calls to get product data directly
   * This is more reliable than HTML scraping
   */
  async interceptApiCalls(url: string): Promise<any[]> {
    const page = await this.browser.newPage();
    const apiData: any[] = [];

    // Listen for API responses
    page.on('response', async (response: any) => {
      const url = response.url();

      // TikTok Shop API endpoints (these may vary)
      if (
        url.includes('/api/shop/product') ||
        url.includes('/api/recommend/') ||
        url.includes('/product/list')
      ) {
        try {
          const json = await response.json();
          apiData.push(json);
          console.log('📡 Intercepted API call:', url);
        } catch (e) {
          // Not JSON, skip
        }
      }
    });

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(5000); // Wait for API calls

      return apiData;
    } catch (error) {
      console.error('Error intercepting API:', error);
      return [];
    } finally {
      await page.close();
    }
  }
}

/**
 * Alternative: Use TikTok's public API if available
 * This is faster and more reliable than scraping
 */
export async function fetchFromTikTokApi(
  endpoint: string,
  params: Record<string, any> = {}
): Promise<any> {
  // TikTok Shop may have public GraphQL or REST API
  // Example (this URL structure is hypothetical):
  const baseUrl = 'https://www.tiktok.com/api/shop/v1';
  const url = new URL(`${baseUrl}/${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('API fetch error:', error);
  }

  return null;
}
