/**
 * Concurrent Load & Stress Test Simulation for Checkout, Escrow & Webhooks (Phase 9.4)
 * Simulates high-throughput concurrent buyer transactions and signed webhook confirmations.
 */

const crypto = require('crypto');
const db = require('../config/db');
const paymentsController = require('../controllers/paymentsController');
const ordersController = require('../controllers/ordersController');

function mockReqRes(reqOptions = {}) {
  const req = {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: null,
    ip: '127.0.0.1',
    ...reqOptions,
  };

  let responseData = null;
  let statusCode = 200;

  const res = {
    status(code) {
      statusCode = code;
      return res;
    },
    json(data) {
      responseData = data;
      return res;
    },
    send(data) {
      responseData = data;
      return res;
    },
    get statusCode() {
      return statusCode;
    },
    get data() {
      return responseData;
    },
  };

  return { req, res };
}

async function runCheckoutLoadTest(concurrentUsers = 50) {
  console.log(`[Load Test] Simulating ${concurrentUsers} concurrent checkout & webhook transactions...`);
  const startTime = Date.now();
  let successfulCheckouts = 0;
  let errors = 0;

  const promises = [];

  for (let i = 0; i < concurrentUsers; i++) {
    promises.push(
      (async () => {
        try {
          const validProduct = db.products[0] || { id: 'prod-1' };
          const { req: reqOrder, res: resOrder } = mockReqRes({
            user: { id: `usr_load_buyer_${i}`, name: `Buyer ${i}` },
            body: {
              productId: validProduct.id,
              quantityTons: 2,
              orderMode: 'RETAIL',
            },
          });
          ordersController.createEscrowOrder(reqOrder, resOrder);
          if (resOrder.statusCode !== 201) throw new Error('Order creation failed');

          const orderId = resOrder.data.orderId;

          // 2. Initialize Razorpay order
          const { req: reqRzp, res: resRzp } = mockReqRes({
            body: { orderId, amountINR: 1200 },
          });
          paymentsController.createRazorpayOrder(reqRzp, resRzp);
          if (resRzp.statusCode !== 200) throw new Error('Razorpay order creation failed');

          // 3. Fire signed webhook
          const webhookBody = {
            event: 'payment.captured',
            payload: {
              payment: {
                entity: {
                  id: `pay_load_${i}_${Date.now()}`,
                  amount: 120000,
                  currency: 'INR',
                  notes: { orderId },
                },
              },
            },
          };

          const signature = crypto
            .createHmac('sha256', 'rzp_sec_deccanorigin2026_secret_phrase')
            .update(JSON.stringify(webhookBody))
            .digest('hex');

          const { req: reqHook, res: resHook } = mockReqRes({
            headers: { 'x-razorpay-signature': signature },
            body: webhookBody,
          });

          paymentsController.handleRazorpayWebhook(reqHook, resHook);
          if (resHook.statusCode !== 200) throw new Error('Webhook processing failed');

          successfulCheckouts++;
        } catch (err) {
          errors++;
          console.error(`Transaction ${i} failed:`, err.message);
        }
      })()
    );
  }

  await Promise.all(promises);
  const durationMs = Date.now() - startTime;
  const throughput = Math.round((concurrentUsers / (durationMs / 1000)) * 100) / 100;

  console.log('----------------------------------------------------------------');
  console.log(`[Load Test Results]`);
  console.log(`  Total Simulated Concurrent Users: ${concurrentUsers}`);
  console.log(`  Successful End-to-End Checkouts : ${successfulCheckouts}`);
  console.log(`  Unhandled Errors               : ${errors}`);
  console.log(`  Total Test Duration            : ${durationMs} ms`);
  console.log(`  Simulated Peak Throughput      : ${throughput} req/sec`);
  console.log('----------------------------------------------------------------\n');

  if (errors === 0) {
    console.log('[PASS] Load testing completed with ZERO unhandled errors.');
  } else {
    process.exit(1);
  }
}

runCheckoutLoadTest(100);
