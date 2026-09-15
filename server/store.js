import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { timingSafeCompare, TokenManager, sanitizeQuotePayload } from './security.js';

const dataDir = path.join(process.cwd(), 'server', 'data');
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
const quotesFile = path.join(process.cwd(), 'server', 'quotes.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Read JSON file safely
export function readJson(filename, defaultValue = {}) {
  const filePath = path.join(dataDir, filename);
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (err) {
    console.error(`[Store] Error reading ${filename}:`, err);
  }
  return defaultValue;
}

// Write JSON file safely
export function writeJson(filename, data) {
  const filePath = path.join(dataDir, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`[Store] Error writing ${filename}:`, err);
    return false;
  }
}

// Get compiled site content bundle
export function getAllContent() {
  return {
    siteConfig: readJson('siteConfig.json'),
    hero: readJson('hero.json'),
    services: readJson('services.json', []),
    gallery: readJson('gallery.json', []),
    reviews: readJson('reviews.json', []),
    areas: readJson('areas.json', []),
    faq: readJson('faq.json', []),
    seo: readJson('seo.json')
  };
}

// Update specific section
export function updateSection(section, data) {
  const allowed = ['siteConfig', 'hero', 'services', 'gallery', 'reviews', 'areas', 'faq', 'seo'];
  if (!allowed.includes(section)) {
    throw new Error(`Invalid section: ${section}`);
  }
  const filename = `${section}.json`;
  writeJson(filename, data);
  return data;
}

// Get single section
export function getSection(section) {
  return readJson(`${section}.json`);
}

// Upload & optimize image from base64
export async function saveBase64Image(dataUrl, customFilename = '') {
  const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 image data URL');
  }

  const buffer = Buffer.from(matches[2], 'base64');
  const timestamp = Date.now();
  const cleanName = customFilename 
    ? customFilename.toLowerCase().replace(/[^a-z0-9_-]/g, '_').slice(0, 30)
    : 'upload';
  const outFilename = `${cleanName}_${timestamp}.webp`;
  const outPath = path.join(uploadsDir, outFilename);

  await sharp(buffer)
    .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(outPath);

  return `/uploads/${outFilename}`;
}

// Quotes management
export function getQuotes() {
  try {
    if (fs.existsSync(quotesFile)) {
      return JSON.parse(fs.readFileSync(quotesFile, 'utf-8'));
    }
  } catch (err) {
    console.error('[Store] Error reading quotes.json:', err);
  }
  return [];
}

export function saveQuoteRecord(quoteData) {
  const sanitized = sanitizeQuotePayload(quoteData);
  const quotes = getQuotes();
  const newQuote = {
    id: 'quote_' + Date.now(),
    createdAt: new Date().toISOString(),
    status: 'new', // new | contacted | booked | archived
    notes: '',
    ...sanitized
  };
  quotes.unshift(newQuote);
  fs.writeFileSync(quotesFile, JSON.stringify(quotes, null, 2), 'utf-8');
  return newQuote;
}

export function updateQuoteStatus(id, updates) {
  const quotes = getQuotes();
  const index = quotes.findIndex(q => q.id === id);
  if (index === -1) throw new Error('Quote not found');
  quotes[index] = { ...quotes[index], ...updates, updatedAt: new Date().toISOString() };
  fs.writeFileSync(quotesFile, JSON.stringify(quotes, null, 2), 'utf-8');
  return quotes[index];
}

// Authentication handling with Timing-Safe comparison and 24-hour Token TTL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'handyeco2026!';
const tokenManager = new TokenManager(24 * 60 * 60 * 1000);

export function verifyAdminPassword(password) {
  return timingSafeCompare(password, ADMIN_PASSWORD);
}

export function createAdminToken() {
  return tokenManager.create();
}

export function isValidToken(token) {
  return tokenManager.validate(token);
}

export function revokeToken(token) {
  tokenManager.revoke(token);
  return true;
}

