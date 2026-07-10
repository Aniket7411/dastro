import './config/env.js';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import logger from './config/logger.js';
import { connectDB, getDbStatus } from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import toolsRoutes from './routes/toolsRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';
import tarotRoutes from './routes/tarotRoutes.js';
import loveRoutes from './routes/loveRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import astrologerRoutes from './routes/astrologerRoutes.js';
import freeConsultationRoutes from './routes/freeConsultationRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(morgan('dev'));

// Required for express-rate-limit & correct IP behind Vercel's proxy
app.set('trust proxy', 1);

// --- CORS ---
const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://www.dsastrology.com',
  'https://dsastrology.com',
  'https://dsastroinstitute.com',
  'https://www.dsastroinstitute.com',
];

function parseAllowedOrigins() {
  const fromEnv = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  const extras = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.trim()] : [];
  return [...new Set([...DEFAULT_ALLOWED_ORIGINS, ...extras, ...fromEnv])];
}

const allowedOrigins = parseAllowedOrigins();

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (process.env.NODE_ENV !== 'production') return true;
  if (allowedOrigins.includes('*')) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) return true;
  // Hostinger preview / staging sites (*.hostingersite.com)
  if (/^https:\/\/[a-z0-9-]+\.hostingersite\.com$/i.test(origin)) return true;
  return false;
}

app.use(cors({
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.options(/.*/, cors());

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allows fetching static assets cross-origin
}));

// Payload Compression
app.use(compression());

// Rate Limiting (Global)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', limiter);

// Webhooks must be mounted before express.json() for Razorpay signature verification
app.use('/api/webhooks', webhookRoutes);

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="' + path.basename(filePath) + '"');
    } else if (ext === '.doc' || ext === '.docx') {
      res.setHeader('Content-Disposition', 'attachment; filename="' + path.basename(filePath) + '"');
    }
  }
}));

// Health Check
app.get('/health', async (req, res) => {
  try {
    await connectDB();
  } catch {
    // still return status for diagnostics
  }
  res.json({
    success: true,
    message: 'Astrology API is live.',
    db: getDbStatus(),
    env: process.env.NODE_ENV,
    timestamp: new Date(),
  });
});

// Reconnect on cold start (serverless) — no-op when already connected from server.js
app.use(async (req, res, next) => {
  if (getDbStatus() === 'disconnected') {
    try {
      await connectDB();
    } catch (err) {
      return res.status(503).json({
        success: false,
        message: 'Database unavailable. Please try again shortly.',
        error: process.env.NODE_ENV === 'production' ? undefined : err.message,
      });
    }
  }
  next();
});

// --- API Routes ---
const apiRoutes = [
  ['/tools', toolsRoutes],
  ['/consultations', consultationRoutes],
  ['/tarot', tarotRoutes],
  ['/love', loveRoutes],
  ['/leads', leadRoutes],
  ['/blogs', blogRoutes],
  ['/jobs', jobRoutes],
  ['/auth', authRoutes],
  ['/admin', adminRoutes],
  ['/settings', settingsRoutes],
  ['/newsletter', newsletterRoutes],
  ['/coupons', couponRoutes],
  ['/offers', offerRoutes],
  ['/courses', courseRoutes],
  ['/student', studentRoutes],
  ['/payment', paymentRoutes],
  ['/upload', uploadRoutes],
  ['/astrologers', astrologerRoutes],
  ['/free-consultation', freeConsultationRoutes],
];

apiRoutes.forEach(([path, route]) => {
  app.use(`/api${path}`, route);
  app.use(`${path}`, route); // Fallback for when Nginx strips the /api prefix
});

// Root route — health + db status for Hostinger / Render probes
app.get('/', async (req, res) => {
  try {
    await connectDB();
  } catch {
    // ignore
  }
  res.json({
    success: true,
    message: 'Astrology API is live.',
    db: getDbStatus(),
    env: process.env.NODE_ENV,
    timestamp: new Date(),
  });
});

// --- Error Handling ---
app.use(notFound);
app.use(errorHandler);

export default app;
