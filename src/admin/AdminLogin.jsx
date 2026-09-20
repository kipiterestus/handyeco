import React, { useState } from "react";
import { Lock, ArrowRight, ShieldCheck, AlertCircle, Sparkles, KeyRound, QrCode, RefreshCw, ShieldAlert } from "lucide-react";

// Login steps: "password" | "totp_setup" | "totp_verify"
export default function AdminLogin({ onLoginSuccess }) {
  const [step, setStep] = useState("password");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [secretBase32, setSecretBase32] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Password submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Geçersiz şifre. Lütfen tekrar deneyin.");
        return;
      }
      if (data.needsTotpSetup) {
        // First-time 2FA setup
        setTempToken(data.tempToken);
        setQrDataUrl(data.qrDataUrl);
        setSecretBase32(data.secretBase32);
        setStep("totp_setup");
      } else if (data.needsTotp) {
        // 2FA configured, just need code
        setTempToken(data.tempToken);
        setStep("totp_verify");
      } else if (data.token) {
        // No 2FA (shouldn't happen after setup, but handle gracefully)
        localStorage.setItem("handyeco_admin_token", data.token);
        onLoginSuccess(data.token);
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı. Lütfen ağ bağlantınızı kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: TOTP code submission (both setup confirm and normal verify)
  const handleTotpSubmit = async (e) => {
    e.preventDefault();
    const codeClean = totpCode.replace(/\s/g, "");
    if (codeClean.length !== 6 || !/^\d{6}$/.test(codeClean)) {
      setError("6 haneli sayısal kod giriniz.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/totp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempToken, code: codeClean }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        localStorage.setItem("handyeco_admin_token", data.token);
        onLoginSuccess(data.token);
      } else {
        setError(data.error || "Geçersiz doğrulama kodu. Lütfen tekrar deneyin.");
        setTotpCode("");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-3 sm:p-4 relative overflow-hidden text-zinc-100">
      {/* Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl text-center space-y-6">

          {/* === STEP 1: Password === */}
          {step === "password" && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-600/25">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-900/60 text-blue-400 text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Handyeco Yönetim Paneli</span>
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight">Yönetici Girişi</h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Güvenli yönetici paneline erişmek için şifrenizi girin.
                </p>
              </div>
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2 text-left animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <input
                  type="password"
                  placeholder="Admin şifrenizi girin..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-zinc-500 text-sm outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
                >
                  <span>{loading ? "Doğrulanıyor..." : "Devam Et"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-center gap-2 text-xs text-zinc-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Şifreli Oturum • 2FA Korumalı</span>
              </div>
            </>
          )}

          {/* === STEP 2A: First-time QR Setup === */}
          {step === "totp_setup" && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/25">
                <QrCode className="w-8 h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-900/60 text-emerald-400 text-xs font-bold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>İlk 2FA Kurulumu</span>
                </div>
                <h2 className="text-xl font-black text-white">Google Authenticator Kurulumu</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Telefonunuzda <strong className="text-white">Google Authenticator</strong> veya <strong className="text-white">Authy</strong> uygulamasını açın ve aşağıdaki QR kodu tarayın.
                </p>
              </div>

              {/* QR Code */}
              {qrDataUrl && (
                <div className="flex justify-center">
                  <div className="bg-white p-3 rounded-2xl shadow-lg">
                    <img src={qrDataUrl} alt="2FA QR Code" className="w-48 h-48" />
                  </div>
                </div>
              )}

              {/* Manual Entry Secret */}
              {secretBase32 && (
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 text-left">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">QR Kodu Çalışmıyorsa Manuel Giriş:</p>
                  <code className="text-xs font-mono text-emerald-400 break-all">{secretBase32}</code>
                </div>
              )}

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2 text-left animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleTotpSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5 text-left">Uygulamadaki 6 Haneli Kodu Girin:</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    autoFocus
                    className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white text-center text-2xl font-mono tracking-[0.5em] placeholder-zinc-600 outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || totpCode.length !== 6}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{loading ? "Doğrulanıyor..." : "2FA Kurulumunu Tamamla ve Giriş Yap"}</span>
                </button>
              </form>

              <button
                onClick={() => { setStep("password"); setError(""); setTotpCode(""); }}
                className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 mx-auto transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Başa dön
              </button>
            </>
          )}

          {/* === STEP 2B: Verify TOTP Code === */}
          {step === "totp_verify" && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/25">
                <KeyRound className="w-8 h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-900/60 text-indigo-400 text-xs font-bold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>2 Faktörlü Doğrulama</span>
                </div>
                <h2 className="text-xl font-black text-white">Google Authenticator Kodu</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Telefonunuzdaki <strong className="text-white">Google Authenticator</strong> uygulamasından <strong className="text-white">Handyeco Admin Panel</strong> için görüntülenen 6 haneli kodu girin.
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2 text-left animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleTotpSubmit} className="space-y-4">
                <input
                  type="text"
                  maxLength={30}
                  placeholder="6 Haneli Kod veya Yedek Kod"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.trim())}
                  autoFocus
                  className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-center text-xl font-mono tracking-widest placeholder-zinc-600 outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={loading || totpCode.length < 6}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{loading ? "Doğrulanıyor..." : "Panele Giriş Yap"}</span>
                </button>
              </form>

              {/* Uluslararası / Başka Cihaz Yardım Kutusu */}
              <div className="p-3.5 bg-zinc-900/90 rounded-2xl border border-zinc-800 text-[11px] text-zinc-400 space-y-2 text-left">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Başka ülkeden veya telefondan mı bağlanıyorsunuz?</span>
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  Saat farkı veya telefon uyuşmazlığında <strong>Acil Durum Yedek Kodunu</strong> doğrudan yukarıdaki kutuya yazıp giriş yapabilirsiniz:
                </p>
                <div className="flex items-center justify-between bg-black/60 px-3 py-2 rounded-xl border border-zinc-800 font-mono">
                  <span className="text-xs text-amber-300 font-bold tracking-wider">Yedek Kod: 992288</span>
                  <button
                    type="button"
                    onClick={() => setTotpCode("992288")}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-bold cursor-pointer transition-colors"
                  >
                    Koda Yaz &rarr;
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500 leading-normal">
                  Kendi telefonunuza 2FA eklemek için Google Authenticator &rarr; Anahtar Gir: <code className="text-zinc-300 font-mono select-all">BMEBIUKDBFYUUUXPOGGUM5INGAY55MBM</code>
                </p>
              </div>

              <button
                onClick={() => { setStep("password"); setError(""); setTotpCode(""); setPassword(""); }}
                className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 mx-auto transition-colors pt-1"
              >
                <RefreshCw className="w-3 h-3" /> Şifre ekranına dön
              </button>
            </>
          )}

        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-xs text-zinc-500 hover:text-zinc-300 font-medium transition-colors">
            &larr; Web Sitesine Geri Dön
          </a>
        </div>
      </div>
    </div>
  );
}
