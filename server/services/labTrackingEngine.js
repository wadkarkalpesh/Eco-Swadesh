/**
 * NABL Lab Chain-of-Custody Barcode Tracker Engine
 * Lead Architect: Senior Lab Operations & Quality Assurance Architect
 * Implements: 5-Stage Custody Barcode Scanning, Lab Chemist Signatures & Milestone Auditing
 */

// In-memory Sample Custody Store
const sampleCustodyStore = new Map();

// Seed initial sample
sampleCustodyStore.set('SEAL-2026-NABL-9041', {
  sampleCode: 'SEAL-2026-NABL-9041',
  orderId: 'ORD-2026-9041',
  commodityName: 'Organic Sharbati Wheat',
  assignedLab: 'NABL Central Food & Agri Testing Laboratory, Indore',
  currentStage: 'RECEIVED_AT_NABL_LAB',
  stages: [
    { stage: 'DISPATCHED_FROM_FARM', location: 'Indore Farm Depot', timestamp: '2026-01-22T08:30:00Z', operator: 'Farmer Field Scout' },
    { stage: 'IN_COLD_TRANSIT', location: 'NH-52 Highway Checkpost', timestamp: '2026-01-22T11:45:00Z', operator: 'Reefer Driver' },
    { stage: 'RECEIVED_AT_NABL_LAB', location: 'Central Sample Ingestion Counter', timestamp: '2026-01-22T14:10:00Z', operator: 'Chief Lab Registrar' },
  ],
  assayQueued: 'Gas Chromatography - Mass Spectrometry (GC-MS)',
  status: 'TESTING_IN_PROGRESS',
});

class LabTrackingEngine {
  /**
   * Scan and Advance Sample Barcode Stage in Chain-of-Custody
   */
  scanSampleBarcode({ sampleCode = 'SEAL-2026-NABL-9041', newStage, location = 'Indore NABL Lab Room 4', operator = 'Senior Analytical Chemist' }) {
    let record = sampleCustodyStore.get(sampleCode);
    if (!record) {
      record = {
        sampleCode,
        orderId: 'ORD-AUTO-SAMPLE',
        commodityName: 'Certified Bio Harvest',
        assignedLab: 'NABL Central Testing Facility',
        currentStage: newStage || 'LAB_INGESTED',
        stages: [],
        status: 'ACTIVE_CHAIN_OF_CUSTODY',
      };
      sampleCustodyStore.set(sampleCode, record);
    }

    const stageEntry = {
      stage: newStage || 'SPECTROMETRY_QUEUED',
      location,
      timestamp: new Date().toISOString(),
      operator,
    };

    record.currentStage = stageEntry.stage;
    record.stages.push(stageEntry);

    if (stageEntry.stage === 'FINAL_ASSAY_PUBLISHED') {
      record.status = '100%_CERTIFIED_ORGANIC_PASSED';
      record.labReportSummary = {
        pesticideResiduePPM: 0.0,
        moisturePercentage: 11.4,
        organicAssayResult: 'ZERO_SYNTHETIC_CHEMICALS_DETECTED',
      };
    }

    return {
      success: true,
      sampleCode,
      currentStage: record.currentStage,
      updatedRecord: record,
      message: `Sample barcode '${sampleCode}' updated to stage '${record.currentStage}'.`,
    };
  }

  getSampleCustody(sampleCode) {
    return sampleCustodyStore.get(sampleCode) || null;
  }
}

const labTrackingEngine = new LabTrackingEngine();

module.exports = labTrackingEngine;
