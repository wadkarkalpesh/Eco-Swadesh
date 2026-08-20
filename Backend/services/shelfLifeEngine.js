/**
 * Cold-Chain Arrhenius Predictive Spoilage & Shelf-Life Watchdog
 * Lead Architect: Senior Cold-Chain Bio-Physicist & Thermal Engineer
 * Implements: Q10 Arrhenius Biological Degradation Kinetics & Excursion Risk Alarms
 */

class ShelfLifeEngine {
  /**
   * Evaluate Biological Shelf-Life Degradation using Arrhenius Kinetics
   * Formula: k(T) = k_ref * (Q10)^((T - T_ref) / 10)
   */
  evaluateShelfLife({
    commodityType = 'BIO_INOCULANT_TRICHODERMA',
    nominalShelfLifeDays = 180,
    referenceTempCelsius = 4.0,
    temperatureReadingsCelsius = [4.2, 5.1, 7.8, 12.4, 22.1, 24.5], // Series with cold-chain break
    exposureHours = 48,
    q10Factor = 2.4,
  }) {
    // Calculate average exposure temperature
    const avgTemp =
      temperatureReadingsCelsius.reduce((sum, t) => sum + t, 0) / temperatureReadingsCelsius.length;

    // Arrhenius Acceleration Multiplier
    const deltaTemp = Math.max(0, avgTemp - referenceTempCelsius);
    const accelerationFactor = Number(Math.pow(q10Factor, deltaTemp / 10).toFixed(2));

    // Equivalent days lost at elevated temperature
    const actualDaysElapsed = exposureHours / 24;
    const equivalentDaysLost = Number((actualDaysElapsed * accelerationFactor).toFixed(1));
    const remainingShelfLifeDays = Math.max(0, Math.round(nominalShelfLifeDays - equivalentDaysLost));
    const integrityPercentage = Number(((remainingShelfLifeDays / nominalShelfLifeDays) * 100).toFixed(1));

    let viabilityStatus = 'OPTIMAL_COLD_CHAIN';
    let recommendation = 'Biological potency is 100% intact. Continue standard distribution.';

    if (integrityPercentage < 50) {
      viabilityStatus = 'CRITICAL_BIO_POTENCY_DEPLETED';
      recommendation = 'Severe thermal excursion detected. Reroute container to nearest cold storage for bio-assay.';
    } else if (integrityPercentage < 80) {
      viabilityStatus = 'MODERATE_ACCELERATED_DECAY';
      recommendation = 'Elevated ambient temperature observed. Prioritize immediate farm application within 14 days.';
    }

    return {
      commodityType,
      nominalShelfLifeDays,
      referenceTempCelsius,
      averageTelemetryTempCelsius: Number(avgTemp.toFixed(1)),
      q10AccelerationFactor: accelerationFactor,
      equivalentDaysLost,
      remainingShelfLifeDays,
      integrityPercentage,
      viabilityStatus,
      recommendation,
      evaluatedAt: new Date().toISOString(),
    };
  }
}

const shelfLifeEngine = new ShelfLifeEngine();

module.exports = shelfLifeEngine;
