/**
 * Water Footprint & Sustainability Controller
 * Lead Architect: Chief Hydrologist & Environmental Footprint Scientist
 */

const waterFootprintEngine = require('../services/waterFootprintEngine');
const db = require('../config/db');

const auditWaterFootprint = (req, res) => {
  const {
    cropType = 'wheat',
    harvestWeightTons = 10.0,
    irrigationMethod = 'SOLAR_PRECISION_DRIP',
    farmerName = 'Swadesh Organic Heritage Collective',
  } = req.body;

  const result = waterFootprintEngine.calculateWaterFootprint({
    cropType,
    harvestWeightTons,
    irrigationMethod,
    farmerName,
  });

  db.logAudit({
    actorId: req.user ? req.user.id : 'water_stewardship_auditor',
    actorRole: 'sustainability_auditor',
    action: 'AUDIT_ISO14046_WATER_FOOTPRINT',
    targetType: 'WATER_AUDIT',
    targetId: result.certificateId,
    reason: `Calculated ${result.waterMetrics.freshwaterSavedMegaliters} ML water saved for ${harvestWeightTons} Tons of ${cropType}`,
  });

  return res.status(200).json({ success: true, waterAuditReport: result });
};

module.exports = {
  auditWaterFootprint,
};
