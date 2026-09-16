import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Smartphone, 
  Bot, 
  ExternalLink, 
  ShieldCheck, 
  Save, 
  HelpCircle,
  Clock,
  MapPin,
  Phone,
  MessageSquare
} from 'lucide-react';

export default function TelegramEditor({ data = {}, onSave, token }) {
  const [botToken, setBotToken] = useState(data.telegramBotToken || '');
  const [chatId, setChatId] = useState(data.telegramChatId || '');
  const [showToken, setShowToken] = useState(false);
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const isConfigured = Boolean(botToken && chatId);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    const updated = {
      ...data,
      telegramBotToken: botToken.trim(),
      telegramChatId: chatId.trim()
    };
    const success = await onSave('siteConfig', updated);
    setSaving(false);
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleTestNotification = async () => {
    if (!botToken.trim() || !chatId.trim()) {
      setTestResult({
        success: false,
        message: 'Please enter both your Telegram Bot Token and Chat ID before sending a test.'
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          token: botToken.trim(),
          chatId: chatId.trim()
        })
      });

      const json = await res.json();
      if (res.ok && json.delivered) {
        setTestResult({
          success: true,
          message: '🚀 Test alert sent successfully! Check your Telegram app right now.'
        });
      } else {
        setTestResult({
          success: false,
          message: `Delivery failed: ${json.error || json.reason || 'Make sure you tapped START on your bot before testing.'}`
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: `Network error: ${err.message}`
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Telegram Bot Notifications</h2>
            {isConfigured ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active & Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                Setup Required
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Receive customer quote inquiries instantly on your phone with customer contact details, postcode, and job description.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-98 shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <span>Saving...</span>
          ) : saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Bot Settings</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid: Bot Credentials & Live Phone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Credentials & Test (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Credentials Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">API Credentials</h3>
                <p className="text-xs text-slate-500">Configure your secret Telegram Bot token and personal Chat ID</p>
              </div>
            </div>

            {/* Test Result Message */}
            {testResult && (
              <div className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-2.5 ${
                testResult.success 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {testResult.success ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">{testResult.message}</p>
                  {!testResult.success && (
                    <p className="text-xs text-rose-700 mt-1">
                      Tip: Open your bot in Telegram and press <strong>START</strong> once so it is authorized to send you messages.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Bot Token Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Telegram Bot Token
                </label>
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showToken ? 'Hide' : 'Reveal'}</span>
                </button>
              </div>
              <input
                type={showToken ? 'text' : 'password'}
                placeholder="e.g. 1234567890:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-sm font-mono outline-none transition-all"
              />
              <p className="text-[11px] text-slate-500">
                Provided by <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">@BotFather</a> when creating a new bot.
              </p>
            </div>

            {/* Chat ID Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Your Telegram Chat ID
              </label>
              <input
                type="text"
                placeholder="e.g. 987654321"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-sm font-mono outline-none transition-all"
              />
              <p className="text-[11px] text-slate-500">
                Your personal numeric user ID. You can find it instantly via <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">@userinfobot</a>.
              </p>
            </div>

            {/* Test Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handleTestNotification}
                disabled={testing}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-98 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{testing ? 'Sending Test Message...' : 'Send Live Test Lead to Phone'}</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold border border-slate-300 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Credentials</span>
              </button>
            </div>
          </div>

          {/* Step-by-Step Instructions Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <h3>How to set up your Telegram Bot in 2 minutes</h3>
            </div>

            <ol className="space-y-3 text-xs sm:text-sm text-slate-600 list-decimal list-inside leading-relaxed">
              <li className="pl-1">
                Open Telegram and message <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline inline-flex items-center gap-0.5">@BotFather <ExternalLink className="w-3 h-3 inline" /></a>.
              </li>
              <li className="pl-1">
                Send the command <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-800 font-mono font-bold">/newbot</code>, choose a display name (e.g. <em>Handyeco Leads</em>) and a username ending in bot (e.g. <em>handyeco_quotes_bot</em>).
              </li>
              <li className="pl-1">
                Copy the long <strong>HTTP API Token</strong> and paste it into the <strong>Telegram Bot Token</strong> field above.
              </li>
              <li className="pl-1">
                <strong>Crucial:</strong> Open your newly created bot in Telegram and tap <strong>START</strong> (or send <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-800 font-mono">/start</code>) so it has permission to message you.
              </li>
              <li className="pl-1">
                To find your Chat ID, message <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline inline-flex items-center gap-0.5">@userinfobot <ExternalLink className="w-3 h-3 inline" /></a>. It will reply with your numeric <strong>Id</strong>. Paste it into <strong>Your Telegram Chat ID</strong>.
              </li>
              <li className="pl-1">
                Click <strong>Send Live Test Lead to Phone</strong> to verify. Once you hear your phone ding, click <strong>Save Bot Settings</strong>.
              </li>
            </ol>
          </div>

        </div>

        {/* Right Column: Live Mockup of Telegram Message (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-100 rounded-3xl p-5 sm:p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>Live Phone Preview</span>
              </div>
              <span className="text-[11px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                Telegram Chat
              </span>
            </div>

            {/* Telegram Message Bubble */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 text-xs space-y-3 text-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    H
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block leading-tight">Handyeco Bot</span>
                    <span className="text-[10px] text-slate-400">bot</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">Just now</span>
              </div>

              {/* Formatted Content */}
              <div className="space-y-1.5 font-sans leading-relaxed text-[13px]">
                <p className="font-bold text-slate-900">
                  🔔 <strong>Yeni Teklif Talebi (Edinburgh)!</strong>
                </p>
                <p>👤 <strong>Müşteri:</strong> Sarah Jenkins</p>
                <p>📞 <strong>Telefon:</strong> +44 7760 123456</p>
                <p>✉️ <strong>E-posta:</strong> sarah.j@gmail.com</p>
                <p>📍 <strong>Posta Kodu / Konum:</strong> EH3 9DJ (Stockbridge)</p>
                <p>🛠️ <strong>Hizmet:</strong> Flat-Pack Furniture Assembly</p>
                <p>⚡ <strong>Aciliyet:</strong> Normal (Bu Hafta)</p>
                <p className="pt-1 text-slate-700 italic">
                  📝 <strong>Detaylar:</strong> IKEA PAX 3 kapaklı gardırop montajı yapılacak.
                </p>
              </div>

              {/* Action Buttons inside Telegram preview */}
              <div className="pt-2 space-y-1.5">
                <div className="w-full py-1.5 bg-emerald-50 text-emerald-700 text-center rounded-lg font-bold text-xs border border-emerald-200 flex items-center justify-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Müşteriye WhatsApp'tan Yaz</span>
                </div>
                <div className="w-full py-1.5 bg-blue-50 text-blue-700 text-center rounded-lg font-bold text-xs border border-blue-200 flex items-center justify-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Hemen Telefonla Ara</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white/70 rounded-2xl text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Delay Alerting</span>
              </div>
              <p>
                Incoming web inquiries trigger this notification via serverless webhook in under 1 second.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
