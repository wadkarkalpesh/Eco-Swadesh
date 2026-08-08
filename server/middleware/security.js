/**
 * Eco Swadesh Security Hardening & DPDP Privacy Middleware
 * Enforces OWASP API Top 10 defenses, HTTP security headers, and Digital Personal Data Protection (DPDP) sanitization.
 */

const securityHeaders = (req, res, next) => {
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // XSS Protection for legacy browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Strict Transport Security (HSTS)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
  );

  // Remove leaking server signatures
  res.removeHeader('X-Powered-By');

  next();
};

/**
 * DPDP (Digital Personal Data Protection) Act PII Masking Helper
 * Redacts sensitive identification data in logs and non-privileged views
 */
const maskPII = (data) => {
  if (!data || typeof data !== 'object') return data;

  const masked = { ...data };

  if (masked.phoneNumber && typeof masked.phoneNumber === 'string') {
    // Keep 2-digit country code (+91) and last 4 digits: +91******3210
    masked.phoneNumber = masked.phoneNumber.replace(/^(\+\d{2})\d+(\d{4})$/, '$1******$2');
  }

  if (masked.email && typeof masked.email === 'string') {
    const parts = masked.email.split('@');
    if (parts.length === 2) {
      masked.email = `${parts[0].slice(0, 2)}***@${parts[1]}`;
    }
  }

  if (masked.aadhaarNo || masked.identityNo) {
    masked.identityNo = 'XXXX-XXXX-XXXX';
    delete masked.aadhaarNo;
  }

  return masked;
};

module.exports = {
  securityHeaders,
  maskPII,
};
