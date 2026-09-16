import React, { useState } from 'react';
import { Save, CheckCircle2, Phone, MessageSquare, Mail, Clock, PoundSterling, MapPin, ExternalLink, Bell, AlertCircle, Send } from 'lucide-react';

export default function BusinessEditor({ data, onSave, token }) {
  const [form, setForm] = useState(data || {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState(null);

  const handleChange = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
    setSaved(false);
  };

  const handleTestTelegram = async () => {
    if (!form.telegramBotToken || !form.telegramChatId) {
      setTelegramStatus({ success: false, message: 'Lütfen önce Telegram Bot Token ve Chat ID alanlarını doldurun.' });
      return;
    }
    setTestingTelegram(true);
    setTelegramStatus(null);
    try {
      const res = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          token: form.telegramBotToken,
          chatId: form.telegramChatId
        })
      });
      const json = await res.json();
      if (json.success || json.delivered) {
        setTelegramStatus({ success: true, message: '✅ Test bildirimi telefonunuza ulaştı! Telegram uygulamanızı kontrol edin.' });
      } else {
        setTelegramStatus({ success: false, message: `❌ Hata: ${json.error || json.reason || 'Gönderilemedi'}` });
      }
    } catch (err) {
      setTelegramStatus({ success: false, message: `❌ Bağlantı hatası: ${err.message}` });
    } finally {
      setTestingTelegram(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave('siteConfig', form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-black text-white">İşletme Ayarları & Fiyatlandırma</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            İletişim bilgileri, minimum £65 iş kabul kuralı, WhatsApp numarası ve çalışma saatlerini yönetin.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Kaydediliyor...' : saved ? 'Başarıyla Kaydedildi!' : 'Değişiklikleri Kaydet'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Contact info card */}
        <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-md">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-400" />
            <span>İletişim & Usta Bilgileri</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">İşletme Adı</label>
              <input
                type="text"
                value={form.businessName || ''}
                onChange={e => handleChange('businessName', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Usta Adı</label>
              <input
                type="text"
                value={form.craftsmanName || ''}
                onChange={e => handleChange('craftsmanName', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Telefon (Arama Formatı)</label>
                <input
                  type="text"
                  value={form.phone || ''}
                  onChange={e => handleChange('phone', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Görünen Telefon Numarası</label>
                <input
                  type="text"
                  value={form.displayPhone || ''}
                  onChange={e => handleChange('displayPhone', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">WhatsApp Numarası (örn: 447760696723)</label>
                <input
                  type="text"
                  value={form.whatsappNumber || ''}
                  onChange={e => {
                    const num = e.target.value.replace(/[^0-9]/g, '');
                    handleChange('whatsappNumber', num);
                    handleChange('whatsappUrl', `https://wa.me/${num}?text=Hello%20Handyeco%2C%20I%20would%20like%20a%20free%20quote%20for%20handyman%20services%20in%20Edinburgh.`);
                  }}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">E-posta Adresi</label>
                <input
                  type="email"
                  value={form.email || ''}
                  onChange={e => handleChange('email', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Operations Card */}
        <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-md">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <PoundSterling className="w-4 h-4 text-emerald-400" />
            <span>Fiyatlandırma Kuralları (Teklifler Ücretsizdir)</span>
          </h3>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Minimum İş Bedeli (£)</label>
                <input
                  type="number"
                  value={form.minimumJobBooking ?? form.callOutFee ?? 65}
                  onChange={e => {
                    const fee = Number(e.target.value);
                    handleChange('minimumJobBooking', fee);
                    handleChange('callOutFee', 0);
                    handleChange('callOutText', `Free Quotes • Minimum Job £${fee} (Edinburgh Area)`);
                  }}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
                />
                <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">Çağrı ücreti yok (yalnızca min iş tutarı)</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Ortalama Yanıt Süresi</label>
                <input
                  type="text"
                  value={form.responseTime || '15–30 mins'}
                  onChange={e => handleChange('responseTime', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Fiyat Rozeti & Banner Metni</label>
              <input
                type="text"
                value={form.callOutText || 'Free Quotes • Minimum Job £65 (Edinburgh Area)'}
                onChange={e => handleChange('callOutText', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Çalışma Saatleri</label>
              <input
                type="text"
                value={form.workingHours || 'Mon - Sat: 8:00 AM - 6:00 PM'}
                onChange={e => handleChange('workingHours', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Hizmet Bölgesi Görünümü</label>
              <input
                type="text"
                value={form.areaCoverage || 'Edinburgh & Lothians'}
                onChange={e => handleChange('areaCoverage', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Telegram Quick Settings */}
        <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 md:col-span-2 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                <span>Anlık Telegram Bot Bildirimleri</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Detaylı rehber ve canlı telefon önizlemesi için soldaki <strong>Telegram Bot</strong> sekmesini kullanabilirsiniz.
              </p>
            </div>

            <button
              type="button"
              disabled={testingTelegram}
              onClick={handleTestTelegram}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{testingTelegram ? 'Gönderiliyor...' : 'Telefona Test Bildirimi Gönder'}</span>
            </button>
          </div>

          {telegramStatus && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              telegramStatus.success 
                ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-300' 
                : 'bg-rose-950/40 border border-rose-800 text-rose-300'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{telegramStatus.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Telegram Bot Token</label>
              <input
                type="text"
                placeholder="Örn: 8510767953:AAE3Gr7keA7fkguS4NAVVTE31tINbWUm24Y"
                value={form.telegramBotToken || ''}
                onChange={e => handleChange('telegramBotToken', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Telegram Chat ID</label>
              <input
                type="text"
                placeholder="Örn: 8755482733"
                value={form.telegramChatId || ''}
                onChange={e => handleChange('telegramChatId', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Verification Profile Links */}
        <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 md:col-span-2 shadow-md">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-blue-400" />
            <span>Harita & Platform Profil Bağlantıları</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Google Maps Profil Linki</label>
              <input
                type="url"
                value={form.googleProfileUrl || ''}
                onChange={e => handleChange('googleProfileUrl', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">MyBuilder Profil Linki</label>
              <input
                type="url"
                value={form.myBuilderUrl || ''}
                onChange={e => handleChange('myBuilderUrl', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

      </div>
    </form>
  );
}
