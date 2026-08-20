const express = require('express');
const router = express.Router();
const {
  getAdminOverview,
  getPlatformConfig,
  getPlatformConfigById,
  updatePlatformConfig,
  getModerationQueue,
  getAuditLogs,
  getDisputes,
  resolveDispute,
} = require('../controllers/adminController');
const { optionalJWT, authenticateJWT } = require('../middleware/auth');

router.get('/overview', optionalJWT, getAdminOverview);
router.get('/platform-config', optionalJWT, getPlatformConfig);
router.get('/platform-config/:configId', optionalJWT, getPlatformConfigById);
router.put('/platform-config/:configId', authenticateJWT, updatePlatformConfig);
router.get('/moderation-queue', optionalJWT, getModerationQueue);
router.get('/audit-logs', optionalJWT, getAuditLogs);
router.get('/disputes', optionalJWT, getDisputes);
router.post('/disputes/:id/resolve', optionalJWT, resolveDispute);

module.exports = router;
