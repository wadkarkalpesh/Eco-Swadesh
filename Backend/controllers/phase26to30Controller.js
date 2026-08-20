/**
 * Deccan Origin Phases 26-30 Controller
 * Endpoints for:
 * 1. Cryptographic Blockchain Merkle Ledger Proofs
 * 2. APEDA / NPOP Electronic Phytosanitary Inspection Dispatch
 * 3. Micro-Climate Predictive Agronomy Hazard Forecaster
 * 4. Multi-Farmer LTL Milk-Run Shared Freight Route Optimizer
 */

const ledgerProofEngine = require('../services/ledgerProofEngine');
const inspectionEngine = require('../services/inspectionEngine');
const microClimateEngine = require('../services/microClimateEngine');
const milkRunLogisticsEngine = require('../services/milkRunLogisticsEngine');

class Phase26to30Controller {
  // --- Phase 26: Ledger Proofs ---
  mintProof(req, res, next) {
    try {
      const { action, entityId, entityType, actorId, metadata } = req.body;
      if (!action || !entityId) {
        return res.status(400).json({
          success: false,
          error: 'MISSING_REQUIRED_FIELDS',
          message: 'action and entityId are required to mint a cryptographic proof block.',
        });
      }
      const proofBlock = ledgerProofEngine.mintProofBlock({
        action,
        entityId,
        entityType,
        actorId,
        metadata,
      });
      return res.status(201).json({
        success: true,
        proofBlock,
      });
    } catch (err) {
      next(err);
    }
  }

  verifyProof(req, res, next) {
    try {
      const { hash } = req.params;
      const result = ledgerProofEngine.verifyProof(hash);
      if (!result.verified) {
        return res.status(404).json({
          success: false,
          error: result.error,
          message: result.message,
        });
      }
      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  getChainAuditTrail(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const auditTrail = ledgerProofEngine.getChainAuditTrail(limit);
      return res.status(200).json({
        success: true,
        totalBlocks: auditTrail.length,
        auditTrail,
      });
    } catch (err) {
      next(err);
    }
  }

  // --- Phase 27: Electronic Phytosanitary Inspections ---
  dispatchInspection(req, res, next) {
    try {
      const inspection = inspectionEngine.dispatchInspection(req.body);
      return res.status(201).json({
        success: true,
        inspection,
      });
    } catch (err) {
      next(err);
    }
  }

  getInspectionById(req, res, next) {
    try {
      const { id } = req.params;
      const inspection = inspectionEngine.getInspectionById(id);
      if (!inspection) {
        return res.status(404).json({
          success: false,
          error: 'INSPECTION_NOT_FOUND',
          message: `Inspection record '${id}' not found.`,
        });
      }
      return res.status(200).json({
        success: true,
        inspection,
      });
    } catch (err) {
      next(err);
    }
  }

  listInspections(req, res, next) {
    try {
      const inspections = inspectionEngine.listInspections();
      return res.status(200).json({
        success: true,
        inspections,
      });
    } catch (err) {
      next(err);
    }
  }

  completeInspection(req, res, next) {
    try {
      const { id } = req.params;
      const { checklistUpdates, auditorNotes } = req.body;
      const updated = inspectionEngine.completeInspection(id, checklistUpdates, auditorNotes);
      return res.status(200).json({
        success: true,
        inspection: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  // --- Phase 28: Micro-Climate Risk Evaluation ---
  evaluateMicroClimate(req, res, next) {
    try {
      const assessment = microClimateEngine.evaluateMicroClimateRisk(req.body);
      return res.status(200).json({
        success: true,
        assessment,
      });
    } catch (err) {
      next(err);
    }
  }

  // --- Phase 29: LTL Freight Milk-Run Consolidation ---
  consolidateMilkRun(req, res, next) {
    try {
      const { destinationHub, truckCapacityTons, consignments } = req.body;
      const routePlan = milkRunLogisticsEngine.consolidateMilkRun({
        destinationHub,
        truckCapacityTons,
        consignments,
      });
      return res.status(200).json({
        success: true,
        routePlan,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new Phase26to30Controller();
