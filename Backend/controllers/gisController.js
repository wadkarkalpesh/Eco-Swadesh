/**
 * Satellite GIS Farm Boundary Controller
 * Lead Architect: Chief GIS & Satellite Remote Sensing Engineer
 */

const gisBoundaryEngine = require('../services/gisBoundaryEngine');
const db = require('../config/db');

const verifyFarmBoundary = (req, res) => {
  const {
    farmId = 'farm-mp-sehore-01',
    farmName = 'Swadesh Organic Heritage Farm',
    ownerName = 'Ramesh Patel',
    coordinates,
    nearestChemicalFarmDistanceMeters,
  } = req.body;

  const result = gisBoundaryEngine.verifyFarmBoundary({
    farmId,
    farmName,
    ownerName,
    coordinates,
    nearestChemicalFarmDistanceMeters,
  });

  db.logAudit({
    actorId: req.user ? req.user.id : ownerName,
    actorRole: 'gis_auditor',
    action: 'VERIFY_FARM_GIS_BOUNDARY',
    targetType: 'FARM_PARCEL',
    targetId: farmId,
    reason: `GIS verification for ${farmName}: ${result.bufferZoneAudit.complianceStatus} (${result.arableAreaAcres} Acres)`,
  });

  return res.status(200).json({ success: true, parcelReport: result });
};

const getParcelById = (req, res) => {
  const { farmId } = req.params;
  const result = gisBoundaryEngine.verifyFarmBoundary({ farmId });
  return res.status(200).json({ success: true, parcelReport: result });
};

module.exports = {
  verifyFarmBoundary,
  getParcelById,
};
