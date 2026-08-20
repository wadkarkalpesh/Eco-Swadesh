/**
 * Deccan Origin Enterprise Processes & Agri-FinTech Test Suite (Phase 9 to 14)
 * Validates:
 * 1. APEDA / USDA Phytosanitary Export Certificates & Heavy Metal Screening
 * 2. Multi-Mandi APMC Price Aggregator & 30/60/90-Day AI Forecasting
 * 3. Soil Organic Carbon (SOC) Delta & Eco Carbon Credit Registry
 * 4. Heavy Freight Transporter Matching & Trip Manifest Allocation
 * 5. Outbound Enterprise ERP Webhooks with HMAC-SHA256 Signatures
 */

const http = require('http');
const app = require('../server');

const PORT = 5077;
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

const runEnterpriseTests = async () => {
  console.log('🏛️ Running Deccan Origin Enterprise Processes & Agri-FinTech Automated Test Suite...\n');
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

    // 1. Biosecurity: Issue Phytosanitary Export Certificate
    const phytoRes = await request('POST', '/v1/export/phytosanitary/issue', {
      orderId: 'ORD-INTL-2026',
      commodityName: 'Organic Sharbati Wheat',
      destinationCountry: 'United States',
      tonnage: 20.0,
      leadPPM: 0.02,
      cadmiumPPM: 0.01,
    });
    assert(
      phytoRes.status === 201 && phytoRes.body.certificate.certNumber.startsWith('PHYTO-IN-2026-'),
      '1. Biosecurity - APEDA / USDA Phytosanitary Export Certificate Issuance'
    );

    // 2. Biosecurity: Heavy Metal Limit Breach Quarantine Lock
    const breachRes = await request('POST', '/v1/export/phytosanitary/issue', {
      orderId: 'ORD-INTL-CONTAMINATED',
      commodityName: 'Adulterated Grain Batch',
      leadPPM: 0.85, // Exceeds 0.1 PPM max limit
    });
    assert(
      breachRes.status === 422 && breachRes.body.error === 'HEAVY_METAL_EXCURSION',
      '2. Biosecurity - ICP-MS Heavy Metal Excursion Quarantine Lock'
    );

    // 3. Biosecurity: Query Certificate Registry
    const phytoLookup = await request('GET', `/v1/export/phytosanitary/${phytoRes.body.certificate.certNumber}`);
    assert(
      phytoLookup.status === 200 && phytoLookup.body.certificate.issuingAuthority.includes('APEDA'),
      '3. Biosecurity - National Plant Protection Registry Lookup'
    );

    // 4. APMC Mandi: Multi-Mandi Live Rates Query
    const mandiRates = await request('GET', '/v1/mandi/live-rates');
    assert(
      mandiRates.status === 200 && mandiRates.body.totalTrackedMandis >= 10,
      '4. APMC Mandi - Live Price & Daily Arrivals Aggregator Across India'
    );

    // 5. APMC Mandi: 30/60/90-Day AI Price Forecast
    const forecastRes = await request('GET', '/v1/mandi/forecast/wheat');
    assert(
      forecastRes.status === 200 && forecastRes.body.forecast.forecasts.length === 3,
      '5. APMC Mandi - 30/60/90-Day Linear Regression Price Forecaster'
    );

    // 6. Carbon Credit: Soil Organic Carbon Delta Sequestration Audit
    const carbonAudit = await request('POST', '/v1/carbon/calculate-sequestration', {
      landAreaAcres: 50.0,
      baselineSoilOrganicCarbonPct: 0.52,
      measuredSoilOrganicCarbonPct: 1.05,
    });
    assert(
      carbonAudit.status === 200 && carbonAudit.body.sequestrationAudit.co2eSequesteredTons > 100,
      '6. Carbon Markets - Soil Organic Carbon (Delta SOC%) Sequestration Quantifier'
    );

    // 7. Carbon Credit: Mint Verified Eco Carbon Credits
    const mintRes = await request('POST', '/v1/carbon/mint-credits', {
      farmerName: 'Ramesh Patel',
      landAreaAcres: 50.0,
      co2eSequesteredTons: 121.5,
    });
    assert(
      mintRes.status === 201 && mintRes.body.carbonCredit.creditId.startsWith('ECC-2026-'),
      '7. Carbon Markets - Verra-Standard Eco Carbon Credit Minting'
    );

    // 8. Carbon Credit: Corporate ESG Buyer Credit Retirement
    const retireRes = await request('POST', '/v1/carbon/retire', {
      creditId: mintRes.body.carbonCredit.creditId,
      buyerCorporateName: 'Tata Agri International ESG Fund',
    });
    assert(
      retireRes.status === 200 && retireRes.body.retiredCredit.status === 'RETIRED_PERMANENTLY',
      '8. Carbon Markets - Permanent Corporate ESG Credit Retirement'
    );

    // 9. Fleet Logistics: Heavy Freight Truck Transporter Matching
    const fleetRes = await request('POST', '/v1/logistics/dispatch', {
      tonnage: 20.0,
      distanceKm: 550,
      coldChainRequired: true,
    });
    assert(
      fleetRes.status === 201 && fleetRes.body.dispatchManifest.matchedVehicle.model.includes('Tata Signa'),
      '9. Fleet Logistics - Intelligent Heavy Freight Trucker Dispatch Allocation'
    );

    // 10. Enterprise ERP: Webhook Subscription Registration
    const subRes = await request('POST', '/v1/webhooks/subscribe', {
      enterpriseName: 'Nestle Agri Sourcing Odoo ERP',
      targetUrl: 'https://odoo.nestle.com/webhooks/deccanorigin',
      events: ['order.created', 'quality.nabl_certified'],
    });
    assert(
      subRes.status === 201 && subRes.body.subscription.signingSecret.startsWith('sec_wh_'),
      '10. Enterprise ERP - Webhook Subscription & HMAC Secret Generation'
    );

    // 11. Enterprise ERP: HMAC-SHA256 Outbound Broadcast
    const dispatchRes = await request('POST', '/v1/webhooks/test-dispatch', {
      event: 'order.created',
      payload: { orderId: 'ORD-BULK-9900', totalINR: 840000 },
    });
    assert(
      dispatchRes.status === 200 && dispatchRes.body.dispatches.length >= 1,
      '11. Enterprise ERP - HMAC-SHA256 Signed Outbound Event Broadcast'
    );

    console.log(`\n========================================================================`);
    console.log(`🎯 Enterprise Test Suite Complete: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================================================\n`);
  } catch (err) {
    console.error('Fatal enterprise test error:', err);
    failed++;
  } finally {
    if (server) server.close();
    process.exit(failed > 0 ? 1 : 0);
  }
};

runEnterpriseTests();
