/**
 * Automated Multi-Category Data & Governance Verification Suite
 * Tests all 5 product categories, 20 farmers, certifications, and live queries.
 */

const http = require('http');
const app = require('../server');

const PORT = 5066;
let server;

const request = (method, path) => {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: PORT,
        path,
        method,
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
    req.end();
  });
};

const runTests = async () => {
  console.log('\n🧪 Starting Multi-Category Comprehensive Verification Suite...\n');
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
    // 1. Category 1: bulkHarvest
    const bulkRes = await request('GET', '/v1/products?category=bulkHarvest');
    assert(
      bulkRes.status === 200 && bulkRes.body.products.length >= 12,
      `Category bulkHarvest contains ${bulkRes.body.products.length} items (Sharbati, Basmati, Saffron, Turmeric, Honey, Khapli, Navara, etc.)`
    );

    // 2. Category 2: fertilizers
    const fertRes = await request('GET', '/v1/products?category=fertilizers');
    assert(
      fertRes.status === 200 && fertRes.body.products.length >= 6,
      `Category fertilizers contains ${fertRes.body.products.length} items (Bio-NPK, Vermicompost, PROM, Seaweed, Bio-Potash, VAM)`
    );

    // 3. Category 3: bioPesticides
    const pestRes = await request('GET', '/v1/products?category=bioPesticides');
    assert(
      pestRes.status === 200 && pestRes.body.products.length >= 5,
      `Category bioPesticides contains ${pestRes.body.products.length} items (Neem-Shield, Trichoderma, Pseudomonas, Beauveria, Dashaparni)`
    );

    // 4. Category 4: seeds
    const seedRes = await request('GET', '/v1/products?category=seeds');
    assert(
      seedRes.status === 200 && seedRes.body.products.length >= 4,
      `Category seeds contains ${seedRes.body.products.length} items (F1 Tomato, Desi Cotton, Ragi GPU-28, Mattu Gulla Brinjal)`
    );

    // 5. Category 5: equipment
    const equipRes = await request('GET', '/v1/products?category=equipment');
    assert(
      equipRes.status === 200 && equipRes.body.products.length >= 5,
      `Category equipment contains ${equipRes.body.products.length} items (Solar Drip, Soil Spectrometer, Shredder, Light Trap, Drone Sprayer)`
    );

    // 6. Total Farmers & Acreage
    const farmerStats = await request('GET', '/v1/farmers/stats/summary');
    assert(
      farmerStats.status === 200 &&
      farmerStats.body.stats.totalRegisteredFarmers >= 20 &&
      farmerStats.body.stats.statesCovered >= 16,
      `Farmer directory covers ${farmerStats.body.stats.totalRegisteredFarmers} farmers across ${farmerStats.body.stats.statesCovered} Indian states (Acreage: ${farmerStats.body.stats.totalOrganicAcreage} acres)`
    );

    // 7. Sikkim Farmer Query
    const sikkimFarmer = await request('GET', '/v1/farmers?state=Sikkim');
    assert(
      sikkimFarmer.status === 200 &&
      sikkimFarmer.body.farmers.length > 0 &&
      sikkimFarmer.body.farmers[0].name === 'Tashi Namgyal' &&
      sikkimFarmer.body.farmers[0].fpoName.includes('Himalayan 100% Organic'),
      'Sikkim organic cluster query resolves Tashi Namgyal with Large Cardamom certification'
    );

    // 8. Bastar Honey Farmer Query
    const bastarFarmer = await request('GET', '/v1/farmers?crop=Honey');
    assert(
      bastarFarmer.status === 200 &&
      bastarFarmer.body.farmers.length > 0 &&
      bastarFarmer.body.farmers.some(f => f.address.state === 'Chhattisgarh'),
      'Crop query "Honey" resolves Bastar tribal forest honey cooperative'
    );

    // 9. Commodity Trends (15+ items)
    const trendsRes = await request('GET', '/v1/products/commodity-trends');
    assert(
      trendsRes.status === 200 && trendsRes.body.trends.length >= 15,
      `Mandi commodity price index tracks ${trendsRes.body.trends.length} real-time benchmarks`
    );

    // 10. Certifications Registry
    const certsRes = await request('GET', '/v1/trust/certifications');
    assert(
      certsRes.status === 200 && certsRes.body.certifications.length >= 10,
      `Trust registry tracks ${certsRes.body.certifications.length} official national and state certifications`
    );

    console.log(`\n======================================================`);
    console.log(`📊 Multi-Category Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`======================================================\n`);

    if (failed > 0) process.exitCode = 1;
  } catch (err) {
    console.error('Test execution error:', err);
    process.exitCode = 1;
  } finally {
    if (server) server.close();
  }
};

server = app.listen(PORT, async () => {
  await runTests();
  server.close(() => process.exit(process.exitCode || 0));
});
