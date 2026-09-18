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
        message: 'Lütfen test göndermeden önce Telegram Bot Token ve Chat ID alanlarını doldurun.'
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
          message: '🚀 Canlı test mesajı telefonunuza başarıyla iletildi! Telegram uygulamanızı kontrol edin.'
        });
      } else {
        setTestResult({
          success: false,
          message: json.error || 'Telegram mesajı iletilemedi. Botunuza Telegram üzerinden /start mesajı attığınızdan emin olun.'
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: 'Ağ hatası: ' + err.message
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white">Telegram Bildirimleri</h2>
            {isConfigured ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Aktif & Bağlı
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-400 border border-amber-800">
                Kurulum Gerekli
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Gelen form talepleri anında cep telefonunuza Telegram ile bildirilir.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-98 shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <span>Kaydediliyor...</span>
          ) : saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Kaydedildi!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Kaydet</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid: Bot Credentials & Live Phone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Credentials & Test (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Credentials Card */}
          <div className="bg-[#0b0e14] rounded-2xl p-6 border border-zinc-800 shadow-md space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-950/60 text-sky-400 border border-sky-800/60 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Bot API Bilgileri</h3>
                <p className="text-xs text-zinc-400">Telegram Bot Token ve kişisel Chat ID bilgilerinizi girin</p>
              </div>
            </div>

            {/* Test Result Message */}
            {testResult && (
              <div className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 ${
                testResult.success 
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' 
                  : 'bg-rose-950/40 border-rose-800 text-rose-300'
              }`}>
                {testResult.success ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">{testResult.message}</p>
                  {!testResult.success && (
                    <p className="text-xs text-rose-400 mt-1">
                      İpucu: Telegram uygulamasında botunuza girip <strong>START</strong> butonuna bir kez basmanız gerekir.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Bot Token Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Telegram Bot Token
                </label>
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showToken ? 'Gizle' : 'Göster'}</span>
                </button>
              </div>
              <input
                type={showToken ? 'text' : 'password'}
                placeholder="Örn: 8510767953:AAE3Gr7keA7fkguS4NAVVTE31tINbWUm24Y"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-blue-500 text-white text-sm font-mono outline-none transition-all"
              />
              <p className="text-[11px] text-zinc-500">
                <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-medium">@BotFather</a> tarafından sağlanan gizli HTTP API token.
              </p>
            </div>

            {/* Chat ID Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Telegram Kişisel Chat ID
              </label>
              <input
                type="text"
                placeholder="Örn: 8755482733"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-blue-500 text-white text-sm font-mono outline-none transition-all"
              />
              <p className="text-[11px] text-zinc-500">
                Kişisel sayısal kullanıcı ID numaranız. <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-medium">@userinfobot</a> üzerinden anında öğrenebilirsiniz.
              </p>
            </div>

            {/* Test Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handleTestNotification}
                disabled={testing}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-98 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{testing ? 'Gönderiliyor...' : 'Test Bildirimi Gönder'}</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs sm:text-sm font-bold border border-zinc-700 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Kaydet</span>
              </button>
            </div>
          </div>

          {/* Step-by-Step Instructions Card */}
          <div className="bg-[#0b0e14] rounded-2xl p-6 border border-zinc-800 shadow-md space-y-4">
            <div className="flex items-center gap-2.5 text-white font-bold">
              <HelpCircle className="w-5 h-5 text-blue-400" />
              <h3>Telegram Kurulum Rehberi</h3>
            </div>

            <ol className="space-y-3 text-xs sm:text-sm text-zinc-400 list-decimal list-inside leading-relaxed">
              <li className="pl-1">
                Telegram uygulamasında <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-blue-400 font-bold underline inline-flex items-center gap-0.5">@BotFather <ExternalLink className="w-3 h-3 inline" /></a> botuna gidin.
              </li>
              <li className="pl-1">
                <code className="px-1.5 py-0.5 bg-zinc-900 rounded text-blue-300 font-mono font-bold">/newbot</code> komutunu gönderin, bot için bir isim ve kullanıcı adı belirleyin.
              </li>
              <li className="pl-1">
                Size verilen uzun <strong>HTTP API Token</strong> kodunu kopyalayıp yukarıdaki <strong>Telegram Bot Token</strong> alanına yapıştırın.
              </li>
              <li className="pl-1">
                <strong>Önemli:</strong> Yeni oluşturduğunuz botunuza Telegram üzerinden mesaj penceresini açıp <strong>BAŞLAT (START)</strong> butonuna basın.
              </li>
              <li className="pl-1">
                Kişisel ID'nizi bulmak için <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer" className="text-blue-400 font-bold underline inline-flex items-center gap-0.5">@userinfobot <ExternalLink className="w-3 h-3 inline" /></a> botuna <code className="px-1.5 py-0.5 bg-zinc-900 rounded text-blue-300 font-mono">/start</code> yazın. Sayısal ID'nizi Chat ID alanına yapıştırın.
              </li>
              <li className="pl-1">
                <strong>Telefona Canlı Test Bildirimi Gönder</strong> butonuna basarak telefonunuza gelen bildirimi doğrulayın.
              </li>
            </ol>
          </div>

        </div>

        {/* Right Column: Live Mockup of Telegram Message (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0b0e14] rounded-2xl p-5 sm:p-6 border border-zinc-800 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs uppercase tracking-wider">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span>Canlı Telefon Önizlemesi</span>
              </div>
              <span className="text-[11px] font-semibold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-800/60">
                Telegram Chat
              </span>
            </div>

            {/* Telegram Message Bubble */}
            <div className="bg-zinc-900 rounded-2xl p-4 shadow-md border border-zinc-800 text-xs space-y-3 text-zinc-100">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    H
                  </div>
                  <div>
                    <span className="font-bold text-white block leading-tight">Handyeco Bot</span>
                    <span className="text-[10px] text-zinc-400">bot</span>
                  </div>
                </div>
                <span className="text-[10px] text-zinc-500">Şimdi</span>
              </div>

              {/* Formatted Content */}
              <div className="space-y-1.5 font-sans leading-relaxed text-[13px]">
                <p className="font-bold text-white">
                  🔔 <strong>Yeni Teklif Talebi (Edinburgh)!</strong>
                </p>
                <p>👤 <strong>Müşteri:</strong> Sarah Jenkins</p>
                <p>📞 <strong>Telefon:</strong> +44 7760 123456</p>
                <p>✉️ <strong>E-posta:</strong> sarah.j@gmail.com</p>
                <p>📍 <strong>Posta Kodu / Konum:</strong> EH3 9DJ (Stockbridge)</p>
                <p>🛠️ <strong>Hizmet:</strong> Flat-Pack Furniture Assembly</p>
                <p>⚡ <strong>Aciliyet:</strong> Normal (Bu Hafta)</p>
                <p className="pt-1 text-zinc-300 italic">
                  📝 <strong>Detaylar:</strong> IKEA PAX 3 kapaklı gardırop montajı yapılacak.
                </p>
              </div>

              {/* Action Buttons inside Telegram preview */}
              <div className="pt-2 space-y-1.5">
                <div className="w-full py-1.5 bg-emerald-950/60 text-emerald-400 text-center rounded-lg font-bold text-xs border border-emerald-800/60 flex items-center justify-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Müşteriye WhatsApp'tan Yaz</span>
                </div>
                <div className="w-full py-1.5 bg-blue-950/60 text-blue-400 text-center rounded-lg font-bold text-xs border border-blue-800/60 flex items-center justify-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Hemen Telefonla Ara</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-zinc-900/60 rounded-xl text-[11px] text-zinc-400 space-y-1 border border-zinc-800">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>0 Gecikmeli Anlık Bildirim</span>
              </div>
              <p>
                Web sitesinden teklif formu gönderildiği anda Telegram API webhook ile 1 saniyeden kısa sürede cep telefonunuza ulaşır.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
