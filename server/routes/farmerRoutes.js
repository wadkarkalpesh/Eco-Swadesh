/**
 * Farmer Directory & Regional Clusters Routes
 */

const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');

// List & Filter Farmers
router.get('/', farmerController.getFarmers);

// Summary Stats
router.get('/stats/summary', farmerController.getFarmerStats);

// Farmer Detail by ID
router.get('/:id', farmerController.getFarmerById);

module.exports = router;
