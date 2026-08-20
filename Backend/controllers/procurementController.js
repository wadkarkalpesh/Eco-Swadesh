/**
 * Procurement & Group-Buying Pool Controller
 * Lead Architect: Lead Rural Procurement & FPO Commercial Lead
 */

const groupBuyingEngine = require('../services/groupBuyingEngine');
const db = require('../config/db');

const createPool = (req, res) => {
  try {
    const {
      title,
      productId,
      productName,
      retailPricePerLiterINR,
      targetTons,
      deliveryDepot,
      deadlineDays,
    } = req.body;

    const pool = groupBuyingEngine.createPool({
      title,
      productId,
      productName,
      retailPricePerLiterINR,
      targetTons,
      deliveryDepot,
      deadlineDays,
    });

    db.logAudit({
      actorId: req.user ? req.user.id : 'fpo_procurement_officer',
      actorRole: 'fpo_manager',
      action: 'CREATE_FPO_GROUP_POOL',
      targetType: 'GROUP_BUYING_POOL',
      targetId: pool.poolId,
      reason: `Created bulk input procurement pool for ${productName} targeting ${targetTons} Tons`,
    });

    return res.status(201).json({ success: true, pool });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const joinPool = (req, res) => {
  try {
    const { id } = req.params;
    const { farmerId = 'usr_farmer_01', farmerName = 'Ramesh Patel', farmerPhone = '+91 98260 11223', committedTons = 2.0 } = req.body;

    const updatedPool = groupBuyingEngine.joinPool(id, {
      farmerId,
      farmerName,
      farmerPhone,
      committedTons,
    });

    db.logAudit({
      actorId: req.user ? req.user.id : farmerId,
      actorRole: 'farmer',
      action: 'JOIN_FPO_GROUP_POOL',
      targetType: 'GROUP_BUYING_POOL',
      targetId: id,
      reason: `Farmer ${farmerName} committed ${committedTons} Tons to bulk pool ${id}`,
    });

    return res.status(200).json({
      success: true,
      pool: updatedPool,
      message: `Successfully joined pool. Current unlocked discount is ${updatedPool.currentDiscountPct}%.`,
    });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const getPools = (req, res) => {
  const pools = groupBuyingEngine.getAllPools();
  return res.status(200).json({ success: true, pools });
};

const getPoolById = (req, res) => {
  const { id } = req.params;
  const pool = groupBuyingEngine.getPoolById(id);
  if (!pool) {
    return res.status(404).json({ success: false, error: 'POOL_NOT_FOUND' });
  }
  return res.status(200).json({ success: true, pool });
};

module.exports = {
  createPool,
  joinPool,
  getPools,
  getPoolById,
};
