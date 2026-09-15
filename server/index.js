import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendTelegramNotification } from './telegram.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const QUOTES_FILE = path.join(__dirname, 'quotes.json');

// Ensure quotes storage file exists
function getSavedQuotes() {
  try {
    if (fs.existsSync(QUOTES_FILE)) {
      const data = fs.readFileSync(QUOTES_FILE, 'utf8');
      return JSON.parse(data || '[]');
    }
  } catch (e) {
    console.error('Error reading quotes file:', e);
  }
  return [];
}

function saveQuote(quote) {
  try {
    const list = getSavedQuotes();
    const entry = {
      id: 'quote_' + Date.now(),
      receivedAt: new Date().toISOString(),
      ...quote
    };
    list.unshift(entry);
    fs.writeFileSync(QUOTES_FILE, JSON.stringify(list, null, 2), 'utf8');
    return entry;
  } catch (e) {
    console.error('Error writing quotes file:', e);
    return quote;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Handyeco Quote Notification API',
    telegramConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID)
  });
});

// List received quotes
app.get('/api/quotes', (req, res) => {
  const quotes = getSavedQuotes();
  res.json({ success: true, count: quotes.length, quotes });
});

// Quote submission endpoint
app.post('/api/quote', async (req, res) => {
  try {
    const quote = req.body;
    console.log('\n[API] 📩 Yeni teklif talebi alındı:', quote.name, quote.phone, quote.service);

    // 1. Always persist quote locally so no customer data is lost
    const saved = saveQuote(quote);

    // 2. Dispatch Telegram notification
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const telegramResult = await sendTelegramNotification(quote, botToken, chatId);

    res.status(200).json({
      success: true,
      message: 'Quote received and processed successfully',
      quoteId: saved.id,
      telegramDelivered: telegramResult.delivered
    });
  } catch (error) {
    console.error('[API] Teklif işlenirken hata:', error);
    // Return 200 with error note so frontend doesn't show a harsh failure to the customer
    res.status(200).json({
      success: true,
      warning: 'Quote recorded locally but notification dispatch had an issue: ' + error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Handyeco API Server çalışıyor: http://localhost:${PORT}`);
  console.log(`📱 Telegram Bot Durumu: ${process.env.TELEGRAM_BOT_TOKEN ? '✅ Aktif' : '⚠️ Yapılandırılmadı (.env dosyasını kontrol edin)'}`);
});
