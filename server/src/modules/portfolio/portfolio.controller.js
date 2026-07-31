/**
 * ============================================================================
 * PORTFOLIO & CASE STUDIES MODULE — CONTROLLER
 * ============================================================================
 */
const { db } = require('../../db');

function listPortfolio(req, res) {
  try {
    const { discipline } = req.query;
    const portfolio = db.getPortfolio(discipline);

    return res.status(200).json({
      success: true,
      count: portfolio.length,
      filter: discipline || 'all',
      data: portfolio
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { code: 500, message: 'Error retrieving portfolio items: ' + error.message }
    });
  }
}

function getPortfolioDetail(req, res) {
  try {
    const { id } = req.params;
    const item = db.getPortfolioById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: { code: 404, message: `Portfolio case study with ID '${id}' not found.` }
      });
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { code: 500, message: 'Error retrieving case study detail: ' + error.message }
    });
  }
}

module.exports = {
  listPortfolio,
  getPortfolioDetail
};
