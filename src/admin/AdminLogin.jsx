import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        localStorage.setItem('handyeco_admin_token', data.token);
        onLoginSuccess(data.token);
      } else {
        setError(data.error || 'Geçersiz admin şifresi. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      setError('Sunucuya bağlanılamadı. Lütfen ağ bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-4 relative overflow-hidden text-zinc-100">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Brand Card (OLED Near-Black) */}
        <div className="bg-[#0b0e14] border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-600/25">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-900/60 text-blue-400 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handyeco Management Suite</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Yönetici Paneli
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              İçerik, canlı teklifler, muhasebe ve SEO yönetimi için şifrenizi girin.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2 text-left animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                placeholder="Admin şifrenizi girin..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-zinc-500 text-sm outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-98 shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Doğrulanıyor...' : 'Panele Giriş Yap'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-center gap-2 text-xs text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Şifreli Oturum • Varsayılan: handyeco2026!</span>
          </div>

        </div>

        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-300 font-medium transition-colors"
          >
            &larr; Web Sitesine Geri Dön
          </a>
        </div>
      </div>
    </div>
  );
}
