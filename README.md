# 🚀 TokSpotter — The Radar for TikTok Shop Trends

> Know what's trending on TikTok Shop — before it hits the mainstream.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **pnpm** (v8 or higher) - [Install guide](https://pnpm.io/installation)
- **Python** (v3.10 or higher) - [Download here](https://www.python.org/downloads/)
- **PostgreSQL** (v14 or higher) - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)

### Installing pnpm

```bash
# Using npm
npm install -g pnpm

# Or using PowerShell (Windows)
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

## 🛠️ Setup Instructions

### 1. Clone and Initial Setup

```bash
# Navigate to the project directory
cd tokspotter

# Verify pnpm is installed
pnpm --version
```

### 2. Backend Setup (Python/FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup (Next.js)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies with pnpm
pnpm install

# Run development server
pnpm dev
```

### 4. Database Setup

```bash
# Create PostgreSQL database
createdb tokspotter

# Run migrations (from backend directory)
cd backend
python -m alembic upgrade head
```

### 5. Environment Variables

Create `.env` files in both backend and frontend directories:

**backend/.env:**
```env
DATABASE_URL=postgresql://username:password@localhost:5432/tokspotter
SECRET_KEY=your-secret-key-here
ENVIRONMENT=development
```

**frontend/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📁 Project Structure

```
tokspotter/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── core/        # Core config
│   │   ├── db/          # Database models
│   │   ├── scraper/     # TikTok scraper
│   │   ├── services/    # Business logic
│   │   └── main.py      # App entry point
│   ├── tests/
│   ├── requirements.txt
│   └── .env
├── frontend/            # Next.js frontend
│   ├── src/
│   │   ├── app/        # App router pages
│   │   ├── components/ # React components
│   │   ├── lib/        # Utilities
│   │   └── types/      # TypeScript types
│   ├── public/
│   ├── package.json
│   └── .env.local
└── README.md
```

## 🎯 Features

- **Discovery Dashboard** - Live feed of trending TikTok Shop products
- **Product Analytics** - Deep dive into product metrics and trends
- **Shop Analytics** - Seller performance insights
- **Alerts & Watchlists** - Get notified of trend spikes
- **Commission Insights** - Affiliate opportunity tracking

## 📚 Documentation

- [API Documentation](http://localhost:8000/docs) - Interactive API docs
- [Architecture Guide](./docs/ARCHITECTURE.md) - System design
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment

## 🤝 Contributing

This is a personal project. For questions or suggestions, please open an issue.

## 📄 License

MIT License - See LICENSE file for details
