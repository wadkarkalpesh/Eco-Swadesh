/**
 * Deccan Origin Next Phase Automated Verification Suite
 * Validates Prometheus SRE metrics, Redis caching, Rate Limiting,
 * PostgreSQL connection pooling, Security Headers, and DPDP privacy masking.
 */

const http = require('http');
const app = require('../server');
const cache = require('../config/redis');
const postgres = require('../config/postgres');
const { maskPII } = require('../middleware/security');

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
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        });
      }
    );

    req.on('error', reject);
    if (dataString) req.write(dataString);
    req.end();
  });
};

const runNextPhaseTests = async () => {
  console.log('🧪 Starting Next Phase Backend Production Test Suite...\n');
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

    // 1. Prometheus SRE Metrics Scraping Endpoint
    const metricsRes = await request('GET', '/metrics');
    assert(
      metricsRes.status === 200 &&
      typeof metricsRes.body === 'string' &&
      metricsRes.body.includes('http_requests_total') &&
      metricsRes.body.includes('nodejs_heap_used_bytes'),
      '1. Prometheus Metrics Scraping Endpoint (/metrics)'
    );

    // 2. Health Check with Multi-Engine Indicators
    const healthRes = await request('GET', '/v1/health');
    assert(
      healthRes.status === 200 &&
      healthRes.body.cache &&
      healthRes.body.cache.status === 'OPERATIONAL' &&
      healthRes.body.postgres &&
      healthRes.body.postgres.status === 'OPERATIONAL' &&
      healthRes.body.services.prometheusSreMetrics === 'OPERATIONAL',
      '2. Health Check Multi-Engine Status (Redis + PostgreSQL + Metrics)'
    );

    // 3. Security Headers Enforcement (OWASP API Top 10)
    const rootRes = await request('GET', '/');
    assert(
      rootRes.headers['x-content-type-options'] === 'nosniff' &&
      rootRes.headers['x-frame-options'] === 'DENY' &&
      rootRes.headers['strict-transport-security'] !== undefined &&
      rootRes.headers['content-security-policy'] !== undefined,
      '3. OWASP Security Headers (nosniff, DENY, HSTS, CSP)'
    );

    // 4. Rate Limiting Headers on Auth Endpoints
    const otpRes = await request('POST', '/v1/auth/send-otp', {
      phoneNumber: '+919876543210',
      countryCode: 'IN',
    });
    assert(
      otpRes.status === 200 &&
      otpRes.headers['x-ratelimit-limit'] === '10' &&
      otpRes.headers['x-ratelimit-remaining'] !== undefined,
      '4. Token-Bucket Rate Limiter Headers (10 req/min for Auth OTP)'
    );

    // 5. Redis / In-Memory Cache Read, Write & Invalidation
    await cache.set('mandi:wheat:punjab', { pricePerTon: 42000, trend: 'BULLISH' }, 60);
    const cachedItem = await cache.get('mandi:wheat:punjab');
    assert(
      cachedItem && cachedItem.pricePerTon === 42000 && cachedItem.trend === 'BULLISH',
      '5. Redis Cache Key-Value Store & Retrieval'
    );

    // 6. Redis Prefix Invalidation
    await cache.set('certs:apeda:101', { verified: true });
    await cache.set('certs:apeda:102', { verified: true });
    const invalidatedCount = await cache.invalidatePrefix('certs:apeda');
    const lookupAfterInvalidation = await cache.get('certs:apeda:101');
    assert(
      invalidatedCount >= 2 && lookupAfterInvalidation === null,
      '6. Redis Prefix Invalidation (certs:apeda:*)'
    );

    // 7. PostgreSQL ACID Query & Transaction Abstraction
    const queryRes = await postgres.query('SELECT * FROM escrow_contracts WHERE order_id = $1', ['ORD-9901']);
    assert(
      queryRes.rowCount === 1 && queryRes.rows[0].status === 'QUERY_EXECUTED_ACID',
      '7. PostgreSQL Connection Pool & Parameterized Query Abstraction'
    );

    // 8. DPDP Act PII Masking Utility
    const rawUserData = {
      name: 'Ramesh Kumar',
      phoneNumber: '+919876543210',
      email: 'ramesh.farmer@deccanorigin.com',
      aadhaarNo: '1234-5678-9012',
    };
    const maskedUserData = maskPII(rawUserData);
    assert(
      maskedUserData.phoneNumber === '+91******3210' &&
      maskedUserData.email.includes('***@') &&
      !maskedUserData.aadhaarNo &&
      maskedUserData.identityNo === 'XXXX-XXXX-XXXX',
      '8. DPDP Act PII Masking (Phone, Email, Aadhaar Redaction)'
    );

    console.log(`\n======================================================`);
    console.log(`🎯 Next Phase Test Run: ${passed} Passed, ${failed} Failed`);
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
  runNextPhaseTests();
}

module.exports = runNextPhaseTests;
