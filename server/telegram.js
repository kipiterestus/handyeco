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

/**
 * Sends a daily appointment reminder summary for tomorrow's jobs to Telegram
 * @param {Array} jobs - List of jobs scheduled for tomorrow
 * @param {string} targetDate - Date string (YYYY-MM-DD)
 * @param {string} token - Telegram Bot Token
 * @param {string} chatId - Telegram Chat ID
 */
export async function sendTelegramDailyAppointmentReminder(jobs, targetDate, token, chatId) {
  if (!token || !chatId) {
    console.warn('\n[Telegram] ⚠️ TELEGRAM_BOT_TOKEN veya TELEGRAM_CHAT_ID ayarlanmamış.');
    return {
      success: true,
      delivered: false,
      reason: 'Missing Telegram credentials'
    };
  }

  if (!jobs || jobs.length === 0) {
    return {
      success: true,
      delivered: false,
      reason: `No jobs scheduled for ${targetDate}`
    };
  }

  const jobItems = jobs.map((job, idx) => {
    const cleanPhone = (job.customerPhone || '').replace(/[^0-9+]/g, '');
    const waLink = cleanPhone ? `https://wa.me/${cleanPhone.replace(/^0/, '44')}` : null;

    return [
      `🔹 <b>${idx + 1}. İŞ (${escapeHtml(job.startTime || 'Saat Belirsiz')}${job.endTime ? ` - ${escapeHtml(job.endTime)}` : ''})</b>`,
      `👤 <b>Müşteri:</b> ${escapeHtml(job.customerName || 'Belirtilmedi')}`,
      `📞 <b>Telefon:</b> <code>${escapeHtml(job.customerPhone || 'Yok')}</code>`,
      `📍 <b>Adres / Posta Kodu:</b> ${escapeHtml(job.address || job.postcode || 'Edinburgh')}`,
      `🛠️ <b>İş / Hizmet:</b> ${escapeHtml(job.service || 'Genel Usta İşi')}`,
      job.priceEstimate ? `💰 <b>Fiyat:</b> £${escapeHtml(String(job.priceEstimate))}` : '',
      job.notes ? `📝 <b>Not:</b> <i>${escapeHtml(job.notes)}</i>` : '',
      waLink ? `💬 <a href="${waLink}">Müşteriye WhatsApp'tan Ulaş</a>` : ''
    ].filter(Boolean).join('\n');
  }).join('\n\n');

  const message = [
    `🔔 <b>YARINKİ İŞ & RANDEVU HATIRLATMASI</b>`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `📅 <b>Tarih:</b> ${targetDate} (Yarın)`,
    `📋 <b>Planlanan İş Sayısı:</b> ${jobs.length} Randevu`,
    `━━━━━━━━━━━━━━━━━━━━`,
    jobItems,
    `━━━━━━━━━━━━━━━━━━━━`,
    `⏱️ <i>Handyeco Edinburgh Otomatik Ajanda Asistanı</i>`
  ].join('\n');

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
    console.error('[Telegram] Hatırlatıcı Gönderme Hatası:', result);
    throw new Error(result.description || 'Telegram reminder notification failed');
  }

  console.log(`[Telegram] 🔔 ${targetDate} tarihli ${jobs.length} randevu hatırlatması Telegram ile iletildi!`);
  return { success: true, delivered: true, count: jobs.length, messageId: result.result?.message_id };
}

