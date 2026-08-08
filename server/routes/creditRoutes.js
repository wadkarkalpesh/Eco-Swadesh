const express = require('express');
const router = express.Router();
const { getFarmerScore, getLoanOffers } = require('../controllers/creditController');
const { optionalJWT } = require('../middleware/auth');

router.post('/farmer-score', optionalJWT, getFarmerScore);
router.get('/loan-offers/:farmerId', optionalJWT, getLoanOffers);

module.exports = router;
