/**
 * ============================================================================
 * AUTOMATED TEST SUITE: SOLAR ENGINEERING & ROI CALCULATOR
 * ============================================================================
 */
const request = require('supertest');
const app = require('../src/app');

describe('POST /api/v1/solar/calculate — Solar Sizing & ROI', () => {
  test('should accurately calculate solar array, battery bank, inverter kVA, and ROI in NGN', async () => {
    const payload = {
      dailyEnergyKwh: 45, // 45 kWh/day usage
      peakLoadKw: 8,      // 8 kW peak surge demand
      backupHours: 12     // 12 hours night battery backup
    };

    const res = await request(app)
      .post('/api/v1/solar/calculate')
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('quoteId');

    // Check mathematical accuracy
    // 1. Inverter: ceil((8 * 1.25) / 0.8) = ceil(12.5) = 13 kVA
    expect(res.body.data.systemSizing.recommendedInverterKva).toBe(13);

    // 2. Battery: (8 * 12) / (0.8 * 0.92) = 96 / 0.736 = 130.4 kWh
    expect(res.body.data.systemSizing.recommendedBatteryKwh).toBe(130.4);

    // 3. Solar: 45 / (5.2 * 0.85) = 45 / 4.42 = 10.2 kWp
    expect(res.body.data.systemSizing.recommendedSolarKwp).toBe(10.2);

    // 4. Panel count: ceil((10.2 * 1000) / 550) = 19 panels
    expect(res.body.data.systemSizing.panelCount550w).toBe(19);

    // 5. Check financial currency formatting
    expect(res.body.data.financialROI.formattedTotalCapEx).toMatch(/^₦/);
    expect(res.body.data.financialROI.paybackPeriodYears).toBeGreaterThan(0);
  });

  test('should reject invalid or negative calculation parameters with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/v1/solar/calculate')
      .send({
        dailyEnergyKwh: -10,
        peakLoadKw: 0,
        backupHours: 100
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe(400);
  });
});
