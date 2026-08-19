/**
 * Eco Swadesh Advanced Backend Engines & FinTech Automated Test Suite
 * Validates:
 * 1. Razorpay Orders, Signatures & Webhook Handlers
 * 2. Stripe International Cross-Border Sessions
 * 3. 4-Vector Algorithmic Trust Engine & Expiry Watchdogs
 * 4. Multi-Crop Pathology Matrix & Geo-Climatic Risk Evaluator
 * 5. IoT Temperature Excursions & GST 12-Digit E-Way Bill Simulator
 * 6. NABL Lab Tamper Seals & Automated Escrow Apportionment
 * 7. Real-Time Server-Sent Events (SSE) Stream
 */

const http = require('http');
const app = require('../server');
const trustEngine = require('../services/trustEngine');
const agronomyEngine = require('../services/agronomyEngine');
const telematicsEngine = require('../services/telematicsEngine');
const disputeArbitrationEngine = require('../services/disputeArbitration');
const { eventBus } = require('../services/eventStream');

const PORT = 5066;
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

const runAdvancedTests = async () => {
  console.log('🚀 Running Eco Swadesh Advanced Engines & FinTech Automated Test Suite...\n');
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

    // 1. FinTech: Create Razorpay Order
    const rzpOrderRes = await request('POST', '/v1/payments/razorpay/create-order', {
      amountINR: 426600,
      orderId: 'ORD-2026-9041',
    });
    assert(
      rzpOrderRes.status === 200 && rzpOrderRes.body.order.amount === 42660000,
      '1. FinTech - Razorpay Order Creation (Paise Conversion)'
    );

    // 2. FinTech: Verify Razorpay Payment Signature
    const rzpVerifyRes = await request('POST', '/v1/payments/razorpay/verify', {
      razorpay_order_id: rzpOrderRes.body.order.id,
      razorpay_payment_id: 'pay_992018244_rzp',
      razorpay_signature: 'sig_valid_sha256_mock_hash',
      orderId: 'ORD-2026-9041',
    });
    assert(
      rzpVerifyRes.status === 200 && rzpVerifyRes.body.escrowStatus === 'HELD_IN_ESCROW_POOL',
      '2. FinTech - Razorpay Cryptographic Verification & Escrow Lock'
    );

    // 3. FinTech: Razorpay Webhook Handler
    const rzpWebhookRes = await request(
      'POST',
      '/v1/payments/razorpay/webhook',
      { event: 'payment.captured', payload: { payment: { entity: { id: 'pay_captured_101' } } } },
      { 'x-razorpay-signature': 'sig_webhook_sha256' }
    );
    assert(
      rzpWebhookRes.status === 200 && rzpWebhookRes.body.eventReceived === 'payment.captured',
      '3. FinTech - Server-to-Server Razorpay Webhook Processing'
    );

    // 4. FinTech: International Stripe Checkout Session
    const stripeRes = await request('POST', '/v1/payments/stripe/create-session', {
      amountUSD: 500,
      orderId: 'ORD-INTL-909',
      customerEmail: 'diaspora.buyer@ecoswadesh.com',
    });
    assert(
      stripeRes.status === 200 && stripeRes.body.equivalentINR > 40000,
      '4. FinTech - Stripe Cross-Border Diaspora FX Conversion'
    );

    // 5. Trust Engine: 4-Vector Algorithmic Trust Score
    const goldTrust = trustEngine.calculateTrustScore({
      certType: 'NATIONAL',
      labPurityRating: '99.8%',
      historicalDeliveriesCount: 150,
      failedInspectionsCount: 0,
      disputesCount: 0,
    });
    assert(
      goldTrust.trustScore >= 95 && goldTrust.badgeTier === 'TRUST_VERIFIED_GOLD',
      '5. Trust Engine - 4-Vector Calculation (Gold Tier Badge)'
    );

    // 6. Trust Engine: Cryptographic Proof Hash
    assert(
      goldTrust.verificationProofHash.startsWith('0x') && goldTrust.vectorBreakdown.certificationWeight.score === 99,
      '6. Trust Engine - Digital Cryptographic Verification Hash (0x)'
    );

    // 7. Trust Engine: Expiration Watchdog
    const isExpired = trustEngine.isCertificateValid('2024-01-01');
    const isValid = trustEngine.isCertificateValid('2028-12-31');
    assert(isExpired === false && isValid === true, '7. Trust Engine - Certificate Expiration Watchdog');

    // 8. AI Agronomy: Multi-Crop Pathology Matrix (Paddy / Rice)
    const paddyDiagnosis = agronomyEngine.diagnoseCrop('paddy');
    assert(
      paddyDiagnosis.detectedDisease.includes('Blast') && paddyDiagnosis.organicRecipes.length >= 3,
      '8. AI Agronomy - Multi-Crop Pathology (Paddy / Rice Blast Recipe)'
    );

    // 9. AI Agronomy: Multi-Crop Pathology Matrix (Cotton Whitefly)
    const cottonDiagnosis = agronomyEngine.diagnoseCrop('cotton');
    assert(
      cottonDiagnosis.biologicalInoculant.includes('Beauveria') && cottonDiagnosis.family === 'Malvaceae',
      '9. AI Agronomy - Bio-Inoculant Matrix (Cotton Beauveria bassiana)'
    );

    // 10. AI Agronomy: Geo-Climatic Fungal Risk Assessment
    const climateRisk = agronomyEngine.evaluateGeoClimaticRisk({
      relativeHumidityPct: 82,
      temperatureCelsius: 25,
      season: 'monsoon',
    });
    assert(
      climateRisk.riskAssessment.fungalSporeProliferationRisk === 'CRITICAL_HIGH',
      '10. AI Agronomy - Geo-Climatic Fungal Spore Proliferation Alarm'
    );

    // 11. Logistics Telematics: Sensor Excursion Monitoring
    const tempExcursion = telematicsEngine.evaluateSensorExcursions({
      temperatureCelsius: 29.5,
      humidityPct: 62.0,
      cargoMoisturePct: 13.2,
    });
    assert(
      tempExcursion.sensorStatus === 'ALERT_EXCURSION' && tempExcursion.alerts.length === 2,
      '11. Telematics - IoT Temperature & Moisture Excursion Alarm'
    );

    // 12. Logistics Telematics: GST 12-Digit E-Way Bill Generation
    const ewb = telematicsEngine.generateGSTWaybill({
      orderId: 'ORD-2026-9041',
      distanceKm: 420,
      cargoValueINR: 420000,
      originState: 'Madhya Pradesh',
      destinationState: 'Maharashtra',
    });
    assert(
      ewb.ewbNumber.startsWith('EWB-2026-') && ewb.taxClassification.includes('IGST'),
      '12. Telematics - Simulated 12-Digit GST E-Way Bill (Interstate IGST)'
    );

    // 13. Dispute Arbitration: NABL Tamper-Evident Seal
    const tamperSeal = disputeArbitrationEngine.generateTamperSeal('ORD-2026-8802', 'disp-901');
    assert(
      tamperSeal.sealNumber.startsWith('SEAL-2026-NABL-') && tamperSeal.barcodeDigest.startsWith('0x'),
      '13. Dispute Arbitration - Tamper-Evident NABL Lab Joint Seal'
    );

    // 14. Dispute Arbitration: Moisture Variance Escrow Apportionment
    const moistureSettlement = disputeArbitrationEngine.apportionEscrowOnLabReport({
      orderTotalINR: 420000,
      measuredMoisturePct: 12.8,
      syntheticResiduePPM: 0.0,
    });
    assert(
      moistureSettlement.buyerRefundPct === 10 && moistureSettlement.apportionment.buyerRefundINR === 42000,
      '14. Dispute Arbitration - Moisture Variance Escrow Apportionment'
    );

    // 15. Dispute Arbitration: Synthetic Residue Zero Tolerance
    const penaltySettlement = disputeArbitrationEngine.apportionEscrowOnLabReport({
      orderTotalINR: 420000,
      measuredMoisturePct: 11.5,
      syntheticResiduePPM: 0.05,
    });
    assert(
      penaltySettlement.buyerRefundPct === 100 && penaltySettlement.verdict === 'TOTAL_REFUND_SELLER_PENALTY',
      '15. Dispute Arbitration - Synthetic Residue Zero Tolerance (100% Refund)'
    );

    // 16. Real-Time SSE Stream Handshake & Telemetry Emission
    let receivedEvent = false;
    const sseReq = http.request(
      {
        hostname: '127.0.0.1',
        port: PORT,
        path: '/v1/events/stream',
        method: 'GET',
      },
      (sseRes) => {
        sseRes.on('data', (chunk) => {
          const str = chunk.toString();
          if (str.includes('connected') || str.includes('telemetry') || str.includes('heartbeat')) {
            receivedEvent = true;
          }
        });
      }
    );
    sseReq.end();

    await new Promise((r) => setTimeout(r, 100));
    eventBus.emit('iot:telemetry', { temperatureCelsius: 24.2, humidityPct: 58.0 });
    await new Promise((r) => setTimeout(r, 100));

    assert(receivedEvent === true, '16. Real-Time - Server-Sent Events (SSE) Stream Subscription');

    console.log(`\n========================================================================`);
    console.log(`🎯 Advanced Test Suite Complete: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================================================\n`);
  } catch (err) {
    console.error('Fatal advanced test error:', err);
    failed++;
  } finally {
    if (server) server.close();
    process.exit(failed > 0 ? 1 : 0);
  }
};

runAdvancedTests();
