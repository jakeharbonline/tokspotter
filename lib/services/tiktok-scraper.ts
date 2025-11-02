import { chromium, Browser, Page } from 'playwright';
import * as cheerio from 'cheerio';
import { Product, Shop } from '@/types/product';

export class TikTokScraper {
  private browser: Browser | null = null;

  async initialize() {
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    console.log('✅ Scraper initialized');
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('✅ Scraper closed');
    }
  }

  private async randomDelay() {
    const min = 2000;
    const max = 5000;
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  private async createPage(): Promise<Page> {
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }

    return await this.browser.newPage({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
    });
  }

  async scrapeProduct(productUrl: string): Promise<Product | null> {
    const page = await this.createPage();

    try {
      await page.goto(productUrl, { waitUntil: 'networkidle', timeout: 30000 });
      await this.randomDelay();

      const content = await page.content();
      const $ = cheerio.load(content);

      const productId = this.extractProductId(productUrl);

      // Note: These selectors are placeholders
      // Real TikTok Shop selectors need to be updated based on actual HTML
      const productData: Partial<Product> = {
        id: productId,
        title: await this.extractText(page, 'h1[data-e2e="product-title"]'),
        image_url: await this.extractImage(page, 'img[data-e2e="product-image"]'),
        current_price: await this.extractPrice(page, 'span[data-e2e="product-price"]'),
        original_price: await this.extractPrice(page, 'span[data-e2e="original-price"]'),
        sold_count: await this.extractSoldCount(page),
        rating: await this.extractRating(page),
        review_count: await this.extractReviewCount(page),
        category: await this.extractText(page, 'a[data-e2e="product-category"]'),
        shop_name: await this.extractText(page, 'a[data-e2e="shop-name"]'),
        shop_id: await this.extractShopId(page),
        product_url: productUrl,
        shop_url: await this.extractShopUrl(page),
        in_stock: await this.checkInStock(page),
        trend_score: 0,
        orders_3d_delta: 0,
        orders_7d_delta: 0,
        price_discount_rate: 0,
        reviews_3d_delta: 0,
        velocity_3d: 0,
        acceleration: 0,
        confidence_score: 0,
        has_affiliate_program: false,
        first_seen: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        snapshot_count: 0,
      };

      if (!productData.title) {
        console.warn(`Could not extract product data from ${productUrl}`);
        return null;
      }

      console.log(`✅ Scraped: ${productData.title?.substring(0, 50)}...`);
      return productData as Product;
    } catch (error) {
      console.error(`Error scraping ${productUrl}:`, error);
      return null;
    } finally {
      await page.close();
    }
  }

  async scrapeCategory(categoryUrl: string, limit: number = 50): Promise<string[]> {
    const page = await this.createPage();
    const productUrls: string[] = [];

    try {
      await page.goto(categoryUrl, { waitUntil: 'networkidle', timeout: 30000 });
      await this.randomDelay();

      // Scroll to load more products
      for (let i = 0; i < 3; i++) {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      const links = await page.$$('a[href*="/product/"]');

      for (const link of links.slice(0, limit)) {
        const href = await link.getAttribute('href');
        if (href && href.includes('/product/')) {
          const fullUrl = href.startsWith('http')
            ? href
            : `https://www.tiktok.com${href}`;
          productUrls.push(fullUrl);
        }
      }

      console.log(`✅ Found ${productUrls.length} products in category`);
      return Array.from(new Set(productUrls)); // Remove duplicates
    } catch (error) {
      console.error(`Error scraping category ${categoryUrl}:`, error);
      return [];
    } finally {
      await page.close();
    }
  }

  async scrapeShop(shopUrl: string): Promise<Shop | null> {
    const page = await this.createPage();

    try {
      await page.goto(shopUrl, { waitUntil: 'networkidle', timeout: 30000 });
      await this.randomDelay();

      const shopId = this.extractShopIdFromUrl(shopUrl);

      const shopData: Shop = {
        id: shopId,
        name: await this.extractText(page, 'h1[data-e2e="shop-name"]'),
        url: shopUrl,
        rating: await this.extractRating(page),
        total_products: await this.extractNumber(page, 'span[data-e2e="product-count"]'),
        followers: await this.extractNumber(page, 'span[data-e2e="follower-count"]'),
        badges: [],
        top_products: [],
        first_seen: new Date().toISOString(),
        last_updated: new Date().toISOString(),
      };

      console.log(`✅ Scraped shop: ${shopData.name}`);
      return shopData;
    } catch (error) {
      console.error(`Error scraping shop ${shopUrl}:`, error);
      return null;
    } finally {
      await page.close();
    }
  }

  // Helper methods
  private extractProductId(url: string): string {
    const match = url.match(/\/product\/(\d+)/);
    return match ? match[1] : '';
  }

  private extractShopIdFromUrl(url: string): string {
    const match = url.match(/\/@([^/]+)/);
    return match ? match[1] : '';
  }

  private async extractText(page: Page, selector: string): Promise<string> {
    try {
      const element = await page.$(selector);
      return element ? await element.innerText() : '';
    } catch {
      return '';
    }
  }

  private async extractImage(page: Page, selector: string): Promise<string> {
    try {
      const element = await page.$(selector);
      return element ? (await element.getAttribute('src')) || '' : '';
    } catch {
      return '';
    }
  }

  private async extractPrice(page: Page, selector: string): Promise<number> {
    try {
      const text = await this.extractText(page, selector);
      const priceStr = text.replace(/[^\d.]/g, '');
      return priceStr ? parseFloat(priceStr) : 0;
    } catch {
      return 0;
    }
  }

  private async extractSoldCount(page: Page): Promise<number> {
    try {
      const text = await this.extractText(page, 'span[data-e2e="sold-count"]');
      return this.parseCount(text);
    } catch {
      return 0;
    }
  }

  private async extractRating(page: Page): Promise<number> {
    try {
      const text = await this.extractText(page, 'span[data-e2e="rating"]');
      const ratingStr = text.replace(/[^\d.]/g, '');
      return ratingStr ? parseFloat(ratingStr) : 0;
    } catch {
      return 0;
    }
  }

  private async extractReviewCount(page: Page): Promise<number> {
    try {
      const text = await this.extractText(page, 'span[data-e2e="review-count"]');
      return this.parseCount(text);
    } catch {
      return 0;
    }
  }

  private async extractNumber(page: Page, selector: string): Promise<number> {
    try {
      const text = await this.extractText(page, selector);
      return this.parseCount(text);
    } catch {
      return 0;
    }
  }

  private parseCount(text: string): number {
    const match = text.match(/([\d.]+)\s*([KMB])?/i);
    if (match) {
      let num = parseFloat(match[1]);
      const multiplier = match[2];
      if (multiplier) {
        const multipliers: { [key: string]: number } = {
          K: 1000,
          M: 1000000,
          B: 1000000000,
        };
        num *= multipliers[multiplier.toUpperCase()] || 1;
      }
      return Math.floor(num);
    }
    return 0;
  }

  private async extractShopUrl(page: Page): Promise<string> {
    try {
      const element = await page.$('a[data-e2e="shop-link"]');
      const href = element ? await element.getAttribute('href') : '';
      return href && href.startsWith('http')
        ? href
        : `https://www.tiktok.com${href}`;
    } catch {
      return '';
    }
  }

  private async extractShopId(page: Page): Promise<string> {
    const shopUrl = await this.extractShopUrl(page);
    return this.extractShopIdFromUrl(shopUrl);
  }

  private async checkInStock(page: Page): Promise<boolean> {
    try {
      const outOfStock = await page.$('button[data-e2e="out-of-stock"]');
      return outOfStock === null;
    } catch {
      return true;
    }
  }
}
