# EcoSense — AI Carbon Footprint Analyzer & Sustainability Coach

> **Goal:** A polished, production-quality AI-powered sustainability platform with clean architecture, excellent UI/UX, robust backend, and AI-powered insights.

---

## 🌿 Project Overview

**EcoSense** enables users to log daily lifestyle activities (transit, electricity, diet, shopping), calculate carbon footprint using standardized emission factors, visualize trends through interactive charts, and receive personalized AI-powered sustainability recommendations via **Groq AI (Llama 3.3 70B)**.

---

## 🏗️ Architecture & Technology Stack

### Frontend
- **Framework:** React 19 + Vite + TypeScript
- **Styling:** Tailwind CSS + Glassmorphism design system
- **Icons & Motion:** Lucide React + Framer Motion
- **Visualizations:** Recharts (Pie, Area, Bar, EcoScore Ring)
- **Forms:** React Hook Form + Zod
- **API Client:** Axios

### Backend
- **Runtime:** Node.js + Express.js + TypeScript
- **Database & ORM:** SQLite + Prisma ORM
- **Validation & Security:** Zod + Helmet + CORS
- **AI Integration:** Groq AI (`llama-3.3-70b-versatile`) with intelligent rule-based fallback

---

## 📂 Folder Structure

```
EcoSense/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # Buttons, Badges, Modals, Cards, Skeletons, Toasts
│   │   │   ├── charts/       # CategoryPieChart, WeeklyTrendChart, ComparisonBarChart, EcoScoreRing
│   │   │   ├── forms/        # ActivityLoggerForm with live calculation preview
│   │   │   ├── layout/       # Navbar, Footer
│   │   │   ├── ai/           # AIReportCard
│   │   │   └── achievements/ # EcoBadges & Goals Tracker
│   │   ├── pages/            # Dashboard, History, Goals
│   │   ├── services/         # Axios API client
│   │   ├── types/            # TypeScript models
│   │   ├── utils/            # Emission preview & export utilities
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── controllers/      # entryController, reportController, summaryController
│   │   ├── routes/           # entryRoutes, reportRoutes, summaryRoutes, healthSyncRoutes
│   │   ├── services/         # groqService, healthSyncService
│   │   ├── middleware/       # errorHandler
│   │   ├── utils/            # calculationEngine, validationSchemas
│   │   ├── tests/            # Unit test suite
│   │   ├── database/         # db.ts singleton & seed.ts script
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma     # SQLite Prisma model
│   └── package.json
├── vercel.json
├── docker-compose.yml
├── .env.example
├── package.json
└── README.md
```

---

## ✨ Features

1. **Daily Activity Logger** — Log transport (car, bus, train, flight, bike, walk), electricity kWh, diet pattern, and shopping. Live carbon estimate preview as you type!
2. **Standard Emission Calculation Engine** — Standardized emission factors (Car 0.21 kg/km, Bus 0.10 kg/km, Grid 0.45 kg/kWh, Meat Heavy 7.2 kg/day, etc.)
3. **Dynamic EcoScore Gauge** — 0–100 animated score ring with letter grades (A+, A, B, C, D, F)
4. **Groq AI Sustainability Coach** — Actionable AI-generated recommendations using Llama 3.3 70B with intelligent fallback engine
5. **Interactive Charts** — Category Breakdown (Pie), Weekly Emission Trend (Area), National Benchmark Comparison (Bar)
6. **Activity Log History** — Search, filter by transport mode, pagination, CSV export
7. **GPS + Health Sync** — Real-time location tracking + Apple HealthKit / Google Health Connect integration
8. **Badges & Reduction Goals** — Unlock sustainability milestones and track Net-Zero progress

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- npm

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/dakshpawar17/EcoSense.git
cd EcoSense
npm run install:all
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
```
Then edit `.env` and add your **Groq API Key** (free at [console.groq.com](https://console.groq.com)):
```env
DATABASE_URL="file:./ecosense.db"
GROQ_API_KEY="your_groq_api_key_here"
PORT=5001
NODE_ENV="development"
```

### 3. Setup Database & Seed Sample Data
```bash
cd backend
npm run prisma:push
npm run seed
cd ..
```

### 4. Start Both Frontend + Backend
```bash
npm run dev
```

| Service | URL |
|---|---|
| 🌐 Frontend | http://localhost:3000 |
| 🔗 Backend API | http://localhost:5001 |

---

## ⚙️ Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | SQLite path (e.g. `file:./ecosense.db`) | ✅ Yes |
| `GROQ_API_KEY` | Groq API key for AI reports | ⚠️ Optional* |
| `PORT` | Backend server port (default: `5001`) | ✅ Yes |
| `NODE_ENV` | `development` or `production` | ✅ Yes |

> *If `GROQ_API_KEY` is omitted or invalid, EcoSense automatically uses its built-in rule-based AI fallback engine — 100% demo-ready without a key.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Server health check |
| `POST` | `/api/entries` | Log new carbon activity |
| `GET` | `/api/entries` | Paginated activity history (`search`, `transportMode`, `page`, `limit`) |
| `GET` | `/api/entries/:id` | Single activity detail |
| `DELETE` | `/api/entries/:id` | Delete activity log |
| `GET` | `/api/summary` | Dashboard metrics & weekly trend |
| `POST` | `/api/report` | Generate AI sustainability report |
| `GET/PUT` | `/api/profile` | User profile management |
| `POST` | `/api/sync` | GPS/Health data sync |
| `GET` | `/api/admin` | Admin statistics panel |

---

## 🚀 Deployment

### Frontend → Vercel
1. Connect `dakshpawar17/EcoSense` on [vercel.com](https://vercel.com)
2. Set **Root Directory** → `frontend`
3. Set **Framework** → `Vite`
4. Add env var: `VITE_API_URL=https://your-backend.railway.app/api`

### Backend → Railway
1. Connect repo on [railway.app](https://railway.app)
2. Set **Root Directory** → `backend`
3. Add env vars: `GROQ_API_KEY`, `DATABASE_URL`, `PORT=5001`, `NODE_ENV=production`
4. Set **Start Command**: `npm run prisma:push && npm start`

---

## 🧪 Testing

```bash
npm run test
```

---

## 🐳 Docker

```bash
docker-compose up --build -d
```

---

## 📱 Mobile Health Integrations

- **Apple HealthKit** — Steps, calories, active minutes on iOS
- **Google Health Connect** — Android equivalent health data
- **GPS Tracker** — Real-time transport mode detection & distance logging

---

## 📄 License

MIT License © EcoSense Team
