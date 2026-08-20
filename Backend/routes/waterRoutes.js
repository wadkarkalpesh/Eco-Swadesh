const express = require('express');
const router = express.Router();
const { auditWaterFootprint } = require('../controllers/waterController');

router.post('/water-audit', auditWaterFootprint);

module.exports = router;
