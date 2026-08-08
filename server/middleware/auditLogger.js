/**
 * Eco Swadesh Audit Logger Middleware
 * Implements IEEE 830 FR-11 compliance: Immutable audit logging of all
 * certification, moderation, dispute, and escrow decisions.
 */

const db = require('../config/db');

const auditMiddleware = (actionName, targetTypeExtractor) => {
  return (req, res, next) => {
    // Intercept response finish to log successful operations
    res.on('finish', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const actorId = req.user ? req.user.id : 'anonymous_user';
        const actorRole = req.user ? req.user.persona : 'guest';
        const targetType = typeof targetTypeExtractor === 'function' 
          ? targetTypeExtractor(req) 
          : (targetTypeExtractor || 'GENERAL');
        const targetId = req.params.id || req.body.id || req.body.productId || req.body.orderId || req.body.sealCode || 'N/A';

        db.logAudit({
          actorId,
          actorRole,
          action: actionName || `${req.method}_${req.baseUrl}${req.path}`,
          targetType,
          targetId,
          reason: req.body.reason || req.body.notes || `Triggered via ${req.method} ${req.originalUrl}`,
        });
      }
    });
    next();
  };
};

module.exports = {
  auditMiddleware,
};
