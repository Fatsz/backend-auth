/**
 * @file index.js
 * @description Entry point aplikasi Express.js
 * 
 * File ini adalah inti dari aplikasi backend:
 * 1. Load environment variables
 * 2. Inisialisasi Express app
 * 3. Setup middleware global (CORS, JSON parser)
 * 4. Daftarkan semua routes
 * 5. Global error handler
 * 6. Start server
 */

// Load .env PERTAMA sebelum semua import lain
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');

// ─── Inisialisasi Express App ──────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware Global ─────────────────────────────────────────────────────

/**
 * CORS (Cross-Origin Resource Sharing)
 * Mengizinkan request dari frontend (React) ke backend (Express)
 * PENTING: Di production, ganti origin dengan URL frontend yang tepat
 */
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

/**
 * Body Parser — agar Express bisa membaca JSON dari request body
 * Limit 10mb untuk mencegah payload yang terlalu besar
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Routes ───────────────────────────────────────────────────────────────

/**
 * Health Check — endpoint sederhana untuk cek apakah server berjalan
 * Berguna untuk monitoring di Render/production
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server berjalan dengan baik! 🚀',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Mount Routes
 * Semua route autentikasi ada di /api/auth/*
 * Semua route user ada di /api/user/*
 */
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────

/**
 * Tangani semua route yang tidak ditemukan
 * Harus diletakkan SETELAH semua route didaftarkan
 */
app.use('/{*path}', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} tidak ditemukan`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────

/**
 * Express global error handler (4 parameter: err, req, res, next)
 * Menangkap semua error yang dilempar dari middleware/route manapun
 * Harus diletakkan paling AKHIR
 */
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Terjadi kesalahan internal pada server'
      : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// ─── Start Server ──────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log('═══════════════════════════════════════');
  console.log(`🚀 Server berjalan di port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log('═══════════════════════════════════════');
});

module.exports = app;
