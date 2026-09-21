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
    quote.postcode ? `🏢 <b>Apartman & Ev No:</b> ${escapeHtml(quote.postcode)}` : '',
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

  let formattedDate = targetDate;
  try {
    const [y, m, d] = targetDate.split('-');
    if (y && m && d) {
      formattedDate = `${d}/${m}/${y}`;
    }
  } catch (e) {
    formattedDate = targetDate;
  }

  // If there are NO jobs scheduled for tomorrow
  if (!jobs || jobs.length === 0) {
    const emptyMessage = [
      `🔔 <b>YARINKİ İŞ & RANDEVU BİLGİLENDİRMESİ</b>`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📅 <b>Tarih:</b> ${formattedDate} (Yarın)`,
      `☕ <b>Durum:</b> Yarın için takvimde planlanmış herhangi bir iş veya randevu kaydı bulunmamaktadır.`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `⏱️ <i>Handyeco Edinburgh Otomatik Ajanda Asistanı</i>`
    ].join('\n');

    const telegramApiUrl = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: emptyMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const result = await response.json();

    if (!result.ok) {
      console.error('[Telegram] Hatırlatıcı Gönderme Hatası:', result);
      throw new Error(result.description || 'Telegram reminder notification failed');
    }

    console.log(`[Telegram] 🔔 ${targetDate} tarihi için iş olmadığı bilgisi Telegram ile iletildi.`);
    return { success: true, delivered: true, count: 0, empty: true, messageId: result.result?.message_id };
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
    `📅 <b>Tarih:</b> ${formattedDate} (Yarın)`,
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

/**
 * Sends a 30-minute upcoming job reminder to Telegram
 * Handles both standard upcoming jobs and transition from an ongoing job
 * @param {Object} params
 * @param {Object} params.job - The upcoming job object
 * @param {number} params.minutesRemaining - Minutes remaining until job start (default 30)
 * @param {boolean} params.isCurrentlyOnJob - Whether Ekrem is currently working on another job
 * @param {Object} params.currentJob - The job currently in progress (if any)
 * @param {string} params.token - Telegram Bot Token
 * @param {string} params.chatId - Telegram Chat ID
 */
export async function sendTelegramUpcomingJobReminder({
  job,
  minutesRemaining = 30,
  isCurrentlyOnJob = false,
  currentJob = null,
  token,
  chatId
}) {
  if (!token || !chatId) {
    console.warn('\n[Telegram] ⚠️ TELEGRAM_BOT_TOKEN veya TELEGRAM_CHAT_ID ayarlanmamış.');
    return {
      success: true,
      delivered: false,
      reason: 'Missing Telegram credentials'
    };
  }

  if (!job) {
    throw new Error('Hatırlatılacak randevu bilgisi bulunamadı.');
  }

  const cleanPhone = (job.customerPhone || '').replace(/[^0-9+]/g, '');
  const waDirectLink = cleanPhone 
    ? `https://wa.me/${cleanPhone.replace(/^0/, '44')}?text=${encodeURIComponent(`Merhaba ${job.customerName || ''}, ben Handyeco'dan Ekrem. Saat ${job.startTime || ''} randevumuz için yola çıkıyorum.`)}` 
    : null;
  const phoneCallLink = cleanPhone ? `tel:${cleanPhone}` : null;
  
  const mapsQuery = encodeURIComponent(`${job.address || ''}, ${job.postcode || ''}, Edinburgh, UK`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  const messageLines = [];

  if (isCurrentlyOnJob && currentJob) {
    messageLines.push(
      `🔔 <b>BİR SONRAKİ İŞİNİZE ${minutesRemaining} DAKİKA KALDI!</b>`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `⚠️ <b>Şu Anki İş:</b> ${escapeHtml(currentJob.customerName || 'Mevcut Müşteri')} (${escapeHtml(currentJob.service || 'İş')})`,
      `⏳ <i>Mevcut işinizi toparlama ve sıradaki adrese hareket etme vakti!</i>`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📍 <b>SIRADAKİ RANDEVU:</b>`,
      `👤 <b>Müşteri:</b> ${escapeHtml(job.customerName || 'İsimsiz Müşteri')}`,
      `⏰ <b>Başlangıç:</b> <b>${escapeHtml(job.startTime || '')}</b>${job.endTime ? ` - ${escapeHtml(job.endTime)}` : ''} <i>(Yaklaşık ${minutesRemaining} dk sonra)</i>`,
      `📍 <b>Adres:</b> ${escapeHtml(job.address || 'Edinburgh')}`,
      job.postcode ? `📮 <b>Posta Kodu:</b> <code>${escapeHtml(job.postcode)}</code>` : '',
      `🛠️ <b>Hizmet:</b> ${escapeHtml(job.service || 'Genel Usta İşi')}`,
      job.priceEstimate ? `💰 <b>Fiyat:</b> £${escapeHtml(String(job.priceEstimate))}` : '',
      job.notes ? `📝 <b>Not:</b> <i>${escapeHtml(job.notes)}</i>` : '',
      `━━━━━━━━━━━━━━━━━━━━`,
      `🗺️ <a href="${mapsUrl}"><b>Google Haritalar Yol Tarifi ➡️</b></a>`,
      waDirectLink ? `💬 <a href="${waDirectLink}"><b>Müşteriye WhatsApp'tan "Yoldayım" Yaz ➡️</b></a>` : '',
      phoneCallLink ? `📞 <a href="${phoneCallLink}"><b>Müşteriyi Ara (${escapeHtml(job.customerPhone)}) ➡️</b></a>` : '',
      `━━━━━━━━━━━━━━━━━━━━`,
      `⏱️ <i>Handyeco Edinburgh Otomatik İş Asistanı</i>`
    );
  } else {
    messageLines.push(
      `⏰ <b>GÜN İÇİ RANDEVU HATIRLATMASI (${minutesRemaining} DK KALDI)</b>`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `🚗 <b>Sıradaki randevunuz yaklaşık ${minutesRemaining} dakika sonra başlıyor!</b>`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `👤 <b>Müşteri:</b> ${escapeHtml(job.customerName || 'İsimsiz Müşteri')}`,
      `⏰ <b>Randevu Saati:</b> <b>${escapeHtml(job.startTime || '')}</b>${job.endTime ? ` - ${escapeHtml(job.endTime)}` : ''}`,
      `📍 <b>Adres:</b> ${escapeHtml(job.address || 'Edinburgh')}`,
      job.postcode ? `📮 <b>Posta Kodu:</b> <code>${escapeHtml(job.postcode)}</code>` : '',
      `🛠️ <b>Hizmet:</b> ${escapeHtml(job.service || 'Genel Usta İşi')}`,
      job.priceEstimate ? `💰 <b>Tahmini Fiyat:</b> £${escapeHtml(String(job.priceEstimate))}` : '',
      job.notes ? `📝 <b>Özel Not:</b> <i>${escapeHtml(job.notes)}</i>` : '',
      `━━━━━━━━━━━━━━━━━━━━`,
      `🗺️ <a href="${mapsUrl}"><b>Google Haritalar Yol Tarifi ➡️</b></a>`,
      waDirectLink ? `💬 <a href="${waDirectLink}"><b>Müşteriye WhatsApp'tan "Yoldayım" Yaz ➡️</b></a>` : '',
      phoneCallLink ? `📞 <a href="${phoneCallLink}"><b>Müşteriyi Ara (${escapeHtml(job.customerPhone)}) ➡️</b></a>` : '',
      `━━━━━━━━━━━━━━━━━━━━`,
      `⏱️ <i>Handyeco Edinburgh Otomatik İş Asistanı</i>`
    );
  }

  const message = messageLines.filter(Boolean).join('\n');
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
    console.error('[Telegram] 30 Dk Hatırlatıcı Hatası:', result);
    throw new Error(result.description || 'Telegram 30-minute reminder failed');
  }

  console.log(`[Telegram] 🔔 ${job.customerName || 'Müşteri'} randevusu için 30 dk hatırlatması iletildi!`);
  return { success: true, delivered: true, messageId: result.result?.message_id };
}

