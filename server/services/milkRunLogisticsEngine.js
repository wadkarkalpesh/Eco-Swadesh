/**
 * Eco Swadesh Phase 29: Multi-Farmer LTL (Less-Than-Truckload) Milk-Run Freight Consolidation Engine
 * Combines smaller harvest consignments (e.g. 2-5 tons) from neighboring rural farmers into single
 * dedicated 16-32 ton heavy freight multi-axle trucks, slashing per-ton transport costs by up to 45%.
 */

class MilkRunLogisticsEngine {
  /**
   * Consolidates farmer consignments into an optimized shared heavy freight load
   */
  consolidateMilkRun({
    destinationHub = 'Central Agro Logistics Terminal, Navi Mumbai',
    truckCapacityTons = 20.0,
    consignments = [],
  }) {
    if (!consignments || consignments.length === 0) {
      throw new Error('At least one farmer consignment is required for milk-run freight routing.');
    }

    const totalWeightTons = consignments.reduce((sum, c) => sum + (Number(c.weightTons) || 0), 0);
    const capacityUtilizationPct = Math.min(100, Math.round((totalWeightTons / truckCapacityTons) * 100));

    // Base dedicated freight cost (e.g. ₹36,000 for a 20-ton truck over 400km)
    const baseFullTruckCostINR = 36000;
    const individualDispatchEstTotalINR = consignments.reduce((sum, c) => {
      // Individual mini-trucks cost substantially more per ton (₹3,200/ton vs ₹1,800/ton)
      return sum + c.weightTons * 3200;
    }, 0);

    const consolidatedTotalCostINR = Math.max(18000, baseFullTruckCostINR * (totalWeightTons / truckCapacityTons));
    const totalFarmerSavingsINR = Math.max(0, individualDispatchEstTotalINR - consolidatedTotalCostINR);

    // Apportion cost proportionally by weight
    const apportionedStops = consignments.map((c, idx) => {
      const shareFraction = c.weightTons / totalWeightTons;
      const farmerShareINR = Math.round(consolidatedTotalCostINR * shareFraction);
      const soloCostEstINR = Math.round(c.weightTons * 3200);
      const savingsINR = Math.max(0, soloCostEstINR - farmerShareINR);

      return {
        stopSequence: idx + 1,
        farmerId: c.farmerId || `usr_farmer_${idx + 1}`,
        farmerName: c.farmerName || `Farmer Collective ${idx + 1}`,
        pickupVillage: c.pickupVillage || `Village Cluster ${String.fromCharCode(65 + idx)}`,
        cropName: c.cropName || 'Organic Harvest Consignment',
        weightTons: c.weightTons,
        proportionalFreightCostINR: farmerShareINR,
        savingsVsSoloDispatchINR: savingsINR,
        estimatedPickupTime: `${String(7 + idx * 2).padStart(2, '0')}:30 AM`,
      };
    });

    const routeId = `MILKRUN-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    return {
      routeId,
      truckAllocation: {
        vehicleType: truckCapacityTons > 20 ? '32-Ton Multi-Axle Volvo Heavy Hauler' : '20-Ton Tata Prima Heavy Reefer',
        maxCapacityTons: truckCapacityTons,
        totalLoadedTons: totalWeightTons,
        capacityUtilizationPct: `${capacityUtilizationPct}%`,
        status: totalWeightTons <= truckCapacityTons ? 'OPTIMAL_LOAD_SECURED' : 'OVERLOAD_SPLIT_REQUIRED',
      },
      financialSummary: {
        consolidatedTotalFreightINR: Math.round(consolidatedTotalCostINR),
        individualSoloDispatchCostSumINR: individualDispatchEstTotalINR,
        totalFarmerGroupSavingsINR: totalFarmerSavingsINR,
        savingsPercentage: `${Math.round((totalFarmerSavingsINR / individualDispatchEstTotalINR) * 100)}%`,
      },
      destinationHub,
      stops: apportionedStops,
      ecoImpact: {
        carbonEmissionsSavedKg: Math.round(consignments.length * 140 - 120),
        tripsConsolidatedRatio: `${consignments.length} individual trips -> 1 single dedicated haul`,
      },
      createdAt: new Date().toISOString(),
    };
  }
}

module.exports = new MilkRunLogisticsEngine();
