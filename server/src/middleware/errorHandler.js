/**
 * ============================================================================
 * GLOBAL ENTERPRISE ERROR HANDLING MIDDLEWARE
 * ============================================================================
 */

function errorHandler(err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error in non-test environments
  if (process.env.NODE_ENV !== 'test') {
    console.error(`❌ [ERROR] ${req.method} ${req.url} - ${statusCode}:`, err.stack || err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
}

function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: {
      code: 404,
      message: `Resource not found: ${req.method} ${req.originalUrl}`
    },
    timestamp: new Date().toISOString()
  });
}

module.exports = { errorHandler, notFoundHandler };
