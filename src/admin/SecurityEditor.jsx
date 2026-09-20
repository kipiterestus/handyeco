import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, KeyRound, Copy, Check, RefreshCw, Power } from 'lucide-react';

export default function SecurityEditor({ token }) {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [toggling, setToggling] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/auth/totp/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.error('Error fetching 2FA status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleToggle = async () => {
    if (!status) return;
    setToggling(true);
    setActionMessage(null);
    try {
      const res = await fetch('/api/auth/totp/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ disabled: status.enabled })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus(data);
        setActionMessage({
          type: 'success',
          text: data.enabled ? '✅ 2FA başarıyla etkinleştirildi.' : '⚠️ 2FA devre dışı bırakıldı! Artık yalnızca şifreyle doğrudan giriş yapılabilir.'
        });
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Hata: ' + err.message });
    } finally {
      setToggling(false);
    }
  };

  const handleCopyKey = () => {
    if (!status?.secretBase32) return;
    navigator.clipboard.writeText(status.secretBase32);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyBackup = () => {
    if (!status?.masterBackupCode) return;
    navigator.clipboard.writeText(status.masterBackupCode);
    setCopiedBackup(true);
    setTimeout(() => setCopiedBackup(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-zinc-400">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
        <span>Güvenlik ayarları yükleniyor...</span>
      </div>
    );
  }

  const isEnabled = status?.enabled;

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-black text-white tracking-tight">Güvenlik &amp; 2FA Yönetimi</h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
              isEnabled 
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800' 
                : 'bg-amber-950/60 text-amber-400 border-amber-800'
            }`}>
              {isEnabled ? '2FA Aktif' : '2FA Devre Dışı'}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Yönetim paneli iki faktörlü kimlik doğrulama, ekip erişimi ve acil durum kodları.
          </p>
        </div>

        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
            isEnabled
              ? 'bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900'
              : 'bg-emerald-600 text-white hover:bg-emerald-500'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{toggling ? 'İşleniyor...' : isEnabled ? '2FA\'yı Devre Dışı Bırak' : '2FA\'yı Etkinleştir'}</span>
        </button>
      </div>

      {actionMessage && (
        <div className={`p-4 rounded-2xl border text-xs font-medium ${
          actionMessage.type === 'success' 
            ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300' 
            : 'bg-rose-950/50 border-rose-800 text-rose-300'
        }`}>
          {actionMessage.text}
        </div>
      )}

      {/* Main Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 1: Ekip & Başka Ülke Kurulum Anahtarı */}
        <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400">
            <KeyRound className="w-5 h-5 shrink-0" />
            <h3 className="text-sm font-bold text-white">Google Authenticator Kurulum Anahtarı</h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Başka bir şehirdeki veya ülkedeki arkadaşınız panele girmek istediğinde, kendi telefonundaki Google Authenticator uygulamasına bu anahtarı ekleyerek geçerli 6 haneli kod üretebilir:
          </p>

          <div className="flex items-center justify-between bg-zinc-900/90 border border-zinc-700/80 p-3 rounded-xl">
            <code className="text-xs font-mono text-indigo-300 select-all font-bold tracking-wider">
              {status?.secretBase32 || '—'}
            </code>
            <button
              onClick={handleCopyKey}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white cursor-pointer transition-colors"
              title="Anahtarı Kopyala"
            >
              {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="text-[11px] text-zinc-500 space-y-1 pt-1">
            <p>1. Google Authenticator uygulamasını açın</p>
            <p>2. <strong>+</strong> &rarr; <strong>Kurulum anahtarı gir</strong> seçin</p>
            <p>3. Hesap: <strong className="text-zinc-300">Handyeco</strong>, Anahtar: yukarıdaki kod</p>
          </div>
        </div>

        {/* Card 2: Acil Durum / Master Yedek Kod */}
        <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <h3 className="text-sm font-bold text-white">Acil Durum Master Kodu</h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Saat farkı veya telefon uyuşmazlığında Google Authenticator kodu kabul edilmezse, giriş ekranındaki 2FA kutusuna doğrudan bu acil durum kodunu yazarak anında giriş yapabilirsiniz:
          </p>

          <div className="flex items-center justify-between bg-zinc-900/90 border border-zinc-700/80 p-3 rounded-xl">
            <code className="text-sm font-mono text-amber-300 select-all font-bold tracking-widest">
              {status?.masterBackupCode || '—'}
            </code>
            <button
              onClick={handleCopyBackup}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white cursor-pointer transition-colors"
              title="Yedek Kodu Kopyala"
            >
              {copiedBackup ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-900/40 text-[11px] text-amber-300/90 leading-relaxed">
            💡 <strong>İpucu:</strong> Eğer arkadaşınız 2FA ile uğraşmak istemiyorsa, yukarıdaki butondan <strong>2FA'yı Devre Dışı Bırak</strong> diyebilirsiniz. Böylece şifre girildiği an panele açılır.
          </div>
        </div>

      </div>
    </div>
  );
}
