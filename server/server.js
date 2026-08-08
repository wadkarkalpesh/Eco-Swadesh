/**
 * Eco Swadesh Production Backend API Server
 * Architecture: Node.js / Express / Firebase & PostgreSQL Extensible Architecture
 * Target Lead: Kalpesh Wadkar
 */

const express = require('express');
const cors = require('cors');

// Import Domain Routers
const authRoutes = require('./routes/authRoutes');
const productsRoutes = require('./routes/productsRoutes');
const ordersRoutes = require('./routes/ordersRoutes');
const logisticsRoutes = require('./routes/logisticsRoutes');
const trustRoutes = require('./routes/trustRoutes');
const aiRoutes = require('./routes/aiRoutes');
const communityRoutes = require('./routes/communityRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentsRoutes = require('./routes/paymentsRoutes');
const eventRoutes = require('./routes/eventRoutes');
const exportRoutes = require('./routes/exportRoutes');
const mandiRoutes = require('./routes/mandiRoutes');
const carbonRoutes = require('./routes/carbonRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const procurementRoutes = require('./routes/procurementRoutes');
const shelfLifeRoutes = require('./routes/shelfLifeRoutes');
const voiceRoutes = require('./routes/voiceRoutes');
const creditRoutes = require('./routes/creditRoutes');
const gisRoutes = require('./routes/gisRoutes');
const actuatorRoutes = require('./routes/actuatorRoutes');
const forwardContractRoutes = require('./routes/forwardContractRoutes');
const waterRoutes = require('./routes/waterRoutes');
const coopRoutes = require('./routes/coopRoutes');
const labTrackingRoutes = require('./routes/labTrackingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Configuration
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request Logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[EcoSwadesh API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Root & Health Verification Endpoints
app.get('/', (req, res) => {
  return res.status(200).json({
    name: 'Eco Swadesh Production Backend API',
    version: '1.0.0',
    status: 'HEALTHY_ONLINE',
    documentation: 'https://docs.ecoswadesh.com/api/v1',
    timestamp: new Date().toISOString(),
  });
});

app.get('/v1/health', (req, res) => {
  return res.status(200).json({
    status: 'UP',
    database: 'CONNECTED_IN_MEMORY_PERSISTENT',
    services: {
      auth: 'OPERATIONAL',
      marketplace: 'OPERATIONAL',
      escrowPool: 'OPERATIONAL',
      paymentsRazorpayStripe: 'OPERATIONAL',
      iotFreightTelemetry: 'OPERATIONAL',
      aiDoctor: 'OPERATIONAL',
      trustRegistry: 'OPERATIONAL',
      communityForum: 'OPERATIONAL',
      disputeResolution: 'OPERATIONAL',
      sseRealtimeStream: 'OPERATIONAL',
      phytosanitaryBiosecurity: 'OPERATIONAL',
      mandiPriceForecaster: 'OPERATIONAL',
      soilCarbonCredits: 'OPERATIONAL',
      enterpriseErpWebhooks: 'OPERATIONAL',
      fpoGroupProcurement: 'OPERATIONAL',
      arrheniusShelfLifeWatchdog: 'OPERATIONAL',
      vernacularVoiceAgronomy: 'OPERATIONAL',
      alternativeEcoAgriCredit: 'OPERATIONAL',
      satelliteGisBoundaryBuffer: 'OPERATIONAL',
      iotActuatorCompressorControl: 'OPERATIONAL',
      preHarvestForwardContracts: 'OPERATIONAL',
      iso14046WaterFootprintStewardship: 'OPERATIONAL',
      cooperativeDividendLedger: 'OPERATIONAL',
      nablLabChainOfCustodyTracking: 'OPERATIONAL',
    },
  });
});

// Mount /v1 Domain Subsystems
app.use('/v1/auth', authRoutes);
app.use('/v1/products', productsRoutes);
app.use('/v1/orders', ordersRoutes);
app.use('/v1/payments', paymentsRoutes);
app.use('/v1/logistics/shelf-life', shelfLifeRoutes);
app.use('/v1/logistics', logisticsRoutes);
app.use('/v1/verify', trustRoutes);
app.use('/v1/trust', trustRoutes);
app.use('/v1/ai/voice', voiceRoutes);
app.use('/v1/ai', aiRoutes);
app.use('/v1/community', communityRoutes);
app.use('/v1/admin', adminRoutes);
app.use('/v1/events', eventRoutes);
app.use('/v1/export', exportRoutes);
app.use('/v1/mandi', mandiRoutes);
app.use('/v1/carbon', carbonRoutes);
app.use('/v1/webhooks', webhookRoutes);
app.use('/v1/procurement', procurementRoutes);
app.use('/v1/credit', creditRoutes);
app.use('/v1/farms', gisRoutes);
app.use('/v1/iot/actuators', actuatorRoutes);
app.use('/v1/contracts/forward', forwardContractRoutes);
app.use('/v1/sustainability', waterRoutes);
app.use('/v1/coop', coopRoutes);
app.use('/v1/lab', labTrackingRoutes);

// 404 Catch-All Handler
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    error: 'ENDPOINT_NOT_FOUND',
    message: `The endpoint '${req.method} ${req.originalUrl}' does not exist on Eco Swadesh v1 API.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[EcoSwadesh Server Error]:', err);
  return res.status(err.status || 500).json({
    success: false,
    error: err.name || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred on the Eco Swadesh backend server.',
  });
});

// Start listening if executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🌿 Eco Swadesh Production Backend API Server`);
    console.log(`🚀 Live listening on http://localhost:${PORT}/v1`);
    console.log(`🌱 Health Check: http://localhost:${PORT}/v1/health`);
    console.log(`======================================================\n`);
  });
}

module.exports = app;
