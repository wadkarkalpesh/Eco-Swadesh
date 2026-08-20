/**
 * Automated Verification Suite for Farmers Directory & Government-Referenced Products API
 */

const http = require('http');
const app = require('../server');

const PORT = 5056;
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

const runFarmersApiTests = async () => {
  console.log('🧪 Starting Deccan Origin Farmers Directory & Agri-Cluster Test Suite...\n');
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
    // 1. Health check includes farmerDirectoryAndClusters
    const healthRes = await request('GET', '/v1/health');
    assert(
      healthRes.status === 200 && healthRes.body.services.farmerDirectoryAndClusters === 'OPERATIONAL',
      'GET /v1/health registers farmerDirectoryAndClusters as OPERATIONAL'
    );

    // 2. GET /v1/farmers lists all registered organic farmers
    const farmersRes = await request('GET', '/v1/farmers');
    assert(
      farmersRes.status === 200 &&
      farmersRes.body.success === true &&
      farmersRes.body.farmers.length >= 15,
      `GET /v1/farmers returns ${farmersRes.body?.farmers?.length || 0} registered certified farmers (Expected >= 15)`
    );

    // 3. Verify farmer postal address structure contains official Indian administrative hierarchy
    const ramesh = farmersRes.body.farmers.find((f) => f.id === 'usr_farmer_01');
    assert(
      ramesh &&
      ramesh.address.village === 'Barkheda Hasan' &&
      ramesh.address.district === 'Sehore' &&
      ramesh.address.state === 'Madhya Pradesh' &&
      ramesh.address.pinCode === '466001' &&
      ramesh.soilHealthCardId === 'SHC-MP-SEH-2025-08912' &&
      ramesh.fpoName.includes('Malwa Narmada'),
      'Farmer usr_farmer_01 has complete Government-verified address and SHC ID'
    );

    // 4. Filter farmers by State
    const meghalayaRes = await request('GET', '/v1/farmers?state=Meghalaya');
    assert(
      meghalayaRes.status === 200 &&
      meghalayaRes.body.farmers.length > 0 &&
      meghalayaRes.body.farmers[0].name === 'Kongthong Synrem' &&
      meghalayaRes.body.farmers[0].address.district === 'West Jaintia Hills',
      'GET /v1/farmers?state=Meghalaya returns Lakadong turmeric farmers in Jaintia Hills'
    );

    // 5. Filter farmers by Crop
    const basmatiRes = await request('GET', '/v1/farmers?crop=Basmati');
    assert(
      basmatiRes.status === 200 &&
      basmatiRes.body.farmers.length > 0 &&
      basmatiRes.body.farmers.some((f) => f.address.state === 'Punjab'),
      'GET /v1/farmers?crop=Basmati filters Punjab Basmati growers'
    );

    // 6. Farmer Detail by ID with verified certifications snapshot
    const farmerDetailRes = await request('GET', '/v1/farmers/usr_farmer_01');
    assert(
      farmerDetailRes.status === 200 &&
      farmerDetailRes.body.success === true &&
      farmerDetailRes.body.farmer.governanceCompliance.soilHealthCardVerified === true &&
      farmerDetailRes.body.farmer.products.length > 0,
      'GET /v1/farmers/:id returns detailed farmer profile with linked certified products'
    );

    // 7. Farmer summary statistics
    const statsRes = await request('GET', '/v1/farmers/stats/summary');
    assert(
      statsRes.status === 200 &&
      statsRes.body.success === true &&
      statsRes.body.stats.totalOrganicAcreage > 100 &&
      statsRes.body.stats.statesCovered >= 10,
      `GET /v1/farmers/stats/summary returns aggregated acreage (${statsRes.body?.stats?.totalOrganicAcreage} acres across ${statsRes.body?.stats?.statesCovered} states)`
    );

    // 8. GET /v1/products returns rich catalog with producerProfile attached
    const productsRes = await request('GET', '/v1/products');
    assert(
      productsRes.status === 200 &&
      productsRes.body.success === true &&
      productsRes.body.products.length >= 20,
      `GET /v1/products returns ${productsRes.body?.products?.length || 0} certified items across categories (Expected >= 20)`
    );

    // 9. Product detail includes producerProfile and government license
    const prodDetailRes = await request('GET', '/v1/products/prod-1');
    assert(
      prodDetailRes.status === 200 &&
      prodDetailRes.body.product.producerProfile &&
      prodDetailRes.body.product.producerProfile.farmerName === 'Ramesh Patel' &&
      prodDetailRes.body.product.producerProfile.address.district === 'Sehore',
      'GET /v1/products/:id resolves and attaches producer farmer profile and address'
    );

    // 10. APEDA NPOP Anti-Counterfeit Verification
    const certVerifyRes = await request('GET', '/v1/verify/qr/NPOP%2FNAB%2F0014%2F2025');
    assert(
      certVerifyRes.status === 200 &&
      certVerifyRes.body.authentic === true &&
      certVerifyRes.body.issuingAuthority.includes('APEDA'),
      'GET /v1/verify/qr/:sealCode authenticates APEDA National Organic license'
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
  await runFarmersApiTests();
  server.close(() => process.exit(process.exitCode || 0));
});
