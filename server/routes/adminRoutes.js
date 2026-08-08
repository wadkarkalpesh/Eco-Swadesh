const express = require('express');
const router = express.Router();
const {
  getAdminOverview,
  getAuditLogs,
  getDisputes,
  resolveDispute,
} = require('../controllers/adminController');
const { optionalJWT, requireRole } = require('../middleware/auth');

router.get('/overview', optionalJWT, getAdminOverview);
router.get('/audit-logs', optionalJWT, getAuditLogs);
router.get('/disputes', optionalJWT, getDisputes);
router.post('/disputes/:id/resolve', optionalJWT, resolveDispute);

module.exports = router;
