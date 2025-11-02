# TokSpotter API Usage Guide

## Base URL
- **Local**: `http://localhost:3000`
- **Production**: `https://tokspotter.vercel.app`

---

## Health Check

### `GET /api/health`

Check if the API and Firebase connection are working.

**Example:**
```bash
curl https://tokspotter.vercel.app/api/health
```

**Response:**
```json
{
  "status": "healthy",
  "firebase": "connected",
  "environment": "production",
  "timestamp": "2025-11-02T17:48:19.870Z"
}
```

---

## Products API

### `GET /api/products/trending`

Get trending products with optional filters.

**Query Parameters:**
- `limit` (number, default: 50) - Number of products to return
- `category` (string) - Filter by category name
- `trend_category` (string) - Filter by trend type: `breakout`, `sustained`, or `discount_driven`
- `min_score` (number) - Minimum TrendScore (0-100)

**Examples:**
```bash
# Get top 10 trending products
curl "https://tokspotter.vercel.app/api/products/trending?limit=10"

# Get breakout products in Beauty category
curl "https://tokspotter.vercel.app/api/products/trending?trend_category=breakout&category=Beauty%20%26%20Personal%20Care"

# Get high-scoring products (TrendScore > 90)
curl "https://tokspotter.vercel.app/api/products/trending?min_score=90"
```

**Response:**
```json
[
  {
    "id": "demo-product-001",
    "title": "Viral LED Light Strips - 16.4ft RGB Color Changing Lights",
    "current_price": 19.99,
    "trend_score": 92.5,
    "viability_grade": "A",
    ...
  }
]
```

### `GET /api/products/[id]`

Get detailed information for a specific product.

**Example:**
```bash
curl "https://tokspotter.vercel.app/api/products/demo-product-001"
```

**Response:**
```json
{
  "id": "demo-product-001",
  "title": "...",
  "snapshots": [...],
  "price_history": [...],
  "sales_history": [...]
}
```

### `GET /api/products/search`

Search products by query.

**Query Parameters:**
- `q` (string, required) - Search query

**Example:**
```bash
curl "https://tokspotter.vercel.app/api/products/search?q=LED+lights"
```

### `GET /api/products/categories`

Get list of all product categories.

**Example:**
```bash
curl "https://tokspotter.vercel.app/api/products/categories"
```

---

## Scraper API

### `POST /api/scrape/seed`

**Seed the database with demo products for testing.**

This endpoint creates 5 sample trending products with realistic data.

**Example:**
```bash
curl -X POST https://tokspotter.vercel.app/api/scrape/seed
```

**Response:**
```json
{
  "message": "Successfully seeded database with demo products",
  "count": 5,
  "products": [
    {
      "id": "demo-product-001",
      "title": "Viral LED Light Strips...",
      "trend_score": 92.5,
      "viability_grade": "A"
    },
    ...
  ]
}
```

**Use this to populate your database before browsing the dashboard!**

### `POST /api/scrape/run`

**Scrape live TikTok Shop products.**

Requires valid TikTok Shop URLs.

**Request Body (Option 1 - Product URLs):**
```json
{
  "productUrls": [
    "https://www.tiktok.com/@shop/product/1234567890",
    "https://www.tiktok.com/@shop/product/0987654321"
  ]
}
```

**Request Body (Option 2 - Category URL):**
```json
{
  "categoryUrl": "https://www.tiktok.com/shop/category/fashion"
}
```

**Example:**
```bash
curl -X POST https://tokspotter.vercel.app/api/scrape/run \
  -H "Content-Type: application/json" \
  -d '{"categoryUrl": "https://www.tiktok.com/shop/category/fashion"}'
```

**Response:**
```json
{
  "message": "Scraping completed",
  "results": {
    "success": 15,
    "failed": 2,
    "products": [
      {
        "id": "1234567890",
        "title": "Fashion Item...",
        "trend_score": 85.3
      },
      ...
    ]
  }
}
```

**Note:** The `/api/scrape/run` endpoint uses Playwright to scrape actual TikTok Shop pages. This may not work on Vercel serverless functions due to browser limitations. For production scraping, consider running this locally or on a dedicated server.

---

## Quick Start

### 1. Seed the Database
```bash
curl -X POST https://tokspotter.vercel.app/api/scrape/seed
```

### 2. View Trending Products
Open https://tokspotter.vercel.app in your browser

Or via API:
```bash
curl "https://tokspotter.vercel.app/api/products/trending?limit=5"
```

---

## TrendScore Metrics

Products are scored 0-100 based on:
- **45%** - Orders growth (3-day delta)
- **20%** - Acceleration (sales velocity change)
- **15%** - Price discount rate
- **10%** - Review growth (3-day delta)
- **10%** - Stock stability

## Viability Grades

- **A+, A, A-** - Exceptional opportunities, ready to capitalize
- **B+, B, B-** - Solid performers, good potential
- **C+, C, C-** - Moderate opportunity, requires research
- **D** - Risky, proceed with caution
- **E** - Not recommended

## Trend Categories

- **Breakout** - New spikes in demand, explosive growth
- **Sustained** - Consistent performers with steady sales
- **Discount-Driven** - Sales driven by price reductions

---

## Error Responses

All endpoints return standard error responses:

```json
{
  "error": "Error message here",
  "details": "Additional context if available"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad request (missing/invalid parameters)
- `404` - Resource not found
- `500` - Server error

---

## Rate Limiting

Currently no rate limiting is enforced. Use responsibly!

---

## Support

For issues or questions, check the project README or open an issue on GitHub.
