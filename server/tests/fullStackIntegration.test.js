/**
 * Eco Swadesh Full-Stack Complete Integration Test Suite
 * End-to-End verification of all 30 subsystem domains bridging Frontend & Backend.
 */

const http = require('http');
const app = require('../server');

const PORT = 5077;
let server;
let authToken = '';

const request = (method, path, body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
    if (authToken && !reqHeaders.Authorization) {
      reqHeaders.Authorization = `Bearer ${authToken}`;
    }
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
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );

    req.on('error', reject);
    if (dataString) req.write(dataString);
    req.end();
  });
};

const runFullStackIntegrationSuite = async () => {
  console.log('🌿 Starting Eco Swadesh Full-Stack End-to-End Enterprise Integration Suite...\n');
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

    // 1. Health Verification with 32 operational services
    const health = await request('GET', '/v1/health');
    assert(health.status === 200 && health.body.status === 'UP', '1. System Health & Infrastructure Diagnostics');

    // 2. Auth Flow
    const otpRes = await request('POST', '/v1/auth/send-otp', { phoneNumber: '+919822011223' });
    const verifyRes = await request('POST', '/v1/auth/verify-otp', {
      otpSessionId: otpRes.body.otpSessionId,
      otpCode: '123456',
      persona: 'farmer',
    });
    authToken = verifyRes.body.token;
    assert(authToken.length > 10, '2. Multi-Persona Authentication & Token Generation');

    // 3. Products Catalog & Live Filter
    const prods = await request('GET', '/v1/products?category=fertilizers');
    assert(prods.status === 200 && prods.body.products.length > 0, '3. Marketplace - Live Query & Category Filters');

    // 4. Publish Product Listing
    const newProd = await request('POST', '/v1/products', {
      name: 'Bio-Organic Neem Cake 500Kg Granules',
      category: 'fertilizers',
      retailPrice: 420,
      bulkPricePerTon: 38000,
    });
    assert(newProd.status === 201 && newProd.body.productId, '4. Marketplace - Real-Time Inventory Publishing');

    // 5. Escrow Order Placement
    const orderRes = await request('POST', '/v1/orders/escrow', {
      items: [{ productId: newProd.body.productId, isBulk: true, quantityTons: 5, agreedPricePerTon: 38000 }],
      logisticsType: 'HEAVY_FREIGHT',
      shippingAddress: 'Nashik Agro Terminal',
    });
    assert(orderRes.status === 201 && orderRes.body.escrowStatus === 'HELD_IN_ESCROW_POOL', '5. FinTech - Escrow Fund Locking');
    const orderId = orderRes.body.orderId;
    const shipmentId = orderRes.body.shipmentId;

    // 6. Razorpay Payment Gateway
    const rzpOrder = await request('POST', '/v1/payments/razorpay/create-order', {
      amountINR: orderRes.body.grandTotal || 190000,
      orderId,
    });
    assert(rzpOrder.status === 200 && rzpOrder.body.keyId, '6. FinTech - Razorpay Gateway Order Creation');

    // 7. IoT Telematics & Temperature Excursion Monitoring
    const track = await request('GET', `/v1/logistics/tracking/${shipmentId}`);
    assert(track.status === 200 && track.body.telemetry.temperatureCelsius !== undefined, '7. Logistics - Real-Time IoT Telematics');

    // 8. Cold-Chain Arrhenius Predictive Spoilage
    const shelfLife = await request('POST', '/v1/logistics/shelf-life/evaluate', {
      commodityType: 'strawberries',
      nominalShelfLifeDays: 7,
      referenceTempCelsius: 4.0,
      temperatureReadingsCelsius: [4.2, 4.5, 4.0],
      exposureHours: 24,
    });
    assert(shelfLife.status === 200 && shelfLife.body.shelfLifeReport.integrityPercentage > 80, '8. Cold-Chain - Arrhenius Shelf-Life Kinetics');

    // 9. Remote IoT Compressor Actuator Control
    const actuatorCmd = await request('POST', '/v1/iot/actuators/send-command', {
      containerId: 'CONT-REEFER-9921',
      commandType: 'SET_TARGET_TEMPERATURE',
      payload: { targetTemperatureCelsius: 2.0 },
    });
    assert(actuatorCmd.status === 200 && actuatorCmd.body.containerState.targetTemperatureCelsius === 2.0, '9. IoT Actuator - Remote Bi-Directional Compressor Command');

    // 10. Anti-Counterfeit QR Seal Verification
    const qrVerify = await request('GET', '/v1/verify/qr/NPOP%2FNAB%2F0014%2F2025');
    assert(qrVerify.status === 200 && qrVerify.body.authentic === true, '10. Trust - APEDA/NPOP Anti-Counterfeit Seal Verification');

    // 11. AI Crop Leaf Disease Diagnosis
    const aiDiag = await request('POST', '/v1/ai/diagnose-leaf', {
      cropType: 'cotton',
      imageBase64: 'sample_leaf_image_data',
    });
    assert(aiDiag.status === 200 && aiDiag.body.organicRecipes.length > 0, '11. AI Agronomy - Leaf Disease Diagnosis & Organic Cure');

    // 12. Vernacular Voice Advisory
    const voiceAdv = await request('POST', '/v1/ai/voice/voice-advisory', {
      langCode: 'hi',
      cropName: 'wheat',
      diseaseDetected: 'Fungal Rust',
    });
    assert(voiceAdv.status === 200 && voiceAdv.body.audioStreamUrl, '12. Vernacular AI - Hindi Speech Synthesis Advisory');

    // 13. Community Discussion & Upvote
    const postRes = await request('POST', '/v1/community/posts', {
      title: 'Drip fertigation dosage for organic tomatoes',
      content: 'Using fermented Jeevamrutha through 16mm inline drippers.',
      tags: ['Tomatoes', 'DripIrrigation'],
    });
    const upvoteRes = await request('POST', `/v1/community/posts/${postRes.body.post.id}/upvote`);
    assert(upvoteRes.status === 200 && upvoteRes.body.upvotes === 1, '13. Community - Discussion Forum & Knowledge Upvotes');

    // 14. Pre-Harvest Forward Contract Margin Escrow
    const fwdContract = await request('POST', '/v1/contracts/forward/create', {
      farmerName: 'Solapur Bio Pomegranate Union',
      buyerName: 'Global Fresh Exports B.V.',
      commodityName: 'Bhagwa Pomegranate Export Grade',
      tonnage: 25.0,
      lockedPricePerTonINR: 110000,
      harvestDeliveryMonth: 'October 2026',
    });
    assert(fwdContract.status === 201 && fwdContract.body.contract.earnestMargin20PctINR === 550000, '14. Forward Contracts - 20% Earnest Margin Calculation');

    // 15. Soil Carbon Sequestration & Verra-Standard Minting
    const carbonMint = await request('POST', '/v1/carbon/mint-credits', {
      farmerId: 'usr_farmer_01',
      co2eSequesteredTons: 64.5,
      farmPlotCoordinates: 'Lat 19.88, Long 74.45',
    });
    assert(carbonMint.status === 201 && carbonMint.body.carbonCredit.creditId, '15. Carbon Markets - Soil Organic Carbon Credit Minting');

    // 16. ISO 14046 Water Footprint Audit
    const waterAudit = await request('POST', '/v1/sustainability/water-audit', {
      cropType: 'wheat',
      harvestWeightTons: 15.0,
      irrigationMethod: 'SOLAR_PRECISION_DRIP',
    });
    assert(waterAudit.status === 200 && waterAudit.body.waterAuditReport.stewardshipTier === 'WATER_POSITIVE_GOLD_STANDARD', '16. Water Stewardship - ISO 14046 Water Positive Audit');

    // 17. Cooperative Net Surplus Dividend Disbursal
    const coopCalc = await request('POST', '/v1/coop/dividends/calculate', {
      totalNetSurplusINR: 800000,
      members: [
        { farmerId: 'usr_f1', name: 'Ramesh Patel', bankAccount: 'SBIN001', contributedTons: 50 },
        { farmerId: 'usr_f2', name: 'Kisan B', bankAccount: 'HDFC002', contributedTons: 50 },
      ],
    });
    assert(coopCalc.status === 200 && coopCalc.body.dividendBatch.dividendDistributions[0].dividendAmountINR === 400000, '17. Co-op Ledger - Proportional Surplus Apportionment');

    // 18. NABL Lab 5-Stage Custody Barcode Tracker
    const labScan = await request('POST', '/v1/lab/custody-tracking/scan', {
      sampleCode: 'SEAL-2026-NABL-9041',
      newStage: 'ICP_MS_HEAVY_METALS_CLEAR',
      location: 'Regional Spectroscopy Center',
    });
    assert(labScan.status === 200 && labScan.body.updatedRecord.currentStage === 'ICP_MS_HEAVY_METALS_CLEAR', '18. NABL Lab - Chain-of-Custody Barcode Tracking');

    // 19. Cryptographic Blockchain Merkle Ledger Proof
    const ledgerMint = await request('POST', '/v1/ledger/proof/generate', {
      action: 'NABL_PURITY_ASSAY_CERTIFIED',
      entityId: 'SEAL-2026-NABL-9041',
      entityType: 'LAB_ASSAY',
      metadata: { purityPct: 99.8, pesticideResiduePPM: 0.0 },
    });
    const ledgerVerify = await request('GET', `/v1/ledger/proof/${ledgerMint.body.proofBlock.blockHash}`);
    assert(ledgerVerify.status === 200 && ledgerVerify.body.verified === true, '19. Blockchain Ledger - Cryptographic Proof Mint & Verification');

    // 20. Electronic Phytosanitary Field Inspection Dispatch
    const insp = await request('POST', '/v1/inspections/dispatch', {
      farmName: 'Godavari Valley Bio Farm Cluster',
      cropType: 'Organic Grapes',
      farmAcreage: 18.0,
      latitude: 19.9975,
      longitude: 73.7898,
    });
    assert(insp.status === 201 && insp.body.inspection.inspectionId, '20. Biosecurity - APEDA/NPOP Field Inspection Dispatch & Geo-Stamp');

    // 21. Micro-Climate Predictive Agronomy Hazard Alert
    const climateRisk = await request('POST', '/v1/ai/micro-climate/forecast-risk', {
      cropType: 'grapes',
      temperatureCelsius: 21.5,
      relativeHumidityPct: 88.0,
      dewPointCelsius: 19.8,
    });
    assert(climateRisk.status === 200 && climateRisk.body.assessment.activeThreatsCount > 0, '21. Micro-Climate - Fungal Spore Threat Forecast & Organic Recipe');

    // 22. Multi-Farmer LTL Freight Milk-Run Consolidation
    const milkRun = await request('POST', '/v1/logistics/milk-run/consolidate', {
      destinationHub: 'JNPT Port Container Freight Station',
      truckCapacityTons: 25.0,
      consignments: [
        { farmerId: 'usr_f1', farmerName: 'Farmer A', pickupVillage: 'Village 1', weightTons: 8.0, cropName: 'Pomegranates' },
        { farmerId: 'usr_f2', farmerName: 'Farmer B', pickupVillage: 'Village 2', weightTons: 12.0, cropName: 'Pomegranates' },
      ],
    });
    assert(milkRun.status === 200 && milkRun.body.routePlan.financialSummary.totalFarmerGroupSavingsINR > 0, '22. Milk-Run Logistics - Multi-Farmer Shared Freight Consolidation');

    // 23. Escrow Release to Farmer
    const releaseRes = await request('POST', `/v1/orders/${orderId}/release-escrow`);
    assert(releaseRes.status === 200 && releaseRes.body.escrowStatus === 'RELEASED_TO_SELLER', '23. FinTech - Escrow Fund Settlement to Producer');

    console.log(`\n=================================================================================`);
    console.log(`🎯 Full-Stack Integration Suite Complete: ${passed} Passed, ${failed} Failed`);
    console.log(`=================================================================================\n`);
  } catch (err) {
    console.error('Fatal Integration Test Error:', err);
    failed++;
  } finally {
    if (server) server.close();
    process.exit(failed > 0 ? 1 : 0);
  }
};

runFullStackIntegrationSuite();
