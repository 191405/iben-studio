/**
 * ============================================================================
 * BEADWORK & BEADED FASHION MODULE — CONTROLLER
 * ============================================================================
 */
const { db } = require('../../db');

function listBeadworkCatalog(req, res) {
  try {
    const catalog = db.getBeadworkCatalog();
    return res.status(200).json({
      success: true,
      count: catalog.length,
      data: catalog
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { code: 500, message: 'Failed to retrieve beadwork catalog' }
    });
  }
}

/**
 * Calculates bespoke beadwork pricing based on material, complexity, and sizing.
 */
function calculateBespokeQuote(req, res) {
  try {
    const { materialType = 'coral', complexity = 'standard', category = 'collar', customNotes } = req.body;

    let basePrice = 350000; // Base craft price NGN
    if (category === 'bodice') basePrice = 550000;
    if (category === 'regalia') basePrice = 850000;

    let materialMultiplier = 1.0;
    if (materialType === 'benin-coral') materialMultiplier = 1.6;
    if (materialType === 'onyx-gold') materialMultiplier = 1.45;
    if (materialType === 'glass-crystal') materialMultiplier = 1.15;

    let complexityMultiplier = 1.0;
    if (complexity === 'intricate') complexityMultiplier = 1.35;
    if (complexity === 'museum-grade') complexityMultiplier = 1.8;

    const totalQuoteNGN = Math.round(basePrice * materialMultiplier * complexityMultiplier);
    const estimatedLeadWeeks = complexity === 'museum-grade' ? 8 : (complexity === 'intricate' ? 6 : 4);

    return res.status(200).json({
      success: true,
      data: {
        category,
        materialType,
        complexity,
        estimatedQuoteNGN: totalQuoteNGN,
        formattedQuote: `₦${totalQuoteNGN.toLocaleString('en-NG')}`,
        estimatedLeadTime: `${estimatedLeadWeeks} Weeks`,
        notes: customNotes || null,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { code: 500, message: 'Failed to calculate beadwork quote' }
    });
  }
}

module.exports = {
  listBeadworkCatalog,
  calculateBespokeQuote
};
