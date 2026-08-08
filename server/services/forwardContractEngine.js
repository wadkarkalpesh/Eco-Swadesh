/**
 * Pre-Harvest Forward Contracts & Futures Hedging Engine
 * Lead Architect: Senior Commodity Derivatives & Trade Finance Architect
 * Implements: Forward Price Locks, 20% Earnest Escrow Margins, and Milestone Tranche Schedules
 */

const crypto = require('crypto');

// In-memory Forward Contracts Store
const forwardContracts = new Map();

class ForwardContractEngine {
  /**
   * Create a Pre-Harvest Forward Contract
   */
  createForwardContract({
    farmerId = 'usr_farmer_01',
    farmerName = 'Swadesh Agro-Cooperative Farmer Collective',
    buyerId = 'usr_buyer_01',
    buyerName = 'Indore Organic Flour Mills Ltd',
    commodityName = 'Certified Organic Sharbati Wheat',
    tonnage = 50.0,
    lockedPricePerTonINR = 43500,
    harvestDeliveryMonth = 'March 2026',
  }) {
    const contractId = `FWD-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const totalContractValueINR = Math.round(tonnage * lockedPricePerTonINR);
    const earnestMargin20PctINR = Math.round(totalContractValueINR * 0.2);

    const trancheSchedule = [
      {
        trancheNumber: 1,
        percentage: 20,
        amountINR: earnestMargin20PctINR,
        milestone: 'CONTRACT_SIGNING_MARGIN_LOCK',
        status: 'PENDING_BUYER_MARGIN_DEPOSIT',
      },
      {
        trancheNumber: 2,
        percentage: 40,
        amountINR: Math.round(totalContractValueINR * 0.4),
        milestone: 'WEIGHBRIDGE_TARE_GROSS_CERTIFICATION',
        status: 'SCHEDULED_UPON_DISPATCH',
      },
      {
        trancheNumber: 3,
        percentage: 40,
        amountINR: Math.round(totalContractValueINR * 0.4),
        milestone: 'NABL_CHEMICAL_PURITY_ASSAY_RELEASE',
        status: 'SCHEDULED_UPON_DESTINATION_TEST',
      },
    ];

    const hashPayload = `${contractId}|${farmerId}|${buyerId}|${totalContractValueINR}|PRICE_LOCKED`;
    const legalHash = crypto.createHash('sha256').update(hashPayload).digest('hex');

    const contract = {
      contractId,
      farmerId,
      farmerName,
      buyerId,
      buyerName,
      commodityName,
      tonnage,
      lockedPricePerTonINR,
      totalContractValueINR,
      earnestMargin20PctINR,
      harvestDeliveryMonth,
      trancheSchedule,
      status: 'AWAITING_EARNEST_MARGIN_ESCROW',
      escrowFundingState: 'MARGIN_UNFUNDED',
      legalBindingHash: `0x${legalHash}`,
      createdAt: new Date().toISOString(),
    };

    forwardContracts.set(contractId, contract);
    return contract;
  }

  /**
   * Fund 20% Earnest Margin into Escrow Pool
   */
  fundEarnestMargin(contractId, transactionProofId = 'pay_fwd_margin_01') {
    const contract = forwardContracts.get(contractId);
    if (!contract) {
      throw new Error(`Forward Contract '${contractId}' not found.`);
    }

    contract.status = 'ACTIVE_FORWARD_HEDGE_LOCKED';
    contract.escrowFundingState = '20PCT_EARNEST_MARGIN_LOCKED_IN_ESCROW';
    contract.trancheSchedule[0].status = 'FUNDED_AND_HELD_IN_ESCROW';
    contract.trancheSchedule[0].paymentProof = transactionProofId;
    contract.fundedAt = new Date().toISOString();

    return contract;
  }

  getContract(contractId) {
    return forwardContracts.get(contractId) || null;
  }

  getAllContracts() {
    return Array.from(forwardContracts.values());
  }
}

const forwardContractEngine = new ForwardContractEngine();

module.exports = forwardContractEngine;
