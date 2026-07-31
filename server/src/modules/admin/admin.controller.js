/**
 * ============================================================================
 * IBEN STUDIO — ENTERPRISE ADMIN & COMMISSION MANAGEMENT CONTROLLER
 * ============================================================================
 * Secured via JWT Authentication & Role-Based Access Control (RBAC)
 */
const jwt = require('jsonwebtoken');
const { db } = require('../../db');

/**
 * @desc    Authenticate admin & generate JWT access token
 * @route   POST /api/v1/admin/login
 * @access  Public
 */
function loginAdmin(req, res) {
  const { email, username, password } = req.body;
  const identifier = email || username;

  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      error: { code: 400, message: 'Please provide both email/username and password.' }
    });
  }

  const validEmail = process.env.ADMIN_EMAIL || 'admin@ibenstudio.com';
  const validPassword = process.env.ADMIN_PASSWORD || 'IbenAdmin2026!';

  if (identifier.toLowerCase() !== validEmail.toLowerCase() || password !== validPassword) {
    return res.status(401).json({
      success: false,
      error: { code: 401, message: 'Invalid enterprise admin credentials.' }
    });
  }

  const secret = process.env.JWT_SECRET || 'iben-studio-super-secret-key-prod';
  const tokenPayload = {
    id: 'admin-iben-001',
    email: validEmail,
    role: 'admin',
    isAdmin: true,
    issuedAt: Date.now()
  };

  const token = jwt.sign(tokenPayload, secret, { expiresIn: '8h' });

  return res.status(200).json({
    success: true,
    message: 'Admin authentication successful.',
    token,
    expiresIn: '8h',
    user: {
      id: tokenPayload.id,
      email: tokenPayload.email,
      role: tokenPayload.role,
      permissions: ['read:inquiries', 'update:inquiries', 'manage:portfolio', 'view:analytics']
    }
  });
}

/**
 * @desc    Get all client commissions / inquiries with summary analytics
 * @route   GET /api/v1/admin/inquiries
 * @access  Private (Admin only)
 */
function getInquiries(req, res) {
  const { discipline, status } = req.query;
  let inquiries = db.getInquiries();

  if (discipline) {
    inquiries = inquiries.filter(i => i.discipline === discipline);
  }
  if (status) {
    inquiries = inquiries.filter(i => i.status === status);
  }

  // Sort newest first
  inquiries.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  // Compute analytics summary
  const allInquiries = db.getInquiries();
  const analytics = {
    totalCommissions: allInquiries.length,
    pending: allInquiries.filter(i => i.status === 'pending').length,
    inReview: allInquiries.filter(i => i.status === 'in-review').length,
    commissioned: allInquiries.filter(i => i.status === 'commissioned').length,
    byDiscipline: {
      'web-development': allInquiries.filter(i => i.discipline === 'web-development').length,
      'software-applications': allInquiries.filter(i => i.discipline === 'software-applications').length,
      'solar-engineering': allInquiries.filter(i => i.discipline === 'solar-engineering').length,
      'beadwork-fashion': allInquiries.filter(i => i.discipline === 'beadwork-fashion').length
    }
  };

  return res.status(200).json({
    success: true,
    count: inquiries.length,
    analytics,
    data: inquiries
  });
}

/**
 * @desc    Get specific client commission by ID
 * @route   GET /api/v1/admin/inquiries/:id
 * @access  Private (Admin only)
 */
function getInquiryById(req, res) {
  const inquiry = db.getInquiryById(req.params.id);
  if (!inquiry) {
    return res.status(404).json({
      success: false,
      error: { code: 404, message: `Inquiry with ID ${req.params.id} not found.` }
    });
  }

  return res.status(200).json({
    success: true,
    data: inquiry
  });
}

/**
 * @desc    Update client commission status
 * @route   PUT /api/v1/admin/inquiries/:id/status
 * @access  Private (Admin only)
 */
function updateInquiryStatus(req, res) {
  const { status } = req.body;
  const allowedStatuses = ['pending', 'in-review', 'contacted', 'commissioned', 'archived'];

  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 400,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`
      }
    });
  }

  const updated = db.updateInquiryStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({
      success: false,
      error: { code: 404, message: `Inquiry with ID ${req.params.id} not found.` }
    });
  }

  return res.status(200).json({
    success: true,
    message: `Inquiry status updated to '${status}'.`,
    data: updated
  });
}

/**
 * @desc    Get executive dashboard KPIs & system health summary
 * @route   GET /api/v1/admin/stats
 * @access  Private (Admin only)
 */
function getAdminStats(req, res) {
  const allInquiries = db.getInquiries();
  const portfolioCount = db.getPortfolio().length;
  const beadworkCount = db.getBeadworkCatalog().length;

  return res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    system: {
      service: 'IBEN Studio Enterprise API',
      version: '1.0.0',
      uptimeSeconds: Math.floor(process.uptime()),
      database: db.inMemory ? 'In-Memory Engine' : 'JSON Storage Engine'
    },
    metrics: {
      totalInquiries: allInquiries.length,
      portfolioItems: portfolioCount,
      beadworkCatalogItems: beadworkCount
    }
  });
}

module.exports = {
  loginAdmin,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  getAdminStats
};
