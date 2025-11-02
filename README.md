# 🚀 TokSpotter — The Radar for TikTok Shop Trends

> Know what's trending on TikTok Shop — before it hits the mainstream.

**Built with TypeScript + Next.js + Firebase**

## 📋 Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **pnpm** (v8 or higher) - Install with: `npm install -g pnpm`
- **Firebase Account** - [Create free account](https://console.firebase.google.com/)

**That's it! No Python or database setup required!**

## ⚡ Quick Start

```bash
# Install dependencies
cd frontend
pnpm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Firebase credentials

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

**→ For detailed setup instructions, see [GETTING_STARTED.md](./GETTING_STARTED.md)**

---

## 🎯 What is TokSpotter?

TokSpotter is a **trend intelligence platform** that helps sellers, creators, and marketers discover winning products on TikTok Shop before they go mainstream.

### Key Features

- **🧨 Breakout Detection** - Identify products with explosive growth
- **🔥 Sustained Winners** - Track consistently performing products
- **💸 Discount Insights** - Find price-driven trending items
- **📊 TrendScore Algorithm** - Proprietary scoring system with 5 weighted metrics
- **🎯 Product Viability Grades** - A-E ratings with plain-English summaries
- **📈 Historical Analytics** - Price and sales trends over time
- **🔍 Smart Search & Filters** - Find products by category and criteria

---

## 🏗️ Architecture

### Full TypeScript Stack

```
tokspotter/
└── frontend/                    # Next.js app (everything in one place!)
    ├── app/
    │   ├── page.tsx            # Dashboard UI
    │   └── api/                # Backend API routes
    │       ├── health/
    │       └── products/       # Product endpoints
    ├── lib/
    │   ├── services/           # Business logic
    │   │   ├── trend-calculator.ts
    │   │   ├── tiktok-scraper.ts
    │   │   └── firestore-service.ts
    │   └── server/
    │       └── firebase-admin.ts
    ├── components/             # React components
    └── types/                  # TypeScript types
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes (serverless functions) |
| **Database** | Firebase Firestore (NoSQL) |
| **Auth** | Firebase Authentication (ready to use) |
| **Scraping** | Playwright + Cheerio |
| **Deployment** | Vercel (one-click deploy) |
| **Charts** | Recharts |

---

## 📊 TrendScore Algorithm

Our proprietary algorithm uses **z-score normalization** across 5 key metrics:

```
TrendScore =
  z(orders_3d_delta) × 45% +
  z(acceleration) × 20% +
  z(price_discount_rate) × 15% +
  z(reviews_3d_delta) × 10% +
  z(stock_stability) × 10%
```

### Product Viability Score (PVS)

Weighted mix of:
- **35%** Demand momentum (TrendScore percentile)
- **20%** Sustained interest (28d orders trend)
- **15%** Price stability (margin potential)
- **15%** Saturation (duplicate listings)
- **10%** Sentiment (rating & review growth)
- **5%** Seasonality (future enhancement)

**Output:** A–E grade + plain-English summary

---

## 🎨 Features in Detail

### Discovery Dashboard
- Live feed of trending TikTok Shop products
- Filter by category, price range, viability grade
- Three trend tabs:
  - 🧨 **Breakouts** - New spikes
  - 🔥 **Sustained Winners** - Steady growth
  - 💸 **Discount-Driven** - Price drop trends

### Product Analytics (Coming Soon)
- Detailed metrics and trend data
- Price history charts
- Sales velocity graphs
- Viability score breakdown
- Affiliate commission insights

### Alerts & Watchlists (Planned)
- Get notified when products spike
- Save lists for daily/weekly digests
- Custom threshold alerts

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com/)
3. Set root directory: `frontend`
4. Add environment variables from `.env.local`
5. Deploy!

Vercel handles everything:
- Next.js build
- Serverless API routes
- Edge functions
- Automatic HTTPS

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
# + all Firebase credentials
```

---

## 💰 Monetization Model (Planned)

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | Limited access, 3 products/day |
| **Starter** | $29/mo | Unlimited browsing, 3 alerts |
| **Pro** | $79/mo | Full access, unlimited alerts, exports |
| **Agency** | $199/mo | Team seats, API access, analytics |

---

## 🔄 Development Workflow

```bash
# Start development server
cd frontend
pnpm dev

# Build for production
pnpm build

# Run production build locally
pnpm start

# Lint code
pnpm lint
```

---

## 📚 Documentation

- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Quick setup guide
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed instructions
- **API Docs** - http://localhost:3000/api/health

---

## 🛠️ API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/products/trending` | GET | Get trending products |
| `/api/products/[id]` | GET | Get product details |
| `/api/products/search` | GET | Search products |
| `/api/products/categories` | GET | List categories |

---

## 🎯 Roadmap

### Phase 1 - MVP ✅
- [x] Product & Shop data models
- [x] TrendScore calculation engine
- [x] Web scraper (Playwright)
- [x] Basic dashboard
- [x] Firebase integration

### Phase 2 - Features (Next)
- [ ] Product detail pages with charts
- [ ] User authentication
- [ ] Watchlists and alerts
- [ ] Email notifications
- [ ] Scheduled scraping (cron jobs)

### Phase 3 - Monetization
- [ ] Stripe integration
- [ ] Subscription tiers
- [ ] User dashboards
- [ ] Team features
- [ ] API access

---

## 🤝 Contributing

This is currently a personal project. For suggestions or bug reports, please open an issue.

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🆘 Need Help?

1. Check [GETTING_STARTED.md](./GETTING_STARTED.md) for setup
2. Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for troubleshooting
3. Verify Firebase credentials in `.env.local`
4. Test API health: http://localhost:3000/api/health

---

**Built with ❤️ for TikTok sellers and creators**
