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

// -------------------------------------------------------------
// Financial / Bookkeeping & Profit Tracking
// -------------------------------------------------------------
const financesFile = path.join(dataDir, 'finances.json');

export function getFinances() {
  return readJson('finances.json', []);
}

export function saveFinanceRecord(record) {
  const finances = getFinances();
  const isOverhead = record.type === 'overhead';
  const revenue = isOverhead ? 0 : (Number(record.revenue) || 0);
  const materialCost = isOverhead ? 0 : (Number(record.materialCost) || 0);
  const otherExpenses = isOverhead 
    ? (Number(record.amount ?? record.otherExpenses) || 0) 
    : (Number(record.otherExpenses) || 0);
  const netProfit = isOverhead 
    ? -otherExpenses 
    : Math.round((revenue - materialCost - otherExpenses) * 100) / 100;

  const newRecord = {
    id: record.id || 'fin-' + Date.now(),
    type: record.type || 'job', // 'job' | 'overhead'
    category: record.category || (isOverhead ? 'other' : ''),
    leadId: record.leadId || null,
    customerName: isOverhead 
      ? (record.title || record.customerName || 'Genel Şirket Masrafı') 
      : (record.customerName || 'İsimsiz Müşteri'),
    customerPhone: record.customerPhone || '',
    postcode: record.postcode || 'Edinburgh',
    service: isOverhead 
      ? (record.categoryLabel || record.service || 'Şirket Gideri') 
      : (record.service || 'Usta İşi'),
    revenue,
    materialCost,
    otherExpenses,
    netProfit,
    paymentStatus: record.paymentStatus || 'paid_card',
    date: record.date || new Date().toISOString().split('T')[0],
    notes: record.notes || '',
    createdAt: new Date().toISOString()
  };

  finances.unshift(newRecord);
  writeJson('finances.json', finances);
  return newRecord;
}

export function updateFinanceRecord(id, updates) {
  const finances = getFinances();
  const index = finances.findIndex(f => f.id === id);
  if (index === -1) throw new Error('Finance record not found');

  const existing = finances[index];
  const merged = { ...existing, ...updates };
  
  const isOverhead = merged.type === 'overhead';
  const revenue = isOverhead ? 0 : (Number(merged.revenue) || 0);
  const materialCost = isOverhead ? 0 : (Number(merged.materialCost) || 0);
  const otherExpenses = isOverhead 
    ? (Number(merged.amount ?? merged.otherExpenses) || 0) 
    : (Number(merged.otherExpenses) || 0);
  merged.revenue = revenue;
  merged.materialCost = materialCost;
  merged.otherExpenses = otherExpenses;
  merged.netProfit = isOverhead 
    ? -otherExpenses 
    : Math.round((revenue - materialCost - otherExpenses) * 100) / 100;
  merged.updatedAt = new Date().toISOString();

  finances[index] = merged;
  writeJson('finances.json', finances);
  return merged;
}

export function deleteFinanceRecord(id) {
  const finances = getFinances();
  const filtered = finances.filter(f => f.id !== id);
  writeJson('finances.json', filtered);
  return true;
}

// -------------------------------------------------------------
// Schedule & Appointment Management
// -------------------------------------------------------------
export function getSchedule() {
  return readJson('schedule.json', []);
}

export function saveScheduleJob(job) {
  const schedule = getSchedule();
  const newJob = {
    id: job.id || 'job-' + Date.now(),
    leadId: job.leadId || null,
    customerName: job.customerName || 'Anonymous Customer',
    customerPhone: job.customerPhone || '',
    postcode: job.postcode || 'Edinburgh',
    address: job.address || '',
    service: job.service || 'Handyman Job',
    date: job.date || new Date().toISOString().split('T')[0],
    startTime: job.startTime || '10:00',
    endTime: job.endTime || '12:00',
    durationMinutes: Number(job.durationMinutes) || 120,
    status: job.status || 'scheduled', // scheduled | in_progress | completed | rescheduled | cancelled
    priceEstimate: job.priceEstimate ? Number(job.priceEstimate) : null,
    notes: job.notes || '',
    createdAt: new Date().toISOString()
  };

  schedule.unshift(newJob);
  writeJson('schedule.json', schedule);
  return newJob;
}

export function updateScheduleJob(id, updates) {
  const schedule = getSchedule();
  const index = schedule.findIndex(j => j.id === id);
  if (index === -1) throw new Error('Schedule job not found');

  const existing = schedule[index];
  const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
  if (merged.priceEstimate !== undefined && merged.priceEstimate !== null) {
    merged.priceEstimate = Number(merged.priceEstimate);
  }

  schedule[index] = merged;
  writeJson('schedule.json', schedule);
  return merged;
}

export function deleteScheduleJob(id) {
  const schedule = getSchedule();
  const filtered = schedule.filter(j => j.id !== id);
  writeJson('schedule.json', filtered);
  return true;
}


