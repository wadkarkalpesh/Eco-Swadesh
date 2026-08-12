/**
 * Eco Swadesh Phase 26 to 30 Enterprise Routes
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/phase26to30Controller');

// Phase 26: Blockchain Proof Routes
router.post('/proof/generate', (req, res, next) => controller.mintProof(req, res, next));
router.get('/proof/audit-trail', (req, res, next) => controller.getChainAuditTrail(req, res, next));
router.get('/proof/:hash', (req, res, next) => controller.verifyProof(req, res, next));

// Phase 27: Phytosanitary Electronic Field Inspections
router.post('/inspections/dispatch', (req, res, next) => controller.dispatchInspection(req, res, next));
router.get('/inspections', (req, res, next) => controller.listInspections(req, res, next));
router.get('/inspections/:id', (req, res, next) => controller.getInspectionById(req, res, next));
router.post('/inspections/:id/complete', (req, res, next) => controller.completeInspection(req, res, next));

// Phase 28: Micro-Climate Risk Engine
router.post('/ai/micro-climate/forecast-risk', (req, res, next) => controller.evaluateMicroClimate(req, res, next));

// Phase 29: Multi-Farmer LTL Freight Milk-Run Route Optimizer
router.post('/logistics/milk-run/consolidate', (req, res, next) => controller.consolidateMilkRun(req, res, next));

module.exports = router;
