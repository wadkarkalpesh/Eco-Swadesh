/**
 * Eco Swadesh Authentication & Authorization Middleware
 * Provides JWT token signing, verification, and role-based access control (RBAC)
 * Supports Multi-Persona Architecture: farmer, consumer, bulkBuyer, seller, expert, admin
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'eco_swadesh_production_jwt_secret_2026_secure';
const JWT_EXPIRES_IN = '7d';

/**
 * Generate signed JWT Token with custom persona and role claims
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    phoneNumber: user.phoneNumber,
    email: user.email,
    persona: user.persona || 'farmer',
    roles: user.roles || [user.persona || 'farmer'],
    verified: user.verified || false,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Require valid JWT Authentication Header
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Access denied. Missing or malformed Bearer authorization token.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Authorization token is invalid or has expired.',
    });
  }
};

/**
 * Optional Authentication (Passes through if no token, attaches req.user if valid)
 */
const optionalJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      // Ignore token error for optional routes
    }
  }
  next();
};

/**
 * Role-Based Access Control (RBAC) Middleware Guard
 * @param  {...string} allowedRoles Allowed user personas/roles
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication required before verifying role permissions.',
      });
    }

    const userRoles = req.user.roles || [req.user.persona];
    const hasRole = allowedRoles.some((role) => userRoles.includes(role) || userRoles.includes('admin'));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN_ROLE',
        message: `Forbidden. This action requires one of the following roles: [${allowedRoles.join(', ')}].`,
      });
    }

    next();
  };
};

module.exports = {
  JWT_SECRET,
  generateToken,
  authenticateJWT,
  optionalJWT,
  requireRole,
};
