/**
 * Eco Swadesh Backend API Automated Test Suite
 * Validates all 8 domain modules and 30+ endpoints for functional correctness.
 */

const http = require('http');
const app = require('../server');

const PORT = 5055;
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

const runAllTests = async () => {
  console.log('🧪 Starting Eco Swadesh Backend API Automated Verification Suite...\n');
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

    // 1. Health Verification
    const health = await request('GET', '/v1/health');
    assert(health.status === 200 && health.body.status === 'UP', '1. System Health Check');

    // 2. Auth Module - Send OTP
    const otpRes = await request('POST', '/v1/auth/send-otp', {
      phoneNumber: '+919876543210',
      countryCode: 'IN',
    });
    assert(otpRes.status === 200 && otpRes.body.otpSessionId, '2. Auth - Send Phone OTP');

    // 3. Auth Module - Verify OTP & Receive JWT
    const verifyRes = await request('POST', '/v1/auth/verify-otp', {
      otpSessionId: otpRes.body.otpSessionId,
      otpCode: '123456',
      persona: 'farmer',
    });
    assert(verifyRes.status === 200 && verifyRes.body.token, '3. Auth - Verify OTP & Sign JWT');
    authToken = verifyRes.body.token;

    // 4. Auth Module - Get Authenticated Profile
    const meRes = await request('GET', '/v1/auth/me');
    assert(meRes.status === 200 && meRes.body.user.persona === 'farmer', '4. Auth - Get Profile /me');

    // 5. Auth Module - Switch Persona
    const switchRes = await request('PUT', '/v1/auth/switch-persona', { persona: 'bulkBuyer' });
    assert(switchRes.status === 200 && switchRes.body.user.persona === 'bulkBuyer', '5. Auth - Switch Persona to bulkBuyer');

    // 5.1 Auth Module - Update Personal Information & Onboarding Profile
    const profileRes = await request('PUT', '/v1/auth/profile', {
      name: 'Ramesh Patel',
      email: 'ramesh.patel@ecoswadesh.com',
      state: 'Madhya Pradesh',
      district: 'Ujjain',
    });
    assert(profileRes.status === 200 && profileRes.body.user.onboardingCompleted === true, '5.1 Auth - Update Personal Profile & Complete Onboarding');

    // 6. Products Module - List Products with Filter
    const prodsRes = await request('GET', '/v1/products?category=fertilizers');
    assert(prodsRes.status === 200 && prodsRes.body.products.length > 0, '6. Marketplace - List & Filter Products');

    // 7. Products Module - Commodity Price Tickers
    const trendsRes = await request('GET', '/v1/products/commodity-trends');
    assert(trendsRes.status === 200 && trendsRes.body.trends.length > 0, '7. Marketplace - Commodity Trends');

    // 8. Products Module - Product Detail
    const prodDetail = await request('GET', '/v1/products/prod-1');
    assert(prodDetail.status === 200 && prodDetail.body.product.id === 'prod-1', '8. Marketplace - Product Detail');

    // 9. Products Module - Create Listing
    const newProd = await request('POST', '/v1/products', {
      name: 'Organic Mustard Oil Cold Pressed 500ml',
      category: 'fertilizers',
      retailPrice: 280,
      bulkPricePerTon: 95000,
    });
    assert(newProd.status === 201 && newProd.body.productId, '9. Marketplace - Publish New Listing');

    // 10. Orders Module - Create Escrow Order
    const orderRes = await request('POST', '/v1/orders/escrow', {
      items: [{ productId: 'prod-2', isBulk: true, quantityTons: 10, agreedPricePerTon: 42000 }],
      logisticsType: 'HEAVY_FREIGHT',
      shippingAddress: 'Central Agro Hub, Pune, IN',
    });
    assert(orderRes.status === 201 && orderRes.body.escrowStatus === 'HELD_IN_ESCROW_POOL', '10. Escrow - Lock Funds in Escrow Pool');
    const createdOrderId = orderRes.body.orderId;
    const createdShipmentId = orderRes.body.shipmentId;

    // 11. Orders Module - List Orders
    const ordersList = await request('GET', '/v1/orders');
    assert(ordersList.status === 200 && ordersList.body.orders.length > 0, '11. Orders - List User Orders');

    // 12. Orders Module - Order Invoice Details
    const orderDetail = await request('GET', `/v1/orders/${createdOrderId}`);
    assert(orderDetail.status === 200 && orderDetail.body.invoice.grandTotal > 0, '12. Orders - Tax Invoice Breakdown');

    // 13. Orders Module - Release Escrow Funds
    const releaseRes = await request('POST', `/v1/orders/${createdOrderId}/release-escrow`);
    assert(releaseRes.status === 200 && releaseRes.body.escrowStatus === 'RELEASED_TO_SELLER', '13. Escrow - Release Funds to Seller');

    // 14. Logistics Module - Real-Time Tracking & IoT Telemetry
    const trackRes = await request('GET', `/v1/logistics/tracking/${createdShipmentId}`);
    assert(trackRes.status === 200 && trackRes.body.telemetry.temperatureCelsius !== undefined, '14. Logistics - IoT Sensor Telemetry');

    // 15. Logistics Module - Freight Calculator
    const freightRes = await request('POST', '/v1/logistics/calculate-freight', {
      weightTons: 15,
      distanceKm: 420,
    });
    assert(freightRes.status === 200 && freightRes.body.breakdown.totalFreight > 0, '15. Logistics - Freight Quote Estimator');

    // 16. Logistics Module - Customs Duty Calculator
    const customsRes = await request('POST', '/v1/logistics/customs-duty', {
      cargoValueINR: 800000,
      weightTons: 10,
    });
    assert(customsRes.status === 200 && customsRes.body.breakdown.totalLandedTax > 0, '16. Logistics - Customs & Biosecurity Tariff');

    // 17. Trust Module - Verify Anti-Counterfeit QR Seal
    const qrRes = await request('GET', '/v1/verify/qr/NPOP%2FNAB%2F0014%2F2025');
    assert(qrRes.status === 200 && qrRes.body.authentic === true, '17. Trust - Anti-Counterfeit QR Seal Verification');

    // 18. Trust Module - Public Organic Certificate Registry
    const certsRes = await request('GET', '/v1/trust/certifications');
    assert(certsRes.status === 200 && certsRes.body.certifications.length > 0, '18. Trust - Searchable Certificate Registry');

    // 19. Trust Module - Upload New Certificate
    const uploadCert = await request('POST', '/v1/trust/upload-certificate', {
      name: 'Gujarat Agro Organic Board Certificate',
      issuingAuthority: 'State Agriculture Dept',
      licenseNo: 'GJ-AGRI-ORG-2026',
    });
    assert(uploadCert.status === 201 && uploadCert.body.certificateId, '19. Trust - Submit Certificate for Moderation');

    // 20. Trust Module - Moderate Certificate
    const modRes = await request('PUT', `/v1/trust/moderate/${uploadCert.body.certificateId}`, { status: 'ACTIVE', verifiedScore: 99 });
    assert(modRes.status === 200 && modRes.body.certificate.status === 'ACTIVE', '20. Trust - Moderate & Audit Certificate');

    // 21. AI Doctor - Leaf Disease Diagnosis
    const aiDiag = await request('POST', '/v1/ai/diagnose-leaf', {
      cropType: 'cotton',
      imageBase64: 'sample_cotton_leaf_base64_data',
    });
    assert(aiDiag.status === 200 && aiDiag.body.organicRecipes.length > 0, '21. AI Doctor - Crop Leaf Disease Diagnosis');

    // 22. AI Doctor - Soil Dosage Calculator
    const soilCalc = await request('POST', '/v1/ai/soil-calculator', {
      crop: 'wheat',
      farmAcreage: 10,
    });
    assert(soilCalc.status === 200 && soilCalc.body.dosage.bioNpkLiters === 40, '22. AI Doctor - Soil NPK & Compost Dosage');

    // 23. AI Doctor - Digital Soil Health Lab Reports
    const soilReps = await request('GET', '/v1/ai/soil-reports');
    assert(soilReps.status === 200 && soilReps.body.reports.length > 0, '23. AI Doctor - Soil Health Lab Reports');

    // 24. Community - Discussions Feed
    const commPosts = await request('GET', '/v1/community/posts');
    assert(commPosts.status === 200 && commPosts.body.posts.length > 0, '24. Community - Discussions Knowledge Feed');

    // 25. Community - Create Discussion Post
    const newPost = await request('POST', '/v1/community/posts', {
      title: 'Best companion crops for organic Basmati paddy?',
      content: 'Planning to intercrop Azolla to suppress weeds and fix organic nitrogen.',
      tags: ['Paddy', 'Bio-Fertilizer'],
    });
    assert(newPost.status === 201 && newPost.body.post.id, '25. Community - Post Discussion Thread');

    // 26. Community - Upvote Post
    const upRes = await request('POST', `/v1/community/posts/${newPost.body.post.id}/upvote`);
    assert(upRes.status === 200 && upRes.body.upvotes === 1, '26. Community - Upvote Discussion');

    // 27. Community - Book Expert Consultation
    const bookRes = await request('POST', '/v1/community/expert-bookings', {
      expertId: 'usr_expert_01',
      farmArea: '10 Acres',
      cropIssue: 'Soil microbial rejuvenation',
    });
    assert(bookRes.status === 201 && bookRes.body.booking.id, '27. Community - Schedule Expert 1-on-1 Consultation');

    // 28. Admin Module - Overview & Financial Metrics
    const adminOver = await request('GET', '/v1/admin/overview');
    assert(adminOver.status === 200 && adminOver.body.metrics.totalMonthlyRevenueINR > 0, '28. Admin - Revenue & Tonnage Metrics');

    // 29. Admin Module - Immutable Audit Logs (FR-11)
    const auditRes = await request('GET', '/v1/admin/audit-logs');
    assert(auditRes.status === 200 && auditRes.body.auditLogs.length > 0, '29. Admin - Audit Log Compliance (FR-11)');

    // 30. Admin Module - Quality Variance Disputes
    const dispRes = await request('GET', '/v1/admin/disputes');
    assert(dispRes.status === 200 && dispRes.body.disputes.length > 0, '30. Admin - Quality Disputes & Retesting');

    // 31. Admin Module - Settle Dispute & Apportion Escrow
    const resolveRes = await request('POST', '/v1/admin/disputes/disp-901/resolve', {
      resolution: 'PARTIAL_SETTLEMENT',
      notes: 'Lab re-test showed 12.8% moisture; 50% discount agreed.',
    });
    assert(resolveRes.status === 200 && resolveRes.body.dispute.status === 'RESOLVED', '31. Admin - Resolve Dispute & Apportion Escrow');

    console.log(`\n======================================================`);
    console.log(`🎯 Test Run Completed: ${passed} Passed, ${failed} Failed`);
    console.log(`======================================================\n`);
  } catch (err) {
    console.error('Fatal test error:', err);
    failed++;
  } finally {
    if (server) server.close();
    process.exit(failed > 0 ? 1 : 0);
  }
};

runAllTests();
