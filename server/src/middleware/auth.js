/**
 * ============================================================================
 * JWT AUTHENTICATION MIDDLEWARE
 * ============================================================================
 */
const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 401, message: 'Authentication required. Missing Bearer token.' }
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'iben-studio-super-secret-key-prod';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: { code: 401, message: 'Invalid or expired authentication token.' }
    });
  }
}

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user && (req.user.role === 'admin' || req.user.isAdmin === true)) {
      return next();
    }
    return res.status(403).json({
      success: false,
      error: { code: 403, message: 'Access denied. Enterprise Admin credentials required.' }
    });
  });
}

module.exports = { requireAuth, requireAdmin };
