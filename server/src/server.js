/**
 * ============================================================================
 * IBEN STUDIO — ENTERPRISE HTTP SERVER LAUNCHER
 * ============================================================================
 */
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log('================================================================');
  console.log(`🚀 IBEN Studio Enterprise API running on port ${PORT}`);
  console.log(`🌐 Health endpoint: http://localhost:${PORT}/api/v1/health`);
  console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('================================================================');
});

// Graceful shutdown handling for container orchestration (Docker/Kubernetes)
const gracefulShutdown = (signal) => {
  console.log(`\n⚠️  Received ${signal}. Starting graceful shutdown...`);
  server.close(() => {
    console.log('✔ HTTP server closed.');
    process.exit(0);
  });

  // Force close after 10 seconds if connections are hanging
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = server;
