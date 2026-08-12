/**
 * Eco Swadesh Analytics & Telemetry Engine
 * Measures Verified Transparency Tonnage (VTT), Escrow Throughput,
 * and User Engagement Metrics across the platform.
 */

class AnalyticsEngine {
  constructor() {
    this.sessionEvents = [];
  }

  logEvent(eventName, payload = {}) {
    const eventRecord = {
      eventName,
      timestamp: new Date().toISOString(),
      payload,
    };

    this.sessionEvents.push(eventRecord);
    if (typeof console !== 'undefined' && console.log) {
      console.log(`[EcoSwadesh Telemetry] 📊 ${eventName}:`, payload);
    }
    return eventRecord;
  }

  trackVTTConversion(tonnage, commodity, escrowContractId) {
    return this.logEvent('VTT_TONNAGE_CONVERTED', {
      tonnage,
      commodity,
      escrowContractId,
      transparencyScore: 99.4,
    });
  }

  trackLeafScanDiagnosis(cropName, diseaseDetected) {
    return this.logEvent('AI_LEAF_SCAN_COMPLETED', {
      cropName,
      diseaseDetected,
    });
  }

  trackMandiForecastLookup(crop) {
    return this.logEvent('MANDI_PRICE_FORECAST_LOOKUP', { crop });
  }

  trackQRVerification(sealCode, authentic) {
    return this.logEvent('QR_TRUST_SEAL_VERIFIED', { sealCode, authentic });
  }

  getEventsSummary() {
    return {
      totalLogged: this.sessionEvents.length,
      events: this.sessionEvents,
    };
  }
}

export const analytics = new AnalyticsEngine();
export default analytics;
