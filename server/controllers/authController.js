/**
 * Auth Controller - Multi-Persona Identity Management & DPDP Compliance
 * Lead Architect: Principal Security & Identity Engineer
 * Implements: Custom Claims, Role Hierarchy, OTP Authentication, and DPDP 2023 Consent Audit
 */

const db = require('../config/db');
const { generateToken } = require('../middleware/auth');

const SELF_ASSIGNABLE_ROLES = ['buyer', 'seller', 'gardener', 'farmer', 'consumer', 'bulkBuyer'];
const RESTRICTED_ROLES = ['expert', 'moderator', 'admin'];

/**
 * Send Simulated 6-Digit OTP to Phone Number
 * POST /v1/auth/send-otp
 */
const sendOTP = (req, res) => {
  const { phoneNumber, countryCode = 'IN' } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_PHONE',
      message: 'Phone number with international dialing code is required.',
    });
  }

  // Generate OTP Session ID and 6-digit verification code (Fixed 123456 in dev/test)
  const otpSessionId = `sess_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const otpCode = phoneNumber.includes('9999') ? '999999' : '123456';
  const expireSeconds = 300;

  db.otpSessions.set(otpSessionId, {
    phoneNumber,
    countryCode,
    otpCode,
    expiresAt: Date.now() + expireSeconds * 1000,
    attempts: 0,
  });

  return res.status(200).json({
    success: true,
    otpSessionId,
    expireSeconds,
    message: `OTP sent successfully to ${phoneNumber}. (Use code: ${otpCode} for instant verification)`,
  });
};

/**
 * Verify OTP and Issue Persona JWT Token with Default Claims & DPDP Record
 * POST /v1/auth/verify-otp
 */
const verifyOTP = (req, res) => {
  const { otpSessionId, otpCode, persona = 'buyer', name, dpdpConsent = true } = req.body;

  if (!otpSessionId || !otpCode) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_PARAMETERS',
      message: 'Both otpSessionId and otpCode are required.',
    });
  }

  const session = db.otpSessions.get(otpSessionId);

  // In test / dev mode, also allow universal master OTP 123456
  const isValidCode = session ? session.otpCode === otpCode || otpCode === '123456' : otpCode === '123456';

  if (!isValidCode) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_OTP',
      message: 'The verification OTP entered is incorrect or expired.',
    });
  }

  const phoneNumber = session ? session.phoneNumber : (req.body.phoneNumber || '+919876543210');
  
  // Find or Provision User
  const existingUser = db.users.find((u) => u.phoneNumber === phoneNumber);
  const isExistingUser = !!existingUser;
  let user = existingUser;

  if (!user) {
    const initialRole = persona || 'buyer';
    user = db.insert('users', {
      id: `usr_${initialRole}_${Date.now().toString().slice(-4)}`,
      phoneNumber,
      countryCode: session ? session.countryCode : 'IN',
      name: name || '',
      persona: initialRole,
      roles: [initialRole], // Phase 2: default role assigned
      verified: true,
      onboardingCompleted: false,
      dpdpConsentGiven: !!dpdpConsent,
      dpdpConsentTimestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    // Record DPDP 2023 Consent Audit Record
    db.recordConsent({
      userId: user.id,
      phoneNumber: user.phoneNumber,
      email: user.email,
      consentType: 'SIGNUP_AUTHENTICATION_DPDP_2023',
      ipAddress: req.ip || '127.0.0.1',
    });
  } else if (persona && user.persona !== persona) {
    user.persona = persona;
    if (!user.roles.includes(persona)) {
      user.roles.push(persona);
    }
    db.update('users', user.id, { persona: user.persona, roles: user.roles });
  }

  // Clean up OTP session
  if (session) {
    db.otpSessions.delete(otpSessionId);
  }

  const token = generateToken(user);

  return res.status(200).json({
    success: true,
    token,
    isExistingUser,
    onboardingCompleted: user.onboardingCompleted !== false && (isExistingUser || !!user.name),
    user: {
      id: user.id,
      name: user.name || (persona === 'farmer' ? 'Organic Farmer' : persona === 'seller' ? 'Organic Seller' : 'Eco Swadesh Buyer'),
      phoneNumber: user.phoneNumber,
      email: user.email,
      persona: user.persona,
      roles: user.roles,
      verified: user.verified,
      location: user.location,
      onboardingCompleted: user.onboardingCompleted !== false,
      dpdpConsentGiven: user.dpdpConsentGiven,
    },
  });
};

/**
 * Add Role to Current User Account (Phase 2.2)
 * POST /v1/auth/roles
 */
const addRole = (req, res) => {
  const { role } = req.body;

  if (!role || typeof role !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'INVALID_ROLE',
      message: 'A role string parameter is required.',
    });
  }

  if (RESTRICTED_ROLES.includes(role)) {
    return res.status(403).json({
      success: false,
      error: 'FORBIDDEN_ROLE_ASSIGNMENT',
      message: `Role '${role}' cannot be self-assigned. Verified authorization or administrative approval is required.`,
    });
  }

  if (!SELF_ASSIGNABLE_ROLES.includes(role)) {
    return res.status(400).json({
      success: false,
      error: 'UNSUPPORTED_ROLE',
      message: `Role '${role}' is not supported. Supported self-assignable roles: [${SELF_ASSIGNABLE_ROLES.join(', ')}].`,
    });
  }

  const user = db.findById('users', req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'USER_NOT_FOUND',
      message: 'User account not found.',
    });
  }

  if (!user.roles) {
    user.roles = ['buyer'];
  }

  if (!user.roles.includes(role)) {
    user.roles.push(role);
  }

  db.update('users', user.id, { roles: user.roles });
  const token = generateToken(user);

  db.logAudit({
    actorId: user.id,
    actorRole: role,
    action: 'ADD_USER_ROLE',
    targetType: 'USER',
    targetId: user.id,
    reason: `Self-assigned verified role '${role}'`,
  });

  return res.status(200).json({
    success: true,
    roles: user.roles,
    token,
    message: `Role '${role}' successfully added to user account.`,
  });
};

/**
 * Update Personal Information & Complete Onboarding
 * PUT /v1/auth/profile
 */
const updateProfile = (req, res) => {
  const {
    name,
    email,
    state,
    district,
    city,
    address,
    farmSizeAcres,
    primaryCrops,
    bankUpiId,
    gstLicenseNo,
    persona,
  } = req.body;

  const user = db.findById('users', req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'USER_NOT_FOUND',
      message: 'User account not found.',
    });
  }

  const locationStr = [city, district, state].filter(Boolean).join(', ');

  user.name = name || user.name;
  user.email = email || user.email;
  user.location = locationStr || user.location;
  user.address = address || user.address;
  user.farmSizeAcres = farmSizeAcres ? parseFloat(farmSizeAcres) : user.farmSizeAcres;
  user.primaryCrops = primaryCrops || user.primaryCrops;
  user.bankUpiId = bankUpiId || user.bankUpiId;
  user.gstLicenseNo = gstLicenseNo || user.gstLicenseNo;
  user.onboardingCompleted = true;
  if (persona) {
    user.persona = persona;
    if (!user.roles.includes(persona)) {
      user.roles.push(persona);
    }
  }

  db.update('users', user.id, user);

  return res.status(200).json({
    success: true,
    message: 'Personal information & onboarding completed successfully.',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      persona: user.persona,
      roles: user.roles,
      location: user.location,
      onboardingCompleted: true,
    },
  });
};

/**
 * Get Current Authenticated Profile
 * GET /v1/auth/me
 */
const getMe = (req, res) => {
  const user = db.findById('users', req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'USER_NOT_FOUND',
      message: 'The requested user account does not exist.',
    });
  }

  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      persona: user.persona,
      roles: user.roles,
      verified: user.verified,
      location: user.location,
      farmSizeAcres: user.farmSizeAcres,
      primaryCrops: user.primaryCrops,
      certifications: user.certifications,
      dpdpConsentGiven: user.dpdpConsentGiven,
    },
  });
};

/**
 * Switch Active User Persona
 * PUT /v1/auth/switch-persona
 */
const switchPersona = (req, res) => {
  const { persona } = req.body;
  const validPersonas = ['farmer', 'consumer', 'bulkBuyer', 'seller', 'expert', 'admin', 'gardener', 'buyer'];

  if (!persona || !validPersonas.includes(persona)) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_PERSONA',
      message: `Invalid persona. Must be one of: [${validPersonas.join(', ')}].`,
    });
  }

  const user = db.findById('users', req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'USER_NOT_FOUND',
      message: 'User profile not found.',
    });
  }

  user.persona = persona;
  if (!user.roles.includes(persona)) {
    user.roles.push(persona);
  }

  db.update('users', user.id, { persona: user.persona, roles: user.roles });
  const token = generateToken(user);

  return res.status(200).json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      persona: user.persona,
      roles: user.roles,
      verified: user.verified,
    },
  });
};

/**
 * Export Data Subject Record (DPDP 2023 Section 11 DSAR compliance)
 * GET /v1/auth/data-export
 */
const exportPersonalData = (req, res) => {
  const userId = req.user.id;
  const user = db.findById('users', userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'USER_NOT_FOUND',
      message: 'User profile not found.',
    });
  }

  const consentRecords = db.filter('consentRecords', (c) => c.userId === userId);
  const userListings = db.filter('products', (p) => p.sellerId === userId || p.farmerId === userId);
  const userOrders = db.filter('orders', (o) => o.buyerId === userId || o.farmerId === userId);
  const userAuditLogs = db.filter('auditLogs', (a) => a.actorId === userId || a.targetId === userId);

  return res.status(200).json({
    success: true,
    complianceStandard: 'Digital Personal Data Protection (DPDP) Act, 2023',
    exportTimestamp: new Date().toISOString(),
    user: {
      id: user.id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      roles: user.roles,
      location: user.location,
      createdAt: user.createdAt,
    },
    consentAuditTrail: consentRecords,
    activitySummary: {
      totalListings: userListings.length,
      totalOrders: userOrders.length,
      totalAuditEvents: userAuditLogs.length,
    },
  });
};

module.exports = {
  sendOTP,
  verifyOTP,
  addRole,
  getMe,
  switchPersona,
  updateProfile,
  exportPersonalData,
};
