# Cron Secret Setup - Quick Guide

## Your Generated CRON_SECRET

```
bebcbb874d9a6cbda0bb786e5611d6461ed08c0242ec22b5197453f386c142c1
```

## Setup Steps (2 minutes)

### 1. Add to Vercel
1. Go to https://vercel.com/jakeharbonline/tokspotter/settings/environment-variables
2. Click "Add New"
3. Name: `CRON_SECRET`
4. Value: `bebcbb874d9a6cbda0bb786e5611d6461ed08c0242ec22b5197453f386c142c1`
5. Environment: Select "Production"
6. Click "Save"

### 2. Redeploy (Optional)
The cron will pick up the secret automatically on next deployment or run.

To redeploy now:
- Go to Deployments tab
- Click "..." on latest deployment
- Click "Redeploy"

## Test Manual Trigger

```bash
curl -X POST https://tokspotter.vercel.app/api/cron/scrape-daily \
  -H "Authorization: Bearer bebcbb874d9a6cbda0bb786e5611d6461ed08c0242ec22b5197453f386c142c1"
```

## Current Configuration

- **51 categories** across all TikTok Shop niches
- **100 products per category** = ~5,100 products daily
- **Schedule**: Daily at 2:00 AM UTC
- **Estimated runtime**: ~2.8 hours per scrape
- **Rate limiting**: 2 seconds between products

## Monitor Status

Check scraper health anytime:
```bash
curl https://tokspotter.vercel.app/api/admin/scrape-status
```

Shows:
- Total products in database
- Products updated in last 24 hours
- New products added
- Category and country breakdown
- Recent products list

## Expected Results

After first scrape completes (~2.8 hours):
- **~5,100 new products** across all categories
- Real TikTok Shop data with:
  - Current prices
  - Sales counts
  - Ratings and reviews
  - TrendScores calculated
  - Viability grades assigned

## Troubleshooting

### Scraper not running?
1. Check Vercel dashboard → Functions → Look for cron logs
2. Verify `CRON_SECRET` is set in environment variables
3. Check `vercel.json` exists in root (it does)

### No products appearing?
1. Scraper selectors may need updating (see QUICK_START_REAL_DATA.md)
2. TikTok may have changed their HTML structure
3. Run manual test: `pnpm run scrape:test` with a real URL

### Rate limited?
If you see 429 errors or blocks:
- Scraper already has 2s delays
- May need to reduce products per category
- Or spread scraping across multiple times per day

---

**You're all set!** Just add the CRON_SECRET to Vercel and the scraper will automatically populate TokSpotter with 5,100+ products daily.
