# 🎯 Quick Start - What You Need To Do

## Immediate Next Steps (Start Here!)

### 1. Install Required Software

Download and install these (if you haven't already):

- **Node.js 18+**: https://nodejs.org/
- **Python 3.10+**: https://www.python.org/downloads/
- **pnpm**: Open terminal and run `npm install -g pnpm`

### 2. Set Up Firebase (10 minutes)

1. Create account at https://console.firebase.google.com/
2. Create new project called "tokspotter"
3. Enable Firestore Database (test mode is fine for now)
4. Get your credentials:
   - **For backend**: Project Settings → Service Accounts → Generate Private Key
   - **For frontend**: Project Settings → Your Apps → Add Web App

### 3. Configure Backend

```bash
# Open terminal in the project folder
cd backend

# Create Python virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit backend/.env with your Firebase credentials
# (Use the service account JSON from step 2)
```

### 4. Configure Frontend

```bash
# Open NEW terminal (keep backend terminal open)
cd frontend

# Install dependencies
pnpm install

# Copy environment file
cp .env.local.example .env.local

# Edit frontend/.env.local with your Firebase web credentials
```

### 5. Run Everything

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm dev
```

Then open:
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs

---

## 📖 Full Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed step-by-step setup instructions
- **[README.md](./README.md)** - Project overview and architecture

---

## 🏗️ Project Structure

```
tokspotter/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Config, Firebase
│   │   ├── db/             # Firestore service
│   │   ├── models/         # Data models
│   │   ├── scraper/        # TikTok scraper
│   │   ├── services/       # TrendScore calculator
│   │   └── main.py         # App entry point
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Your config (create this!)
│
├── frontend/               # Next.js frontend
│   ├── app/               # Pages (Next.js 14 App Router)
│   ├── components/        # React components
│   ├── lib/               # API client
│   ├── types/             # TypeScript types
│   ├── package.json       # Node dependencies
│   └── .env.local        # Your config (create this!)
│
├── SETUP_GUIDE.md         # Detailed setup instructions
├── README.md              # Project overview
└── GETTING_STARTED.md     # This file!
```

---

## 🎨 What's Been Built

### Backend (Python/FastAPI)
- ✅ FastAPI application with CORS
- ✅ Firebase Admin SDK integration
- ✅ Product and Shop data models
- ✅ TrendScore calculation engine
- ✅ Playwright-based TikTok scraper
- ✅ REST API endpoints for products
- ✅ Firestore database service

### Frontend (Next.js/React)
- ✅ Next.js 15 with App Router
- ✅ TypeScript throughout
- ✅ Tailwind CSS styling
- ✅ Product listing dashboard
- ✅ Filter and category system
- ✅ Product cards with trend data
- ✅ API client for backend communication

---

## 🔄 Development Workflow

### Daily Development

1. Start backend: `cd backend && uvicorn app.main:app --reload`
2. Start frontend: `cd frontend && pnpm dev`
3. Make changes - both will auto-reload

### Before Committing

```bash
# From project root
git add .
git commit -m "Your message"
git push
```

---

## 🚀 Next Phase: Adding Features

After you have the basic app running, here's what to build next:

1. **Product Scraping Script**
   - Create scheduled job to scrape TikTok Shop
   - Update TrendScores daily
   - Store snapshots in Firestore

2. **Product Detail Page**
   - Show full analytics
   - Price/sales history charts
   - Viability score breakdown

3. **Authentication**
   - Firebase Auth integration
   - User accounts
   - Watchlists per user

4. **Subscription System**
   - Stripe integration
   - Free/Starter/Pro tiers
   - Feature gates

5. **Alerts System**
   - Email notifications
   - Trend spike alerts
   - Custom thresholds

---

## 💡 Tips for Success

1. **Start Simple**: Get the basic app running first before adding features
2. **Test Frequently**: Use the API docs at `/docs` to test endpoints
3. **Firebase First**: Make sure Firebase connection works before debugging other issues
4. **Use Real Data**: Once scraper works, everything will look much better
5. **Iterate**: Don't try to build everything at once

---

## 🐛 Common Issues

### "Module not found"
- Backend: Make sure virtual environment is activated
- Frontend: Run `pnpm install` again

### "Firebase authentication error"
- Double-check credentials in `.env` files
- Make sure private key includes `\n` characters

### "CORS error"
- Verify `CORS_ORIGINS` in backend includes `http://localhost:3000`
- Make sure both servers are running

### "Connection refused"
- Check backend is running on port 8000
- Check frontend is running on port 3000

---

## 📞 Getting Help

1. Check error messages in terminal
2. Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed troubleshooting
3. Verify all environment variables are set correctly
4. Make sure Firebase project is created and configured

---

## ✅ Success Checklist

- [ ] Firebase project created
- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] API docs accessible at http://localhost:8000/docs
- [ ] No errors in either terminal
- [ ] Dashboard loads (even if empty)

If all checkboxes are checked, you're ready to start development! 🎉

---

**Ready to dive deeper?** Read the full [SETUP_GUIDE.md](./SETUP_GUIDE.md) for deployment instructions and advanced configuration.
