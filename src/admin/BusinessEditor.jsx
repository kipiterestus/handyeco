import React, { useState } from 'react';
import { Save, CheckCircle, Phone, MessageSquare, Mail, Clock, PoundSterling, MapPin, ExternalLink, Bell, AlertCircle, Send } from 'lucide-react';

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
      setTelegramStatus({ success: false, message: 'Please enter both Telegram Bot Token and Chat ID first.' });
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
      if (json.success) {
        setTelegramStatus({ success: true, message: '✅ Test notification sent! Check your Telegram app now.' });
      } else {
        setTelegramStatus({ success: false, message: `❌ Error: ${json.error || 'Failed to send'}` });
      }
    } catch (err) {
      setTelegramStatus({ success: false, message: `❌ Connection error: ${err.message}` });
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Business Settings, Pricing & Telegram Bot</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage contact details, £65 minimum job booking, free quotes display, and instant Telegram phone alerts.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
        >
          {saved ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : saved ? 'Saved Successfully!' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Contact info card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-400" />
            <span>Contact & Communication</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Business Name</label>
              <input
                type="text"
                value={form.businessName || ''}
                onChange={e => handleChange('businessName', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Craftsman Name</label>
              <input
                type="text"
                value={form.craftsmanName || ''}
                onChange={e => handleChange('craftsmanName', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Phone (Direct / Dial)</label>
                <input
                  type="text"
                  value={form.phone || ''}
                  onChange={e => handleChange('phone', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Display Phone</label>
                <input
                  type="text"
                  value={form.displayPhone || ''}
                  onChange={e => handleChange('displayPhone', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">WhatsApp Number (e.g. 447760696723)</label>
                <input
                  type="text"
                  value={form.whatsappNumber || ''}
                  onChange={e => {
                    const num = e.target.value.replace(/[^0-9]/g, '');
                    handleChange('whatsappNumber', num);
                    handleChange('whatsappUrl', `https://wa.me/${num}?text=Hello%20Handyeco%2C%20I%20would%20like%20a%20free%20quote%20for%20handyman%20services%20in%20Edinburgh.`);
                  }}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={form.email || ''}
                  onChange={e => handleChange('email', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Operations Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <PoundSterling className="w-4 h-4 text-emerald-400" />
            <span>Pricing & Booking Rules (Quotes are 100% Free)</span>
          </h3>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Minimum Job Booking (£)</label>
                <input
                  type="number"
                  value={form.minimumJobBooking ?? form.callOutFee ?? 65}
                  onChange={e => {
                    const fee = Number(e.target.value);
                    handleChange('minimumJobBooking', fee);
                    handleChange('callOutFee', 0);
                    handleChange('callOutText', `Free Quotes • Minimum Job £${fee} (Edinburgh Area)`);
                  }}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-emerald-400 mt-1 block">Zero call-out fee (only min job size)</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Avg Response (Navbar)</label>
                <input
                  type="text"
                  value={form.responseTime || '15–30 mins'}
                  onChange={e => handleChange('responseTime', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Price Badge & Banner Text</label>
              <input
                type="text"
                value={form.callOutText || 'Free Quotes • Minimum Job £65 (Edinburgh Area)'}
                onChange={e => handleChange('callOutText', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Working Hours</label>
              <input
                type="text"
                value={form.workingHours || 'Mon - Sat: 8:00 AM - 6:00 PM'}
                onChange={e => handleChange('workingHours', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Coverage Area Display</label>
              <input
                type="text"
                value={form.areaCoverage || 'Edinburgh & Lothians'}
                onChange={e => handleChange('areaCoverage', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Telegram Bot Notification Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 md:col-span-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                <span>Instant Telegram Bot Phone Alerts (Incoming Quotes)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                When a customer submits a quote on the site, an instant notification with a one-tap WhatsApp reply button rings on your phone.
              </p>
            </div>

            <button
              type="button"
              disabled={testingTelegram}
              onClick={handleTestTelegram}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{testingTelegram ? 'Sending Test...' : 'Send Test Notification to Phone'}</span>
            </button>
          </div>

          {telegramStatus && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              telegramStatus.success 
                ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300' 
                : 'bg-rose-950/80 border border-rose-800 text-rose-300'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{telegramStatus.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Telegram Bot Token</label>
              <input
                type="text"
                placeholder="e.g. 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                value={form.telegramBotToken || ''}
                onChange={e => handleChange('telegramBotToken', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Get this in 30 seconds by sending <code>/newbot</code> to <b>@BotFather</b> on Telegram.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Telegram Your Chat ID</label>
              <input
                type="text"
                placeholder="e.g. 987654321"
                value={form.telegramChatId || ''}
                onChange={e => handleChange('telegramChatId', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Get your numerical Chat ID by sending any message to <b>@userinfobot</b> on Telegram.
              </span>
            </div>
          </div>
        </div>

        {/* Verification Profile Links & Review Sync Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 md:col-span-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-blue-400" />
            <span>Profile Links & Google / MyBuilder Auto-Sync</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Google Maps Profile URL</label>
              <input
                type="url"
                value={form.googleProfileUrl || ''}
                onChange={e => handleChange('googleProfileUrl', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">MyBuilder Profile URL</label>
              <input
                type="url"
                value={form.myBuilderUrl || ''}
                onChange={e => handleChange('myBuilderUrl', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Google Place ID (Optional for Direct API Sync)</label>
              <input
                type="text"
                placeholder="e.g. ChIJ..."
                value={form.googlePlaceId || ''}
                onChange={e => handleChange('googlePlaceId', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.autoSyncReviews !== false}
                  onChange={e => handleChange('autoSyncReviews', e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800 focus:ring-0 cursor-pointer"
                />
                <span>Automatically sync new Google & MyBuilder reviews in the background (Hourly)</span>
              </label>
            </div>
          </div>
        </div>

      </div>
    </form>
  );
}
