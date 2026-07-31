const express = require('express');
const router = express.Router();
const { listBeadworkCatalog, calculateBespokeQuote } = require('./beadwork.controller');

router.get('/catalog', listBeadworkCatalog);
router.post('/quote', calculateBespokeQuote);

module.exports = router;
