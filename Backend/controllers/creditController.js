/**
 * Agri-Credit & Underwriting Controller
 * Lead Architect: Principal FinTech Underwriting & Risk Modeler
 */

const agriCreditEngine = require('../services/agriCreditEngine');
const db = require('../config/db');

const getFarmerScore = (req, res) => {
  const {
    farmerId = 'usr_farmer_01',
    farmerName = 'Ramesh Patel',
    completedEscrowOrdersCount = 48,
    escrowDefaultDisputeCount = 0,
    labChemicalPurityPct = 99.4,
    annualHarvestTonnage = 35.0,
  } = req.body;

  const evaluation = agriCreditEngine.calculateCreditScore({
    farmerId,
    farmerName,
    completedEscrowOrdersCount,
    escrowDefaultDisputeCount,
    labChemicalPurityPct,
    annualHarvestTonnage,
  });

  db.logAudit({
    actorId: req.user ? req.user.id : farmerId,
    actorRole: 'credit_underwriter',
    action: 'EVALUATE_AGRI_CREDIT_SCORE',
    targetType: 'CREDIT_PROFILE',
    targetId: farmerId,
    reason: `Calculated Eco Agri-Credit rating ${evaluation.creditScore} (${evaluation.tier})`,
  });

  return res.status(200).json({ success: true, creditReport: evaluation });
};

const getLoanOffers = (req, res) => {
  const { farmerId } = req.params;
  const evaluation = agriCreditEngine.calculateCreditScore({
    farmerId,
    completedEscrowOrdersCount: 50,
  });

  return res.status(200).json({
    success: true,
    farmerId,
    offers: [
      {
        bank: 'NABARD Rural Organic Facility',
        amountINR: evaluation.preApprovedLoanLimitINR,
        interestRate: `${evaluation.subsidizedInterestRatePct}% per annum`,
        tenure: '24 Months',
        processingFeeINR: 0,
        status: 'INSTANT_DISBURSAL_ELIGIBLE',
      },
    ],
  });
};

module.exports = {
  getFarmerScore,
  getLoanOffers,
};
