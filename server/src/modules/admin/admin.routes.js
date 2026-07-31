/**
 * ============================================================================
 * IBEN STUDIO — ENTERPRISE ADMIN ROUTER
 * ============================================================================
 * Mounted at: /api/v1/admin
 */
const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/auth');
const {
  loginAdmin,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  getAdminStats,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem
} = require('./admin.controller');

// @route   POST /api/v1/admin/login
// @desc    Admin JWT authentication
// @access  Public
router.post('/login', loginAdmin);

// @route   GET /api/v1/admin/inquiries
// @desc    Retrieve all client commissions (with optional filtering)
// @access  Private (Admin only - requires Bearer token)
router.get('/inquiries', requireAdmin, getInquiries);

// @route   GET /api/v1/admin/inquiries/:id
// @desc    Retrieve single commission detail
// @access  Private (Admin only - requires Bearer token)
router.get('/inquiries/:id', requireAdmin, getInquiryById);

// @route   PUT /api/v1/admin/inquiries/:id/status
// @desc    Update commission status ('pending', 'in-review', 'contacted', 'commissioned', 'archived')
// @access  Private (Admin only - requires Bearer token)
router.put('/inquiries/:id/status', requireAdmin, updateInquiryStatus);

// @route   GET /api/v1/admin/stats
// @desc    Executive KPI summary and system telemetry stats
// @access  Private (Admin only - requires Bearer token)
router.get('/stats', requireAdmin, getAdminStats);

// @route   POST /api/v1/admin/portfolio
// @desc    Create new portfolio case study
// @access  Private (Admin only - requires Bearer token)
router.post('/portfolio', requireAdmin, createPortfolioItem);

// @route   PUT /api/v1/admin/portfolio/:id
// @desc    Update portfolio case study
// @access  Private (Admin only - requires Bearer token)
router.put('/portfolio/:id', requireAdmin, updatePortfolioItem);

// @route   DELETE /api/v1/admin/portfolio/:id
// @desc    Delete portfolio case study
// @access  Private (Admin only - requires Bearer token)
router.delete('/portfolio/:id', requireAdmin, deletePortfolioItem);

module.exports = router;
