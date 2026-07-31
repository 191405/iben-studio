const express = require('express');
const router = express.Router();
const { createInquiry, getInquiries } = require('./inquiries.controller');
const { validateInquiry } = require('../../middleware/validator');
const { inquiryLimiter } = require('../../middleware/rateLimiter');

router.post('/', inquiryLimiter, validateInquiry, createInquiry);
router.get('/', getInquiries);

module.exports = router;
