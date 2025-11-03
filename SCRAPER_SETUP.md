# TikTok Shop Scraper Setup

## Overview

TokSpotter now uses **ScraperAPI** to scrape real TikTok Shop product data.

- **FREE**: 1,000 requests/month (no credit card required)
- **Cost**: $49/month for 250,000 requests if you need more
- **Signup**: https://www.scraperapi.com

---

## Setup Steps

### 1. Sign Up for ScraperAPI

1. Go to https://www.scraperapi.com
2. Click "Start Free Trial"
3. Create account (no credit card needed)
4. Get your API key from the dashboard

### 2. Add API Key to Vercel

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add new variable:
   - **Name**: `SCRAPERAPI_KEY`
   - **Value**: `your_api_key_here`
4. Save and redeploy

### 3. Test the Scraper

Test with a single product URL:

```bash
curl -X POST https://your-app.vercel.app/api/scrape/test \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.tiktok.com/view/product/1234567890"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Successfully scraped product",
  "product": {
    "id": "1234567890",
    "title": "Product Name",
    "current_price": 19.99,
    ...
  }
}
```

---

## Finding Product URLs

### Method 1: Browse TikTok Shop
1. Go to https://www.tiktok.com/shop/us
2. Browse categories
3. Click on products
4. Copy URLs like: `https://www.tiktok.com/view/product/1234567890`

### Method 2: Search TikTok Shop
1. Search for products on TikTok Shop
2. Collect 50 product URLs per category
3. Add them to `app/api/scrape/populate/route.ts`

---

## Populating the Database

### Step 1: Add Product URLs

Edit `app/api/scrape/populate/route.ts`:

```typescript
const PRODUCT_URLS: Record<string, string[]> = {
  'Beauty & Personal Care': [
    'https://www.tiktok.com/view/product/1234567890',
    'https://www.tiktok.com/view/product/0987654321',
    // ... 48 more URLs
  ],
  'Fashion & Accessories': [
    // ... 50 URLs
  ],
  // ... other categories
};
```

### Step 2: Run Population

```bash
curl -X POST https://your-app.vercel.app/api/scrape/populate \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

This will:
- Scrape all configured product URLs
- Save products to Firestore
- Create initial snapshots
- Calculate trend scores

---

## Usage Limits

### Free Tier (1,000 requests/month)

- **Initial population**: 500 products = 500 requests
- **Monthly refresh**: 500 products = 500 requests
- **Perfect for getting started!**

### Paid Tier ($49/month = 250,000 requests)

- **Daily scraping**: 500 products × 30 days = 15,000 requests/month
- **Cost**: Still only $49/month
- **Enough for**: 2+ years of daily scraping

---

## Automation (Optional)

### Daily Scraping with Vercel Cron

Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/scrape/populate",
      "schedule": "0 2 * * *"
    }
  ]
}
```

This scrapes products daily at 2 AM UTC.

---

## Troubleshooting

### Error: "SCRAPERAPI_KEY not set"
- Add `SCRAPERAPI_KEY` to Vercel environment variables
- Redeploy your app

### Error: "Failed to scrape product"
- Check if URL is valid TikTok Shop product URL
- Verify ScraperAPI key is correct
- Check ScraperAPI dashboard for usage/errors

### Error: "Rate limit exceeded"
- You've used your 1,000 free requests
- Wait until next month or upgrade to paid plan

---

## Cost Breakdown

### Scenario 1: Initial Launch
- **Goal**: Populate 500 products
- **Requests**: 500
- **Cost**: FREE (within 1,000 free tier)

### Scenario 2: Monthly Updates
- **Goal**: Refresh 500 products monthly
- **Requests**: 500/month
- **Cost**: FREE (within 1,000 free tier)

### Scenario 3: Daily Updates
- **Goal**: Refresh 500 products daily
- **Requests**: 15,000/month
- **Cost**: $49/month

---

## Next Steps

1. ✅ Sign up for ScraperAPI
2. ✅ Add SCRAPERAPI_KEY to Vercel
3. ✅ Test with `/api/scrape/test`
4. ✅ Collect 500 TikTok Shop product URLs
5. ✅ Add URLs to populate endpoint
6. ✅ Run initial population
7. ✅ Set up daily cron (optional)

---

## Support

- **ScraperAPI Docs**: https://www.scraperapi.com/documentation
- **ScraperAPI Support**: support@scraperapi.com
- **Free Tier**: 1,000 requests/month
- **Paid Plans**: From $49/month
