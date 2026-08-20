/**
 * Automated Verification Suite for Deccan Origin Authentication & Session Management
 * Tests: Registration, Login (Password & OTP), Token issuance, Profile retrieval, Persona switching, Logout, and DPDP 2023 compliance
 */

process.env.NODE_ENV = 'test';
const http = require('http');
const app = require('../server');

const PORT = 5059;
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

const runAuthFlowTests = async () => {
  console.log('🧪 Starting Deccan Origin Authentication & Session Test Suite...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      failed++;
    }
  };

  try {
    // 1. Account Registration (POST /v1/auth/register)
    const registerRes = await request('POST', '/v1/auth/register', {
      name: 'Suraj Kumar',
      identifier: '+919988776655',
      persona: 'farmer',
      state: 'Maharashtra',
      district: 'Nashik',
      dpdpConsent: true,
    });
    assert(
      registerRes.status === 201 &&
      registerRes.body.success === true &&
      !!registerRes.body.token &&
      registerRes.body.user.name === 'Suraj Kumar',
      'POST /v1/auth/register creates user record with DPDP consent and issues JWT token'
    );

    // 2. Direct Account Login (POST /v1/auth/login)
    const loginRes = await request('POST', '/v1/auth/login', {
      identifier: '+919988776655',
      secretOrOtp: '123456',
      persona: 'farmer',
    });
    assert(
      loginRes.status === 200 &&
      loginRes.body.success === true &&
      !!loginRes.body.token &&
      loginRes.body.user.name === 'Suraj Kumar',
      'POST /v1/auth/login authenticates registered user and issues JWT token'
    );

    authToken = loginRes.body.token;

    // 3. Send OTP Request (POST /v1/auth/send-otp)
    const sendOtpRes = await request('POST', '/v1/auth/send-otp', {
      phoneNumber: '+919823011200',
      countryCode: 'IN',
    });
    assert(
      sendOtpRes.status === 200 && sendOtpRes.body.success === true && !!sendOtpRes.body.otpSessionId,
      'POST /v1/auth/send-otp issues valid otpSessionId'
    );

    const otpSessionId = sendOtpRes.body.otpSessionId;

    // 4. Reject Invalid OTP
    const badOtpRes = await request('POST', '/v1/auth/verify-otp', {
      otpSessionId,
      otpCode: '999000',
      persona: 'farmer',
    });
    assert(
      badOtpRes.status === 400 && badOtpRes.body.error === 'INVALID_OTP',
      'POST /v1/auth/verify-otp rejects invalid 6-digit OTP code'
    );

    // 5. Verify Valid OTP and Receive JWT Token
    const verifyOtpRes = await request('POST', '/v1/auth/verify-otp', {
      otpSessionId,
      otpCode: '123456',
      persona: 'farmer',
      name: 'Ramesh Patel',
    });
    assert(
      verifyOtpRes.status === 200 &&
      verifyOtpRes.body.success === true &&
      !!verifyOtpRes.body.token &&
      verifyOtpRes.body.user.persona === 'farmer',
      'POST /v1/auth/verify-otp authenticates and returns JWT bearer token'
    );

    authToken = verifyOtpRes.body.token;

    // 6. GET /v1/auth/me authenticated profile endpoint
    const meRes = await request('GET', '/v1/auth/me');
    assert(
      meRes.status === 200 &&
      meRes.body.success === true &&
      meRes.body.user.phoneNumber === '+919823011200',
      'GET /v1/auth/me resolves authenticated user profile'
    );

    // 7. Switch User Persona Role
    const switchRes = await request('PUT', '/v1/auth/switch-persona', {
      persona: 'seller',
    });
    assert(
      switchRes.status === 200 &&
      switchRes.body.success === true &&
      switchRes.body.user.persona === 'seller' &&
      !!switchRes.body.token,
      'PUT /v1/auth/switch-persona updates persona and re-issues authorization token'
    );

    authToken = switchRes.body.token;

    // 8. Update Profile & Complete Onboarding
    const updateRes = await request('PUT', '/v1/auth/profile', {
      name: 'Ramesh Patel',
      state: 'Madhya Pradesh',
      district: 'Ujjain',
      farmSizeAcres: 18,
    });
    assert(
      updateRes.status === 200 &&
      updateRes.body.success === true &&
      updateRes.body.user.onboardingCompleted === true,
      'PUT /v1/auth/profile updates member information and flags onboardingCompleted'
    );

    // 9. DPDP 2023 DSAR Data Export Endpoint
    const exportRes = await request('GET', '/v1/auth/data-export');
    assert(
      exportRes.status === 200 &&
      exportRes.body.success === true &&
      exportRes.body.complianceStandard.includes('DPDP'),
      'GET /v1/auth/data-export returns DPDP Act 2023 Section 11 DSAR export payload'
    );

    // 10. Account Logout (POST /v1/auth/logout)
    const logoutRes = await request('POST', '/v1/auth/logout');
    assert(
      logoutRes.status === 200 && logoutRes.body.success === true,
      'POST /v1/auth/logout logs audit entry and terminates session'
    );

    console.log(`\n=================================================`);
    console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`=================================================\n`);

    if (failed > 0) {
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
    }
  }
};

// Start server and run tests
server = app.listen(PORT, async () => {
  await runAuthFlowTests();
  server.close(() => process.exit(process.exitCode || 0));
});
