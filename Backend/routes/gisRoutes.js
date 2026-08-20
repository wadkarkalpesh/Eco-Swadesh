const express = require('express');
const router = express.Router();
const { verifyFarmBoundary, getParcelById } = require('../controllers/gisController');
const { optionalJWT } = require('../middleware/auth');

router.post('/parcels/verify-boundary', optionalJWT, verifyFarmBoundary);
router.get('/parcels/:farmId', getParcelById);

module.exports = router;
