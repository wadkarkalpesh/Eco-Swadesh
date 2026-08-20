const express = require('express');
const router = express.Router();
const { getLiveRates, getCropForecast } = require('../controllers/mandiController');

router.get('/live-rates', getLiveRates);
router.get('/forecast/:crop', getCropForecast);

module.exports = router;
