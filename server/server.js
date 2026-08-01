const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();
console.log('✅ dotenv loaded');
console.log('✅ OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? 'Present' : 'Missing');
console.log('✅ OPENROUTER_MODEL:', process.env.OPENROUTER_MODEL ? process.env.OPENROUTER_MODEL : 'Missing');

// Validate critical environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v]);
if (missingEnvVars.length > 0) {
  console.error(`FATAL: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Connect to database
connectDB();

const app = express();
// Railway runs behind a reverse proxy
app.set('trust proxy', 1);

// ─── Security Middleware ──────────────────────────────────────────────────────
// Set security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow serving uploads
}));

// Enable CORS with explicit origin whitelist
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .filter(Boolean);
if (process.env.CLIENT_URL && !allowedOrigins.includes(process.env.CLIENT_URL)) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

// Temporary logging before CORS
app.use((req, res, next) => {
  console.log('CORS LOG -> method:', req.method, 'origin:', req.headers.origin, 'ip:', req.ip);
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non‑browser requests without Origin header
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some(o => origin.startsWith(o))) {
        callback(null, true);
      } else {
        // Accept any *.vercel.app preview domain
        if (origin && origin.includes('.vercel.app')) {
          callback(null, true);
        } else {
          callback(new Error(`Not allowed by CORS: ${origin}`));
        }
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Rate limiting – 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests from this IP, please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
});
app.use('/api', limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many authentication attempts, please try again in 15 minutes.' },
  // OPTIONS preflight should not be rate‑limited
  skip: (req) => req.method === 'OPTIONS',
});
app.use('/api/auth', authLimiter);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // Limit body size to 10kb
// Log when response finishes or closes for debugging
app.use((req, res, next) => {
  res.on('finish', () => console.log('FINISH', req.method, req.originalUrl));
  res.on('close', () => console.log('CLOSE', req.method, req.originalUrl));
  next();
});
app.use(express.urlencoded({ extended: false }));

// ─── Data Sanitization ────────────────────────────────────────────────────────
// Sanitize against MongoDB Operator Injection (recursively strips keys beginning with $)
function sanitizeObject(obj) {
  if (obj instanceof Object) {
    for (const key in obj) {
      if (/^\$/.test(key)) {
        delete obj[key];
      } else {
        sanitizeObject(obj[key]);
      }
    }
  }
}

app.use((req, res, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.params) sanitizeObject(req.params);
  if (req.query) {
    try {
      const queryClone = JSON.parse(JSON.stringify(req.query));
      sanitizeObject(queryClone);
      Object.defineProperty(req, 'query', {
        value: queryClone,
        writable: true,
        configurable: true,
        enumerable: true
      });
    } catch (e) {
      // Fallback: ignore if query object cannot be redefined
    }
  }
  next();
});

// ─── Logging ──────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Static Files ─────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/interview', require('./routes/interviewRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/portfolio', require('./routes/portfolioRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err.name, err.message);
  server.close(() => process.exit(1));
});

module.exports = app;
