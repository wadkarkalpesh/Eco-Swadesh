/**
 * Logistics Controller - Heavy Freight Trucking & IoT Sensor Telemetry
 * Lead Architect: Senior IoT & Supply Chain Engineer
 */

const db = require('../config/db');

/**
 * Get Real-Time Shipment Tracking & IoT Telemetry
 * GET /v1/logistics/tracking/:shipmentId
 */
const getTracking = (req, res) => {
  const { shipmentId } = req.params;
  const shipment = db.findById('shipments', shipmentId);

  if (!shipment) {
    return res.status(404).json({
      success: false,
      error: 'SHIPMENT_NOT_FOUND',
      message: `Shipment '${shipmentId}' not found.`,
    });
  }

  // Simulate subtle real-time IoT sensor telemetry variance
  const telemetry = {
    ...shipment.telemetry,
    temperatureCelsius: Number((shipment.telemetry.temperatureCelsius + (Math.random() * 0.4 - 0.2)).toFixed(1)),
    humidityPct: Number((shipment.telemetry.humidityPct + (Math.random() * 0.6 - 0.3)).toFixed(1)),
    lastUpdated: new Date().toISOString(),
  };

  return res.status(200).json({
    success: true,
    shipmentId: shipment.id,
    orderId: shipment.orderId,
    type: shipment.type,
    title: shipment.title,
    origin: shipment.origin,
    destination: shipment.destination,
    weight: shipment.weight,
    carrier: shipment.carrier,
    status: shipment.status,
    driverName: shipment.driverName,
    driverPhone: shipment.driverPhone,
    vehicleNo: shipment.vehicleNo,
    estDelivery: shipment.estDelivery,
    escrowStatus: shipment.escrowStatus,
    telemetry,
    milestones: shipment.milestones,
  });
};

/**
 * Calculate Direct Freight Quote (Middleman-Free Freight Engine)
 * POST /v1/logistics/calculate-freight
 */
const calculateFreightQuote = (req, res) => {
  const { weightTons = 1, distanceKm = 350, logisticsType = 'HEAVY_FREIGHT' } = req.body;

  let baseRatePerKm = 8.5; // INR per Ton per KM
  let fuelSurchargePct = 0.04;
  let loadingUnloadingFee = 1200;

  if (logisticsType === 'RETAIL_PARCEL') {
    baseRatePerKm = 2.0;
    loadingUnloadingFee = 50;
  }

  const transportCost = Math.round(weightTons * distanceKm * baseRatePerKm);
  const fuelSurcharge = Math.round(transportCost * fuelSurchargePct);
  const totalFreight = transportCost + fuelSurcharge + loadingUnloadingFee;

  return res.status(200).json({
    success: true,
    weightTons,
    distanceKm,
    logisticsType,
    breakdown: {
      transportCost,
      fuelSurcharge,
      loadingUnloadingFee,
      totalFreight,
      middlemanSavingsVsMandi: Math.round(totalFreight * 0.42), // 42% cheaper than broker cartels
    },
  });
};

/**
 * Calculate International Customs Duty & Biosecurity
 * POST /v1/logistics/customs-duty
 */
const calculateCustomsDuty = (req, res) => {
  const {
    cargoValueINR = 500000,
    originCountry = 'India',
    destinationCountry = 'United States',
    weightTons = 10,
    cropType = 'Organic Basmati Rice',
  } = req.body;

  const biosecurityLabFee = 8500;
  const containerOceanFreight = weightTons * 12000;
  const tariffRatePct = destinationCountry === 'United States' ? 0.025 : 0.04; // 2.5% for organic staples
  const importTariff = Math.round(cargoValueINR * tariffRatePct);
  const totalLandedTax = biosecurityLabFee + containerOceanFreight + importTariff;

  return res.status(200).json({
    success: true,
    originCountry,
    destinationCountry,
    weightTons,
    cargoValueINR,
    breakdown: {
      biosecurityLabFee,
      containerOceanFreight,
      importTariff,
      totalLandedTax,
      portInspectionRequired: true,
      apedaPhytosanitaryClearance: 'CLEARED_GREEN_CHANNEL',
    },
  });
};

/**
 * Dispatch Transporter Fleet & Generate Trip Manifest
 * POST /v1/logistics/dispatch
 */
const fleetMatcher = require('../services/fleetMatcher');
const dispatchTransporter = (req, res) => {
  const { tonnage = 10, distanceKm = 420, coldChainRequired = false } = req.body;
  const dispatchManifest = fleetMatcher.matchFleet(tonnage, distanceKm, coldChainRequired);

  db.logAudit({
    actorId: req.user ? req.user.id : 'fleet_dispatcher',
    actorRole: 'logistics_operator',
    action: 'DISPATCH_HEAVY_FLEET',
    targetType: 'FLEET_MANIFEST',
    targetId: dispatchManifest.tripId,
    reason: `Allocated ${dispatchManifest.matchedVehicle.model} for ${tonnage} Tons across ${distanceKm} KM`,
  });

  return res.status(201).json({
    success: true,
    dispatchManifest,
    message: 'Heavy freight truck assigned and driver trip manifest generated.',
  });
};

module.exports = {
  getTracking,
  calculateFreightQuote,
  calculateCustomsDuty,
  dispatchTransporter,
};
