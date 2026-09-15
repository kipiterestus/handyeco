import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { sendTelegramNotification } from './server/telegram.js'

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

const telegramApiPlugin = () => ({
  name: 'telegram-api-plugin',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url === '/api/quote' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const quote = JSON.parse(body || '{}');
            console.log('\n[Vite API] 📩 Yeni teklif alındı:', quote.name, quote.phone, quote.service);

            // Log locally to server/quotes.json
            const quotesPath = path.resolve(process.cwd(), 'server/quotes.json');
            let quotes = [];
            try {
              if (fs.existsSync(quotesPath)) quotes = JSON.parse(fs.readFileSync(quotesPath, 'utf8') || '[]');
            } catch (e) {}
            const entry = { id: 'quote_' + Date.now(), receivedAt: new Date().toISOString(), ...quote };
            quotes.unshift(entry);
            fs.writeFileSync(quotesPath, JSON.stringify(quotes, null, 2), 'utf8');

            const env = readEnv();
            const token = process.env.TELEGRAM_BOT_TOKEN || env.TELEGRAM_BOT_TOKEN;
            const chatId = process.env.TELEGRAM_CHAT_ID || env.TELEGRAM_CHAT_ID;

            const tgRes = await sendTelegramNotification(quote, token, chatId);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, quoteId: entry.id, telegramDelivered: tgRes.delivered }));
          } catch (err) {
            console.error('[Vite API] Hata:', err);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, warning: err.message }));
          }
        });
        return;
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    telegramApiPlugin(),
  ],
})
