/**
 * Farmer FPO Group-Buying & Pooled Procurement Engine
 * Lead Architect: Lead Rural Procurement & FPO Commercial Lead
 * Implements: FPO Volume Aggregation, Tiered Wholesale Discounts, and Joint Escrow Pool
 */

// In-memory Group Buying Pool Store
const groupPools = new Map();

// Tiered Manufacturer Discount Matrix
const TIER_DISCOUNTS = [
  { minTons: 50, discountPct: 35, tierName: 'MEGA_FPO_DIRECT_MANUFACTURER' },
  { minTons: 15, discountPct: 25, tierName: 'REGIONAL_COOPERATIVE_TIER' },
  { minTons: 5, discountPct: 15, tierName: 'LOCAL_VILLAGE_CLUSTER_TIER' },
  { minTons: 0, discountPct: 0, tierName: 'RETAIL_BASE_TIER' },
];

class GroupBuyingEngine {
  constructor() {
    // Seed an active FPO pool in Sehore District, Madhya Pradesh
    this.createPool({
      id: 'pool-sehore-neem-101',
      title: 'Sehore District FPO 10,000 PPM Neem Oil Bulk Pool',
      productId: 'prod-3',
      productName: 'Neem-Shield Bio-Pesticide & Cold-Pressed Neem Oil (10,000 PPM)',
      retailPricePerLiterINR: 760,
      targetTons: 20.0,
      currentTons: 14.5,
      deliveryDepot: 'Sehore Central Agro Cooperative Hub, MP',
      deadlineDays: 7,
    });
  }

  /**
   * Create a new Group-Buying Pool
   */
  createPool({
    id,
    title,
    productId,
    productName,
    retailPricePerLiterINR = 760,
    targetTons = 15.0,
    currentTons = 0,
    deliveryDepot = 'Central FPO Village Depot',
    deadlineDays = 14,
  }) {
    const poolId = id || `pool_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const expiresAt = new Date(Date.now() + deadlineDays * 24 * 60 * 60 * 1000).toISOString();

    const pool = {
      poolId,
      title,
      productId,
      productName,
      retailPricePerLiterINR,
      targetTons,
      currentTons,
      participantsCount: currentTons > 0 ? 12 : 0,
      participants: [],
      deliveryDepot,
      status: currentTons >= targetTons ? 'TARGET_TONNAGE_REACHED' : 'RECRUITING_FARMERS',
      currentDiscountPct: this.calculateDiscount(currentTons).discountPct,
      currentTier: this.calculateDiscount(currentTons).tierName,
      effectiveWholesalePriceINR: Math.round(
        retailPricePerLiterINR * (1 - this.calculateDiscount(currentTons).discountPct / 100)
      ),
      expiresAt,
      createdAt: new Date().toISOString(),
    };

    groupPools.set(poolId, pool);
    return pool;
  }

  /**
   * Calculate wholesale discount percentage based on aggregated tonnage
   */
  calculateDiscount(tonnage) {
    for (const tier of TIER_DISCOUNTS) {
      if (tonnage >= tier.minTons) {
        return tier;
      }
    }
    return TIER_DISCOUNTS[TIER_DISCOUNTS.length - 1];
  }

  /**
   * Join an active Group-Buying Pool
   */
  joinPool(poolId, { farmerId, farmerName, farmerPhone, committedTons = 1.5 }) {
    const pool = groupPools.get(poolId);
    if (!pool) {
      throw new Error(`Group-Buying Pool '${poolId}' not found.`);
    }

    pool.currentTons = Number((pool.currentTons + committedTons).toFixed(2));
    pool.participantsCount += 1;
    pool.participants.push({
      farmerId,
      farmerName,
      farmerPhone,
      committedTons,
      joinedAt: new Date().toISOString(),
    });

    const tier = this.calculateDiscount(pool.currentTons);
    pool.currentDiscountPct = tier.discountPct;
    pool.currentTier = tier.tierName;
    pool.effectiveWholesalePriceINR = Math.round(
      pool.retailPricePerLiterINR * (1 - tier.discountPct / 100)
    );

    if (pool.currentTons >= pool.targetTons) {
      pool.status = 'TARGET_TONNAGE_REACHED_READY_FOR_DISPATCH';
    }

    return pool;
  }

  getAllPools() {
    return Array.from(groupPools.values());
  }

  getPoolById(poolId) {
    return groupPools.get(poolId) || null;
  }
}

const groupBuyingEngine = new GroupBuyingEngine();

module.exports = groupBuyingEngine;
