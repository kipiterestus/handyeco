import crypto from "crypto";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "server", "data");
const adminConfigFile = path.join(dataDir, "admin_config.json");

function readAdminConfig() {
  try {
    if (fs.existsSync(adminConfigFile)) {
      return JSON.parse(fs.readFileSync(adminConfigFile, "utf-8"));
    }
  } catch (err) {
    console.error("[Security] Error reading admin_config:", err);
  }
  return {};
}

function writeAdminConfig(config) {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(adminConfigFile, JSON.stringify(config, null, 2), "utf-8");
}

export function isTotpConfigured() {
  const config = readAdminConfig();
  return Boolean(config.totpSecret);
}

export async function generateTotpSetup() {
  const issuer = process.env.TOTP_ISSUER || "Handyeco Admin";
  const secret = new OTPAuth.Secret({ size: 20 });
  const totp = new OTPAuth.TOTP({
    issuer, label: "admin@handyeco", algorithm: "SHA1", digits: 6, period: 30, secret,
  });
  const uri = totp.toString();
  const qrDataUrl = await QRCode.toDataURL(uri, {
    errorCorrectionLevel: "H", margin: 2, width: 256,
    color: { dark: "#000000", light: "#ffffff" }
  });
  return { secretBase32: secret.base32, uri, qrDataUrl };
}

export function saveTotpSecret(secretBase32) {
  const config = readAdminConfig();
  config.totpSecret = secretBase32;
  config.totpConfiguredAt = new Date().toISOString();
  writeAdminConfig(config);
}

export function resetTotp() {
  const config = readAdminConfig();
  delete config.totpSecret;
  delete config.totpConfiguredAt;
  writeAdminConfig(config);
}

// Replay protection: track recently used TOTP tokens (cleared after 90s)
const usedTotpTokens = new Map();

export function verifyTotpCode(code) {
  const config = readAdminConfig();
  if (!config.totpSecret) return false;
  const normalized = String(code).trim();
  // Reject replayed tokens (same code used twice within the same window)
  if (usedTotpTokens.has(normalized)) return false;
  const totp = new OTPAuth.TOTP({
    algorithm: "SHA1", digits: 6, period: 30,
    secret: OTPAuth.Secret.fromBase32(config.totpSecret),
  });
  // window: 1 = ±30s clock drift tolerance (was 2 = ±60s, which accepts 4 extra codes)
  const delta = totp.validate({ token: normalized, window: 1 });
  if (delta === null) return false;
  // Mark token as used; clean up after 90 seconds
  usedTotpTokens.set(normalized, Date.now());
  setTimeout(() => usedTotpTokens.delete(normalized), 90_000);
  return true;
}

export function timingSafeCompare(userInput, expectedSecret) {
  if (typeof userInput !== "string" || typeof expectedSecret !== "string") return false;
  const userHash = crypto.createHash("sha256").update(userInput).digest();
  const targetHash = crypto.createHash("sha256").update(expectedSecret).digest();
  return crypto.timingSafeEqual(userHash, targetHash);
}

class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 15 * 60 * 1000;
    this.maxRequests = options.maxRequests || 5;
    this.records = new Map();
    const timer = setInterval(() => this.cleanup(), 5 * 60 * 1000);
    if (timer.unref) timer.unref();
  }
  check(ip) {
    const now = Date.now();
    const entry = this.records.get(ip);
    if (!entry || now > entry.resetTime) {
      this.records.set(ip, { count: 1, resetTime: now + this.windowMs });
      return { allowed: true, remaining: this.maxRequests - 1 };
    }
    if (entry.count >= this.maxRequests) {
      return { allowed: false, remaining: 0, waitSeconds: Math.ceil((entry.resetTime - now) / 1000) };
    }
    entry.count++;
    return { allowed: true, remaining: this.maxRequests - entry.count };
  }
  reset(ip) { this.records.delete(ip); }
  cleanup() {
    const now = Date.now();
    for (const [ip, entry] of this.records.entries()) {
      if (now > entry.resetTime) this.records.delete(ip);
    }
  }
}

export const loginRateLimiter = new RateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 5 });
export const quoteRateLimiter = new RateLimiter({ windowMs: 10 * 60 * 1000, maxRequests: 5 });

export function sanitizeInput(input, maxLength = 500) {
  if (typeof input !== "string") return "";
  return input
    .slice(0, maxLength)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/on\w+=\S+/gi, "")
    .trim();
}

export function sanitizeQuotePayload(payload) {
  if (!payload || typeof payload !== "object") throw new Error("Invalid quote payload format");
  const name = sanitizeInput(payload.name, 100);
  const phone = sanitizeInput(payload.phone, 30);
  const email = sanitizeInput(payload.email, 100);
  const postcode = sanitizeInput(payload.postcode, 20);
  const service = sanitizeInput(payload.service, 100);
  const urgency = sanitizeInput(payload.urgency, 20);
  const details = sanitizeInput(payload.details, 2000);
  if (!name || name.length < 2) throw new Error("Valid name is required");
  if (!phone || phone.length < 6) throw new Error("Valid phone number is required");
  return {
    name, phone,
    email: email || "",
    postcode: postcode || "Edinburgh Area",
    service: service || "Handyman Service",
    urgency: ["flexible", "this-week", "urgent", "weekend"].includes(urgency) ? urgency : "flexible",
    details: details || "No additional details provided",
    photosCount: Math.min(Math.max(Number(payload.photosCount) || 0, 0), 5)
  };
}

const sessionsFile = path.join(dataDir, "admin_sessions.json");

function readStoredSessions() {
  try {
    if (fs.existsSync(sessionsFile)) {
      return JSON.parse(fs.readFileSync(sessionsFile, "utf-8"));
    }
  } catch (e) {}
  return {};
}

function writeStoredSessions(sessions) {
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2), "utf-8");
  } catch (e) {}
}

export class TokenManager {
  // 1 hour TTL (60 minutes) - automatically refreshed while user is active
  constructor(ttlMs = 60 * 60 * 1000) {
    this.ttlMs = ttlMs;
    this.tokens = new Map();
    // Load persisted sessions on startup so restarts don't log out the admin
    const stored = readStoredSessions();
    const now = Date.now();
    for (const [t, exp] of Object.entries(stored)) {
      if (typeof exp === 'number' && exp > now) {
        this.tokens.set(t, exp);
      }
    }
    const timer = setInterval(() => this.cleanup(), 60 * 60 * 1000);
    if (timer.unref) timer.unref();
  }

  saveToDisk() {
    const obj = {};
    for (const [t, exp] of this.tokens.entries()) {
      obj[t] = exp;
    }
    writeStoredSessions(obj);
  }

  create() {
    const token = crypto.randomBytes(32).toString("hex");
    this.tokens.set(token, Date.now() + this.ttlMs);
    this.saveToDisk();
    return token;
  }

  validate(token) {
    if (!token || typeof token !== "string") return false;
    let expiresAt = this.tokens.get(token);
    // If not in memory (e.g. process restart), check persistent disk storage
    if (!expiresAt) {
      const stored = readStoredSessions();
      if (stored[token]) {
        expiresAt = stored[token];
        this.tokens.set(token, expiresAt);
      }
    }
    if (!expiresAt) return false;
    if (Date.now() > expiresAt) {
      this.tokens.delete(token);
      this.saveToDisk();
      return false;
    }
    // Auto-refresh expiry so active users stay logged in indefinitely
    this.tokens.set(token, Date.now() + this.ttlMs);
    return true;
  }

  revoke(token) {
    if (token) {
      this.tokens.delete(token);
      this.saveToDisk();
    }
  }

  cleanup() {
    const now = Date.now();
    let changed = false;
    for (const [token, expiresAt] of this.tokens.entries()) {
      if (now > expiresAt) {
        this.tokens.delete(token);
        changed = true;
      }
    }
    if (changed) this.saveToDisk();
  }
}

export function getAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGIN || "http://localhost:5173,http://localhost:3001";
  return new Set(raw.split(",").map(o => o.trim()).filter(Boolean));
}

export function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;
  const allowed = getAllowedOrigins();
  if (!process.env.ALLOWED_ORIGIN) {
    console.warn("[Security] WARNING: ALLOWED_ORIGIN env var is not set. CORS is restrictive (localhost only).");
  }
  if (origin && allowed.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  // Non-browser requests (no Origin header) are allowed but without CORS headers
  // This is safe because browsers always send Origin for cross-origin requests
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }
  if (next) next();
}

export const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.telegram.org https://maps.googleapis.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join("; ")
};
