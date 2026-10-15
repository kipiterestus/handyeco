import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { 
  timingSafeCompare, 
  TokenManager, 
  sanitizeQuotePayload, 
  isTotpConfigured, 
  verifyTotpCode, 
  generateTotpSetup, 
  saveTotpSecret, 
  resetTotp, 
  getTotpStatus, 
  toggleTotp,
  hashPartnerPassword,
  verifyPartnerPassword,
  PartnerTokenManager,
  partnerAuthRateLimiter,
  partnerJobRateLimiter
} from './security.js';

// Re-export TOTP and B2B security helpers
export { 
  isTotpConfigured, 
  verifyTotpCode, 
  generateTotpSetup, 
  saveTotpSecret, 
  resetTotp, 
  getTotpStatus, 
  toggleTotp,
  partnerAuthRateLimiter,
  partnerJobRateLimiter
};

const dataDir = path.join(process.cwd(), 'server', 'data');
const defaultDataDir = path.join(process.cwd(), 'server', 'default_data');
const uploadsDir = path.join(dataDir, 'uploads');
const quotesFile = path.join(dataDir, 'quotes.json');
const legacyQuotesFile = path.join(process.cwd(), 'server', 'quotes.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Auto-seed data directory if empty or missing files (critical for newly mounted Railway volumes)
function seedDataDir() {
  if (!fs.existsSync(defaultDataDir)) return;
  try {
    const files = fs.readdirSync(defaultDataDir);
    for (const file of files) {
      const dest = path.join(dataDir, file);
      if (!fs.existsSync(dest)) {
        fs.copyFileSync(path.join(defaultDataDir, file), dest);
        console.log(`[Store] Seeded missing file ${file} to data directory`);
      }
    }
  } catch (err) {
    console.error('[Store] Error seeding data directory:', err);
  }
}
seedDataDir();

// Migrate legacy quotes.json if needed
if (!fs.existsSync(quotesFile) && fs.existsSync(legacyQuotesFile)) {
  try {
    fs.copyFileSync(legacyQuotesFile, quotesFile);
    console.log('[Store] Migrated quotes.json to server/data/quotes.json');
  } catch (err) {
    console.error('[Store] Error migrating quotes.json:', err);
  }
}

// Ensure persistent volume siteConfig.json has the updated email address
function migrateSiteConfigEmail() {
  try {
    const siteConfigFile = path.join(dataDir, 'siteConfig.json');
    if (fs.existsSync(siteConfigFile)) {
      const cfg = JSON.parse(fs.readFileSync(siteConfigFile, 'utf-8'));
      if (cfg && (cfg.email === 'ekremguran@gmail.com' || !cfg.email)) {
        cfg.email = 'info@handyeco.co.uk';
        fs.writeFileSync(siteConfigFile, JSON.stringify(cfg, null, 2), 'utf-8');
        console.log('[Store] Automatically migrated siteConfig email from legacy to info@handyeco.co.uk');
      }
    }
  } catch (err) {
    console.error('[Store] Error migrating siteConfig email:', err);
  }
}
migrateSiteConfigEmail();

// Ensure persistent volume siteConfig.json has the updated reviewCount
function migrateSiteConfigReviewCount() {
  try {
    const siteConfigFile = path.join(dataDir, 'siteConfig.json');
    if (fs.existsSync(siteConfigFile)) {
      const cfg = JSON.parse(fs.readFileSync(siteConfigFile, 'utf-8'));
      if (cfg && (!cfg.googleReviewCount || Number(cfg.googleReviewCount) < 87)) {
        cfg.googleReviewCount = 87;
        fs.writeFileSync(siteConfigFile, JSON.stringify(cfg, null, 2), 'utf-8');
        console.log('[Store] Automatically migrated siteConfig googleReviewCount to 87 on persistent volume');
      }
    }
  } catch (err) {
    console.error('[Store] Error migrating siteConfig review count:', err);
  }
}
migrateSiteConfigReviewCount();

// Ensure persistent volume services.json updates outdated copy on deploy
function migrateServicesCopy() {
  try {
    const servicesFile = path.join(dataDir, 'services.json');
    if (fs.existsSync(servicesFile)) {
      const services = JSON.parse(fs.readFileSync(servicesFile, 'utf-8'));
      if (Array.isArray(services)) {
        let changed = false;
        for (const s of services) {
          if (s.id === 'painting-decorating' && Array.isArray(s.bullets)) {
            s.bullets = s.bullets.map(b => {
              if (b.toLowerCase().includes('dust-sheet') || b.toLowerCase().includes('dust sheet')) {
                changed = true;
                return 'Dust-free, clean & spotless tidy workmanship';
              }
              return b;
            });
          }
        }
        if (changed) {
          fs.writeFileSync(servicesFile, JSON.stringify(services, null, 2), 'utf-8');
          console.log('[Store] Automatically migrated services.json painting copy on persistent volume');
        }
      }
    }
  } catch (err) {
    console.error('[Store] Error migrating services copy:', err);
  }
}
migrateServicesCopy();

// One-time startup migration to wipe old test quotes as requested by user
function clearExistingQuotesMigration() {
  try {
    const adminConfigFile = path.join(dataDir, 'admin_config.json');
    let cfg = {};
    if (fs.existsSync(adminConfigFile)) {
      try { cfg = JSON.parse(fs.readFileSync(adminConfigFile, 'utf-8')); } catch (e) {}
    }
    if (!cfg.quotesCleaned_v1) {
      fs.writeFileSync(quotesFile, JSON.stringify([], null, 2), 'utf-8');
      if (fs.existsSync(legacyQuotesFile)) {
        try { fs.writeFileSync(legacyQuotesFile, JSON.stringify([], null, 2), 'utf-8'); } catch (e) {}
      }
      cfg.quotesCleaned_v1 = true;
      fs.writeFileSync(adminConfigFile, JSON.stringify(cfg, null, 2), 'utf-8');
      console.log('[Store] Automatically cleared old test quotes on deploy (quotesCleaned_v1).');
    }
  } catch (err) {
    console.error('[Store] Error in clearExistingQuotesMigration:', err);
  }
}
clearExistingQuotesMigration();

// Read JSON file safely
export function readJson(filename, defaultValue = {}) {
  const filePath = path.join(dataDir, filename);
  try {
    if (fs.existsSync(filePath)) {
      const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      // Defensive guarantee: Never let legacy email or outdated review count slip through in siteConfig
      if (filename === 'siteConfig.json' && parsed) {
        if (parsed.email === 'ekremguran@gmail.com' || !parsed.email) {
          parsed.email = 'info@handyeco.co.uk';
        }
        if (!parsed.googleReviewCount) {
          parsed.googleReviewCount = 87;
        }
      }
      if (filename === 'services.json' && Array.isArray(parsed)) {
        for (const s of parsed) {
          if (s.id === 'painting-decorating' && Array.isArray(s.bullets)) {
            s.bullets = s.bullets.map(b => (b.toLowerCase().includes('dust-sheet') || b.toLowerCase().includes('dust sheet'))
              ? 'Dust-free, clean & spotless tidy workmanship'
              : b);
          }
        }
      }
      return parsed;
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
    if (filename === 'siteConfig.json' && data && (data.email === 'ekremguran@gmail.com' || !data.email)) {
      data.email = 'info@handyeco.co.uk';
    }
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

// Get single section (allowlisted to prevent path traversal)
const ALLOWED_SECTIONS = ['siteConfig', 'hero', 'services', 'gallery', 'reviews', 'areas', 'faq', 'seo'];

export function getSection(section) {
  if (!ALLOWED_SECTIONS.includes(section)) {
    throw new Error(`Invalid section: ${section}`);
  }
  return readJson(`${section}.json`);
}

// Upload & optimize image from base64
export async function saveBase64Image(dataUrl, customFilename = '') {
  const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 image data URL');
  }

  // SECURITY: Only accept genuine image MIME types (defence-in-depth before Sharp)
  const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/heic', 'image/heif']);
  const detectedMime = matches[1].toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.has(detectedMime)) {
    throw new Error(`Unsupported image type: ${detectedMime}. Only JPEG, PNG, WebP, GIF, AVIF, and HEIC are accepted.`);
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
    id: 'quote_' + crypto.randomUUID().replace(/-/g, ''),
    createdAt: new Date().toISOString(),
    status: 'new', // new | contacted | booked | archived
    notes: '',
    ...sanitized
  };
  quotes.unshift(newQuote);
  fs.writeFileSync(quotesFile, JSON.stringify(quotes, null, 2), 'utf-8');
  return newQuote;
}

// Only allow safe fields to be updated — prevents mass assignment attacks
const QUOTE_UPDATABLE_FIELDS = ['status', 'notes', 'adminNote', 'priceEstimate'];
const QUOTE_ALLOWED_STATUSES = ['new', 'contacted', 'booked', 'completed', 'archived'];

export function updateQuoteStatus(id, updates) {
  const quotes = getQuotes();
  const index = quotes.findIndex(q => q.id === id);
  if (index === -1) throw new Error('Quote not found');

  // Whitelist only safe fields
  const safe = {};
  for (const field of QUOTE_UPDATABLE_FIELDS) {
    if (updates[field] !== undefined) {
      safe[field] = updates[field];
    }
  }
  // Validate status value
  if (safe.status && !QUOTE_ALLOWED_STATUSES.includes(safe.status)) {
    throw new Error(`Invalid status: ${safe.status}`);
  }

  quotes[index] = { ...quotes[index], ...safe, updatedAt: new Date().toISOString() };
  fs.writeFileSync(quotesFile, JSON.stringify(quotes, null, 2), 'utf-8');
  return quotes[index];
}

export function deleteQuoteRecord(id) {
  const quotes = getQuotes();
  const filtered = quotes.filter(q => q.id !== id);
  fs.writeFileSync(quotesFile, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}

export function clearAllQuotes() {
  fs.writeFileSync(quotesFile, JSON.stringify([], null, 2), 'utf-8');
  if (fs.existsSync(legacyQuotesFile)) {
    try { fs.writeFileSync(legacyQuotesFile, JSON.stringify([], null, 2), 'utf-8'); } catch (e) {}
  }
  return true;
}

// Authentication handling with Timing-Safe comparison and persistent 1-hour Token TTL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'handyeco2026!';
const tokenManager = new TokenManager(60 * 60 * 1000);

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
    id: record.id || 'fin-' + crypto.randomUUID().replace(/-/g, ''),
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
    id: job.id || 'job-' + crypto.randomUUID().replace(/-/g, ''),
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

// -------------------------------------------------------------
// B2B Partner Portal & Subcontractor Management
// -------------------------------------------------------------
const partnerTokenManager = new PartnerTokenManager();

export function getB2BPartners(includeSecrets = false) {
  const partners = readJson('b2b_partners.json', []);
  if (includeSecrets) return partners;
  return partners.map(p => {
    const { passwordHash, ...safe } = p;
    return safe;
  });
}

export function getB2BPartnerById(id, includeSecrets = false) {
  const partners = readJson('b2b_partners.json', []);
  const partner = partners.find(p => p.id === id);
  if (!partner) return null;
  if (includeSecrets) return partner;
  const { passwordHash, ...safe } = partner;
  return safe;
}

export function getB2BPartnerByEmail(email) {
  if (!email) return null;
  const partners = readJson('b2b_partners.json', []);
  const cleanEmail = email.trim().toLowerCase();
  return partners.find(p => p.email && p.email.trim().toLowerCase() === cleanEmail) || null;
}

export function registerB2BPartner(payload) {
  const {
    companyName,
    contactPerson,
    phone,
    email,
    password,
    tradeType = 'letting_agent',
    jobVolumeEstimate = '1-5 jobs/month',
    notes = ''
  } = payload || {};

  if (!companyName || companyName.trim().length < 2) {
    throw new Error('Valid company or trade name is required');
  }
  if (!contactPerson || contactPerson.trim().length < 2) {
    throw new Error('Valid contact person name is required');
  }
  if (!phone || phone.trim().length < 6) {
    throw new Error('Valid contact phone or WhatsApp number is required');
  }
  if (!email || !email.includes('@')) {
    throw new Error('Valid contact email is required');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const existing = getB2BPartnerByEmail(email);
  if (existing) {
    throw new Error('An account with this email address is already registered');
  }

  const partners = readJson('b2b_partners.json', []);
  const newPartner = {
    id: 'partner_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10),
    companyName: companyName.trim(),
    contactPerson: contactPerson.trim(),
    phone: phone.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: hashPartnerPassword(password),
    tradeType, // letting_agent | main_contractor | property_investor | landlord | other
    jobVolumeEstimate,
    paymentTerms: 'weekly', // Default to weekly; can be switched to daily upon review. Strictly no monthly.
    notes: notes.trim(),
    status: 'pending', // Pending manual review & call by Ekrem
    createdAt: new Date().toISOString(),
    approvedAt: null
  };

  partners.unshift(newPartner);
  writeJson('b2b_partners.json', partners);

  const { passwordHash, ...safePartner } = newPartner;
  return safePartner;
}

export function loginB2BPartner(email, password) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  const partner = getB2BPartnerByEmail(email);
  if (!partner) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = verifyPartnerPassword(password, partner.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Gatekeeping: partner cannot access portal until Ekrem reviews & approves
  if (partner.status === 'pending') {
    const err = new Error('Your trade account application is currently pending verification. Ekrem will contact you before portal activation.');
    err.code = 'PENDING_APPROVAL';
    throw err;
  }

  if (partner.status === 'rejected') {
    const err = new Error('Your trade partner application was not approved. Please contact us directly.');
    err.code = 'APPLICATION_REJECTED';
    throw err;
  }

  // Generate session token
  const token = partnerTokenManager.create(partner.id);
  const { passwordHash, ...safePartner } = partner;
  return { token, partner: safePartner };
}

export function verifyB2BPartnerToken(token) {
  if (!token) return null;
  const partnerId = partnerTokenManager.validate(token);
  if (!partnerId) return null;
  const partner = getB2BPartnerById(partnerId);
  if (!partner || partner.status !== 'approved') return null;
  return partner;
}

export function revokeB2BPartnerToken(token) {
  partnerTokenManager.revoke(token);
  return true;
}

export function updateB2BPartner(id, updates) {
  const partners = readJson('b2b_partners.json', []);
  const index = partners.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Partner not found');

  const existing = partners[index];
  const allowedUpdates = [
    'companyName',
    'contactPerson',
    'phone',
    'email',
    'tradeType',
    'jobVolumeEstimate',
    'paymentTerms', // 'daily' | 'weekly'
    'notes',
    'status' // 'pending' | 'approved' | 'rejected'
  ];

  const merged = { ...existing };
  for (const field of allowedUpdates) {
    if (updates[field] !== undefined) {
      merged[field] = updates[field];
    }
  }

  // If status is transitioning to approved
  if (updates.status === 'approved' && existing.status !== 'approved') {
    merged.approvedAt = new Date().toISOString();
  }

  // Enforce strictly daily or weekly payment terms
  if (merged.paymentTerms !== 'daily' && merged.paymentTerms !== 'weekly') {
    merged.paymentTerms = 'weekly';
  }

  merged.updatedAt = new Date().toISOString();
  partners[index] = merged;
  writeJson('b2b_partners.json', partners);

  const { passwordHash, ...safe } = merged;
  return safe;
}

export function deleteB2BPartner(id) {
  const partners = readJson('b2b_partners.json', []);
  const filtered = partners.filter(p => p.id !== id);
  writeJson('b2b_partners.json', filtered);
  return true;
}

// -------------------------------------------------------------
// B2B Jobs Pipeline Management
// -------------------------------------------------------------
export function getB2BJobs(partnerId = null) {
  const jobs = readJson('b2b_jobs.json', []);
  if (partnerId) {
    return jobs.filter(j => j.partnerId === partnerId);
  }
  return jobs;
}

export function createB2BJob(jobData) {
  const jobs = readJson('b2b_jobs.json', []);
  const partner = getB2BPartnerById(jobData.partnerId);

  const myNetPrice = Number(jobData.myNetPrice) || 0;
  const partnerGrossPrice = Number(jobData.partnerGrossPrice) || 0;
  const partnerProfit = Math.max(0, Math.round((partnerGrossPrice - myNetPrice) * 100) / 100);

  const newJob = {
    id: jobData.id || 'b2b_job_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10),
    partnerId: jobData.partnerId,
    partnerCompanyName: partner ? partner.companyName : (jobData.partnerCompanyName || 'Direct Partner'),
    partnerContact: partner ? `${partner.contactPerson} (${partner.phone})` : (jobData.partnerContact || ''),
    propertyAddress: jobData.propertyAddress || 'Address not specified',
    tenantName: jobData.tenantName || 'Tenant',
    tenantPhone: jobData.tenantPhone || '',
    accessMethod: jobData.accessMethod || 'Direct tenant contact',
    jobTitle: jobData.jobTitle || 'Property Maintenance Job',
    jobDescription: jobData.jobDescription || '',
    urgency: jobData.urgency || 'flexible', // urgent | this-week | flexible
    status: jobData.status || 'new', // new | quote_sent | approved | scheduled | in_progress | completed | cancelled
    scheduledDate: jobData.scheduledDate || null,
    scheduledTime: jobData.scheduledTime || null,
    myNetPrice,
    partnerGrossPrice,
    partnerProfit,
    paymentTerms: jobData.paymentTerms || (partner ? partner.paymentTerms : 'weekly'),
    paymentStatus: jobData.paymentStatus || 'unpaid', // unpaid | paid
    paidAt: jobData.paymentStatus === 'paid' ? new Date().toISOString() : null,
    syncedToAccounting: false,
    adminNotes: jobData.adminNotes || '',
    createdAt: new Date().toISOString()
  };

  jobs.unshift(newJob);
  writeJson('b2b_jobs.json', jobs);
  return newJob;
}

export function updateB2BJob(id, updates) {
  const jobs = readJson('b2b_jobs.json', []);
  const index = jobs.findIndex(j => j.id === id);
  if (index === -1) throw new Error('B2B Job not found');

  const existing = jobs[index];
  const merged = { ...existing, ...updates };

  // Recalculate profit if prices were updated
  if (updates.myNetPrice !== undefined || updates.partnerGrossPrice !== undefined) {
    const net = Number(merged.myNetPrice) || 0;
    const gross = Number(merged.partnerGrossPrice) || 0;
    merged.myNetPrice = net;
    merged.partnerGrossPrice = gross;
    merged.partnerProfit = Math.max(0, Math.round((gross - net) * 100) / 100);
  }

  // Handle paid status timestamp
  if (updates.paymentStatus === 'paid' && existing.paymentStatus !== 'paid') {
    merged.paidAt = new Date().toISOString();
  } else if (updates.paymentStatus === 'unpaid') {
    merged.paidAt = null;
  }

  merged.updatedAt = new Date().toISOString();
  jobs[index] = merged;
  writeJson('b2b_jobs.json', jobs);
  return merged;
}

export function deleteB2BJob(id) {
  const jobs = readJson('b2b_jobs.json', []);
  const filtered = jobs.filter(j => j.id !== id);
  writeJson('b2b_jobs.json', filtered);
  return true;
}

export function syncB2BJobToAccounting(jobId) {
  const jobs = readJson('b2b_jobs.json', []);
  const index = jobs.findIndex(j => j.id === jobId);
  if (index === -1) throw new Error('B2B Job not found');

  const job = jobs[index];
  if (job.syncedToAccounting) {
    return { alreadySynced: true, job };
  }

  const financeRecord = saveFinanceRecord({
    type: 'job',
    customerName: `${job.partnerCompanyName} (${job.propertyAddress})`,
    customerPhone: job.tenantPhone || '',
    postcode: 'Edinburgh',
    service: `B2B: ${job.jobTitle || 'Maintenance'}`,
    revenue: job.myNetPrice,
    materialCost: 0,
    otherExpenses: 0,
    paymentStatus: job.paymentStatus === 'paid' ? 'paid_bank' : 'pending',
    date: job.scheduledDate || new Date().toISOString().split('T')[0],
    notes: `[B2B Subcontract Job #${job.id}]\nPartner: ${job.partnerCompanyName}\nTenant: ${job.tenantName} (${job.tenantPhone})\nEkrem Net: £${job.myNetPrice} | Partner Gross: £${job.partnerGrossPrice} (Kâr: £${job.partnerProfit})\nAccess: ${job.accessMethod}`
  });

  job.syncedToAccounting = true;
  job.accountingRecordId = financeRecord.id;
  job.updatedAt = new Date().toISOString();
  jobs[index] = job;
  writeJson('b2b_jobs.json', jobs);

  return { success: true, financeRecord, job };
}



