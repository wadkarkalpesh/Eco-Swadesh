/**
 * Deccan Origin Full Enterprise Infrastructure & DLQ Verification Suite
 * Validates Dead-Letter Queues, Topic Event Bus, Schema Migration Runner,
 * and Pre-Harvest Forward Contract Margin Calculations.
 */

const http = require('http');
const app = require('../server');
const dlqDispatcher = require('../services/dlqWebhookDispatcher');
const eventBus = require('../services/eventBus');
const migrationRunner = require('../config/migrationRunner');
const forwardContractEngine = require('../services/forwardContractEngine');

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
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        });
      }
    );

    req.on('error', reject);
    if (dataString) req.write(dataString);
    req.end();
  });
};

const runEnterprisePhasesFullTests = async () => {
  console.log('🏛️ Starting Deccan Origin Advanced Enterprise & DLQ Verification Suite...\n');
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

    // 1. Resilient Webhook Dispatch with Exponential Backoff Retries
    const successfulDispatch = await dlqDispatcher.dispatchWithRetry({
      eventType: 'order.escrow_locked',
      payload: { orderId: 'ORD-2026-9041', grandTotal: 426600 },
      endpoint: 'https://erp.agrocorporation.com/events',
    });
    assert(
      successfulDispatch.status === 'DELIVERED' && successfulDispatch.signature.startsWith('sha256='),
      '1. Webhook Dispatch - HMAC-SHA256 Signed Successful Delivery'
    );

    // 2. Dead-Letter Queue (DLQ) Capture on Failed Endpoint
    const failedDispatch = await dlqDispatcher.dispatchWithRetry({
      eventType: 'order.dispute_filed',
      payload: { orderId: 'ORD-FAIL-900', reason: 'MOISTURE_EXCURSION' },
      endpoint: 'https://fail.invalid-enterprise-erp.com/hook',
    });
    assert(
      failedDispatch.status === 'HELD_IN_DEAD_LETTER_QUEUE' &&
      failedDispatch.attempts === 3 &&
      dlqDispatcher.getDLQMessages().length >= 1,
      '2. DLQ Engine - 3x Exponential Backoff Retries & Dead-Letter Persistence'
    );

    // 3. DLQ REST Inspection Endpoint
    const dlqRes = await request('GET', '/v1/webhooks/dlq');
    assert(
      dlqRes.status === 200 &&
      dlqRes.body.deadLetterQueue &&
      dlqRes.body.deadLetterQueue.length >= 1,
      '3. DLQ API - Inspection Endpoint (/v1/webhooks/dlq)'
    );

    // 4. DLQ Replay Endpoint
    const replayId = failedDispatch.dlqId;
    const replayRes = await request('POST', `/v1/webhooks/dlq/${replayId}/replay`, {
      targetEndpoint: 'https://recovered.enterprise.com/hook',
    });
    assert(
      replayRes.status === 200 &&
      replayRes.body.success === true &&
      replayRes.body.dlqMessage.status === 'REPLAYED_SUCCESSFULLY',
      '4. DLQ API - Dead-Letter Replay & Reconciliation (/v1/webhooks/dlq/:id/replay)'
    );

    // 5. Topic-based Real-Time Event Bus Publishing
    const pubResult = eventBus.publish('mandi.rates', 'PRICE_TICKER_UPDATE', {
      crop: 'wheat',
      modalPricePerQuintal: 4250,
      trend: 'BULLISH',
    });
    assert(
      pubResult.success === true && pubResult.channel === 'mandi.rates' && pubResult.totalEventsPublished >= 1,
      '5. Real-Time Event Bus - Multi-Channel Topic Publishing'
    );

    // 6. Event Bus Stats & Channel Metrics
    const busStats = eventBus.getStats();
    assert(
      typeof busStats.totalEventsPublished === 'number' && busStats.totalEventsPublished >= 1,
      '6. Real-Time Event Bus - Channel Metrics & Connection Stats'
    );

    // 7. Database Migration Runner - DDL Schema Execution
    const migrationResult = await migrationRunner.runAll();
    const migrationStatus = migrationRunner.getStatus();
    assert(
      migrationResult.success === true &&
      migrationStatus.totalExecuted >= 3 &&
      migrationStatus.pendingCount === 0,
      '7. Database Engine - Versioned DDL Schema Migration Runner'
    );

    // 8. Forward Contracts - Margin Calculation & Price Hedging
    const forwardContract = forwardContractEngine.createForwardContract({
      commodityName: 'Organic Durum Wheat',
      tonnage: 50.0,
      lockedPricePerTonINR: 43500,
      buyerName: 'Vedic Flour Mills Global Ltd',
      harvestDeliveryMonth: 'October 2026',
    });
    assert(
      forwardContract.earnestMargin20PctINR === 435000 &&
      forwardContract.totalContractValueINR === 2175000 &&
      forwardContract.status === 'AWAITING_EARNEST_MARGIN_ESCROW',
      '8. Forward FinTech - 20% Pre-Harvest Earnest Margin Lock (₹4.35 Lakh)'
    );

    console.log(`\n======================================================`);
    console.log(`🎯 Enterprise Phases Full Test Run: ${passed} Passed, ${failed} Failed`);
    console.log(`======================================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  } finally {
    if (server) server.close();
  }
};

if (require.main === module) {
  runEnterprisePhasesFullTests();
}

module.exports = runEnterprisePhasesFullTests;
