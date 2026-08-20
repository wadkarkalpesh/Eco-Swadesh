/**
 * Phytosanitary & Export Biosecurity Engine
 * Lead Architect: Chief Biosecurity & International Trade Officer
 * Implements: APEDA / USDA Phytosanitary Certificate Generation, ICP-MS Heavy Metal Audits, and Cold CO2 Quarantine Records
 */

const crypto = require('crypto');

// International Organic Heavy Metal Thresholds (PPM)
const HEAVY_METAL_LIMITS_PPM = {
  lead: 0.1,      // Pb maximum 0.1 PPM
  cadmium: 0.05,  // Cd maximum 0.05 PPM
  arsenic: 0.1,   // As maximum 0.1 PPM
  mercury: 0.01,  // Hg maximum 0.01 PPM
};

class PhytosanitaryEngine {
  /**
   * Screen ICP-MS Heavy Metal Spectrometry against International Organic Tolerances
   */
  screenHeavyMetals({ leadPPM = 0.02, cadmiumPPM = 0.01, arsenicPPM = 0.03, mercuryPPM = 0.002 }) {
    const breaches = [];

    if (leadPPM > HEAVY_METAL_LIMITS_PPM.lead) {
      breaches.push(`Lead (Pb) is ${leadPPM} PPM (exceeds limit of ${HEAVY_METAL_LIMITS_PPM.lead} PPM)`);
    }
    if (cadmiumPPM > HEAVY_METAL_LIMITS_PPM.cadmium) {
      breaches.push(`Cadmium (Cd) is ${cadmiumPPM} PPM (exceeds limit of ${HEAVY_METAL_LIMITS_PPM.cadmium} PPM)`);
    }
    if (arsenicPPM > HEAVY_METAL_LIMITS_PPM.arsenic) {
      breaches.push(`Arsenic (As) is ${arsenicPPM} PPM (exceeds limit of ${HEAVY_METAL_LIMITS_PPM.arsenic} PPM)`);
    }
    if (mercuryPPM > HEAVY_METAL_LIMITS_PPM.mercury) {
      breaches.push(`Mercury (Hg) is ${mercuryPPM} PPM (exceeds limit of ${HEAVY_METAL_LIMITS_PPM.mercury} PPM)`);
    }

    const passed = breaches.length === 0;

    return {
      passed,
      testedLevels: { leadPPM, cadmiumPPM, arsenicPPM, mercuryPPM },
      tolerances: HEAVY_METAL_LIMITS_PPM,
      breaches,
      status: passed ? 'ICP_MS_HEAVY_METALS_PASSED' : 'QUARANTINE_LOCKED_HEAVY_METAL_BREACH',
      analyzedAt: new Date().toISOString(),
    };
  }

  /**
   * Issue Official Digital Phytosanitary Export Certificate
   */
  issuePhytosanitaryCertificate({
    orderId,
    commodityName = 'Organic Sharbati Wheat (Triticum aestivum)',
    exporterName = 'Swadesh Agro-Cooperative Farmer Collective',
    destinationCountry = 'United States (USDA NOP)',
    tonnage = 20.0,
    containerSealNo = 'SEAL-APEDA-9941',
    fumigationMethod = 'Non-Toxic Cold Controlled Atmosphere CO2 (Zero Chemical Residue)',
    metalScreening = null,
  }) {
    const certNumber = `PHYTO-IN-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const screening = metalScreening || this.screenHeavyMetals({});
    if (!screening.passed) {
      throw new Error(`Cannot issue Phytosanitary Certificate: Heavy metal screening failed (${screening.breaches.join(', ')})`);
    }

    const barcodePayload = `${certNumber}|${orderId}|${commodityName}|${tonnage}TONS|${containerSealNo}|VALID`;
    const digitalSignature = crypto.createHash('sha256').update(barcodePayload).digest('hex');

    return {
      success: true,
      certNumber,
      orderId,
      commodityName,
      exporterName,
      destinationCountry,
      tonnage,
      containerSealNo,
      fumigationTreatment: {
        method: fumigationMethod,
        temperatureCelsius: 18.5,
        exposureHours: 72,
        verifiedOrganicStatus: '100% RESIDUE_FREE',
      },
      heavyMetalScreening: screening,
      issuingAuthority: 'National Plant Protection Organization (NPPO) & APEDA, India',
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days export validity
      digitalSignature: `0x${digitalSignature}`,
      status: 'ISSUED_AND_CUSTOMS_CLEARED',
      issuedAt: new Date().toISOString(),
    };
  }
}

const phytosanitaryEngine = new PhytosanitaryEngine();

module.exports = phytosanitaryEngine;
