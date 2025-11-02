# 🎯 Quick Start - TypeScript Only!

## Immediate Next Steps (Start Here!)

### 1. Install Required Software

Download and install these (if you haven't already):

- **Node.js 18+**: https://nodejs.org/
- **pnpm**: Open terminal and run `npm install -g pnpm`

**That's it! No Python needed!** 🎉

### 2. Set Up Firebase (10 minutes)

1. Create account at https://console.firebase.google.com/
2. Create new project called "tokspotter"
3. Enable Firestore Database (test mode is fine for now)
4. Get your credentials:
   - **Service Account**: Project Settings → Service Accounts → Generate Private Key (save the JSON file)
   - **Web Config**: Project Settings → Your Apps → Add Web App

### 3. Install Dependencies

```bash
# Navigate to frontend folder
cd frontend

# Install all dependencies with pnpm
pnpm install

# This will install everything including Playwright
```

### 4. Configure Environment

```bash
# Copy the example environment file
cp .env.local.example .env.local

# Now edit .env.local with your Firebase credentials
```

**In `.env.local`, you need to set:**

```env
# API URL (leave as localhost:3000)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Firebase Client Config (from Web App you created)
NEXT_PUBLIC_FIREBASE_API_KEY=your-web-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-web-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Admin Config (from Service Account JSON)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour full private key from JSON\n-----END PRIVATE KEY-----\n"
```

### 5. Run Everything

```bash
# From the frontend folder
pnpm dev
```

**That's it!** Open http://localhost:3000

---

## 📖 Full Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup with troubleshooting
- **[README.md](./README.md)** - Project overview

---

## 🏗️ Project Structure (TypeScript Only!)

```
tokspotter/
├── frontend/                    # Everything is here!
│   ├── app/
│   │   ├── page.tsx            # Dashboard
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Styles
│   │   └── api/                # Backend API routes
│   │       ├── health/
│   │       └── products/
│   │           ├── trending/
│   │           ├── search/
│   │           ├── categories/
│   │           └── [id]/
│   ├── components/
│   │   ├── ProductCard.tsx
│   │   └── FilterBar.tsx
│   ├── lib/
│   │   ├── api-client.ts       # Frontend API client
│   │   ├── firebase.ts         # Firebase client
│   │   ├── server/
│   │   │   └── firebase-admin.ts  # Firebase Admin (server)
│   │   └── services/
│   │       ├── firestore-service.ts
│   │       ├── trend-calculator.ts
│   │       └── tiktok-scraper.ts
│   ├── types/
│   │   └── product.ts
│   ├── package.json
│   └── .env.local              # Your config
│
├── GETTING_STARTED.md          # This file!
├── SETUP_GUIDE.md
└── README.md
```

---

## 🎨 What's Been Built

### All TypeScript/Next.js!
- ✅ Next.js 15 with App Router
- ✅ API Routes (serverless functions)
- ✅ Firebase Admin SDK (backend)
- ✅ Firebase Client SDK (frontend)
- ✅ TrendScore calculation engine
- ✅ TikTok scraper with Playwright
- ✅ Firestore database service
- ✅ Beautiful UI with Tailwind CSS

---

## 🚀 Running the App

### Development

```bash
cd frontend
pnpm dev
```

- App: http://localhost:3000
- API: http://localhost:3000/api/health

### Production Build

```bash
cd frontend
pnpm build
pnpm start
```

---

## 🔄 Development Workflow

1. **Single terminal** - just run `pnpm dev`
2. Make changes - auto-reload
3. Test API at http://localhost:3000/api/health
4. View dashboard at http://localhost:3000

```bash
# Commit changes
git add .
git commit -m "Your message"
git push
```

---

## 🐛 Common Issues

### "Module not found"
- Run `pnpm install` in the frontend folder

### "Firebase authentication error"
- Check `.env.local` has all Firebase credentials
- Make sure private key includes `\n` characters
- Verify project ID matches in both client and admin configs

### Port already in use
- Kill the process on port 3000 or use: `pnpm dev -p 3001`

---

## ✅ Success Checklist

- [ ] Node.js 18+ installed
- [ ] pnpm installed globally
- [ ] Firebase project created
- [ ] Firestore Database enabled
- [ ] `.env.local` file created with all credentials
- [ ] `pnpm install` completed
- [ ] `pnpm dev` running without errors
- [ ] http://localhost:3000 loads

If all checked, you're ready! 🎉

---

## 🚀 Deploy to Vercel

When you're ready to deploy:

1. Push code to GitHub
2. Go to https://vercel.com/
3. Import your repository
4. Set Root Directory to `frontend`
5. Add all environment variables from `.env.local`
6. Click Deploy!

Vercel will:
- Build your Next.js app
- Deploy frontend + API routes together
- Give you a URL like `tokspotter.vercel.app`

---

## 📚 Next Steps

1. **Get it running locally** (follow steps above)
2. **Test the API** at `/api/health`
3. **Add test data** to Firestore manually
4. **Configure scraper** with real TikTok Shop selectors
5. **Deploy to Vercel**

**Ready for details?** Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for comprehensive instructions!
