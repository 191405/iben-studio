const express = require('express');
const router = express.Router();
const { listPortfolio, getPortfolioDetail } = require('./portfolio.controller');

router.get('/', listPortfolio);
router.get('/:id', getPortfolioDetail);

module.exports = router;
