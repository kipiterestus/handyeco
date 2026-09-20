import express from 'express';
import fs from 'fs';
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
  deleteQuoteRecord, 
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
  resetTotp,
  readJson,
  writeJson
} from './store.js';
import { sendTelegramNotification, sendTelegramDailyAppointmentReminder } from './telegram.js';
import { syncReviews } from './reviewsSync.js';
import { SECURITY_HEADERS, loginRateLimiter, quoteRateLimiter, corsMiddleware } from './security.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Trust reverse proxy (Railway, Cloudflare, Nginx)
app.set('trust proxy', 1);

// Resolve real client IP behind Cloudflare and proxies
function getClientIp(req) {
  return (
    req.headers['cf-connecting-ip'] ||
    req.headers['x-real-ip'] ||
    (req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0].trim() : null) ||
    req.ip ||
    req.socket?.remoteAddress ||
    '127.0.0.1'
  );
}

// Standard OWASP Security Headers middleware
app.use((req, res, next) => {
  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
  for (const [header, val] of Object.entries(SECURITY_HEADERS)) {
    // HSTS must only be sent on HTTPS connections to avoid breaking HTTP dev sessions
    if (header === 'Strict-Transport-Security' && !isHttps) continue;
    res.setHeader(header, val);
  }
  next();
});

// Restricted CORS (only allowed origins from .env ALLOWED_ORIGIN)
app.use(corsMiddleware);

// 10MB limit protects against memory exhaustion attacks while allowing base64 photos
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded images statically (from volume and fallback)
app.use('/uploads', express.static(path.join(process.cwd(), 'server', 'data', 'uploads')));
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Serve production build files if present
const distDir = path.join(process.cwd(), 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}


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
  const clientIp = getClientIp(req); // Use Cloudflare-aware IP extraction
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
const pendingTotpSessions = new Map(); // tempToken -> { expiresAt, setupSecret }

app.post('/api/auth/login', async (req, res) => {
  const clientIp = getClientIp(req);
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
    pendingTotpSessions.set(tempToken, { expiresAt: Date.now() + 15 * 60 * 1000, setupSecret: setup.secretBase32 });
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
  pendingTotpSessions.set(tempToken, { expiresAt: Date.now() + 15 * 60 * 1000 });
  console.log('[Auth] Password OK. Awaiting TOTP verification...');
  return res.json({ success: true, needsTotp: true, tempToken });
});

// Confirm 6-digit TOTP code (also used for initial QR setup confirmation)
app.post('/api/auth/totp', async (req, res) => {
  const clientIp = getClientIp(req);
  const rateLimit = loginRateLimiter.check(clientIp);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      success: false,
      error: `Too many attempts. Please wait ${rateLimit.waitSeconds} seconds.`
    });
  }

  const { tempToken, code } = req.body;
  if (!tempToken || !code) {
    return res.status(400).json({ success: false, error: 'tempToken and code are required.' });
  }

  const session = pendingTotpSessions.get(tempToken);
  if (!session || Date.now() > session.expiresAt) {
    pendingTotpSessions.delete(tempToken);
    return res.status(401).json({ success: false, error: 'Session expired. Please click "Şifre ekranına dön" and login again.' });
  }

  // If this is first-time setup, we need to save the secret first then verify
  if (session.setupSecret) {
    // Save the secret before verifying (so verifyTotpCode can read it)
    saveTotpSecret(session.setupSecret);
  }

  if (!verifyTotpCode(code)) {
    // If setup failed, remove the saved secret so they have to restart
    if (session.setupSecret) resetTotp();
    return res.status(401).json({ success: false, error: 'Invalid or expired 2FA code. Please check the code on your phone and try again.' });
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

// Delete quote lead
app.delete('/api/quotes/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    deleteQuoteRecord(id);
    res.json({ success: true });
  } catch (err) {
    console.error('[API] Delete quote error:', err);
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

// Auto-detect Telegram Chat ID from bot updates
app.post('/api/telegram/detect-chat-id', requireAuth, async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, error: 'Telegram Bot Token gerekli.' });
    }
    const response = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
    const data = await response.json();
    if (!data.ok) {
      return res.status(400).json({ success: false, error: data.description || 'Bot güncellemeleri alınamadı.' });
    }
    if (!data.result || data.result.length === 0) {
      return res.json({
        success: false,
        empty: true,
        error: 'Henüz bota bir mesaj ulaşmadı. Lütfen Telegram uygulamasında botunuza girip BAŞLAT (START) veya herhangi bir mesaj (ör. "merhaba") gönderin, ardından bu butona tekrar basın.'
      });
    }
    // Get the most recent message / chat update
    const lastUpdate = data.result[data.result.length - 1];
    const chat = lastUpdate.message?.chat || lastUpdate.channel_post?.chat || lastUpdate.my_chat_member?.chat;
    if (!chat || !chat.id) {
      return res.json({ success: false, error: 'Mesaj bulundu ancak Chat ID ayrıştırılamadı.' });
    }
    res.json({
      success: true,
      chatId: String(chat.id),
      name: chat.first_name || chat.title || 'Kullanıcı',
      username: chat.username || ''
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Send Tomorrow's Appointment Reminder via Telegram (Manual or Automatic Trigger)
app.post('/api/telegram/reminders', requireAuth, async (req, res) => {
  try {
    const siteConfig = getSection('siteConfig') || {};
    const botToken = siteConfig.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN;
    const chatId = siteConfig.telegramChatId || process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return res.status(400).json({
        success: false,
        error: 'Telegram Bot Token ve Chat ID yapılandırılmamış. Lütfen Yönetim Panelinden Telegram sekmesini kontrol edin.'
      });
    }

    // Default to tomorrow in UK time (YYYY-MM-DD)
    const targetDate = req.body?.targetDate || (() => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d.toLocaleDateString('en-CA', { timeZone: 'Europe/London' });
    })();

    const allSchedule = getSchedule() || [];
    const targetJobs = allSchedule.filter(j => j.date === targetDate && j.status !== 'cancelled');

    const result = await sendTelegramDailyAppointmentReminder(targetJobs, targetDate, botToken, chatId);
    res.json({
      ...result,
      targetDate,
      message: targetJobs.length > 0
        ? `${targetDate} tarihli ${targetJobs.length} adet randevu hatırlatması Telegram'a başarıyla iletildi!`
        : `${targetDate} için planlanmış iş olmadığı bilgisi Telegram'a iletildi.`
    });
  } catch (err) {
    console.error('[Telegram] Reminder error:', err);
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

// Automated Daily Appointment Reminders (Checks every 15 minutes, dispatches once daily between 19:00 and 22:00 UK time)
async function checkAndSendAppointmentReminders() {
  try {
    const siteConfig = getSection('siteConfig') || {};
    const botToken = siteConfig.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN;
    const chatId = siteConfig.telegramChatId || process.env.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) return;

    // Current hour in UK time
    const nowUk = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', hour12: false });
    const currentHour = parseInt(nowUk, 10);

    // Send reminders in the evening between 19:00 and 22:00 (7 PM - 10 PM) UK time for the next day
    if (currentHour >= 19 && currentHour <= 22) {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      const tomorrowDate = d.toLocaleDateString('en-CA', { timeZone: 'Europe/London' });

      // Check persisted state to ensure we only dispatch ONCE per day (even if server restarts)
      const reminderState = readJson('reminder_state.json', {});
      if (reminderState.lastReminderDateSent === tomorrowDate) {
        return;
      }

      const allSchedule = getSchedule() || [];
      const tomorrowJobs = allSchedule.filter(j => j.date === tomorrowDate && j.status !== 'cancelled');

      console.log(`\n[AutoReminder] ⏰ ${tomorrowDate} tarihi için otomatik Telegram bildirimi iletiliyor (İş sayısı: ${tomorrowJobs.length})...`);
      await sendTelegramDailyAppointmentReminder(tomorrowJobs, tomorrowDate, botToken, chatId);

      // Persist state to prevent repeated notifications on subsequent checks or restarts
      writeJson('reminder_state.json', {
        lastReminderDateSent: tomorrowDate,
        sentAt: new Date().toISOString(),
        jobCount: tomorrowJobs.length
      });
      console.log(`[AutoReminder] ✅ ${tomorrowDate} hatırlatması başarıyla tamamlandı ve kaydedildi.`);
    }
  } catch (err) {
    console.error('[AutoReminder Error]:', err.message);
  }
}

setInterval(checkAndSendAppointmentReminders, 15 * 60 * 1000);
setTimeout(checkAndSendAppointmentReminders, 5000);

// Client-side SPA routing fallback (serves index.html for non-API routes in production)
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexPath = path.join(process.cwd(), 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(404).send('Not Found');
});

app.listen(PORT, () => {
  console.log(`\n🚀 Handyeco API Server active at: http://localhost:${PORT}`);
  console.log(`📱 Telegram Bot: ${process.env.TELEGRAM_BOT_TOKEN ? '✅ Configured' : '⚠️ Ready via Admin Panel or .env'}`);
  console.log(`🔔 Otomatik Randevu Hatırlatıcısı: Aktif (Her gün 19:00 - 21:00 arası ertesi gün için gönderilir)`);
});

