const express = require('express');
const router = express.Router();
const { getSystemHealth } = require('./telemetry.controller');

router.get('/health', getSystemHealth);

module.exports = router;
