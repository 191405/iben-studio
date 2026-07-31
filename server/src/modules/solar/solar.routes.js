const express = require('express');
const router = express.Router();
const { calculateSolarSystem } = require('./solar.controller');
const { validateSolarCalculation } = require('../../middleware/validator');

router.post('/calculate', validateSolarCalculation, calculateSolarSystem);

module.exports = router;
