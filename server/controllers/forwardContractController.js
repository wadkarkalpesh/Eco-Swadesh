/**
 * Forward Contract Controller
 * Lead Architect: Senior Commodity Derivatives & Trade Finance Architect
 */

const forwardContractEngine = require('../services/forwardContractEngine');
const db = require('../config/db');

const createContract = (req, res) => {
  try {
    const {
      farmerId,
      farmerName,
      buyerId,
      buyerName,
      commodityName,
      tonnage,
      lockedPricePerTonINR,
      harvestDeliveryMonth,
    } = req.body;

    const contract = forwardContractEngine.createForwardContract({
      farmerId,
      farmerName,
      buyerId,
      buyerName,
      commodityName,
      tonnage,
      lockedPricePerTonINR,
      harvestDeliveryMonth,
    });

    db.logAudit({
      actorId: req.user ? req.user.id : (buyerId || 'institutional_buyer'),
      actorRole: 'trade_finance',
      action: 'CREATE_FORWARD_CONTRACT',
      targetType: 'FORWARD_AGREEMENT',
      targetId: contract.contractId,
      reason: `Locked forward price ₹${lockedPricePerTonINR}/Ton for ${tonnage} Tons of ${commodityName}`,
    });

    return res.status(201).json({ success: true, contract });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const fundEarnestMargin = (req, res) => {
  try {
    const { id } = req.params;
    const { transactionProofId = 'pay_fwd_razorpay_margin' } = req.body;

    const updated = forwardContractEngine.fundEarnestMargin(id, transactionProofId);

    db.logAudit({
      actorId: req.user ? req.user.id : 'escrow_custodian',
      actorRole: 'escrow_service',
      action: 'FUND_FORWARD_EARNEST_MARGIN',
      targetType: 'FORWARD_AGREEMENT',
      targetId: id,
      reason: `Locked ₹${updated.earnestMargin20PctINR} earnest margin (20%) in Deccan Origin Escrow Pool`,
    });

    return res.status(200).json({
      success: true,
      contract: updated,
      message: '20% Earnest margin successfully locked in Escrow. Forward price hedge is active.',
    });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const getContractById = (req, res) => {
  const { id } = req.params;
  const contract = forwardContractEngine.getContract(id);
  if (!contract) {
    return res.status(404).json({ success: false, error: 'CONTRACT_NOT_FOUND' });
  }
  return res.status(200).json({ success: true, contract });
};

const listContracts = (req, res) => {
  const contracts = forwardContractEngine.getAllContracts();
  return res.status(200).json({ success: true, contracts });
};

module.exports = {
  createContract,
  fundEarnestMargin,
  getContractById,
  listContracts,
};
