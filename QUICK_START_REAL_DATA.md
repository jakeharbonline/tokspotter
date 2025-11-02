# Quick Start: Get Real TikTok Shop Data in 10 Minutes

Follow these steps to populate TokSpotter with actual trending products.

## Step 1: Install Dependencies (1 min)

```bash
cd frontend
pnpm install
npx playwright install chromium
```

## Step 2: Get TikTok Shop Product URLs (3 min)

### Option A: Browse TikTok App/Website
1. Open TikTok app or visit https://www.tiktok.com
2. Tap the shopping bag icon or go to "Shop" section
3. Browse trending products
4. Copy 10-20 product URLs

**URL Format**: `https://www.tiktok.com/view/product/[PRODUCT_ID]`

Example:
- `https://www.tiktok.com/view/product/1729762527861968902`
- `https://www.tiktok.com/view/product/1731692301508841983`

### Option B: Use TikTok Creator Marketplace
1. Visit https://creatormarketplace.tiktok.com
2. Look for promoted products
3. Copy product links

### Option C: Browse Viral Products Subreddits
- r/TikTokShop
- r/tiktokfavorites
- Copy URLs people share

## Step 3: Inspect Page Structure (2 min)

**Important**: TikTok Shop's HTML structure changes, so you need to find the actual selectors.

```bash
# Open a product page in debug mode
npx tsx scripts/inspect-page.ts https://www.tiktok.com/view/product/YOUR_PRODUCT_ID
```

This will:
- Open a browser window
- Load the product page
- Let you inspect elements to find selectors

**Find selectors for:**
- Product title (`h1` or similar)
- Current price
- Sold count
- Rating
- Reviews
- Shop name
- Category

## Step 4: Update Scraper Selectors (2 min)

Edit `lib/services/tiktok-scraper.ts`:

```typescript
// Line 58-70 - Replace placeholder selectors with real ones
const productData: Partial<Product> = {
  id: productId,
  title: await this.extractText(page, 'h1.actual-title-class'), // ← Update this
  image_url: await this.extractImage(page, 'img.actual-image-class'), // ← Update this
  current_price: await this.extractPrice(page, 'span.actual-price-class'), // ← Update this
  // ... update all selectors
};
```

**Example real selectors** (may vary):
```typescript
title: await this.extractText(page, 'h1[data-e2e="pdp-product-title"]'),
current_price: await this.extractPrice(page, 'div[data-e2e="pdp-price"]'),
sold_count: await this.extractSoldCount(page, 'span[data-e2e="sold-count"]'),
```

## Step 5: Test Scraper Locally (1 min)

Add test URLs to `scripts/test-scraper.ts`:

```typescript
const TEST_URLS = [
  'https://www.tiktok.com/view/product/YOUR_PRODUCT_ID_1',
  'https://www.tiktok.com/view/product/YOUR_PRODUCT_ID_2',
];
```

Run test:
```bash
npx tsx scripts/test-scraper.ts
```

If it works, you'll see:
```
✅ Success!
Title: Viral LED Light Strips...
Price: $19.99
Sold: 15420
```

If it fails:
- Selectors are wrong → Go back to Step 3
- URL is wrong → Check format
- TikTok blocked you → Add more delays, use proxies

## Step 6: Bulk Import Products (1 min)

Add your URLs to `scripts/bulk-import.ts`:

```typescript
const PRODUCT_URLS = [
  'https://www.tiktok.com/view/product/1234567890',
  'https://www.tiktok.com/view/product/0987654321',
  // ... add 10-20 URLs
];
```

Run import:
```bash
# Make sure you have .env.local with Firebase credentials
npx tsx scripts/bulk-import.ts
```

This will:
- Scrape each product
- Calculate TrendScore
- Save to Firestore
- Create snapshots

## Step 7: Verify Data (30 sec)

Check your live site:
```bash
curl "https://tokspotter.vercel.app/api/products/trending?limit=10"
```

Or visit: https://tokspotter.vercel.app

You should see real products with actual data!

---

## Troubleshooting

### "Failed to scrape product"

**Problem**: Selectors are outdated or wrong

**Fix**:
1. Run `npx tsx scripts/inspect-page.ts <URL>`
2. Inspect elements manually
3. Update selectors in `lib/services/tiktok-scraper.ts`

### "Bot detection / Captcha"

**Problem**: TikTok is blocking automated access

**Fix**:
```typescript
// In tiktok-scraper.ts, add stealth
import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Use stealth mode
chromium.use(StealthPlugin());
```

Or use:
- Residential proxies
- Longer delays between requests
- Different user agents

### "No products showing on site"

**Problem**: Products scraped but not appearing

**Check**:
1. Firestore console - are products saved?
2. API endpoint - does it return data?
3. Frontend console - any errors?

---

## Alternative: Use API Instead of Scraping

### Option 1: TikTok Shop API (Official)
- Apply at: https://seller.tiktok.com/account/api
- Requires seller account
- Real-time data, no scraping

### Option 2: Third-Party Data APIs
- **Apify**: https://apify.com/apify/tiktok-scraper ($50/mo)
- **Bright Data**: https://brightdata.com ($500+/mo)
- **ScrapeOwl**: https://scrapeowl.com ($29/mo)

### Option 3: Manual Entry (Quick Start)
1. Browse TikTok Shop
2. Manually create products in Firestore
3. Use Firebase console to add documents

---

## Next Steps After First Import

1. **Set up Cron Job**: Automate scraping daily
   ```typescript
   // In vercel.json
   {
     "crons": [{
       "path": "/api/scrape/run",
       "schedule": "0 2 * * *"  // 2 AM daily
     }]
   }
   ```

2. **Monitor TrendScores**: Products update automatically

3. **Add More Countries**: Scrape UK, CA, AU TikTok Shops

4. **Build Features**: Alerts, watchlists, exports

---

## Success Checklist

- [ ] Playwright installed
- [ ] Found 10+ product URLs
- [ ] Inspected page structure
- [ ] Updated scraper selectors
- [ ] Tested with test-scraper.ts
- [ ] Ran bulk-import.ts successfully
- [ ] Verified data on live site

**All checked?** You now have real TikTok Shop data! 🎉

---

**Need help?** Check the logs, inspect the page, update selectors. The scraper framework is solid, it just needs the right CSS selectors for current TikTok Shop structure.
