/**
 * Eco Swadesh Phase 15 to 20 Automated Test Suite
 * Validates:
 * 1. Farmer FPO Group-Buying Procurement & Tier Discounts
 * 2. Arrhenius Biological Shelf-Life Degradation Kinetics
 * 3. Multilingual Vernacular Voice Agronomy Synthesizer
 * 4. Alternative Eco Agri-Credit Underwriting (300-900)
 * 5. Satellite GIS Farm Boundary & 30-Meter Buffer Verifier
 */

const http = require('http');
const app = require('../server');

const PORT = 5088;
let server;

const request = (method, path, body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
    if (dataString) {
      reqHeaders['Content-Length'] = Buffer.byteLength(dataString);
    }

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: PORT,
        path,
        method,
        headers: reqHeaders,
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => (responseBody += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(responseBody);
          } catch (e) {
            parsed = responseBody;
          }
          resolve({ status: res.statusCode, body: parsed, headers: res.headers });
        });
      }
    );

    req.on('error', reject);
    if (dataString) req.write(dataString);
    req.end();
  });
};

const runPhase15Tests = async () => {
  console.log('🌾 Running Eco Swadesh Phase 15 to 20 Rural Agri-Tech Automated Test Suite...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  };

  try {
    server = app.listen(PORT);
    await new Promise((r) => setTimeout(r, 200));

    // 1. FPO Group-Buying: Create Pool
    const createPoolRes = await request('POST', '/v1/procurement/group-pools/create', {
      title: 'Ujjain Farmer Collective Bio-NPK 50 Ton Wholesale Pool',
      productId: 'prod-1',
      productName: 'Bio-Active NPK Liquid Organic Fertilizer',
      retailPricePerLiterINR: 450,
      targetTons: 50.0,
      deliveryDepot: 'Ujjain Central Cooperative Cold Depot',
    });
    assert(
      createPoolRes.status === 201 && createPoolRes.body.pool.poolId.startsWith('pool_'),
      '1. FPO Procurement - Group-Buying Bulk Pool Creation'
    );

    // 2. FPO Group-Buying: Join Pool & Unlock 25% Discount Tier
    const joinPoolRes = await request(
      'POST',
      `/v1/procurement/group-pools/${createPoolRes.body.pool.poolId}/join`,
      {
        farmerId: 'usr_farmer_02',
        farmerName: 'Baldev Singh',
        committedTons: 16.0,
      }
    );
    assert(
      joinPoolRes.status === 200 && joinPoolRes.body.pool.currentDiscountPct === 25,
      '2. FPO Procurement - Tier Discount Progression (25% Tier Unlocked)'
    );

    // 3. FPO Group-Buying: List All Active Pools
    const listPoolsRes = await request('GET', '/v1/procurement/group-pools');
    assert(
      listPoolsRes.status === 200 && listPoolsRes.body.pools.length >= 2,
      '3. FPO Procurement - Active Multi-District Pool Registry'
    );

    // 4. Cold-Chain: Arrhenius Shelf-Life Degradation Model
    const shelfLifeRes = await request('POST', '/v1/logistics/shelf-life/evaluate', {
      commodityType: 'BIO_INOCULANT_BEAUVERIA',
      nominalShelfLifeDays: 180,
      referenceTempCelsius: 4.0,
      temperatureReadingsCelsius: [4.5, 4.8, 5.0, 4.2], // Optimal cold chain
      exposureHours: 48,
    });
    assert(
      shelfLifeRes.status === 200 && shelfLifeRes.body.shelfLifeReport.viabilityStatus === 'OPTIMAL_COLD_CHAIN',
      '4. Cold-Chain - Arrhenius Q10 Kinetics (Potency Preserved at 4°C)'
    );

    // 5. Cold-Chain: Severe Thermal Excursion Degradation Alarm
    const excursionRes = await request('POST', '/v1/logistics/shelf-life/evaluate', {
      commodityType: 'BIO_INOCULANT_TRICHODERMA',
      nominalShelfLifeDays: 90,
      referenceTempCelsius: 4.0,
      temperatureReadingsCelsius: [28.5, 31.0, 33.2, 30.5], // Severe failure
      exposureHours: 120,
    });
    assert(
      excursionRes.status === 200 && excursionRes.body.shelfLifeReport.integrityPercentage < 50,
      '5. Cold-Chain - Thermal Excursion Decay Alarm (<50% Integrity)'
    );

    // 6. Vernacular Voice: Hindi Speech Advisory Synthesis
    const hindiVoice = await request('POST', '/v1/ai/voice/voice-advisory', {
      langCode: 'hi',
      cropName: 'tomato',
      diseaseDetected: 'Early Bacterial Blight',
    });
    assert(
      hindiVoice.status === 200 && hindiVoice.body.speechScript.includes('नमस्ते किसान भाई'),
      '6. AI Voice - Hindi Agronomy Speech & Acoustic Script'
    );

    // 7. Vernacular Voice: Punjabi Speech Advisory Synthesis
    const punjabiVoice = await request('POST', '/v1/ai/voice/voice-advisory', {
      langCode: 'pa',
      cropName: 'wheat',
      diseaseDetected: 'Brown Rust',
    });
    assert(
      punjabiVoice.status === 200 && punjabiVoice.body.speechScript.includes('ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ'),
      '7. AI Voice - Punjabi Agronomy Audio Dispatch'
    );

    // 8. Agri-Credit: Alternative Credit Rating Calculation (300-900)
    const creditRes = await request('POST', '/v1/credit/farmer-score', {
      farmerId: 'usr_farmer_patel',
      farmerName: 'Ramesh Patel',
      completedEscrowOrdersCount: 52,
      escrowDefaultDisputeCount: 0,
      labChemicalPurityPct: 99.8,
      annualHarvestTonnage: 45.0,
    });
    assert(
      creditRes.status === 200 && creditRes.body.creditReport.creditScore >= 820,
      '8. Agri-Credit - 300-900 Credit Rating (Prime Organic Borrower 820+)'
    );

    // 9. Agri-Credit: 4% Priority Sector Kisan Loan Eligibility
    const loanOfferRes = await request('GET', `/v1/credit/loan-offers/${creditRes.body.creditReport.farmerId}`);
    assert(
      loanOfferRes.status === 200 && loanOfferRes.body.offers[0].interestRate.includes('4%'),
      '9. Agri-Credit - Subsidized 4% Priority Kisan Credit Facility'
    );

    // 10. Satellite GIS: GeoJSON Parcel Boundary & Buffer Verification
    const gisRes = await request('POST', '/v1/farms/parcels/verify-boundary', {
      farmId: 'farm-sehore-101',
      farmName: 'Patel Bio Heritage Acres',
      ownerName: 'Ramesh Patel',
      nearestChemicalFarmDistanceMeters: 45.0, // Exceeds 30m required buffer
    });
    assert(
      gisRes.status === 200 && gisRes.body.parcelReport.bufferZoneAudit.complianceStatus === 'ORGANIC_BUFFER_VERIFIED_COMPLIANT',
      '10. Satellite GIS - GeoJSON Polygon & 30m Chemical Buffer Compliance'
    );

    // 11. Satellite GIS: Buffer Drift Hazard Detection
    const driftRes = await request('POST', '/v1/farms/parcels/verify-boundary', {
      farmId: 'farm-hazard-02',
      nearestChemicalFarmDistanceMeters: 12.0, // Violates 30m limit
    });
    assert(
      driftRes.status === 200 && driftRes.body.parcelReport.bufferZoneAudit.isCompliant === false,
      '11. Satellite GIS - Chemical Pesticide Buffer Drift Hazard Warning'
    );

    console.log(`\n========================================================================`);
    console.log(`🎯 Phase 15-20 Test Suite Complete: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================================================\n`);
  } catch (err) {
    console.error('Fatal Phase 15 test error:', err);
    failed++;
  } finally {
    if (server) server.close();
    process.exit(failed > 0 ? 1 : 0);
  }
};

runPhase15Tests();
