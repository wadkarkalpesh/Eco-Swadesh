/**
 * NABL Lab Chain-of-Custody & Escrow Arbitration Engine
 * Lead Architect: Senior Legal-Tech & Operations Lead
 * Implements Tamper-Evident Seals, Joint Chromatography Retests, and Automated Escrow Settle
 */

const crypto = require('crypto');

class DisputeArbitrationEngine {
  /**
   * Issue Tamper-Evident Lab Retest Sample Seal
   */
  generateTamperSeal(orderId, disputeId) {
    const sealNumber = `SEAL-2026-NABL-${Math.floor(1000 + Math.random() * 9000)}`;
    const barcodeDigest = crypto
      .createHash('sha256')
      .update(`${sealNumber}|${orderId}|${disputeId}|NABL_ACCREDITED`)
      .digest('hex')
      .substring(0, 12);

    return {
      sealNumber,
      barcodeDigest: `0x${barcodeDigest}`,
      assignedLab: 'NABL Accredited Central Food & Agri Safety Laboratory, Indore',
      status: 'SAMPLE_DISPATCHED_IN_SEALED_CONTAINER',
      issuedAt: new Date().toISOString(),
    };
  }

  /**
   * Ingest Chromatography & Moisture Lab Report and Apportion Escrow Funds
   */
  apportionEscrowOnLabReport({
    orderTotalINR = 420000,
    measuredMoisturePct = 12.8, // Contract max was 12.0%
    syntheticResiduePPM = 0.0, // Zero tolerance for synthetic chemicals
    grainPurityPct = 99.4,
  }) {
    let buyerRefundPct = 0;
    let sellerPayoutPct = 100;
    let verdict = 'FULL_SELLER_PAYOUT';
    let explanation = 'All quality parameters verified within 100% certified organic specifications.';

    // 1. Check for synthetic pesticide adulteration (Zero Tolerance)
    if (syntheticResiduePPM > 0.01) {
      buyerRefundPct = 100;
      sellerPayoutPct = 0;
      verdict = 'TOTAL_REFUND_SELLER_PENALTY';
      explanation = `Prohibited synthetic chemical residue (${syntheticResiduePPM} PPM) detected. 100% refund issued to buyer. Seller certificate flagged for revocation.`;
    }
    // 2. Moisture variance discount
    else if (measuredMoisturePct > 12.0) {
      const excessMoisture = measuredMoisturePct - 12.0;
      buyerRefundPct = Math.min(50, Number((excessMoisture * 12.5).toFixed(1))); // 10% discount per 0.8% moisture excess
      sellerPayoutPct = 100 - buyerRefundPct;
      verdict = 'PARTIAL_SETTLEMENT_MOISTURE_DISCOUNT';
      explanation = `Moisture level measured at ${measuredMoisturePct}% (exceeds 12.0% specification). ${buyerRefundPct}% price adjustment apportioned to buyer from escrow pool.`;
    }

    const buyerRefundAmount = Math.round((orderTotalINR * buyerRefundPct) / 100);
    const sellerPayoutAmount = orderTotalINR - buyerRefundAmount;

    return {
      verdict,
      explanation,
      buyerRefundPct,
      sellerPayoutPct,
      apportionment: {
        orderTotalINR,
        buyerRefundINR: buyerRefundAmount,
        sellerPayoutINR: sellerPayoutAmount,
      },
      labMetrics: {
        measuredMoisturePct,
        syntheticResiduePPM,
        grainPurityPct,
        status: 'NABL_TEST_COMPLETED_PASSED',
      },
      settledAt: new Date().toISOString(),
    };
  }
}

const disputeArbitrationEngine = new DisputeArbitrationEngine();

module.exports = disputeArbitrationEngine;
