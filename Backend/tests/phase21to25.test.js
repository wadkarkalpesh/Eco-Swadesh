/**
 * Deccan Origin Phase 21 to 25 Automated Test Suite
 * Validates:
 * 1. Active IoT Telematics Actuator & Compressor Remote Commands
 * 2. Pre-Harvest Forward Contracts & 20% Earnest Margin Escrow Locks
 * 3. ISO 14046 Water Footprint & Freshwater Stewardship Auditor
 * 4. Cooperative Farmer Shareholder Dividend Apportionment
 * 5. NABL Lab Chain-of-Custody Barcode Scanner (5-Stage Tracking)
 */

const http = require('http');
const app = require('../server');

const PORT = 5099;
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

const runPhase21Tests = async () => {
  console.log('⚡ Running Deccan Origin Phase 21 to 25 Industrial IoT & Forward FinTech Test Suite...\n');
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

    // 1. IoT Actuator: Set Target Temperature
    const tempCmd = await request('POST', '/v1/iot/actuators/send-command', {
      containerId: 'CONT-REEFER-9921',
      commandType: 'SET_TARGET_TEMPERATURE',
      payload: { targetTemperatureCelsius: 3.5 },
    });
    assert(
      tempCmd.status === 200 && tempCmd.body.containerState.targetTemperatureCelsius === 3.5,
      '1. IoT Actuator - Remote Bidirectional Compressor Setpoint (3.5°C)'
    );

    // 2. IoT Actuator: Activate Forced Ventilation
    const ventCmd = await request('POST', '/v1/iot/actuators/send-command', {
      containerId: 'CONT-REEFER-9921',
      commandType: 'ACTIVATE_FORCED_VENTILATION',
    });
    assert(
      ventCmd.status === 200 && ventCmd.body.containerState.ventilationState.includes('FORCED_AIR'),
      '2. IoT Actuator - Forced Air Exchange Defrost & Moisture Evacuation'
    );

    // 3. IoT Actuator: Query Container Status & Execution Logs
    const statusRes = await request('GET', '/v1/iot/actuators/CONT-REEFER-9921/status');
    assert(
      statusRes.status === 200 && statusRes.body.recentCommands.length >= 2,
      '3. IoT Actuator - Remote ECU Command Audit Log Verification'
    );

    // 4. Forward Contracts: Create Pre-Harvest Price Lock Agreement
    const contractRes = await request('POST', '/v1/contracts/forward/create', {
      farmerName: 'Sehore Bio Farmer Collective',
      buyerName: 'Patanjali Organic Sourcing Ltd',
      commodityName: 'Certified Organic Sharbati Wheat',
      tonnage: 50.0,
      lockedPricePerTonINR: 43500,
      harvestDeliveryMonth: 'March 2026',
    });
    assert(
      contractRes.status === 201 && contractRes.body.contract.earnestMargin20PctINR === 435000,
      '4. Forward Contracts - Pre-Harvest 20% Earnest Margin Lock (₹4.35 Lakh)'
    );

    // 5. Forward Contracts: Fund Earnest Margin into Escrow Pool
    const marginFundRes = await request(
      'POST',
      `/v1/contracts/forward/${contractRes.body.contract.contractId}/fund-margin`,
      { transactionProofId: 'pay_rzp_forward_margin_881' }
    );
    assert(
      marginFundRes.status === 200 && marginFundRes.body.contract.status === 'ACTIVE_FORWARD_HEDGE_LOCKED',
      '5. Forward Contracts - Escrow Pool Margin Activation & Price Hedge Lock'
    );

    // 6. Forward Contracts: List Active Forward Hedging Agreements
    const listContractsRes = await request('GET', '/v1/contracts/forward');
    assert(
      listContractsRes.status === 200 && listContractsRes.body.contracts.length >= 1,
      '6. Forward Contracts - Institutional Bulk Buyer Forward Portfolio'
    );

    // 7. Water Footprint: ISO 14046 Freshwater Stewardship Audit
    const waterRes = await request('POST', '/v1/sustainability/water-audit', {
      cropType: 'wheat',
      harvestWeightTons: 10.0,
      irrigationMethod: 'SOLAR_PRECISION_DRIP',
    });
    assert(
      waterRes.status === 200 && waterRes.body.waterAuditReport.waterMetrics.freshwaterSavedMegaliters === 11.3,
      '7. Water Footprint - ISO 14046 / AWARE Index (11.3 Megaliters Saved)'
    );

    // 8. Water Footprint: Gold Standard Badge Verification
    assert(
      waterRes.body.waterAuditReport.stewardshipTier === 'WATER_POSITIVE_GOLD_STANDARD',
      '8. Water Footprint - Water Positive Gold Standard Certification Badge'
    );

    // 9. Cooperative Ledger: Proportional Net Surplus Dividend Calculation
    const coopCalcRes = await request('POST', '/v1/coop/dividends/calculate', {
      totalNetSurplusINR: 1200000,
      members: [
        { farmerId: 'usr_farmer_01', name: 'Ramesh Patel', bankAccount: 'SBIN0011244-9921', contributedTons: 25.0 },
        { farmerId: 'usr_farmer_02', name: 'Baldev Singh', bankAccount: 'PUNB0024410-8812', contributedTons: 35.0 },
        { farmerId: 'usr_farmer_03', name: 'Kisan Cooperative C', bankAccount: 'HDFC0001209-5541', contributedTons: 40.0 },
      ],
    });
    assert(
      coopCalcRes.status === 200 && coopCalcRes.body.dividendBatch.dividendDistributions[0].dividendAmountINR === 300000,
      '9. Cooperative Ledger - Proportional Surplus Dividend Share (₹3.0 Lakh for 25% Share)'
    );

    // 10. Cooperative Ledger: Automated Bank Batch Disbursal
    const coopDisburseRes = await request('POST', '/v1/coop/dividends/disburse', {
      batchId: coopCalcRes.body.dividendBatch.batchId,
      dividendReport: coopCalcRes.body.dividendBatch,
    });
    assert(
      coopDisburseRes.status === 200 && coopDisburseRes.body.disbursement.status === 'FUNDS_CREDITED_TO_FARMER_ACCOUNTS',
      '10. Cooperative Ledger - Direct Benefit Transfer (DBT) Bank Disbursal'
    );

    // 11. NABL Lab Tracking: 5-Stage Custody Barcode Scanner
    const labScanRes = await request('POST', '/v1/lab/custody-tracking/scan', {
      sampleCode: 'SEAL-2026-NABL-9041',
      newStage: 'FINAL_ASSAY_PUBLISHED',
      location: 'Central Mass Spectrometry Chromatography Suite',
      operator: 'Lead Analytical Chemist',
    });
    assert(
      labScanRes.status === 200 && labScanRes.body.updatedRecord.status === '100%_CERTIFIED_ORGANIC_PASSED',
      '11. NABL Lab - 5-Stage Custody Barcode Tracker (Assay Published Pass)'
    );

    console.log(`\n========================================================================`);
    console.log(`🎯 Phase 21-25 Test Suite Complete: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================================================\n`);
  } catch (err) {
    console.error('Fatal Phase 21 test error:', err);
    failed++;
  } finally {
    if (server) server.close();
    process.exit(failed > 0 ? 1 : 0);
  }
};

runPhase21Tests();
