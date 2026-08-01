# SkillSync AI 🚀

> **Your AI-Powered Career Command Center** — Practice mock interviews, analyze resumes, track job applications, and showcase your work with a sharable public portfolio. Built for developers who are serious about landing their next role.

[![CI/CD](https://github.com/your-username/skillsync-ai/actions/workflows/main.yml/badge.svg)](https://github.com/your-username/skillsync-ai/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🔐 **Authentication** | JWT-based registration, login, and protected routes |
| 📁 **Projects** | Manage, categorize, and showcase your software portfolio |
| 📄 **Resume Management** | Upload, preview, and download your PDF resume (max 5MB) |
| 🤖 **AI Resume Analysis** | Gemini-powered scoring: ATS fitness, weaknesses, and improvements |
| 🎤 **AI Mock Interviews** | HR, Technical, Behavioral, DSA and more interview types with real-time scoring |
| 💼 **Job Tracker** | Kanban/List/Calendar views for your entire application pipeline |
| 📊 **Career Analytics** | Aggregate insights, radar charts, progress over time, and goal tracking |
| 🌐 **Public Portfolio** | A shareable recruiter-ready URL: `/portfolio/your-username` |
| ⚙️ **Settings** | Profile, privacy, notifications, security, data export, and account deletion |

---

## 🛠️ Tech Stack

**Frontend:**
- React 19 + Vite
- Tailwind CSS
- React Router v7
- Recharts (data visualization)
- React Hot Toast (notifications)
- Lucide React (icons)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)
- Google Gemini AI (`@google/genai`)
- Helmet, CORS, Rate Limiting

**DevOps:**
- Docker + Docker Compose
- GitHub Actions CI/CD
- Nginx (production frontend)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))
- Google Gemini API Key ([Get one here](https://aistudio.google.com))

### 1. Clone the repository

```bash
git clone https://github.com/your-username/skillsync-ai.git
cd skillsync-ai
```

### 2. Configure Environment Variables

```bash
# Configure the backend
cp server/.env.example server/.env
```

Edit `server/.env` and fill in your actual values:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/skillsync
JWT_SECRET=your-super-secret-key-here
GEMINI_API_KEY=your-gemini-api-key
ALLOWED_ORIGINS=http://localhost:5173
```

### 3. Install Dependencies

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 4. Seed Demo Data (Optional)

```bash
cd server && npm run seed
```

This creates a demo user:
- **Email:** `demo@skillsync.ai`
- **Password:** `demo@1234`

### 5. Start Development Servers

```bash
# Terminal 1 – Backend
cd server && npm run dev

# Terminal 2 – Frontend
cd client && npm run dev
```

The app will be available at **http://localhost:5173**

---

## 🐳 Docker Setup

Run the entire stack with a single command:

```bash
# Create a .env file in the root
cp server/.env.example server/.env  # fill in values

# Build and start all containers
docker-compose up --build

# Seed demo data (after containers are running)
docker exec skillsync_server node seeder.js
```

Access:
- **Frontend:** http://localhost
- **API:** http://localhost:5000/api/health

---

## 🌍 Deployment

### Frontend → Vercel

1. Push the `client/` directory to GitHub
2. Connect to [Vercel](https://vercel.com)
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL=https://your-backend.render.com`

### Backend → Render

1. Push `server/` to GitHub
2. Create a **Web Service** on [Render](https://render.com)
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add all environment variables from `.env.example`

### Database → MongoDB Atlas

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Add your Render server IP to the IP allowlist
3. Copy the connection string to `MONGO_URI`

---

## 📁 Folder Structure

```
skillsync-ai/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── analytics/      # Dashboard chart components
│   │   │   ├── common/         # ErrorBoundary, PageLoader, etc.
│   │   │   ├── layout/         # DashboardLayout, Sidebar
│   │   │   └── settings/       # Settings tab sub-components
│   │   ├── context/            # AuthContext (global state)
│   │   ├── pages/              # One component per route
│   │   ├── routes/             # AppRoutes (with lazy loading)
│   │   └── services/           # api.js (Axios instance)
│   ├── Dockerfile
│   └── nginx.conf
│
├── server/                     # Express backend
│   ├── config/                 # MongoDB connection
│   ├── controllers/            # Route handlers
│   ├── middleware/             # Auth, Error, Upload middleware
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express routers
│   ├── services/               # AI service abstraction layer
│   ├── utils/                  # Helper utilities
│   ├── seeder.js               # Demo data seeder
│   ├── .env.example            # Environment variable template
│   └── Dockerfile
│
├── .github/
│   └── workflows/main.yml      # GitHub Actions CI/CD
├── docker-compose.yml
└── README.md
```

---

## 🧪 Testing

```bash
# Run backend tests
cd server && npm test

# Run frontend lint
cd client && npm run lint
```

---

## 🔒 Security

- HTTP headers hardened with `helmet`
- Global rate limiting (100 req/15 min)
- Stricter auth rate limiting (20 req/15 min)
- MongoDB injection prevention with `express-mongo-sanitize`
- JWT expiration enforced
- File upload restricted to PDF, max 5MB
- Passwords hashed with `bcrypt` (10 rounds)
- Stack traces hidden in production

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'feat: add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

[MIT](./LICENSE) — free to use, modify, and distribute.

---

<div align="center">
  <p>Built with ❤️ for developers who are serious about their careers.</p>
  <p><strong>SkillSync AI</strong> — Practice. Track. Ship. 🚀</p>
</div>
