/**
 * ============================================================================
 * INQUIRIES & LEAD CAPTURE MODULE — CONTROLLER
 * ============================================================================
 */
const { db } = require('../../db');
const { triggerInquiryNotification } = require('../../services/notificationService');

/**
 * @desc    Submit new client commission inquiry
 * @route   POST /api/v1/inquiries
 * @access  Public
 */
function createInquiry(req, res) {
  try {
    const { name, email, discipline, message, phone, company } = req.body;

    const savedInquiry = db.createInquiry({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      discipline,
      message: message.trim(),
      phone: phone ? phone.trim() : null,
      company: company ? company.trim() : null,
      source: 'IBEN Studio Website'
    });

    // Trigger async email & webhook notification alert
    triggerInquiryNotification(savedInquiry).catch(err => {
      console.warn('Notification delivery warning:', err.message);
    });

    return res.status(201).json({
      success: true,
      data: {
        inquiryId: savedInquiry.id,
        status: savedInquiry.status,
        createdAt: savedInquiry.createdAt,
        message: 'Your inquiry has been received by IBEN Studio. Our engineering crew will contact you shortly.'
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { code: 500, message: 'Failed to record inquiry: ' + error.message }
    });
  }
}

/**
 * Retrieves all inquiries (Protected by Admin Auth in production).
 */
function getInquiries(req, res) {
  try {
    const inquiries = db.getInquiries();
    return res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { code: 500, message: 'Failed to retrieve inquiries' }
    });
  }
}

module.exports = {
  createInquiry,
  getInquiries
};
