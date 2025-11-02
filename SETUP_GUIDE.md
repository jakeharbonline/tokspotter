# 🚀 TokSpotter Setup Guide

## Step-by-Step Instructions for Getting Started

This guide will walk you through setting up TokSpotter from scratch. Follow each step carefully.

---

## ✅ Prerequisites Checklist

Before you begin, install these tools:

- [ ] **Node.js 18+** - [Download](https://nodejs.org/)
- [ ] **Python 3.10+** - [Download](https://www.python.org/downloads/)
- [ ] **pnpm** - Install with: `npm install -g pnpm`
- [ ] **Git** - [Download](https://git-scm.com/)

---

## 📝 Part 1: Firebase Setup (5 minutes)

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name your project: `tokspotter` (or your preferred name)
4. Disable Google Analytics (optional for MVP)
5. Click "Create Project"

### 1.2 Enable Firestore Database

1. In your Firebase project, go to **Build** → **Firestore Database**
2. Click "Create Database"
3. Choose **"Start in test mode"** (we'll add security rules later)
4. Select your preferred region (choose closest to you)
5. Click "Enable"

### 1.3 Get Firebase Admin Credentials (for Backend)

1. Go to **Project Settings** (gear icon) → **Service Accounts**
2. Click "Generate new private key"
3. Save the JSON file (keep it secure!)
4. Open the JSON file and extract these values:
   - `project_id`
   - `private_key_id`
   - `private_key`
   - `client_email`
   - `client_id`

### 1.4 Get Firebase Web Credentials (for Frontend)

1. Go to **Project Settings** → **General**
2. Scroll to "Your apps" section
3. Click the **Web** icon (`</>`)
4. Register app with nickname: `tokspotter-web`
5. Copy the `firebaseConfig` object values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

---

## 🐍 Part 2: Backend Setup

### 2.1 Create Python Virtual Environment

Open terminal in the project root and run:

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate

# On Mac/Linux:
source venv/bin/activate

# You should see (venv) in your terminal prompt
```

### 2.2 Install Python Dependencies

```bash
# Make sure you're in the backend folder with venv activated
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium
```

This will take a few minutes to download all packages.

### 2.3 Configure Backend Environment

1. Copy the example env file:
   ```bash
   cp .env.example .env
   ```

2. Open `backend/.env` in your editor

3. Fill in the Firebase values from Part 1.3:
   ```env
   ENVIRONMENT=development

   # From Firebase Service Account JSON
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY_ID=your-private-key-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour full private key here\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=your-client-id

   # Generate a random secret (or use a password generator)
   API_SECRET_KEY=your-super-secret-key-min-32-characters

   # CORS origins (add your Vercel domain later)
   CORS_ORIGINS=http://localhost:3000

   # Optional: TikTok Seller API
   TIKTOK_SELLER_API_KEY=
   ```

### 2.4 Test Backend

```bash
# Make sure you're in backend/ with venv activated
uvicorn app.main:app --reload
```

You should see:
```
🚀 TokSpotter API starting up...
📍 Environment: development
🔥 Firebase Project: your-project-id
✅ Startup complete
INFO:     Uvicorn running on http://127.0.0.1:8000
```

Open http://localhost:8000/docs in your browser. You should see the API documentation!

---

## ⚛️ Part 3: Frontend Setup

### 3.1 Install Frontend Dependencies

Open a **NEW terminal** (keep the backend running) and run:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies with pnpm
pnpm install
```

This will take 2-3 minutes.

### 3.2 Configure Frontend Environment

1. Copy the example env file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `frontend/.env.local` in your editor

3. Fill in the Firebase values from Part 1.4:
   ```env
   # Backend API URL
   NEXT_PUBLIC_API_URL=http://localhost:8000

   # From Firebase Web Config
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

   NEXT_PUBLIC_ENVIRONMENT=development
   ```

### 3.3 Run Frontend

```bash
# In the frontend folder
pnpm dev
```

You should see:
```
▲ Next.js 15.1.0
- Local:        http://localhost:3000
✓ Ready in 2.3s
```

Open http://localhost:3000 in your browser!

---

## 🎯 Part 4: Testing Your Setup

### 4.1 Test the Full Stack

You should have TWO terminals running:
1. **Terminal 1**: Backend (port 8000)
2. **Terminal 2**: Frontend (port 3000)

### 4.2 Add Test Data

Since you don't have products yet, let's add some test data:

1. Open http://localhost:8000/docs
2. Try the `/health` endpoint - should return `{"status": "healthy"}`
3. The frontend will show "No products found" initially (this is correct!)

### 4.3 Run the Scraper (Optional)

To actually scrape TikTok Shop products, you'll need to:

1. Find a TikTok Shop product URL (e.g., `https://www.tiktok.com/@shop/product/123456`)
2. Update the scraper with actual TikTok Shop selectors (they change frequently)
3. Run the scraper script (we can create this in the next phase)

---

## 🚢 Part 5: Deploying to Vercel (Production)

### 5.1 Prepare for Deployment

1. Initialize git and commit your code:
   ```bash
   git add .
   git commit -m "Initial commit"
   ```

2. Push to GitHub:
   ```bash
   # Create a new repo on GitHub first, then:
   git remote add origin https://github.com/your-username/tokspotter.git
   git push -u origin main
   ```

### 5.2 Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com/)
2. Sign in with GitHub
3. Click "New Project"
4. Import your `tokspotter` repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `pnpm build`
   - **Install Command**: `pnpm install`

6. Add environment variables (all the `NEXT_PUBLIC_*` variables from `.env.local`)

7. Click "Deploy"

### 5.3 Deploy Backend to Vercel (or Railway/Render)

**Option A: Vercel Serverless Functions**
1. In Vercel, create a new project for backend
2. Root directory: `backend`
3. Add a `vercel.json`:
   ```json
   {
     "builds": [{"src": "app/main.py", "use": "@vercel/python"}],
     "routes": [{"src": "/(.*)", "dest": "app/main.py"}]
   }
   ```

**Option B: Railway (Recommended for always-on backend)**
1. Go to [Railway.app](https://railway.app/)
2. Connect GitHub repo
3. Select `backend` folder
4. Add environment variables
5. Railway will auto-detect Python and deploy

### 5.4 Update Environment Variables

After deployment:
1. Get your Vercel frontend URL (e.g., `tokspotter.vercel.app`)
2. Get your backend URL (e.g., `tokspotter.up.railway.app`)
3. Update environment variables:
   - Frontend: Set `NEXT_PUBLIC_API_URL` to your backend URL
   - Backend: Add your frontend URL to `CORS_ORIGINS`
4. Redeploy both services

---

## 🔧 Troubleshooting

### Backend won't start
- Check Firebase credentials are correct
- Make sure virtual environment is activated
- Verify Python version: `python --version` (should be 3.10+)

### Frontend won't build
- Delete `node_modules` and `.next` folders, then run `pnpm install` again
- Check all `NEXT_PUBLIC_*` environment variables are set

### CORS errors
- Make sure backend `CORS_ORIGINS` includes your frontend URL
- Check both services are running

### Firebase connection issues
- Verify project ID matches in both backend and frontend
- Check Firebase rules allow read/write (test mode)
- Ensure private key is properly formatted with `\n` characters

---

## 📚 Next Steps

Now that your app is running:

1. **Configure the scraper** with actual TikTok Shop selectors
2. **Set up scheduled scraping** (using GitHub Actions or Railway cron)
3. **Implement authentication** (Firebase Auth)
4. **Add Stripe** for subscriptions
5. **Improve the TrendScore algorithm** with real data

---

## 🆘 Need Help?

If you get stuck:
1. Check the error messages carefully
2. Verify all environment variables are set
3. Make sure all prerequisites are installed
4. Check that both backend and frontend are running

Good luck! 🚀
