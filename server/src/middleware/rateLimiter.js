/**
 * ============================================================================
 * API RATE LIMITING MIDDLEWARE
 * ============================================================================
 */
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 429,
      message: 'Too many requests created from this IP, please try again after 15 minutes.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'test' // skip in tests
});

const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 inquiries per hour
  message: {
    success: false,
    error: {
      code: 429,
      message: 'Too many inquiry submissions from this IP. Please try again later.'
    }
  },
  skip: (req) => process.env.NODE_ENV === 'test'
});

module.exports = {
  apiLimiter,
  inquiryLimiter
};
