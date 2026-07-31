/**
 * ============================================================================
 * SOLAR ENGINEERING & ROI CALCULATOR MODULE — CONTROLLER
 * ============================================================================
 * Performs rigorous mathematical sizing for solar PV systems in Nigeria,
 * calculating inverter capacity, LiFePO4 battery bank sizing, solar array
 * wattage, capital expenditure (NGN), and financial payback period.
 */
const { db } = require('../../db');

/**
 * Calculates complete solar system architecture and financial ROI.
 * 
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
function calculateSolarSystem(req, res) {
  try {
    const { dailyEnergyKwh, peakLoadKw, backupHours, location = 'Lagos' } = req.body;

    // 1. Inverter Sizing (kVA)
    // Safety surge factor of 1.25x peak load, assuming 0.8 power factor
    const surgeFactor = 1.25;
    const powerFactor = 0.80;
    const requiredInverterKva = Math.ceil((peakLoadKw * surgeFactor) / powerFactor);

    // 2. Battery Bank Sizing (kWh)
    // LiFePO4 batteries with 80% Depth of Discharge (DoD) and 92% round-trip efficiency
    const dod = 0.80;
    const efficiency = 0.92;
    const requiredBatteryKwh = Number(((peakLoadKw * backupHours) / (dod * efficiency)).toFixed(1));

    // 3. Solar PV Array Sizing (kWp)
    // Average peak sun hours in Lagos / Southern Nigeria is ~5.2 hours/day
    const peakSunHours = 5.2;
    const systemLosses = 0.85; // derate factor for dust, temperature, wiring
    const requiredSolarKwp = Number((dailyEnergyKwh / (peakSunHours * systemLosses)).toFixed(1));
    const number550wPanels = Math.ceil((requiredSolarKwp * 1000) / 550);

    // 4. Financial Capital Expenditure Breakdown (in Nigerian Naira NGN ₦)
    // Based on prevailing Lagos market rates for Tier-1 equipment (2025/2026)
    const costPerKwp = 750000;         // ₦750k per kWp of solar PV installed
    const costPerKwhBattery = 380000;  // ₦380k per kWh LiFePO4 rack battery
    const costPerKvaInverter = 220000; // ₦220k per kVA Hybrid Inverter + BOS + Labor

    const solarCost = requiredSolarKwp * costPerKwp;
    const batteryCost = requiredBatteryKwh * costPerKwhBattery;
    const inverterCost = requiredInverterKva * costPerKvaInverter;
    const totalCapExNGN = Math.round(solarCost + batteryCost + inverterCost);

    // 5. Diesel Generator Cost Comparison & ROI Payback Period
    // Diesel fuel cost in Nigeria (~₦1,250 / liter). A generator uses ~0.35 L per kWh.
    const dieselCostPerLiter = 1250;
    const litersPerKwh = 0.35;
    const annualEnergyKwh = dailyEnergyKwh * 365;
    const annualDieselCostNGN = Math.round(annualEnergyKwh * litersPerKwh * dieselCostPerLiter);
    const annualMaintenanceSavingsNGN = Math.round(requiredInverterKva * 150000); // avoided generator maintenance
    const totalAnnualSavingsNGN = annualDieselCostNGN + annualMaintenanceSavingsNGN;
    const paybackPeriodYears = Number((totalCapExNGN / totalAnnualSavingsNGN).toFixed(1));

    // 6. Environmental Impact (Carbon CO2 offset)
    // ~0.71 kg CO2 per kWh of diesel generation replaced
    const annualCo2OffsetKg = Math.round(annualEnergyKwh * 0.71);
    const treesEquivalent = Math.round(annualCo2OffsetKg / 21); // ~21 kg CO2 absorbed per tree/year

    const quoteData = {
      inputs: {
        dailyEnergyKwh,
        peakLoadKw,
        backupHours,
        location
      },
      systemSizing: {
        recommendedInverterKva: requiredInverterKva,
        recommendedBatteryKwh: requiredBatteryKwh,
        recommendedSolarKwp: requiredSolarKwp,
        panelCount550w: number550wPanels
      },
      financialROI: {
        totalCapExNGN,
        formattedTotalCapEx: `₦${totalCapExNGN.toLocaleString('en-NG')}`,
        annualSavingsNGN: totalAnnualSavingsNGN,
        formattedAnnualSavings: `₦${totalAnnualSavingsNGN.toLocaleString('en-NG')}`,
        paybackPeriodYears
      },
      environmentalImpact: {
        annualCo2OffsetKg,
        treesEquivalent
      },
      generatedAt: new Date().toISOString()
    };

    // Save to database quotes log
    const savedQuote = db.saveSolarQuote(quoteData);

    return res.status(200).json({
      success: true,
      data: {
        quoteId: savedQuote.id,
        ...quoteData
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: 'Error executing solar calculation algorithm: ' + error.message
      }
    });
  }
}

module.exports = {
  calculateSolarSystem
};
