/**
 * NABL Lab Custody Tracking Controller
 * Lead Architect: Senior Lab Operations & Quality Assurance Architect
 */

const labTrackingEngine = require('../services/labTrackingEngine');
const db = require('../config/db');

const scanSample = (req, res) => {
  const { sampleCode, newStage, location, operator } = req.body;
  const result = labTrackingEngine.scanSampleBarcode({
    sampleCode,
    newStage,
    location,
    operator,
  });

  db.logAudit({
    actorId: req.user ? req.user.id : (operator || 'nabl_lab_chemist'),
    actorRole: 'lab_chemist',
    action: 'SCAN_NABL_SAMPLE_BARCODE',
    targetType: 'LAB_SAMPLE',
    targetId: sampleCode || 'SEAL-2026',
    reason: `Advanced sample ${sampleCode} to stage ${result.currentStage}`,
  });

  return res.status(200).json(result);
};

const getSampleCustody = (req, res) => {
  const { sampleCode } = req.params;
  let record = labTrackingEngine.getSampleCustody(sampleCode);

  if (!record) {
    record = labTrackingEngine.scanSampleBarcode({ sampleCode }).updatedRecord;
  }

  return res.status(200).json({ success: true, custodyRecord: record });
};

module.exports = {
  scanSample,
  getSampleCustody,
};
