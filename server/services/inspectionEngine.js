/**
 * Eco Swadesh Phase 27: Electronic Phytosanitary Inspection Dispatch Engine
 * Automates field auditor allocation, digital inspection scheduling,
 * GPS geo-stamping, and real-time APEDA/NPOP compliance auditing.
 */

class InspectionEngine {
  constructor() {
    this.inspections = new Map();
    this.auditors = [
      {
        id: 'aud_apeda_01',
        name: 'Dr. Sunita Deshmukh',
        agency: 'APEDA Regional Organic Inspection Directorate',
        certifiedStandards: ['NPOP', 'USDA_NOP', 'EU_ORGANIC'],
        phone: '+91 98220 55112',
        geoCoordinates: { lat: 18.5204, lng: 73.8567 }, // Pune Hub
        activeStatus: 'AVAILABLE',
      },
      {
        id: 'aud_nabl_02',
        name: 'Prof. Virendra Sharma',
        agency: 'NABL Certified Agriculture Quality Cell',
        certifiedStandards: ['JAIVIK_BHARAT', 'ISO_17025', 'GLOBAL_GAP'],
        phone: '+91 94140 33901',
        geoCoordinates: { lat: 23.2599, lng: 77.4126 }, // Bhopal / Central Hub
        activeStatus: 'AVAILABLE',
      },
    ];
    this.initMockInspections();
  }

  initMockInspections() {
    const defaultInsp = {
      inspectionId: 'INSP-2026-9011',
      farmName: 'Sehore Bio-Wheat Organic Cluster',
      farmerId: 'usr_farmer_01',
      cropType: 'Organic Sharbati Wheat',
      farmAcreage: 25.0,
      inspectionType: 'PRE_HARVEST_ORGANIC_COMPLIANCE',
      assignedAuditor: this.auditors[0],
      scheduledDate: '2026-03-05T09:00:00.000Z',
      geoStamp: {
        latitude: 23.2001,
        longitude: 77.0855,
        bufferComplianceRadiusMeters: 30.0,
        gpsAccuracyMeters: 1.2,
      },
      status: 'AUDITOR_DISPATCHED',
      checklist: {
        syntheticPesticideAbsence: true,
        bufferZoneIntact: true,
        seedNurseryTraceability: true,
        soilNitrogenBioBalance: true,
      },
      complianceScore: 98.6,
      certificateReady: true,
    };
    this.inspections.set(defaultInsp.inspectionId, defaultInsp);
  }

  /**
   * Dispatches a new electronic inspection
   */
  dispatchInspection({ farmName, farmerId, cropType, farmAcreage, latitude, longitude, preferredDate }) {
    const inspectionId = `INSP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const assignedAuditor = this.auditors[Math.floor(Math.random() * this.auditors.length)];

    const inspection = {
      inspectionId,
      farmName: farmName || 'Swadesh Certified Organic Parcel',
      farmerId: farmerId || 'usr_farmer_anon',
      cropType: cropType || 'Mixed Organic Produce',
      farmAcreage: Number(farmAcreage) || 10.0,
      inspectionType: 'APEDA_NPOP_ANNUAL_ORGANIC_AUDIT',
      assignedAuditor,
      scheduledDate: preferredDate || new Date(Date.now() + 86400000 * 2).toISOString(),
      geoStamp: {
        latitude: Number(latitude) || 23.2001,
        longitude: Number(longitude) || 77.0855,
        bufferComplianceRadiusMeters: 30.0,
        gpsAccuracyMeters: 1.5,
        timestamp: new Date().toISOString(),
      },
      status: 'SCHEDULED_AUDITOR_ASSIGNED',
      checklist: {
        syntheticPesticideAbsence: 'PENDING_PHYSICAL_SAMPLE',
        bufferZoneIntact: 'VERIFIED_VIA_GIS_SATELLITE',
        seedNurseryTraceability: 'DOCUMENT_UPLOADED',
        soilNitrogenBioBalance: 'LAB_SAMPLE_QUEUED',
      },
      complianceScore: 95.0,
      certificateReady: false,
      createdAt: new Date().toISOString(),
    };

    this.inspections.set(inspectionId, inspection);
    return inspection;
  }

  /**
   * Retrieves inspection record by ID
   */
  getInspectionById(inspectionId) {
    return this.inspections.get(inspectionId) || null;
  }

  /**
   * Lists all inspections
   */
  listInspections() {
    return Array.from(this.inspections.values());
  }

  /**
   * Finalizes an audit report
   */
  completeInspection(inspectionId, checklistUpdates, auditorNotes) {
    const inspection = this.inspections.get(inspectionId);
    if (!inspection) throw new Error('Inspection not found');

    inspection.checklist = { ...inspection.checklist, ...checklistUpdates };
    inspection.auditorNotes = auditorNotes || 'All organic parameters comply with NPOP Section 3 standards.';
    inspection.status = 'COMPLETED_100%_ORGANIC_PASSED';
    inspection.complianceScore = 99.2;
    inspection.certificateReady = true;
    inspection.completedAt = new Date().toISOString();

    return inspection;
  }
}

module.exports = new InspectionEngine();
