/**
 * ============================================================================
 * REQUEST SANITIZATION & VALIDATION MIDDLEWARE
 * ============================================================================
 */

function validateInquiry(req, res, next) {
  const { name, email, discipline, message } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: { code: 400, message: 'Invalid name provided. Must be at least 2 characters.' }
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: { code: 400, message: 'Invalid email address provided.' }
    });
  }

  const validDisciplines = ['web-development', 'software-applications', 'solar-engineering', 'beadwork-fashion', 'general'];
  if (!discipline || !validDisciplines.includes(discipline)) {
    return res.status(400).json({
      success: false,
      error: { code: 400, message: `Invalid discipline. Allowed: ${validDisciplines.join(', ')}` }
    });
  }

  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    return res.status(400).json({
      success: false,
      error: { code: 400, message: 'Message content must be at least 5 characters.' }
    });
  }

  next();
}

function validateSolarCalculation(req, res, next) {
  const { dailyEnergyKwh, peakLoadKw, backupHours } = req.body;

  const kwh = Number(dailyEnergyKwh);
  const kw = Number(peakLoadKw);
  const hours = Number(backupHours);

  if (isNaN(kwh) || kwh <= 0 || kwh > 10000) {
    return res.status(400).json({
      success: false,
      error: { code: 400, message: 'dailyEnergyKwh must be a positive number between 0.1 and 10,000 kWh.' }
    });
  }

  if (isNaN(kw) || kw <= 0 || kw > 5000) {
    return res.status(400).json({
      success: false,
      error: { code: 400, message: 'peakLoadKw must be a positive number between 0.1 and 5,000 kW.' }
    });
  }

  if (isNaN(hours) || hours <= 0 || hours > 72) {
    return res.status(400).json({
      success: false,
      error: { code: 400, message: 'backupHours must be between 1 and 72 hours.' }
    });
  }

  // Attach sanitized numbers to req.body
  req.body.dailyEnergyKwh = kwh;
  req.body.peakLoadKw = kw;
  req.body.backupHours = hours;

  next();
}

module.exports = {
  validateInquiry,
  validateSolarCalculation
};
