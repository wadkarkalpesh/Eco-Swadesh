/**
 * Auth Controller - Multi-Persona Identity Management
 * Lead Architect: Principal Security & Identity Engineer
 */

const db = require('../config/db');
const { generateToken } = require('../middleware/auth');

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
 * Verify OTP and Issue Persona JWT Token
 * POST /v1/auth/verify-otp
 */
const verifyOTP = (req, res) => {
  const { otpSessionId, otpCode, persona = 'farmer', name } = req.body;

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

  const phoneNumber = session ? session.phoneNumber : '+919876543210';
  
  // Find or Provision User
  let user = db.users.find((u) => u.phoneNumber === phoneNumber);

  if (!user) {
    user = db.insert('users', {
      id: `usr_${persona}_${Date.now().toString().slice(-4)}`,
      phoneNumber,
      countryCode: session ? session.countryCode : 'IN',
      name: name || (persona === 'farmer' ? 'Organic Farmer' : persona === 'bulkBuyer' ? 'Agro Commodity Buyer' : 'Eco Swadesh Member'),
      persona,
      roles: [persona],
      verified: true,
      createdAt: new Date().toISOString(),
    });
  } else if (persona && user.persona !== persona) {
    user.persona = persona;
    if (!user.roles.includes(persona)) {
      user.roles.push(persona);
    }
    db.update('users', user.id, { persona: user.persona, roles: user.roles });
  }

  // Clean up OTP session
  db.otpSessions.delete(otpSessionId);

  const token = generateToken(user);

  return res.status(200).json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      persona: user.persona,
      roles: user.roles,
      verified: user.verified,
      location: user.location,
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
    },
  });
};

/**
 * Switch Active User Persona
 * PUT /v1/auth/switch-persona
 */
const switchPersona = (req, res) => {
  const { persona } = req.body;
  const validPersonas = ['farmer', 'consumer', 'bulkBuyer', 'seller', 'expert', 'admin'];

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

module.exports = {
  sendOTP,
  verifyOTP,
  getMe,
  switchPersona,
};
