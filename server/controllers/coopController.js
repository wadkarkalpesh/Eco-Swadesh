/**
 * Cooperative Ledger & Dividend Controller
 * Lead Architect: Principal Cooperative FinTech & Dividend Systems Lead
 */

const coopLedgerEngine = require('../services/coopLedgerEngine');
const db = require('../config/db');

const calculateDividends = (req, res) => {
  const { fpoId, fpoName, totalNetSurplusINR, members } = req.body;
  const result = coopLedgerEngine.calculateDividends({
    fpoId,
    fpoName,
    totalNetSurplusINR,
    members,
  });

  db.logAudit({
    actorId: req.user ? req.user.id : (fpoId || 'fpo_treasurer'),
    actorRole: 'fpo_treasurer',
    action: 'CALCULATE_COOP_DIVIDENDS',
    targetType: 'COOP_DIVIDENDS',
    targetId: result.batchId,
    reason: `Calculated ₹${result.totalNetSurplusINR} surplus dividends across ${result.membersCount} farmer members`,
  });

  return res.status(200).json({ success: true, dividendBatch: result });
};

const disburseDividends = (req, res) => {
  const { batchId, dividendReport } = req.body;
  const result = coopLedgerEngine.disburseDividends(batchId, dividendReport || { totalNetSurplusINR: 1200000, membersCount: 3 });

  db.logAudit({
    actorId: req.user ? req.user.id : 'banking_gateway',
    actorRole: 'banking_gateway',
    action: 'DISBURSE_COOP_DIVIDENDS',
    targetType: 'COOP_DIVIDENDS',
    targetId: batchId || result.batchId,
    reason: `Disbursed ₹${result.disbursedTotalINR} to ${result.totalFarmersPaid} farmer bank accounts`,
  });

  return res.status(200).json({ success: true, disbursement: result });
};

module.exports = {
  calculateDividends,
  disburseDividends,
};
