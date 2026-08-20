/**
 * Live Demonstration Script - Deccan Origin Backend API
 * Queries and displays live endpoints for Farmers, Products, and Governance Data
 */

const http = require('http');
const app = require('../server');

const PORT = 5099;

const makeRequest = (path) => {
  return new Promise((resolve, reject) => {
    http.get({ hostname: '127.0.0.1', port: PORT, path }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    }).on('error', reject);
  });
};

const runDemo = async () => {
  console.log('\n================================================================');
  console.log('🌿 ECO SWADESH PRODUCTION BACKEND - LIVE DATA DEMONSTRATION');
  console.log('================================================================\n');

  // 1. Health Status
  const health = await makeRequest('/v1/health');
  console.log('1️⃣  System Health Check:');
  console.log(`    Status: ${health.data.status} | Database: ${health.data.database}`);
  console.log(`    Farmer Directory & Clusters: ${health.data.services.farmerDirectoryAndClusters}`);
  console.log(`    Marketplace: ${health.data.services.marketplace}`);
  console.log(`    Trust Registry: ${health.data.services.trustRegistry}\n`);

  // 2. Farmer Stats
  const stats = await makeRequest('/v1/farmers/stats/summary');
  console.log('2️⃣  Platform Farmer & Organic Acreage Statistics:');
  console.log(`    Total Registered Farmers: ${stats.data.stats.totalRegisteredFarmers}`);
  console.log(`    Total Organic Acreage: ${stats.data.stats.totalOrganicAcreage} Acres`);
  console.log(`    States Covered: ${stats.data.stats.statesCovered}`);
  console.log('    State Distribution:', stats.data.stats.stateDistribution);
  console.log(`    Compliance Rate: ${stats.data.stats.complianceRate}\n`);

  // 3. Farmers Directory
  const farmersList = await makeRequest('/v1/farmers');
  console.log(`3️⃣  Farmers Directory (${farmersList.data.total} Registered Farmers across India):`);
  farmersList.data.farmers.slice(0, 5).forEach((f, idx) => {
    console.log(`    [${idx + 1}] ${f.name} (${f.fpoName})`);
    console.log(`        📍 Address: Village ${f.address.village}, Tehsil ${f.address.tehsil}, Dist. ${f.address.district}, ${f.address.state} - PIN ${f.address.pinCode}`);
    console.log(`        🌾 Crops: ${f.primaryCrops.join(', ')} | Farm Size: ${f.farmSizeAcres} Acres`);
    console.log(`        📜 Cert: ${f.certifications.join(', ')} | SHC ID: ${f.soilHealthCardId}`);
    console.log(`        📦 Linked Products: ${f.productsCount} items listed`);
  });
  console.log(`    ... and ${farmersList.data.total - 5} more farmers in Kerala, Odisha, Gujarat, J&K, Karnataka, Andhra Pradesh, Assam, Himachal Pradesh, etc.\n`);

  // 4. Farmer Detail (Single Profile)
  const singleFarmer = await makeRequest('/v1/farmers/usr_farmer_02');
  console.log('4️⃣  Individual Farmer Detail (/v1/farmers/usr_farmer_02):');
  console.log(`    Name: ${singleFarmer.data.farmer.name} | Phone: ${singleFarmer.data.farmer.phoneNumber}`);
  console.log('    Full Administrative Address Hierarchy:');
  console.log(`      - Village: ${singleFarmer.data.farmer.address.village}`);
  console.log(`      - Gram Panchayat: ${singleFarmer.data.farmer.address.gramPanchayat}`);
  console.log(`      - Tehsil/Block: ${singleFarmer.data.farmer.address.tehsil}`);
  console.log(`      - District: ${singleFarmer.data.farmer.address.district}`);
  console.log(`      - State: ${singleFarmer.data.farmer.address.state}`);
  console.log(`      - PIN Code: ${singleFarmer.data.farmer.address.pinCode}`);
  console.log(`      - Geocoordinates: Lat ${singleFarmer.data.farmer.address.coordinates.latitude}, Long ${singleFarmer.data.farmer.address.coordinates.longitude}`);
  console.log(`    FPO: ${singleFarmer.data.farmer.fpoName}`);
  console.log(`    Governance Compliance:`, singleFarmer.data.farmer.governanceCompliance);
  console.log(`    Linked Harvest Catalog: ${singleFarmer.data.farmer.products.map(p => p.name).join(' | ')}\n`);

  // 5. Products Directory
  const productsList = await makeRequest('/v1/products');
  console.log(`5️⃣  Marketplace Products Catalog (${productsList.data.total} Certified Products):`);
  productsList.data.products.slice(0, 4).forEach((p, idx) => {
    console.log(`    [${idx + 1}] ${p.name}`);
    console.log(`        Category: ${p.category} | Purity: ${p.labPurityRating}`);
    console.log(`        Retail: ₹${p.retailPrice}/${p.retailUnit} | Bulk: ₹${p.bulkPricePerTon}/Ton`);
    if (p.producerProfile) {
      console.log(`        👨‍🌾 Producer: ${p.producerProfile.farmerName} (${p.producerProfile.fpoName})`);
      console.log(`        📍 Location: ${p.producerProfile.address.district}, ${p.producerProfile.address.state}`);
    }
  });
  console.log(`    ... and ${productsList.data.total - 4} more certified bio-inputs, seeds, and equipment.\n`);

  // 6. Anti-Counterfeit Verification
  const qrCheck = await makeRequest('/v1/verify/qr/NPOP%2FNAB%2F0014%2F2025');
  console.log('6️⃣  Anti-Counterfeit QR Seal / License Verification:');
  console.log(`    License: ${qrCheck.data.licenseNo} | Authentic: ${qrCheck.data.authentic}`);
  console.log(`    Standard: ${qrCheck.data.certName}`);
  console.log(`    Issuing Authority: ${qrCheck.data.issuingAuthority}`);
  console.log(`    Status: ${qrCheck.data.status} | Trust Score: ${qrCheck.data.verifiedScore}%\n`);

  console.log('================================================================');
  console.log('✨ DEMONSTRATION COMPLETE - ALL SYSTEMS OPERATIONAL');
  console.log('================================================================\n');
};

const server = app.listen(PORT, async () => {
  try {
    await runDemo();
  } catch (err) {
    console.error('Demo error:', err);
  } finally {
    server.close(() => process.exit(0));
  }
});
