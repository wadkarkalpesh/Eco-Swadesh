/**
 * Deccan Origin Token Bucket Rate Limiting Middleware
 * Protects endpoints from brute-force authentication attempts, API flooding, and DDoS attacks.
 * Conforms to IETF RateLimit Header specifications.
 */

const ipBuckets = new Map();

/**
 * Creates a rate limiter middleware instance
 * @param {Object} options
 * @param {number} options.windowMs Window duration in milliseconds (default: 60,000 = 1 min)
 * @param {number} options.maxRequests Maximum allowed requests within window (default: 100)
 * @param {string} options.message Error message returned upon exceeding limit
 */
const createRateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 60 * 1000;
  const maxRequests = options.maxRequests || 100;
  const message = options.message || 'Too many requests. Please try again after the rate limit window cools down.';

  return (req, res, next) => {
    // Determine client identifier (IP or Authenticated User ID)
    const clientId = req.user ? `user_${req.user.id}` : (req.ip || req.headers['x-forwarded-for'] || '127.0.0.1');
    const bucketKey = `${req.baseUrl || req.path}:${clientId}`;
    const now = Date.now();

    let bucket = ipBuckets.get(bucketKey);

    if (!bucket || now > bucket.resetTime) {
      bucket = {
        count: 0,
        resetTime: now + windowMs,
      };
      ipBuckets.set(bucketKey, bucket);
    }

    bucket.count++;

    const remaining = Math.max(0, maxRequests - bucket.count);
    const resetSeconds = Math.ceil((bucket.resetTime - now) / 1000);

    // Set standard rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetSeconds);

    if (bucket.count > maxRequests) {
      res.setHeader('Retry-After', resetSeconds);
      return res.status(429).json({
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message,
        retryAfterSeconds: resetSeconds,
      });
    }

    next();
  };
};

// Global default rate limiter: 100 req/min
const globalRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 100,
  message: 'Standard API rate limit exceeded (100 req/min). Please slow down.',
});

// Strict rate limiter for Auth/OTP: 10 req/min
const authRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 10,
  message: 'Authentication rate limit exceeded (10 req/min). To prevent abuse, OTP requests are throttled.',
});

module.exports = {
  createRateLimiter,
  globalRateLimiter,
  authRateLimiter,
};
