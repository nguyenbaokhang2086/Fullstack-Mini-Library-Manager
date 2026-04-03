import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import connectDB from './config/db.js';
import swaggerSpec from './config/swaggerConfig.js';

// Routes
// import userRoutes from './routes/userRoutes.js';
// import projectRoutes from './routes/projectRoutes.js';
import authorRoutes from './routes/authorRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import borrowingRoutes from './routes/borrowingRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

// Load biến môi trường
dotenv.config();

const app = express();

// ── CORS ─────────────────────────────────────
const allowedOrigins = [
  'https://app.com',
  'https://admin.app.com',
  'http://localhost:3000',
  'http://localhost:5173', // Vite dev server
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
}));

// ── Middleware ────────────────────────────────
app.use(express.json());

// ── Kết nối Database ─────────────────────────
connectDB();

// ── Routes ────────────────────────────────────
// app.use('/api/users', userRoutes);
// app.use('/api/projects', projectRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrowings', borrowingRoutes);
app.use('/api/stats', statsRoutes);

// ── Swagger UI ────────────────────────────────
// Truy cập tại: http://localhost:3001/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Lumina Library API Docs',
  swaggerOptions: {
    persistAuthorization: true,
  },
}));

// ── Health check ──────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: '🚀 Lumina Library API is running',
    docs: `${process.env.SERVER_URL || `http://localhost:${process.env.PORT || 3001}`}/api-docs`,
  });
});

// ── Start server ──────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
});
