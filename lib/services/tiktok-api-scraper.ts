/**
 * TikTok Shop API Scraper
 * Uses TikTok's internal API endpoints for reliable product data extraction
 */

import { Product } from '@/types/product';

interface TikTokApiProduct {
  product_id: string;
  title: string;
  images?: { url_list?: string[] }[];
  price?: {
    sale_price?: string;
    original_price?: string;
    currency?: string;
  };
  stats?: {
    sold_count?: number;
    review_count?: number;
  };
  rating?: number;
  shop?: {
    shop_id?: string;
    shop_name?: string;
  };
  category?: string;
}

export class TikTokApiScraper {
  private readonly userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  /**
   * Search TikTok Shop for products by query
   */
  async searchProducts(query: string, limit: number = 50): Promise<string[]> {
    const productUrls: string[] = [];

    try {
      // TikTok Shop search endpoint
      const searchUrl = `https://www.tiktok.com/api/shop/product/search`;

      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'User-Agent': this.userAgent,
          'Content-Type': 'application/json',
          'Referer': 'https://www.tiktok.com',
        },
        body: JSON.stringify({
          query,
          limit: Math.min(limit, 100),
          offset: 0,
        }),
      });

      if (!response.ok) {
        console.warn(`Search API returned ${response.status}`);
        return [];
      }

      const data = await response.json();

      if (data.products && Array.isArray(data.products)) {
        productUrls.push(
          ...data.products.map((p: any) =>
            `https://www.tiktok.com/view/product/${p.product_id}`
          )
        );
      }

      console.log(`✅ Found ${productUrls.length} products for query: ${query}`);
      return productUrls;
    } catch (error) {
      console.error(`Error searching products:`, error);
      return [];
    }
  }

  /**
   * Get category products from TikTok Shop
   */
  async getCategoryProducts(categoryUrl: string, limit: number = 50): Promise<string[]> {
    const productUrls: string[] = [];

    try {
      // Extract category ID from URL
      const categoryMatch = categoryUrl.match(/category\/([^/?]+)/);
      if (!categoryMatch) {
        console.warn(`Could not extract category from: ${categoryUrl}`);
        return [];
      }

      const categorySlug = categoryMatch[1];

      // Convert category slug to search terms for better results
      const searchTerms = categorySlug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

      // Use search API with category-specific terms
      return await this.searchProducts(searchTerms, limit);
    } catch (error) {
      console.error(`Error getting category products:`, error);
      return [];
    }
  }

  /**
   * Scrape product details via API interception approach
   */
  async scrapeProduct(productUrl: string): Promise<Product | null> {
    try {
      const productId = this.extractProductId(productUrl);
      if (!productId) {
        console.warn(`Could not extract product ID from: ${productUrl}`);
        return null;
      }

      // Fetch product page and intercept API calls
      const response = await fetch(productUrl, {
        headers: {
          'User-Agent': this.userAgent,
        },
      });

      if (!response.ok) {
        console.warn(`Product page returned ${response.status}`);
        return null;
      }

      const html = await response.text();

      // Extract JSON data from __UNIVERSAL_DATA_FOR_REHYDRATION__ script tag
      const dataMatch = html.match(/__UNIVERSAL_DATA_FOR_REHYDRATION__\s*=\s*({.+?})\s*;/s);

      if (!dataMatch) {
        console.warn(`Could not find product data in page`);
        return null;
      }

      const pageData = JSON.parse(dataMatch[1]);

      // Navigate to product data (structure may vary)
      const productData = this.extractProductFromPageData(pageData, productId);

      if (!productData) {
        console.warn(`Could not parse product data for ${productId}`);
        return null;
      }

      return this.convertToProduct(productData, productUrl);
    } catch (error) {
      console.error(`Error scraping product ${productUrl}:`, error);
      return null;
    }
  }

  /**
   * Extract product data from TikTok's page data object
   */
  private extractProductFromPageData(pageData: any, productId: string): TikTokApiProduct | null {
    try {
      // Try multiple possible data locations in TikTok's page structure
      const possiblePaths = [
        pageData.__DEFAULT_SCOPE__?.['webapp.commerce-product']?.product,
        pageData.__DEFAULT_SCOPE__?.['webapp.shop-product']?.product,
        pageData.seo?.metaParams?.product,
      ];

      for (const productData of possiblePaths) {
        if (productData && productData.product_id === productId) {
          return productData;
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Convert TikTok API product to our Product type
   */
  private convertToProduct(apiProduct: TikTokApiProduct, productUrl: string): Product {
    const currentPrice = apiProduct.price?.sale_price
      ? parseFloat(apiProduct.price.sale_price) / 100  // TikTok stores prices in cents
      : 0;

    const originalPrice = apiProduct.price?.original_price
      ? parseFloat(apiProduct.price.original_price) / 100
      : currentPrice;

    const discountRate = originalPrice > 0
      ? (originalPrice - currentPrice) / originalPrice
      : 0;

    return {
      id: apiProduct.product_id,
      title: apiProduct.title,
      image_url: apiProduct.images?.[0]?.url_list?.[0] || '',
      current_price: currentPrice,
      original_price: originalPrice,
      sold_count: apiProduct.stats?.sold_count || 0,
      rating: apiProduct.rating || 0,
      review_count: apiProduct.stats?.review_count || 0,
      category: apiProduct.category || 'Unknown',
      shop_name: apiProduct.shop?.shop_name || 'Unknown Shop',
      shop_id: apiProduct.shop?.shop_id || '',
      shop_url: apiProduct.shop?.shop_id
        ? `https://www.tiktok.com/@${apiProduct.shop.shop_id}`
        : '',
      product_url: productUrl,
      in_stock: true,  // Assume in stock if we can fetch it
      price_discount_rate: discountRate,

      // Metrics will be calculated by TrendCalculator
      trend_score: 0,
      orders_3d_delta: 0,
      orders_7d_delta: 0,
      reviews_3d_delta: 0,
      velocity_3d: 0,
      acceleration: 0,
      confidence_score: 0,
      has_affiliate_program: false,

      first_seen: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      snapshot_count: 0,
    };
  }

  /**
   * Extract product ID from URL
   */
  private extractProductId(url: string): string {
    const match = url.match(/\/product\/(\d+)/);
    return match ? match[1] : '';
  }

  /**
   * Add delay to respect rate limits
   */
  private async delay(ms: number = 2000): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
}
