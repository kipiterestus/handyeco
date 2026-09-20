import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
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
} from './server/store.js';
import { sendTelegramNotification } from './server/telegram.js';
import { syncReviews } from './server/reviewsSync.js';
import { SECURITY_HEADERS, loginRateLimiter, quoteRateLimiter } from './server/security.js';

// Shared pending TOTP sessions (dev server only)
const pendingTotpSessions = new Map();
const totpTimer = setInterval(() => {
  const now = Date.now();
  for (const [token, session] of pendingTotpSessions.entries()) {
    if (now > session.expiresAt) pendingTotpSessions.delete(token);
  }
}, 5 * 60 * 1000);
if (totpTimer.unref) totpTimer.unref();


function readEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  const env = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [k, ...v] = trimmed.split('=');
        if (k) env[k.trim()] = v.join('=').trim();
      }
    }
  }
  return env;
}

function parseBody(req, limitBytes = 10 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = '';
    let bytesReceived = 0;
    req.on('data', chunk => {
      bytesReceived += chunk.length;
      if (bytesReceived > limitBytes) {
        req.destroy();
        reject(new Error('Payload Too Large: Max 10MB allowed'));
        return;
      }
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const backendApiPlugin = () => ({
  name: 'backend-api-plugin',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      // Only intercept /api/*
      if (!req.url?.startsWith('/api/')) return next();

      const url = new URL(req.url, 'http://localhost');
      const pathname = url.pathname;
      const method = req.method;
      const clientIp = req.socket?.remoteAddress || '127.0.0.1';

      const sendJson = (status, obj) => {
        const allowedOrigin = req.headers.origin && (
          req.headers.origin.startsWith('http://localhost') ||
          req.headers.origin.startsWith('http://127.0.0.1') ||
          req.headers.origin.endsWith('handyeco.co.uk')
        ) ? req.headers.origin : 'http://localhost:5173';
        res.writeHead(status, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigin,
          'Vary': 'Origin',
          ...SECURITY_HEADERS
        });
        res.end(JSON.stringify(obj));
      };

      try {
        // 1. Health check
        if (pathname === '/api/health' && method === 'GET') {
          const env = readEnv();
          return sendJson(200, {
            status: 'ok',
            service: 'Handyeco Full Stack Backend API',
            telegramConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN || env.TELEGRAM_BOT_TOKEN)
          });
        }

        // 2. Public Content Fetch
        if (pathname === '/api/content' && method === 'GET') {
          const content = getAllContent();
          return sendJson(200, { success: true, content });
        }

        // 3. Customer Quote Submission with Rate Limiting
        if (pathname === '/api/quote' && method === 'POST') {
          const limit = quoteRateLimiter.check(clientIp);
          if (!limit.allowed) {
            return sendJson(429, { 
              success: false, 
              error: `Too many quote submissions. Please wait ${limit.waitSeconds} seconds.` 
            });
          }

          const quote = await parseBody(req);
          console.log('\n[API] 📩 New quote submission:', quote.name, quote.phone, quote.service);
          const saved = saveQuoteRecord(quote);
          const env = readEnv();
          const siteConfig = getSection('siteConfig') || {};
          const token = siteConfig.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN || env.TELEGRAM_BOT_TOKEN;
          const chatId = siteConfig.telegramChatId || process.env.TELEGRAM_CHAT_ID || env.TELEGRAM_CHAT_ID;
          const tgRes = await sendTelegramNotification(quote, token, chatId);
          return sendJson(200, { success: true, quoteId: saved.id, telegramDelivered: tgRes.delivered });
        }

        // 4. Admin Auth Login with Rate Limiting & 2FA
        if (pathname === '/api/auth/login' && method === 'POST') {
          const limit = loginRateLimiter.check(clientIp);
          if (!limit.allowed) {
            return sendJson(429, { 
              success: false, 
              error: `Too many failed login attempts. Please wait ${limit.waitSeconds} seconds.` 
            });
          }

          const { password } = await parseBody(req);
          if (!verifyAdminPassword(password)) {
            return sendJson(401, { success: false, error: 'Invalid admin password' });
          }

          loginRateLimiter.reset(clientIp);

          if (!isTotpConfigured()) {
            const setup = await generateTotpSetup();
            const tempToken = crypto.randomBytes(24).toString('hex');
            pendingTotpSessions.set(tempToken, { ip: clientIp, expiresAt: Date.now() + 5 * 60 * 1000, setupSecret: setup.secretBase32 });
            return sendJson(200, {
              success: true, needsTotpSetup: true, tempToken,
              qrDataUrl: setup.qrDataUrl, secretBase32: setup.secretBase32,
              message: 'Scan QR code with Google Authenticator then confirm with a 6-digit code.'
            });
          }

          const tempToken = crypto.randomBytes(24).toString('hex');
          pendingTotpSessions.set(tempToken, { ip: clientIp, expiresAt: Date.now() + 5 * 60 * 1000 });
          return sendJson(200, { success: true, needsTotp: true, tempToken });
        }

        // 4b. TOTP 2FA Confirm
        if (pathname === '/api/auth/totp' && method === 'POST') {
          const limit = loginRateLimiter.check(clientIp);
          if (!limit.allowed) {
            return sendJson(429, { success: false, error: `Too many attempts. Please wait ${limit.waitSeconds} seconds.` });
          }
          const { tempToken, code } = await parseBody(req);
          if (!tempToken || !code) {
            return sendJson(400, { success: false, error: 'tempToken and code are required.' });
          }
          const session = pendingTotpSessions.get(tempToken);
          if (!session || Date.now() > session.expiresAt) {
            pendingTotpSessions.delete(tempToken);
            return sendJson(401, { success: false, error: 'Session expired. Please start login again.' });
          }
          if (session.setupSecret) saveTotpSecret(session.setupSecret);
          if (!verifyTotpCode(code)) {
            if (session.setupSecret) resetTotp();
            return sendJson(401, { success: false, error: 'Invalid or expired 2FA code. Please try again.' });
          }
          pendingTotpSessions.delete(tempToken);
          loginRateLimiter.reset(clientIp);
          const token = createAdminToken();
          console.log('[Auth] Admin logged in with 2FA.');
          return sendJson(200, { success: true, token });
        }

        // 4c. TOTP Reset
        if (pathname === '/api/auth/totp/reset' && method === 'POST') {
          const auth = req.headers.authorization;
          const token = auth?.startsWith('Bearer ') ? auth.substring(7) : null;
          if (!isValidToken(token)) return sendJson(401, { success: false, error: 'Unauthorized' });
          resetTotp();
          return sendJson(200, { success: true, message: '2FA has been reset.' });
        }

        // 4d. TOTP Status
        if (pathname === '/api/auth/totp/status' && method === 'GET') {
          const auth = req.headers.authorization;
          const token = auth?.startsWith('Bearer ') ? auth.substring(7) : null;
          if (!isValidToken(token)) return sendJson(401, { success: false, error: 'Unauthorized' });
          return sendJson(200, { configured: isTotpConfigured() });
        }

        // 5. Auth Verify
        if (pathname === '/api/auth/verify' && method === 'GET') {
          const auth = req.headers.authorization;
          const token = auth?.startsWith('Bearer ') ? auth.substring(7) : null;
          return sendJson(200, { valid: isValidToken(token) });
        }

        // 6. Auth Logout
        if (pathname === '/api/auth/logout' && method === 'POST') {
          const auth = req.headers.authorization;
          const token = auth?.startsWith('Bearer ') ? auth.substring(7) : null;
          revokeToken(token);
          return sendJson(200, { success: true });
        }

        // Protected routes auth guard check
        const auth = req.headers.authorization;
        const token = auth?.startsWith('Bearer ') ? auth.substring(7) : null;
        const isAuth = isValidToken(token);

        // 7. Update Section Content
        if (pathname.startsWith('/api/content/') && method === 'PUT') {
          if (!isAuth) return sendJson(401, { success: false, error: 'Unauthorized' });
          const section = pathname.replace('/api/content/', '');
          const body = await parseBody(req);
          const updated = updateSection(section, body);
          return sendJson(200, { success: true, section, data: updated });
        }

        // 8. Image Upload
        if (pathname === '/api/upload' && method === 'POST') {
          if (!isAuth) return sendJson(401, { success: false, error: 'Unauthorized' });
          const { dataUrl, filename } = await parseBody(req);
          const publicUrl = await saveBase64Image(dataUrl, filename);
          return sendJson(200, { success: true, url: publicUrl });
        }

        // 9. Quotes List
        if (pathname === '/api/quotes' && method === 'GET') {
          if (!isAuth) return sendJson(401, { success: false, error: 'Unauthorized' });
          const quotes = getQuotes();
          return sendJson(200, { success: true, quotes });
        }

        // 10. Update Quote Status
        if (pathname.startsWith('/api/quotes/') && method === 'PATCH') {
          if (!isAuth) return sendJson(401, { success: false, error: 'Unauthorized' });
          const id = pathname.replace('/api/quotes/', '');
          const updates = await parseBody(req);
          const updated = updateQuoteStatus(id, updates);
          return sendJson(200, { success: true, quote: updated });
        }

        // 11. Test Telegram Notification
        if (pathname === '/api/telegram/test' && method === 'POST') {
          if (!isAuth) return sendJson(401, { success: false, error: 'Unauthorized' });
          const body = await parseBody(req);
          const testQuote = {
            name: 'Handyeco Test Lead',
            phone: '+44 7760 696723',
            postcode: 'EH1 1AA (Edinburgh City Centre)',
            service: 'Flat-Pack Furniture Assembly & TV Mounting',
            urgency: 'urgent',
            details: 'This is a test notification from your Handyeco Admin Panel. Your Telegram phone alerts are working properly!',
            photosCount: 1
          };
          const tgRes = await sendTelegramNotification(testQuote, body.token, body.chatId);
          return sendJson(200, tgRes);
        }

        // 11b. Auto-detect Telegram Chat ID from bot updates
        if (pathname === '/api/telegram/detect-chat-id' && method === 'POST') {
          if (!isAuth) return sendJson(401, { success: false, error: 'Unauthorized' });
          const body = await parseBody(req);
          if (!body.token) return sendJson(400, { success: false, error: 'Token gerekli.' });
          try {
            const resp = await fetch(`https://api.telegram.org/bot${body.token}/getUpdates`);
            const data = await resp.json();
            if (!data.ok) return sendJson(400, { success: false, error: data.description });
            if (!data.result || data.result.length === 0) {
              return sendJson(200, {
                success: false,
                empty: true,
                error: 'Henüz bota bir mesaj ulaşmadı. Lütfen Telegram uygulamasında botunuza girip BAŞLAT (START) veya herhangi bir mesaj (ör. "merhaba") gönderin, ardından bu butona tekrar basın.'
              });
            }
            const lastUpdate = data.result[data.result.length - 1];
            const chat = lastUpdate.message?.chat || lastUpdate.channel_post?.chat || lastUpdate.my_chat_member?.chat;
            if (!chat || !chat.id) return sendJson(200, { success: false, error: 'Chat ID ayrıştırılamadı.' });
            return sendJson(200, {
              success: true,
              chatId: String(chat.id),
              name: chat.first_name || chat.title || 'Kullanıcı',
              username: chat.username || ''
            });
          } catch (e) {
            return sendJson(500, { success: false, error: e.message });
          }
        }

        // 12. Sync Google & MyBuilder Reviews
        if (pathname === '/api/reviews/sync' && method === 'POST') {
          if (!isAuth) return sendJson(401, { success: false, error: 'Unauthorized' });
          const syncResult = await syncReviews();
          const reviews = getSection('reviews') || [];
          return sendJson(200, { ...syncResult, reviews });
        }

        // 13. Finances (Bookkeeping & Profit Tracking)
        if (pathname === '/api/finances' && method === 'GET') {
          if (!isAuth) return sendJson(401, { success: false, error: 'Unauthorized' });
          const records = getFinances();
          return sendJson(200, { success: true, finances: records });
        }

        if (pathname === '/api/finances' && method === 'POST') {
          if (!isAuth) return sendJson(401, { success: false, error: 'Unauthorized' });
          const body = await parseBody(req);
          const saved = saveFinanceRecord(body);
          return sendJson(200, { success: true, record: saved });
        }

        if (pathname.startsWith('/api/finances/') && method === 'PUT') {
          if (!isAuth) return sendJson(401, { success: false, error: 'Unauthorized' });
          const id = pathname.replace('/api/finances/', '');
          const body = await parseBody(req);
          const updated = updateFinanceRecord(id, body);
          return sendJson(200, { success: true, record: updated });
        }

        if (pathname.startsWith('/api/finances/') && method === 'DELETE') {
          if (!isAuth) return sendJson(401, { success: false, error: 'Unauthorized' });
          const id = pathname.replace('/api/finances/', '');
          deleteFinanceRecord(id);
          return sendJson(200, { success: true, id });
        }

        // 14. Job Schedule & Appointment Management
        if (pathname === '/api/schedule' && method === 'GET') {
          if (!isAuth) return sendJson(401, { success: false, error: 'Unauthorized' });
          const jobs = getSchedule();
          return sendJson(200, { success: true, schedule: jobs });
        }

        if (pathname === '/api/schedule' && method === 'POST') {
          if (!isAuth) return sendJson(401, { success: false, error: 'Unauthorized' });
          const body = await parseBody(req);
          const saved = saveScheduleJob(body);
          return sendJson(200, { success: true, job: saved });
        }

        if (pathname.startsWith('/api/schedule/') && method === 'PUT') {
          if (!isAuth) return sendJson(401, { success: false, error: 'Unauthorized' });
          const id = pathname.replace('/api/schedule/', '');
          const body = await parseBody(req);
          const updated = updateScheduleJob(id, body);
          return sendJson(200, { success: true, job: updated });
        }

        if (pathname.startsWith('/api/schedule/') && method === 'DELETE') {
          if (!isAuth) return sendJson(401, { success: false, error: 'Unauthorized' });
          const id = pathname.replace('/api/schedule/', '');
          deleteScheduleJob(id);
          return sendJson(200, { success: true, id });
        }

        next();
      } catch (err) {
        console.error('[API Error]:', err);
        return sendJson(500, { success: false, error: err.message });
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
    ...(command === 'serve' ? [backendApiPlugin()] : []),
  ],
  server: {
    watch: {
      ignored: ['**/server/data/**', '**/server/data/*.json']
    }
  }
}));
