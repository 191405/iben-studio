/**
 * ============================================================================
 * IBEN STUDIO — ENTERPRISE EXPRESS APPLICATION BOOTSTRAPPER
 * ============================================================================
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { db } = require('./db');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import modular domain routes
const telemetryRoutes = require('./modules/telemetry/telemetry.routes');
const solarRoutes = require('./modules/solar/solar.routes');
const inquiriesRoutes = require('./modules/inquiries/inquiries.routes');
const portfolioRoutes = require('./modules/portfolio/portfolio.routes');
const beadworkRoutes = require('./modules/beadwork/beadwork.routes');
const adminRoutes = require('./modules/admin/admin.routes');

const app = express();

// Initialize database & migrations
db.init();

// Security headers (configured to permit inline SVGs & Figma design token styles)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS Configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Global API rate limiting
app.use('/api', apiLimiter);

// Mount API v1 Routes
const apiPrefix = process.env.API_PREFIX || '/api/v1';
app.use(`${apiPrefix}`, telemetryRoutes);          // /api/v1/health
app.use(`${apiPrefix}/solar`, solarRoutes);        // /api/v1/solar/calculate
app.use(`${apiPrefix}/inquiries`, inquiriesRoutes);// /api/v1/inquiries
app.use(`${apiPrefix}/portfolio`, portfolioRoutes);// /api/v1/portfolio
app.use(`${apiPrefix}/beadwork`, beadworkRoutes);  // /api/v1/beadwork/catalog & quote
app.use(`${apiPrefix}/admin`, adminRoutes);        // /api/v1/admin (login, inquiries, stats)

// Serve static frontend files from project root
const staticPath = process.env.PUBLIC_DIR || path.join(__dirname, '..', '..');
app.use(express.static(staticPath));

// Fallback route for SPA / HTML root
app.get('/', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// 404 & Global Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
