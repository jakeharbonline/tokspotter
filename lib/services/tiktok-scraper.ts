/**
 * TikTok Shop Scraper using ScraperAPI
 * FREE: 1,000 requests/month - Sign up at scraperapi.com
 */

import { Product } from '@/types/product';

interface ScraperAPIResponse {
  status: string;
  body: string;
}

export class TikTokScraper {
  private apiKey: string;
  private baseUrl = 'https://api.scraperapi.com';

  constructor() {
    this.apiKey = process.env.SCRAPERAPI_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️  SCRAPERAPI_KEY not set - scraping will not work');
    }
  }

  /**
   * Scrape a single TikTok Shop product URL
   */
  async scrapeProduct(productUrl: string): Promise<Product | null> {
    if (!this.apiKey) {
      console.error('❌ SCRAPERAPI_KEY environment variable not set');
      return null;
    }

    try {
      console.log(`🔍 Scraping: ${productUrl}`);

      // ScraperAPI with JavaScript rendering enabled
      const scraperUrl = new URL(this.baseUrl);
      scraperUrl.searchParams.set('api_key', this.apiKey);
      scraperUrl.searchParams.set('url', productUrl);
      scraperUrl.searchParams.set('render', 'true'); // Enable JS rendering

      const response = await fetch(scraperUrl.toString());

      if (!response.ok) {
        console.error(`❌ ScraperAPI returned ${response.status}`);
        return null;
      }

      const html = await response.text();

      // Extract product data from HTML
      const product = this.parseProductHtml(html, productUrl);

      if (product) {
        console.log(`✅ Scraped: ${product.title}`);
      }

      return product;
    } catch (error) {
      console.error(`❌ Error scraping ${productUrl}:`, error);
      return null;
    }
  }

  /**
   * Discover top trending product URLs from TikTok Shop category page
   * Filters for: Best Sellers, High Reviews, Trending, Viral
   */
  async discoverProducts(categoryUrl: string, limit: number = 50): Promise<string[]> {
    if (!this.apiKey) {
      console.error('❌ SCRAPERAPI_KEY environment variable not set');
      return [];
    }

    try {
      console.log(`🔍 Discovering trending products from: ${categoryUrl}`);

      // Try multiple sorting options to get the best products
      const sortOptions = [
        'sort_by=best_selling',   // Best sellers (proven winners)
        'sort_by=trending',        // Trending products (current hot items)
        'sort_by=top_rated',       // Highest rated (quality products)
        'sort_by=newest',          // New arrivals (upcoming/emerging trends)
        'sort_by=price_low',       // Budget-friendly (viral potential)
      ];

      const allProductUrls = new Set<string>();

      for (const sortOption of sortOptions) {
        const url = `${categoryUrl}?${sortOption}`;

        console.log(`  🎯 Fetching: ${sortOption.replace('sort_by=', '')}`);

        const scraperUrl = new URL(this.baseUrl);
        scraperUrl.searchParams.set('api_key', this.apiKey);
        scraperUrl.searchParams.set('url', url);
        scraperUrl.searchParams.set('render', 'true');

        const response = await fetch(scraperUrl.toString());

        if (response.ok) {
          const html = await response.text();
          const urls = this.extractProductUrls(html);
          urls.forEach(u => allProductUrls.add(u));

          console.log(`    ✅ Found ${urls.length} products`);
        }

        // Rate limiting between sort requests
        await this.delay(1000);
      }

      const productUrls = Array.from(allProductUrls);
      console.log(`✅ Total unique products discovered: ${productUrls.length}`);

      // Return top products up to limit
      return productUrls.slice(0, limit);
    } catch (error) {
      console.error(`❌ Error discovering products:`, error);
      return [];
    }
  }

  /**
   * Extract product URLs from category page HTML
   * Prioritizes products with trending indicators
   */
  private extractProductUrls(html: string): string[] {
    interface ProductCandidate {
      url: string;
      score: number;
    }

    const productCandidates: ProductCandidate[] = [];
    const seenUrls = new Set<string>();

    // Pattern 1: Direct product links with context
    const productLinkPattern = /href="(https?:\/\/(?:www\.)?tiktok\.com\/view\/product\/\d+[^"]*)"/g;
    let match;

    while ((match = productLinkPattern.exec(html)) !== null) {
      const url = match[1].split('?')[0];
      if (!seenUrls.has(url)) {
        seenUrls.add(url);

        // Calculate quality score based on surrounding context
        const contextStart = Math.max(0, match.index - 500);
        const contextEnd = Math.min(html.length, match.index + 500);
        const context = html.substring(contextStart, contextEnd).toLowerCase();

        let score = 0;

        // Boost for trending indicators (current viral products)
        if (context.includes('trending') || context.includes('viral')) score += 10;
        if (context.includes('best seller') || context.includes('bestseller')) score += 8;
        if (context.includes('hot') || context.includes('popular')) score += 6;

        // Boost for upcoming/emerging trend indicators
        if (context.includes('new') || context.includes('just launched')) score += 7;
        if (context.includes('rising') || context.includes('growing')) score += 6;
        if (context.includes('limited') || context.includes('exclusive')) score += 5;

        // Boost for high sales indicators (proven demand)
        if (context.includes('sold') && /\d+k|million/i.test(context)) score += 5;

        // Boost for early momentum (moderate sales = emerging trend)
        if (context.includes('sold') && /\d+\s?(sold|sales)/i.test(context)) score += 4;

        // Boost for ratings (quality products)
        if (context.includes('rating') && /[4-5]\.\d/i.test(context)) score += 4;
        if (context.includes('review') && /\d+k/i.test(context)) score += 3;

        // Boost for moderate reviews (emerging trend sweet spot: 100-1000 reviews)
        if (context.includes('review') && /\d{2,3}\s?review/i.test(context)) score += 4;

        // Boost for discounts (trending products often have deals)
        if (context.includes('off') && /\d+%/i.test(context)) score += 2;

        // Boost for TikTok-specific viral indicators
        if (context.includes('tiktok made me buy') || context.includes('tiktok viral')) score += 8;
        if (context.includes('creator') || context.includes('influencer')) score += 3;

        productCandidates.push({ url, score });
      }
    }

    // Pattern 2: Product IDs in JSON data (also score these)
    const jsonPattern = /"product_id"\s*:\s*"?(\d+)"?/g;
    while ((match = jsonPattern.exec(html)) !== null) {
      const url = `https://www.tiktok.com/view/product/${match[1]}`;
      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        productCandidates.push({ url, score: 1 }); // Default low score
      }
    }

    // Pattern 3: Alternative product URL format
    const altLinkPattern = /href="(\/view\/product\/\d+[^"]*)"/g;
    while ((match = altLinkPattern.exec(html)) !== null) {
      const url = `https://www.tiktok.com${match[1].split('?')[0]}`;
      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        productCandidates.push({ url, score: 1 });
      }
    }

    // Sort by score (highest first) and return URLs
    return productCandidates
      .sort((a, b) => b.score - a.score)
      .map(p => p.url);
  }

  /**
   * Scrape multiple products with rate limiting
   */
  async scrapeProducts(productUrls: string[]): Promise<Product[]> {
    const products: Product[] = [];

    for (let i = 0; i < productUrls.length; i++) {
      const product = await this.scrapeProduct(productUrls[i]);

      if (product) {
        products.push(product);
      }

      // Rate limiting: wait 2 seconds between requests
      if (i < productUrls.length - 1) {
        await this.delay(2000);
      }
    }

    return products;
  }

  /**
   * Parse HTML to extract product data
   */
  private parseProductHtml(html: string, productUrl: string): Product | null {
    try {
      // Extract product ID from URL
      const productId = this.extractProductId(productUrl);

      // Try to find JSON data in script tags
      const jsonData = this.extractJsonData(html);

      if (jsonData) {
        return this.parseFromJson(jsonData, productId, productUrl);
      }

      // Fallback: parse HTML directly
      return this.parseFromHtml(html, productId, productUrl);
    } catch (error) {
      console.error('❌ Error parsing product HTML:', error);
      return null;
    }
  }

  /**
   * Extract JSON data from script tags
   */
  private extractJsonData(html: string): any {
    try {
      // TikTok embeds data in __UNIVERSAL_DATA_FOR_REHYDRATION__
      const dataMatch = html.match(/__UNIVERSAL_DATA_FOR_REHYDRATION__[\s\S]*?=[\s\S]*?(\{[\s\S]+?\})\s*;/);

      if (dataMatch) {
        return JSON.parse(dataMatch[1]);
      }

      // Alternative: SIGI_STATE
      const sigiMatch = html.match(/window\['SIGI_STATE'\]\s*=\s*(\{.+?\})\s*;/);

      if (sigiMatch) {
        return JSON.parse(sigiMatch[1]);
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Parse product from JSON data structure
   */
  private parseFromJson(data: any, productId: string, productUrl: string): Product | null {
    try {
      // Navigate TikTok's nested data structure
      const productData =
        data.__DEFAULT_SCOPE__?.['webapp.commerce-product']?.product ||
        data.__DEFAULT_SCOPE__?.['webapp.shop-product']?.product ||
        data.seo?.metaParams?.product ||
        null;

      if (!productData) return null;

      const currentPrice = this.parsePrice(productData.price?.sale_price || productData.salePrice);
      const originalPrice = this.parsePrice(productData.price?.original_price || productData.originalPrice);
      const discount = originalPrice > 0 ? (originalPrice - currentPrice) / originalPrice : 0;

      return {
        id: productId,
        title: productData.title || productData.name || '',
        image_url: this.extractImage(productData),
        current_price: currentPrice,
        original_price: originalPrice,
        sold_count: productData.stats?.sold_count || productData.sales || 0,
        rating: productData.rating || 0,
        review_count: productData.stats?.review_count || productData.reviews || 0,
        category: productData.category || 'Unknown',
        shop_name: productData.shop?.name || productData.shop?.shop_name || 'Unknown',
        shop_id: productData.shop?.id || productData.shop?.shop_id || '',
        shop_url: productData.shop?.url || '',
        product_url: productUrl,
        in_stock: productData.in_stock !== false,
        country: 'US',

        // Metrics (will be calculated later)
        orders_3d_delta: 0,
        orders_7d_delta: 0,
        price_discount_rate: discount,
        reviews_3d_delta: 0,
        velocity_3d: 0,
        acceleration: 0,
        trend_score: 0,
        confidence_score: 0.7,
        has_affiliate_program: false,

        first_seen: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        snapshot_count: 0,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Parse product from HTML (fallback)
   */
  private parseFromHtml(html: string, productId: string, productUrl: string): Product | null {
    try {
      // Extract title
      const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/) ||
                        html.match(/"product_name":"([^"]+)"/) ||
                        html.match(/"title":"([^"]+)"/);
      const title = titleMatch ? this.decodeHtml(titleMatch[1]) : '';

      // Extract price
      const priceMatch = html.match(/\$(\d+\.?\d*)/) ||
                        html.match(/"price":(\d+)/);
      const price = priceMatch ? parseFloat(priceMatch[1]) : 0;

      // Extract image
      const imageMatch = html.match(/<img[^>]+src="([^"]+)"[^>]*>/);
      const imageUrl = imageMatch ? imageMatch[1] : '';

      if (!title || !price) {
        console.warn('⚠️  Could not extract basic product info from HTML');
        return null;
      }

      return {
        id: productId,
        title,
        image_url: imageUrl,
        current_price: price,
        original_price: price,
        sold_count: 0,
        rating: 0,
        review_count: 0,
        category: 'Unknown',
        shop_name: 'Unknown',
        shop_id: '',
        shop_url: '',
        product_url: productUrl,
        in_stock: true,
        country: 'US',

        orders_3d_delta: 0,
        orders_7d_delta: 0,
        price_discount_rate: 0,
        reviews_3d_delta: 0,
        velocity_3d: 0,
        acceleration: 0,
        trend_score: 0,
        confidence_score: 0.5,
        has_affiliate_program: false,

        first_seen: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        snapshot_count: 0,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Extract product ID from URL
   */
  private extractProductId(url: string): string {
    const match = url.match(/\/product\/(\d+)/) ||
                  url.match(/\/(\d{10,})/) ||
                  url.match(/product_id=(\d+)/);
    return match ? match[1] : `product-${Date.now()}`;
  }

  /**
   * Extract image URL from product data
   */
  private extractImage(productData: any): string {
    return productData.image_url ||
           productData.images?.[0]?.url_list?.[0] ||
           productData.images?.[0] ||
           productData.image ||
           '';
  }

  /**
   * Parse price (handles different formats)
   */
  private parsePrice(price: any): number {
    if (typeof price === 'number') {
      // TikTok often stores prices in cents
      return price > 1000 ? price / 100 : price;
    }
    if (typeof price === 'string') {
      const num = parseFloat(price.replace(/[^0-9.]/g, ''));
      return isNaN(num) ? 0 : num;
    }
    return 0;
  }

  /**
   * Decode HTML entities
   */
  private decodeHtml(text: string): string {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  /**
   * Delay helper for rate limiting
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
