/**
 * Deccan Origin Phases 26 to 30 Automated Test Suite
 * Validates:
 * 1. Phase 26: Cryptographic Blockchain/Merkle Ledger Proofs & Chain Verifier
 * 2. Phase 27: APEDA / NPOP Electronic Phytosanitary Field Inspection Dispatch & Geo-Stamping
 * 3. Phase 28: Micro-Climate Predictive Agronomy Hazard Forecaster (Fungal Spores, Frost, Heat)
 * 4. Phase 29: Multi-Farmer LTL Milk-Run Shared Freight Route Optimizer
 * 5. Phase 30: System Health Telemetry Verification
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
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );

    req.on('error', reject);
    if (dataString) req.write(dataString);
    req.end();
  });
};

const runPhase26to30Tests = async () => {
  console.log('⛓️ Running Deccan Origin Phases 26 to 30 Enterprise Test Suite...\n');
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

    // 1. Health check includes new services
    const health = await request('GET', '/v1/health');
    assert(
      health.status === 200 &&
      health.body.services.cryptographicMerkleLedgerProofs === 'OPERATIONAL' &&
      health.body.services.multiFarmerLtlMilkRunOptimizer === 'OPERATIONAL',
      '1. Health Telemetry - Phases 26 to 30 Operational Verification'
    );

    // 2. Mint Blockchain Merkle Proof Block
    const mintRes = await request('POST', '/v1/ledger/proof/generate', {
      action: 'ESCROW_PAYOUT_SETTLED_TO_FARMER',
      entityId: 'ORD-2026-9041',
      entityType: 'ESCROW_SETTLEMENT',
      actorId: 'SMART_CONTRACT_ESCROW_RELEASE_NODE',
      metadata: {
        payoutAmountINR: 420000,
        farmerBeneficiary: 'Ramesh Patel',
        labSealHash: 'SEAL-2026-NABL-9041',
      },
    });
    assert(
      mintRes.status === 201 &&
      mintRes.body.proofBlock.blockHash &&
      mintRes.body.proofBlock.blockHash.startsWith('0x'),
      '2. Phase 26: Ledger - Mint Cryptographic SHA-256 Merkle Proof Block'
    );
    const createdBlockHash = mintRes.body.proofBlock.blockHash;

    // 3. Verify Blockchain Proof by Hash
    const verifyRes = await request('GET', `/v1/ledger/proof/${createdBlockHash}`);
    assert(
      verifyRes.status === 200 &&
      verifyRes.body.verified === true &&
      verifyRes.body.block.entityId === 'ORD-2026-9041',
      '3. Phase 26: Ledger - Verify Cryptographic Proof on Immutable Chain'
    );

    // 4. Query Chain Audit Trail
    const auditRes = await request('GET', '/v1/ledger/proof/audit-trail');
    assert(
      auditRes.status === 200 && auditRes.body.auditTrail.length >= 2,
      '4. Phase 26: Ledger - Query Immutable Audit Trail Blocks'
    );

    // 5. Dispatch Electronic Phytosanitary Inspection
    const inspDispatch = await request('POST', '/v1/inspections/dispatch', {
      farmName: 'Indore Bio Agri Cooperative Hub',
      farmerId: 'usr_farmer_02',
      cropType: 'Organic Basmati Paddy',
      farmAcreage: 40.0,
      latitude: 22.7196,
      longitude: 75.8577,
    });
    assert(
      inspDispatch.status === 201 &&
      inspDispatch.body.inspection.inspectionId &&
      inspDispatch.body.inspection.assignedAuditor.name,
      '5. Phase 27: Inspections - Dispatch APEDA/NPOP Auditor with GPS Geo-Stamping'
    );
    const inspectionId = inspDispatch.body.inspection.inspectionId;

    // 6. Complete Inspection Audit
    const inspComplete = await request('POST', `/v1/inspections/${inspectionId}/complete`, {
      checklistUpdates: { syntheticPesticideAbsence: 'ZERO_RESIDUE_CONFIRMED' },
      auditorNotes: 'Paddy crop meets 100% NPOP chemical-free standards.',
    });
    assert(
      inspComplete.status === 200 &&
      inspComplete.body.inspection.status === 'COMPLETED_100%_ORGANIC_PASSED',
      '6. Phase 27: Inspections - Finalize Digital Phytosanitary Field Audit'
    );

    // 7. Micro-Climate Risk Forecaster (Fungal Spore Risk)
    const fungalRisk = await request('POST', '/v1/ai/micro-climate/forecast-risk', {
      cropType: 'wheat',
      temperatureCelsius: 22.0,
      relativeHumidityPct: 92.0,
      dewPointCelsius: 20.5,
      soilMoisturePct: 50.0,
    });
    assert(
      fungalRisk.status === 200 &&
      fungalRisk.body.assessment.overallRiskLevel === 'HIGH_ALERT' &&
      fungalRisk.body.assessment.identifiedHazards[0].hazardType === 'FUNGAL_SPORE_PROLIFERATION_RISK',
      '7. Phase 28: Micro-Climate - Predict Fungal Spore Hazard & Bio-Intervention Recipe'
    );

    // 8. Micro-Climate Risk Forecaster (Frost Alert)
    const frostRisk = await request('POST', '/v1/ai/micro-climate/forecast-risk', {
      cropType: 'mustard',
      temperatureCelsius: 2.5,
      relativeHumidityPct: 45.0,
    });
    assert(
      frostRisk.status === 200 &&
      frostRisk.body.assessment.overallRiskLevel === 'CRITICAL_ALERT' &&
      frostRisk.body.assessment.identifiedHazards[0].hazardType === 'FROST_CELL_DAMAGE_WARNING',
      '8. Phase 28: Micro-Climate - Sub-4°C Night Frost Alarm & Agro-Fleece Recommendation'
    );

    // 9. LTL Milk-Run Route Optimizer (3 Neighboring Smallholders Pooling 1 Truck)
    const milkRun = await request('POST', '/v1/logistics/milk-run/consolidate', {
      destinationHub: 'Central Organic Milling Terminal, Pune',
      truckCapacityTons: 20.0,
      consignments: [
        { farmerId: 'usr_f1', farmerName: 'Ramesh Patel', pickupVillage: 'Khed Cluster', weightTons: 5.0, cropName: 'Sharbati Wheat' },
        { farmerId: 'usr_f2', farmerName: 'Baldev Singh', pickupVillage: 'Shirur Cluster', weightTons: 8.0, cropName: 'Organic Soybean' },
        { farmerId: 'usr_f3', farmerName: 'Sanjay Deshmukh', pickupVillage: 'Junnar Cluster', weightTons: 6.0, cropName: 'Cold-Pressed Mustard' },
      ],
    });
    assert(
      milkRun.status === 200 &&
      milkRun.body.routePlan.stops.length === 3 &&
      milkRun.body.routePlan.financialSummary.totalFarmerGroupSavingsINR > 0,
      '9. Phase 29: Milk-Run Logistics - Multi-Farmer LTL Freight Consolidation & Savings'
    );

    console.log(`\n========================================================================`);
    console.log(`🎯 Phases 26 to 30 Test Suite Complete: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================================================\n`);
  } catch (err) {
    console.error('Fatal test error:', err);
    failed++;
  } finally {
    if (server) server.close();
    process.exit(failed > 0 ? 1 : 0);
  }
};

runPhase26to30Tests();
