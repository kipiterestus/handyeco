import crypto from 'crypto';

// 1. Timing-safe string comparison to prevent side-channel timing attacks
export function timingSafeCompare(userInput, expectedSecret) {
  if (typeof userInput !== 'string' || typeof expectedSecret !== 'string') {
    return false;
  }
  const userHash = crypto.createHash('sha256').update(userInput).digest();
  const targetHash = crypto.createHash('sha256').update(expectedSecret).digest();
  return crypto.timingSafeEqual(userHash, targetHash);
}

// 2. Sliding Window Rate Limiter (Memory-efficient, IP-based with TTL)
class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 15 * 60 * 1000; // 15 mins
    this.maxRequests = options.maxRequests || 5;
    this.records = new Map(); // ip -> { count, resetTime }

    // Automatic cleanup of expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  check(ip) {
    const now = Date.now();
    const entry = this.records.get(ip);

    if (!entry || now > entry.resetTime) {
      this.records.set(ip, { count: 1, resetTime: now + this.windowMs });
      return { allowed: true, remaining: this.maxRequests - 1 };
    }

    if (entry.count >= this.maxRequests) {
      const waitSeconds = Math.ceil((entry.resetTime - now) / 1000);
      return { allowed: false, remaining: 0, waitSeconds };
    }

    entry.count++;
    return { allowed: true, remaining: this.maxRequests - entry.count };
  }

  reset(ip) {
    this.records.delete(ip);
  }

  cleanup() {
    const now = Date.now();
    for (const [ip, entry] of this.records.entries()) {
      if (now > entry.resetTime) {
        this.records.delete(ip);
      }
    }
  }
}

// Strict rate limiter for Admin Login: 5 failed attempts per 15 mins
export const loginRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5
});

// Rate limiter for Quote submissions: 5 quotes per 10 mins per IP
export const quoteRateLimiter = new RateLimiter({
  windowMs: 10 * 60 * 1000,
  maxRequests: 5
});

// 3. XSS & Malicious Input Sanitization
export function sanitizeInput(input, maxLength = 500) {
  if (typeof input !== 'string') return '';
  
  return input
    .slice(0, maxLength)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // remove control chars
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // strip script tags
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // strip style tags
    .replace(/javascript:/gi, '') // strip JS pseudo-protocol
    .replace(/on\w+="[^"]*"/gi, '') // strip inline event handlers
    .replace(/on\w+='[^']*'/gi, '')
    .trim();
}

export function sanitizeQuotePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid quote payload format');
  }

  const name = sanitizeInput(payload.name, 100);
  const phone = sanitizeInput(payload.phone, 30);
  const postcode = sanitizeInput(payload.postcode, 20);
  const service = sanitizeInput(payload.service, 100);
  const urgency = sanitizeInput(payload.urgency, 20);
  const details = sanitizeInput(payload.details, 2000);

  if (!name || name.length < 2) {
    throw new Error('Valid name is required (at least 2 characters)');
  }
  if (!phone || phone.length < 6) {
    throw new Error('Valid contact phone number is required');
  }

  return {
    name,
    phone,
    postcode: postcode || 'Edinburgh Area',
    service: service || 'Handyman Service',
    urgency: ['flexible', 'this-week', 'urgent', 'weekend'].includes(urgency) ? urgency : 'flexible',
    details: details || 'No additional details provided',
    photosCount: Math.min(Math.max(Number(payload.photosCount) || 0, 0), 5)
  };
}

// 4. Token Store with TTL (24 Hours expiration)
export class TokenManager {
  constructor(ttlMs = 24 * 60 * 60 * 1000) {
    this.ttlMs = ttlMs;
    this.tokens = new Map(); // token -> expiresAt
    setInterval(() => this.cleanup(), 15 * 60 * 1000);
  }

  create() {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + this.ttlMs;
    this.tokens.set(token, expiresAt);
    return token;
  }

  validate(token) {
    if (!token || typeof token !== 'string') return false;
    const expiresAt = this.tokens.get(token);
    if (!expiresAt) return false;
    if (Date.now() > expiresAt) {
      this.tokens.delete(token);
      return false;
    }
    return true;
  }

  revoke(token) {
    if (token) this.tokens.delete(token);
  }

  cleanup() {
    const now = Date.now();
    for (const [token, expiresAt] of this.tokens.entries()) {
      if (now > expiresAt) {
        this.tokens.delete(token);
      }
    }
  }
}

// 5. Standard OWASP Security Headers
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};
