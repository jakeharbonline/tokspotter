# TikTok Shop Automated Scraping Guide

Your TokSpotter now has **fully automated scraping** that runs daily without manual intervention!

## 🤖 How It Works

### Daily Automation
- **Cron Job** runs at 2:00 AM UTC every day
- **Scrapes** configured product URLs or category pages
- **Calculates** TrendScores automatically
- **Updates** existing products with new data
- **Saves** snapshots for trend tracking

### Architecture
```
Vercel Cron (2 AM UTC)
    ↓
/api/cron/scrape-daily
    ↓
TikTok Shop Scraper
    ↓
Firestore Database
    ↓
Live on tokspotter.vercel.app
```

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Add Scrape Targets

Edit `app/api/cron/scrape-daily/route.ts`:

```typescript
const SCRAPE_TARGETS = [
  // Option A: Category pages (automatically finds products)
  'https://www.tiktok.com/shop/category/beauty',
  'https://www.tiktok.com/shop/category/home',

  // Option B: Specific product URLs
  'https://www.tiktok.com/view/product/1234567890',
  'https://www.tiktok.com/view/product/0987654321',
];
```

### Step 2: Add Cron Secret (Security)

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add: `CRON_SECRET` = `your-random-secret-key-here`
3. Redeploy

This prevents unauthorized access to your cron endpoint.

### Step 3: Deploy

```bash
git add -A
git commit -m "Configure automated scraping"
git push
```

Vercel automatically sets up the cron job from `vercel.json`!

---

## 📅 Cron Schedule

Current schedule: **Daily at 2:00 AM UTC**

### Change Schedule

Edit `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/scrape-daily",
      "schedule": "0 2 * * *"  // ← Change this
    }
  ]
}
```

**Schedule Examples:**
- `"0 2 * * *"` - Daily at 2 AM UTC
- `"0 */6 * * *"` - Every 6 hours
- `"0 0 * * 0"` - Weekly on Sunday
- `"0 0 1 * *"` - Monthly on 1st

Format: `minute hour day month dayOfWeek`

---

## 🎯 Discovery Methods

### Method 1: Manual URL List (Simplest)
Add specific product URLs to `SCRAPE_TARGETS`:
```typescript
const SCRAPE_TARGETS = [
  'https://www.tiktok.com/view/product/1234567890',
  'https://www.tiktok.com/view/product/0987654321',
];
```

### Method 2: Category Scraping (Automatic Discovery)
Point to category pages:
```typescript
const SCRAPE_TARGETS = [
  'https://www.tiktok.com/shop/category/beauty',
];
```
The scraper will find ~20 products from that category.

### Method 3: API Interception (Advanced)
Use `UrlDiscovery` service to intercept TikTok's own API:
```typescript
import { UrlDiscovery } from '@/lib/services/url-discovery';

const discovery = new UrlDiscovery();
await discovery.initialize();
const urls = await discovery.discoverTrendingUrls(50);
```

### Method 4: Reddit/Social Scraping (Creative)
Scrape r/TikTokShop for product links:
```typescript
// Scrape Reddit for TikTok Shop URLs people share
const redditUrls = await scrapeRedditForTikTokUrls();
```

---

## 📊 Monitoring

### Check Scrape Status
```bash
curl https://tokspotter.vercel.app/api/admin/scrape-status
```

Returns:
```json
{
  "status": "operational",
  "database": {
    "total_products": 150,
    "products_updated_24h": 45,
    "new_products_24h": 12
  },
  "next_scrape": "Daily at 2:00 AM UTC"
}
```

### Manual Trigger (Testing)
```bash
curl -X POST https://tokspotter.vercel.app/api/cron/scrape-daily \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### View Logs
1. Go to Vercel dashboard
2. Navigate to Deployments → Your deployment
3. Click "Functions" tab
4. Find `/api/cron/scrape-daily`
5. View execution logs

---

## 🛡️ Error Handling

The automated scraper handles:

### Scraping Failures
- **Retries** failed products
- **Logs** errors for debugging
- **Continues** even if some products fail
- **Reports** summary at end

### Rate Limiting
- **2-second delay** between products
- **Configurable** in scraper code
- **Prevents** IP bans

### Data Validation
- **Skips** products with missing data
- **Validates** before saving
- **Prevents** duplicate entries

---

## 🔧 Advanced Configuration

### Multi-Region Scraping

```typescript
const REGIONS = [
  { country: 'US', baseUrl: 'https://www.tiktok.com' },
  { country: 'UK', baseUrl: 'https://shop-uk.tiktok.com' },
  { country: 'CA', baseUrl: 'https://shop-ca.tiktok.com' },
];
```

### Dynamic Discovery

Use the URL discovery service:

```typescript
import { UrlDiscovery } from '@/lib/services/url-discovery';

const discovery = new UrlDiscovery();
await discovery.initialize();

// Auto-discover trending products
const trendingUrls = await discovery.discoverTrendingUrls(30);

// Discover by category
const beautyUrls = await discovery.discoverCategoryUrls('beauty', 20);

await discovery.close();
```

### Custom Scrape Logic

Edit `app/api/cron/scrape-daily/route.ts` to:
- Filter by minimum sold count
- Only scrape high-rated products
- Focus on specific price ranges
- Prioritize certain categories

Example:
```typescript
// Only scrape products with 1000+ sold
const product = await scraper.scrapeProduct(url);
if (product && product.sold_count >= 1000) {
  await db.saveProduct(product);
}
```

---

## 💰 Cost Optimization

### Vercel Cron Limits
- **Free tier**: 100 cron executions/day
- **Pro tier**: Unlimited

### Reduce Scraping
If hitting limits:
```json
{
  "schedule": "0 2 * * 0"  // Weekly instead of daily
}
```

### Optimize Targets
Scrape fewer products but more frequently:
```typescript
// Instead of 100 products daily
// Scrape 20 products every 6 hours
const SCRAPE_TARGETS = [...].slice(0, 20);
```

---

## 🚨 Troubleshooting

### Cron Not Running

**Check:**
1. `vercel.json` is in root directory
2. Deployed to production (not preview)
3. Vercel dashboard shows cron job
4. Check function logs for errors

**Fix:**
```bash
git push  # Redeploy to trigger cron setup
```

### No Products Being Scraped

**Check:**
1. `SCRAPE_TARGETS` has URLs
2. URLs are valid TikTok Shop links
3. Selectors are updated (see QUICK_START_REAL_DATA.md)

**Debug:**
```bash
# Test locally first
pnpm run scrape:test
```

### Products Not Updating

**Check:**
1. Cron is running (check logs)
2. Firebase credentials in Vercel env vars
3. API returning data

**Debug:**
```bash
# Check status endpoint
curl https://tokspotter.vercel.app/api/admin/scrape-status
```

---

## 🎓 Best Practices

### 1. Start Small
Begin with 10-20 products, verify it works, then scale up.

### 2. Use Categories
Let the scraper discover products from categories instead of manual URLs.

### 3. Monitor Weekly
Check `/api/admin/scrape-status` weekly to ensure automation is working.

### 4. Update Selectors
When scraping fails, update selectors in `lib/services/tiktok-scraper.ts`.

### 5. Backup Strategy
Keep manual import as backup if automation fails.

---

## 📈 Scaling Up

### From 50 to 500 Products

1. **Use URL Discovery**
   ```typescript
   const urls = await discovery.discoverTrendingUrls(500);
   ```

2. **Multiple Categories**
   ```typescript
   const SCRAPE_TARGETS = [
     'https://www.tiktok.com/shop/category/beauty',
     'https://www.tiktok.com/shop/category/home',
     'https://www.tiktok.com/shop/category/fashion',
     // ... 10 categories × 50 products = 500 products
   ];
   ```

3. **Increase Frequency**
   ```json
   "schedule": "0 */6 * * *"  // Every 6 hours
   ```

### From 500 to 5,000+ Products

Consider:
- **Paid API** (Apify, Bright Data) - More reliable
- **Dedicated Server** - Run scraper 24/7
- **Multiple IPs** - Avoid rate limits
- **Database Optimization** - Firestore indexes

---

## ✅ Success Checklist

- [ ] Added URLs to `SCRAPE_TARGETS`
- [ ] Set `CRON_SECRET` in Vercel
- [ ] Deployed to production
- [ ] Verified cron shows in Vercel dashboard
- [ ] Tested manual trigger
- [ ] Checked `/api/admin/scrape-status`
- [ ] Confirmed products updating daily

**All checked?** Your scraping is fully automated! 🎉

---

## 📚 Related Guides

- **[QUICK_START_REAL_DATA.md](QUICK_START_REAL_DATA.md)** - Initial setup
- **[REAL_DATA_GUIDE.md](REAL_DATA_GUIDE.md)** - All data options
- **[API_USAGE.md](API_USAGE.md)** - API reference

---

**Questions?** Check the logs in Vercel dashboard or run manual test with `pnpm run scrape:test`
