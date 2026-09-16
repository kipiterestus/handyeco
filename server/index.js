import express from 'express';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  getAllContent, 
  updateSection, 
  saveBase64Image, 
  getQuotes, 
  saveQuoteRecord, 
  updateQuoteStatus, 
  verifyAdminPassword, 
  createAdminToken, 
  isValidToken, 
  revokeToken,
  getSection,
  getFinances,
  saveFinanceRecord,
  updateFinanceRecord,
  deleteFinanceRecord,
  getSchedule,
  saveScheduleJob,
  updateScheduleJob,
  deleteScheduleJob,
  isTotpConfigured,
  verifyTotpCode,
  generateTotpSetup,
  saveTotpSecret,
  resetTotp
} from './store.js';
import { sendTelegramNotification } from './telegram.js';
import { syncReviews } from './reviewsSync.js';
import { SECURITY_HEADERS, loginRateLimiter, quoteRateLimiter, corsMiddleware } from './security.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Standard OWASP Security Headers middleware
app.use((req, res, next) => {
  for (const [header, val] of Object.entries(SECURITY_HEADERS)) {
    res.setHeader(header, val);
  }
  next();
});

// Restricted CORS (only allowed origins from .env ALLOWED_ORIGIN)
app.use(corsMiddleware);

// 10MB limit protects against memory exhaustion attacks while allowing base64 photos
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));


// Auth middleware guard for protected routes
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  if (!isValidToken(token)) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Please log in.' });
  }
  next();
}

// --- PUBLIC API ROUTES ---

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Handyeco Full Stack Backend API',
    telegramConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
    timestamp: new Date().toISOString()
  });
});

// 2. Fetch full public site content
app.get('/api/content', (req, res) => {
  try {
    const content = getAllContent();
    res.json({ success: true, content });
  } catch (err) {
    console.error('[API] Error getting content:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Customer quote submission with Telegram dispatch & Rate Limiting
app.post('/api/quote', async (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const rateLimit = quoteRateLimiter.check(clientIp);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      success: false,
      error: `Too many submissions from this connection. Please wait ${rateLimit.waitSeconds} seconds before trying again.`
    });
  }

  try {
    const quote = req.body;
    console.log('\n[API] 📩 New quote submission received:', quote.name, quote.phone, quote.service);

    // Save quote record locally (with sanitization)
    const saved = saveQuoteRecord(quote);

    // Send Telegram alert
    const siteConfig = getSection('siteConfig') || {};
    const botToken = siteConfig.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN;
    const chatId = siteConfig.telegramChatId || process.env.TELEGRAM_CHAT_ID;
    const telegramResult = await sendTelegramNotification(quote, botToken, chatId);

    res.status(200).json({
      success: true,
      message: 'Quote received and saved',
      quoteId: saved.id,
      telegramDelivered: telegramResult.delivered
    });
  } catch (error) {
    console.error('[API] Error processing quote:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// --- AUTHENTICATION ROUTES ---

// Step 1: Verify password → if 2FA set up, return needsTotp:true; else return token directly
// Step 2 (if needsTotp): POST /api/auth/totp with the 6-digit code and a temporary passThroughToken
// On success → return the real session token

// Temporary pass-through store for confirmed-password sessions pending TOTP
const pendingTotpSessions = new Map(); // tempToken -> { ip, expiresAt }

app.post('/api/auth/login', async (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const rateLimit = loginRateLimiter.check(clientIp);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      success: false,
      error: `Too many failed login attempts. Please wait ${rateLimit.waitSeconds} seconds before trying again.`
    });
  }

  const { password } = req.body;
  if (!verifyAdminPassword(password)) {
    console.warn('[Auth] Failed admin login attempt from', clientIp);
    return res.status(401).json({ success: false, error: 'Invalid admin password.' });
  }

  loginRateLimiter.reset(clientIp);

  // Check whether 2FA is configured
  if (!isTotpConfigured()) {
    // 2FA not yet configured: generate setup QR and send to client
    console.log('[Auth] Password OK. 2FA not configured. Sending QR setup...');
    const setup = await generateTotpSetup();
    // Issue a short-lived temp token so the TOTP confirm endpoint knows the password was verified
    const tempToken = Buffer.from(crypto.randomBytes(24)).toString('hex');
    pendingTotpSessions.set(tempToken, { ip: clientIp, expiresAt: Date.now() + 5 * 60 * 1000, setupSecret: setup.secretBase32 });
    return res.json({
      success: true,
      needsTotpSetup: true,
      tempToken,
      qrDataUrl: setup.qrDataUrl,
      secretBase32: setup.secretBase32,
      message: 'Scan QR code with Google Authenticator then confirm with a 6-digit code.'
    });
  }

  // 2FA configured: issue temp token requiring TOTP confirmation
  const tempToken = Buffer.from(crypto.randomBytes(24)).toString('hex');
  pendingTotpSessions.set(tempToken, { ip: clientIp, expiresAt: Date.now() + 5 * 60 * 1000 });
  console.log('[Auth] Password OK. Awaiting TOTP verification...');
  return res.json({ success: true, needsTotp: true, tempToken });
});

// Confirm 6-digit TOTP code (also used for initial QR setup confirmation)
app.post('/api/auth/totp', async (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const rateLimit = loginRateLimiter.check(clientIp);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      success: false,
      error: `Too many attempts. Please wait ${rateLimit.waitSeconds} seconds.`
    });
  }

  const { tempToken, code, setupSecret } = req.body;
  if (!tempToken || !code) {
    return res.status(400).json({ success: false, error: 'tempToken and code are required.' });
  }

  const session = pendingTotpSessions.get(tempToken);
  if (!session || session.ip !== clientIp || Date.now() > session.expiresAt) {
    pendingTotpSessions.delete(tempToken);
    return res.status(401).json({ success: false, error: 'Session expired. Please start login again.' });
  }

  // If this is first-time setup, we need to save the secret first then verify
  if (session.setupSecret) {
    // Save the secret before verifying (so verifyTotpCode can read it)
    saveTotpSecret(session.setupSecret);
  }

  if (!verifyTotpCode(code)) {
    // If setup failed, remove the saved secret so they have to restart
    if (session.setupSecret) resetTotp();
    return res.status(401).json({ success: false, error: 'Invalid or expired 2FA code. Please try again.' });
  }

  pendingTotpSessions.delete(tempToken);
  loginRateLimiter.reset(clientIp);
  const token = createAdminToken();
  console.log('[Auth] Admin logged in with 2FA successfully.');
  return res.json({ success: true, token });
});

// Reset 2FA (requires current session token - admin only)
app.post('/api/auth/totp/reset', requireAuth, (req, res) => {
  resetTotp();
  console.log('[Auth] 2FA TOTP reset by authenticated admin.');
  return res.json({ success: true, message: '2FA has been reset. You will be prompted to re-configure on next login.' });
});

// Check TOTP status
app.get('/api/auth/totp/status', requireAuth, (req, res) => {
  return res.json({ configured: isTotpConfigured() });
});

app.get('/api/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  res.json({ valid: isValidToken(token) });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  revokeToken(token);
  res.json({ success: true });
});

// Clean up expired pending TOTP sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of pendingTotpSessions.entries()) {
    if (now > session.expiresAt) pendingTotpSessions.delete(token);
  }
}, 5 * 60 * 1000);


// --- PROTECTED ADMIN API ROUTES ---

// Update any content section
app.put('/api/content/:section', requireAuth, (req, res) => {
  try {
    const { section } = req.params;
    const data = req.body;
    const updated = updateSection(section, data);
    console.log(`[Store] Section '${section}' updated by admin.`);
    res.json({ success: true, section, data: updated });
  } catch (err) {
    console.error('[API] Update error:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// Image upload and automatic Sharp optimization
app.post('/api/upload', requireAuth, async (req, res) => {
  try {
    const { dataUrl, filename } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ success: false, error: 'dataUrl is required' });
    }
    const publicUrl = await saveBase64Image(dataUrl, filename);
    console.log(`[Upload] Image saved and optimized: ${publicUrl}`);
    res.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error('[API] Upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all quote leads
app.get('/api/quotes', requireAuth, (req, res) => {
  try {
    const quotes = getQuotes();
    res.json({ success: true, quotes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update quote lead status / notes
app.patch('/api/quotes/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = updateQuoteStatus(id, updates);
    res.json({ success: true, quote: updated });
  } catch (err) {
    console.error('[API] Update quote error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Test Telegram notification
app.post('/api/telegram/test', requireAuth, async (req, res) => {
  try {
    const { token, chatId } = req.body;
    const testQuote = {
      name: 'Handyeco Test Lead',
      phone: '+44 7760 696723',
      postcode: 'EH1 1AA (Edinburgh City Centre)',
      service: 'Flat-Pack Furniture Assembly & TV Mounting',
      urgency: 'urgent',
      details: 'This is a test notification from your Handyeco Admin Panel. Your Telegram phone alerts are working properly!',
      photosCount: 1
    };
    const result = await sendTelegramNotification(testQuote, token, chatId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Sync Google & MyBuilder reviews
app.post('/api/reviews/sync', requireAuth, async (req, res) => {
  try {
    const result = await syncReviews();
    const reviews = getSection('reviews') || [];
    res.json({ ...result, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Financial Management / Bookkeeping
app.get('/api/finances', requireAuth, (req, res) => {
  res.json({ success: true, finances: getFinances() });
});

app.post('/api/finances', requireAuth, (req, res) => {
  try {
    const record = saveFinanceRecord(req.body);
    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/finances/:id', requireAuth, (req, res) => {
  try {
    const updated = updateFinanceRecord(req.params.id, req.body);
    res.json({ success: true, record: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/finances/:id', requireAuth, (req, res) => {
  try {
    deleteFinanceRecord(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Job Schedule & Appointment Management
app.get('/api/schedule', requireAuth, (req, res) => {
  res.json({ success: true, schedule: getSchedule() });
});

app.post('/api/schedule', requireAuth, (req, res) => {
  try {
    const job = saveScheduleJob(req.body);
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/schedule/:id', requireAuth, (req, res) => {
  try {
    const updated = updateScheduleJob(req.params.id, req.body);
    res.json({ success: true, job: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/schedule/:id', requireAuth, (req, res) => {
  try {
    deleteScheduleJob(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// Hourly background review synchronization
setInterval(() => {
  syncReviews().catch(err => console.error('[AutoSync Error]:', err));
}, 60 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`\n🚀 Handyeco API Server active at: http://localhost:${PORT}`);
  console.log(`📱 Telegram Bot: ${process.env.TELEGRAM_BOT_TOKEN ? '✅ Configured' : '⚠️ Ready via Admin Panel or .env'}`);
});
