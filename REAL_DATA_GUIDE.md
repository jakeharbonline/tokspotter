# Getting Real TikTok Shop Data

The current scraper is built but needs real TikTok Shop URLs to work. Here's how to populate TokSpotter with actual trending products.

## Option 1: Manual URL Collection (Fastest to Start)

1. **Browse TikTok Shop**:
   - Go to https://shop.tiktok.com or the TikTok app
   - Find trending products in various categories

2. **Copy Product URLs**:
   - Get 20-30 product URLs like:
     - `https://www.tiktok.com/@shop/product/1234567890`
     - `https://shop.tiktok.com/view/product/1234567890`

3. **Use the Scraper API**:
   ```bash
   curl -X POST https://tokspotter.vercel.app/api/scrape/run \
     -H "Content-Type: application/json" \
     -d '{
       "productUrls": [
         "https://www.tiktok.com/@shop/product/...",
         "https://www.tiktok.com/@shop/product/..."
       ]
     }'
   ```

## Option 2: TikTok Shop API (Official - Requires Partnership)

1. **Apply for TikTok Shop Seller API**:
   - Visit: https://seller.tiktok.com/account/api
   - Requires being an approved TikTok Shop seller

2. **Endpoints You'd Use**:
   ```
   GET /product/search    - Search trending products
   GET /product/list      - List products by category
   GET /product/detail    - Get full product metrics
   ```

3. **Benefits**:
   - Official data with sales counts
   - Real-time metrics
   - No scraping limitations

## Option 3: Third-Party Data APIs

### A. Use a Data Service
- **Apify** (apify.com) - Has TikTok scrapers
- **Bright Data** (brightdata.com) - E-commerce data
- **Scrapfly** (scrapfly.io) - TikTok scraping

Example with Apify:
```javascript
const ApifyClient = require('apify-client');
const client = new ApifyClient({ token: 'YOUR_TOKEN' });

const run = await client.actor('apify/tiktok-scraper').call({
  searchQueries: ['trending products'],
  maxResults: 100,
});
```

### B. Use RSS/Data Aggregators
- Some TikTok tracking sites provide RSS feeds
- Scrape aggregator sites that track TikTok trends

## Option 4: Build a Robust Scraper (Advanced)

The current scraper (`lib/services/tiktok-scraper.ts`) needs:

### Issues to Fix:
1. **Selectors are Placeholders**:
   - Line 58-66: `data-e2e="product-title"` etc. are generic
   - Need actual TikTok Shop DOM selectors

2. **How to Get Real Selectors**:
   ```bash
   # Install Playwright
   pnpm exec playwright install chromium

   # Run in headed mode to inspect
   const browser = await chromium.launch({ headless: false });
   ```

3. **Inspect TikTok Shop Page**:
   - Right-click → Inspect
   - Find actual selectors for:
     - Product title: Maybe `h1.product-title`
     - Price: `span.price-current`
     - Sold count: `div.sold-count`
     - Reviews: `span.review-count`

4. **Update Scraper**:
   ```typescript
   // In tiktok-scraper.ts, replace:
   title: await this.extractText(page, 'h1[data-e2e="product-title"]'),

   // With actual selector:
   title: await this.extractText(page, 'h1.actual-title-class'),
   ```

### Anti-Scraping Challenges:
- **Rate Limiting**: Add delays, rotate IPs
- **Bot Detection**: Use stealth plugins
- **Captchas**: May need solving service

## Option 5: Hybrid Approach (Recommended for MVP)

1. **Start with Demo Data**:
   ```bash
   curl -X POST https://tokspotter.vercel.app/api/scrape/seed
   ```

2. **Manually Add 10-20 Real Products**:
   - Browse TikTok Shop
   - Create products via Firestore console
   - Or use seed API with real data

3. **Build Community**:
   - Let users submit trending products
   - Crowdsource URLs
   - Verify and import

4. **Later: Automate**:
   - Once you have traction, invest in proper API or data service
   - Or hire someone to fix scraper selectors

## Quick Win: Use Product Hunt / Reddit

People share trending TikTok products on:
- r/TikTokShop
- r/TrendingProducts
- Product Hunt

Scrape these aggregators instead!

## Database Structure for Real Data

When you get real products, ensure they have:

```typescript
{
  id: string,              // Unique product ID
  title: string,           // Full product name
  current_price: number,   // Current price in USD
  sold_count: number,      // Total units sold
  rating: number,          // 0-5 star rating
  review_count: number,    // Number of reviews
  category: string,        // e.g., "Beauty & Personal Care"
  country: string,         // "US", "UK", "CA", "AU"
  trend_score: number,     // Calculate via TrendCalculator
  shop_name: string,       // Seller shop name
  product_url: string,     // Link to TikTok Shop
  image_url: string,       // Product image
  ...
}
```

## Next Steps

1. **Choose your approach** (I recommend Option 1 for MVP)
2. **Get 20-30 real product URLs**
3. **Test scraper locally**:
   ```bash
   cd frontend
   pnpm dev
   # Then call /api/scrape/run with real URLs
   ```
4. **Verify data in Firestore**
5. **Deploy and monitor**

## Need Help?

If scraping fails:
1. Check network tab for actual API calls
2. TikTok might have a GraphQL API you can intercept
3. Consider paying for data service ($50-200/mo)
4. Start with manual data entry while building audience

---

**Remember**: Real data makes TokSpotter valuable. Demo data is fine for UI/UX testing, but users want REAL trending products!
