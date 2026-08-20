/**
 * Cold-Chain Shelf-Life Controller
 * Lead Architect: Senior Cold-Chain Bio-Physicist & Thermal Engineer
 */

const shelfLifeEngine = require('../services/shelfLifeEngine');
const db = require('../config/db');

const evaluateShelfLife = (req, res) => {
  const {
    commodityType,
    nominalShelfLifeDays,
    referenceTempCelsius,
    temperatureReadingsCelsius,
    exposureHours,
    q10Factor,
    shipmentId,
  } = req.body;

  const result = shelfLifeEngine.evaluateShelfLife({
    commodityType,
    nominalShelfLifeDays,
    referenceTempCelsius,
    temperatureReadingsCelsius,
    exposureHours,
    q10Factor,
  });

  if (result.integrityPercentage < 50) {
    db.logAudit({
      actorId: req.user ? req.user.id : 'iot_telemetry_daemon',
      actorRole: 'thermal_monitor',
      action: 'COLD_CHAIN_SPOILAGE_ALARM',
      targetType: 'SHIPMENT',
      targetId: shipmentId || 'SHIP-EXCURSION',
      reason: `Arrhenius degradation alarm: Bio-potency dropped to ${result.integrityPercentage}%`,
    });
  }

  return res.status(200).json({ success: true, shelfLifeReport: result });
};

module.exports = {
  evaluateShelfLife,
};
