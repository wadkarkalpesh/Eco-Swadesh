/**
 * Alternative Eco Agri-Credit & Underwriting Engine
 * Lead Architect: Principal FinTech Underwriting & Risk Modeler
 * Implements: 300-900 Alternative Credit Rating Formula & 4% Subsidized Kisan Credit Limit Model
 */

class AgriCreditEngine {
  /**
   * Compute Eco Agri-Credit Rating (300 to 900)
   * Formula: Score = 300 + (EscrowCompletionRate * 2.5) + (LabPurityRating * 2.0) + (YieldTonnageIndex * 1.5)
   */
  calculateCreditScore({
    farmerId = 'usr_farmer_01',
    farmerName = 'Ramesh Patel',
    completedEscrowOrdersCount = 48,
    escrowDefaultDisputeCount = 0,
    labChemicalPurityPct = 99.4,
    annualHarvestTonnage = 35.0,
  }) {
    // 1. Escrow fulfillment reliability ratio (0-100)
    let escrowRate = 95;
    if (completedEscrowOrdersCount > 0) {
      escrowRate = Math.min(
        100,
        Math.round(((completedEscrowOrdersCount - escrowDefaultDisputeCount) / completedEscrowOrdersCount) * 100)
      );
    }

    // 2. Lab Purity Rating (0-100)
    const purityScore = Math.min(100, Math.max(0, labChemicalPurityPct));

    // 3. Yield Tonnage Index (Cap at 100)
    const tonnageIndex = Math.min(100, Math.round(annualHarvestTonnage * 2.2));

    // Composite Credit Rating (300 - 900 range)
    const rawScore = 300 + escrowRate * 2.5 + purityScore * 2.0 + tonnageIndex * 1.5;
    const finalScore = Math.min(900, Math.max(300, Math.round(rawScore)));

    // Categorize Underwriting Tier
    let tier = 'STANDARD_TIER';
    let maxPreApprovedLoanINR = 800000;
    let interestRatePct = 5.5;

    if (finalScore >= 820) {
      tier = 'PRIME_ORGANIC_PRODUCER';
      maxPreApprovedLoanINR = 2500000; // ₹25 Lakh pre-approved
      interestRatePct = 4.0; // 4% Subsidized priority Kisan rate
    } else if (finalScore >= 740) {
      tier = 'LOW_RISK_GROWER';
      maxPreApprovedLoanINR = 1500000; // ₹15 Lakh pre-approved
      interestRatePct = 4.5;
    }

    return {
      farmerId,
      farmerName,
      creditScore: finalScore,
      scoreRange: '300-900',
      tier,
      preApprovedLoanLimitINR: maxPreApprovedLoanINR,
      subsidizedInterestRatePct: interestRatePct,
      repaymentPeriodMonths: 24,
      scoringVectors: {
        escrowFulfillmentScore: { value: escrowRate, weightFactor: 2.5 },
        labPurityScore: { value: purityScore, weightFactor: 2.0 },
        harvestTonnageIndex: { value: tonnageIndex, weightFactor: 1.5 },
      },
      partnerBanks: ['NABARD Rural Lending', 'State Bank of India Kisan Desk', 'HDFC Agri Priority'],
      assessedAt: new Date().toISOString(),
    };
  }
}

const agriCreditEngine = new AgriCreditEngine();

module.exports = agriCreditEngine;
