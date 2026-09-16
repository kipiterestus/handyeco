// server/telegram.js
// Handles instant notification dispatch to the business owner via Telegram Bot API

/**
 * Sends a formatted quote notification to Telegram
 * @param {Object} quote
 * @param {string} token
 * @param {string} chatId
 */
export async function sendTelegramNotification(quote, token, chatId) {
  if (!token || !chatId) {
    console.warn('\n[Telegram] ⚠️ TELEGRAM_BOT_TOKEN veya TELEGRAM_CHAT_ID ayarlanmamış.');
    console.warn('[Telegram] Gelen teklif yerel loga kaydedildi:\n', JSON.stringify(quote, null, 2));
    return {
      success: true,
      delivered: false,
      reason: 'Missing credentials. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env'
    };
  }

  const cleanPhone = (quote.phone || '').replace(/[^0-9+]/g, '');
  const waDirectLink = cleanPhone ? `https://wa.me/${cleanPhone.replace(/^0/, '44')}` : null;
  const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });

  const message = [
    `🚨 <b>YENİ İŞ / TEKLİF TALEBİ GELDİ!</b>`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `👤 <b>Müşteri:</b> ${escapeHtml(quote.name || 'İsimsiz')}`,
    `📞 <b>Telefon:</b> <code>${escapeHtml(quote.phone || 'Belirtilmedi')}</code>`,
    quote.email ? `📧 <b>E-posta:</b> <code>${escapeHtml(quote.email)}</code>` : '',
    `📍 <b>Posta Kodu / Bölge:</b> ${escapeHtml(quote.postcode || 'Edinburgh')}`,
    `🛠️ <b>Hizmet:</b> ${escapeHtml(quote.service || 'Genel Tamirat')}`,
    `⏱️ <b>Zamanlama:</b> ${escapeHtml((quote.urgency || 'flexible').toUpperCase())}`,
    `📝 <b>İş Detayları:</b>\n<i>${escapeHtml(quote.details || 'Detay verilmedi')}</i>`,
    quote.photosCount ? `📸 <b>Fotoğraf:</b> ${quote.photosCount} adet eklendi` : '',
    `⏰ <b>Tarih:</b> ${timestamp} (UK Time)`,
    `━━━━━━━━━━━━━━━━━━━━`,
    waDirectLink ? `💬 <a href="${waDirectLink}"><b>Müşteriye WhatsApp'tan Yanıt Ver ➡️</b></a>` : ''
  ].filter(Boolean).join('\n');

  const telegramApiUrl = `https://api.telegram.org/bot${token}/sendMessage`;

  const response = await fetch(telegramApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
  });

  const result = await response.json();

  if (!result.ok) {
    console.error('[Telegram] API Hatası:', result);
    throw new Error(result.description || 'Telegram notification failed');
  }

  console.log('[Telegram] ✅ Anlık bildirim başarıyla telefonunuza iletildi!');
  return { success: true, delivered: true, messageId: result.result?.message_id };
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
