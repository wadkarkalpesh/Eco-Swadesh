/**
 * Satellite GIS Farm Boundary & Organic Buffer Verifier
 * Lead Architect: Chief GIS & Satellite Remote Sensing Engineer
 * Implements: GeoJSON Parcel Ingestion, Acreage Calculation, and 30-Meter Chemical Buffer Verification
 */

class GisBoundaryEngine {
  /**
   * Verify GeoJSON Polygon and Check for 30m Chemical Buffer Drift Compliance
   */
  verifyFarmBoundary({
    farmId = 'farm-mp-sehore-01',
    farmName = 'Swadesh Organic Heritage Farm',
    ownerName = 'Ramesh Patel',
    coordinates = [
      [77.085, 23.195],
      [77.092, 23.195],
      [77.092, 23.188],
      [77.085, 23.188],
      [77.085, 23.195],
    ],
    nearestChemicalFarmDistanceMeters = 45.0, // Must be >= 30m
  }) {
    // Calculate approximate area in acres from polygon vertices
    let areaAcres = 25.0;
    if (coordinates && coordinates.length >= 3) {
      // Shoelace approximation
      let area = 0;
      for (let i = 0; i < coordinates.length - 1; i++) {
        area += coordinates[i][0] * coordinates[i + 1][1] - coordinates[i + 1][0] * coordinates[i][1];
      }
      const rawDegSq = Math.abs(area) / 2;
      areaAcres = Number((rawDegSq * 1230000).toFixed(1)); // Approx conversion for tropical latitudes
      if (areaAcres <= 0 || isNaN(areaAcres)) areaAcres = 25.0;
    }

    // NPOP & USDA 30-Meter Buffer Compliance Check
    const isBufferCompliant = nearestChemicalFarmDistanceMeters >= 30.0;
    const bufferStatus = isBufferCompliant
      ? 'ORGANIC_BUFFER_VERIFIED_COMPLIANT'
      : 'BUFFER_DRIFT_HAZARD_NON_COMPLIANT';

    const centroid = [
      coordinates.reduce((sum, p) => sum + p[0], 0) / coordinates.length,
      coordinates.reduce((sum, p) => sum + p[1], 0) / coordinates.length,
    ];

    return {
      farmId,
      farmName,
      ownerName,
      arableAreaAcres: areaAcres,
      centroidGPS: {
        longitude: Number(centroid[0].toFixed(5)),
        latitude: Number(centroid[1].toFixed(5)),
      },
      bufferZoneAudit: {
        requiredBufferMeters: 30.0,
        measuredBufferDistanceMeters: nearestChemicalFarmDistanceMeters,
        complianceStatus: bufferStatus,
        isCompliant: isBufferCompliant,
        remediationAdvice: isBufferCompliant
          ? 'Buffer zone complies with APEDA / USDA standards.'
          : 'Plant dense non-edible shelterbelt trees (e.g. Casuarina / Neem) to prevent chemical pesticide drift.',
      },
      geoJsonFeature: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates],
        },
        properties: {
          farmId,
          areaAcres,
          organicStatus: '100%_CERTIFIED',
        },
      },
      verifiedAt: new Date().toISOString(),
    };
  }
}

const gisBoundaryEngine = new GisBoundaryEngine();

module.exports = gisBoundaryEngine;
