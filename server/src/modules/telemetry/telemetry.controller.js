/**
 * ============================================================================
 * TELEMETRY & SYSTEM HEALTH MODULE — CONTROLLER
 * ============================================================================
 */
const { db } = require('../../db');

const startTime = Date.now();

function getSystemHealth(req, res) {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const memUsage = process.memoryUsage();

  return res.status(200).json({
    success: true,
    status: 'ONLINE',
    system: {
      name: 'IBEN Studio Enterprise API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptimeSeconds,
      formattedUptime: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m ${uptimeSeconds % 60}s`,
      memory: {
        rssMB: Math.round(memUsage.rss / 1024 / 1024),
        heapUsedMB: Math.round(memUsage.heapUsed / 1024 / 1024)
      }
    },
    database: {
      status: 'CONNECTED',
      type: db.inMemory ? 'In-Memory SQLite/JSON' : 'Persistent Storage',
      inquiriesCount: db.data.inquiries.length,
      portfolioCount: db.data.portfolio.length,
      solarQuotesCount: db.data.solarQuotes.length
    },
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  getSystemHealth
};
