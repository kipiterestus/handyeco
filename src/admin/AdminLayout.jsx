import React, { useState, useEffect } from 'react';
import { 
  Inbox, 
  Building2, 
  Sparkles, 
  Wrench, 
  Camera, 
  Star, 
  MapPin, 
  Search, 
  Send,
  LogOut, 
  ExternalLink, 
  Menu, 
  X,
  ShieldCheck,
  CheckCircle2,
  PoundSterling,
  Briefcase,
  SlidersHorizontal,
  Calendar
} from 'lucide-react';
import AdminLogin from './AdminLogin';
import LeadsManager from './LeadsManager';
import ScheduleManager from './ScheduleManager';
import AccountingManager from './AccountingManager';
import BusinessEditor from './BusinessEditor';
import TelegramEditor from './TelegramEditor';
import HeroEditor from './HeroEditor';
import ServicesEditor from './ServicesEditor';
import GalleryManager from './GalleryManager';
import ReviewsManager from './ReviewsManager';
import FaqAreasEditor from './FaqAreasEditor';
import SeoEditor from './SeoEditor';
import { useContent } from '../context/ContentContext';

export default function AdminLayout() {
  const [token, setToken] = useState(() => localStorage.getItem('handyeco_admin_token') || '');
  const [isAuth, setIsAuth] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // Persist activeTab in localStorage so updating data never kicks the user back to leads
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('handyeco_admin_active_tab') || 'leads';
  });
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [unreadLeadsCount, setUnreadLeadsCount] = useState(0);
  
  // State for passing lead data to schedule and accounting
  const [initialLeadForSchedule, setInitialLeadForSchedule] = useState(null);
  const [initialLeadForAccounting, setInitialLeadForAccounting] = useState(null);

  const { content, refreshContent, updateSectionLocally } = useContent();

  // Check for new unread leads
  const checkUnreadLeads = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/quotes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.quotes)) {
          const lastSeen = Number(localStorage.getItem('handyeco_last_seen_quote_time') || 0);
          
          // Unread: new quotes arriving after lastSeen or status === 'new'
          const unread = data.quotes.filter(q => {
            const quoteTime = q.createdAt ? new Date(q.createdAt).getTime() : 0;
            return q.status === 'new' && (quoteTime > lastSeen || !lastSeen);
          });

          if (activeTab === 'leads') {
            setUnreadLeadsCount(0);
          } else {
            setUnreadLeadsCount(unread.length);
          }
        }
      }
    } catch (e) {
      console.error('Error checking unread leads:', e);
    }
  };

  useEffect(() => {
    if (isAuth && token) {
      checkUnreadLeads();
      const interval = setInterval(checkUnreadLeads, 25000);
      return () => clearInterval(interval);
    }
  }, [isAuth, token, activeTab]);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    localStorage.setItem('handyeco_admin_active_tab', tabId);
    setSidebarOpen(false);

    // When visiting leads, immediately clear notification badge and update last seen
    if (tabId === 'leads') {
      localStorage.setItem('handyeco_last_seen_quote_time', String(Date.now()));
      setUnreadLeadsCount(0);
    }
  };

  // Verify token on mount
  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setIsAuth(false);
        setCheckingAuth(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.valid) {
            setIsAuth(true);
          } else {
            localStorage.removeItem('handyeco_admin_token');
            setIsAuth(false);
          }
        } else if (res.status === 401) {
          localStorage.removeItem('handyeco_admin_token');
          setIsAuth(false);
        } else {
          // Temporary server deploy or 502/503: do not kick user out
          setIsAuth(true);
        }
      } catch (e) {
        // Tab was suspended / offline / network hiccup: keep session active
        console.warn('[Admin Auth] Verification network hiccup, keeping session:', e.message);
        setIsAuth(true);
      } finally {
        setCheckingAuth(false);
      }
    };
    verify();
  }, [token]);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
    setIsAuth(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
    localStorage.removeItem('handyeco_admin_token');
    setToken('');
    setIsAuth(false);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Central section saver communicating directly with backend API
  const handleSaveSection = async (section, data) => {
    try {
      const res = await fetch(`/api/content/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        updateSectionLocally(section, data);
        showToast(`${section} başarıyla kaydedildi!`);
        refreshContent();
        return true;
      } else {
        alert(resData.error || 'Değişiklikler kaydedilemedi');
        return false;
      }
    } catch (err) {
      alert('Kaydetme esnasında ağ hatası: ' + err.message);
      return false;
    }
  };

  // Handler to schedule a lead into calendar
  const handleScheduleLead = (lead) => {
    setInitialLeadForSchedule(lead);
    handleSelectTab('schedule');
    showToast(`${lead.name || 'Müşteri'} için randevu planlama ekranı açıldı.`);
  };

  // Handler to log a lead into accounting
  const handleLogLeadToAccounting = (lead) => {
    setInitialLeadForAccounting(lead);
    handleSelectTab('accounting');
    showToast(`${lead.name || 'Müşteri'} için muhasebe kaydı formu açıldı.`);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-zinc-400 font-medium">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span>Yönetici oturumu doğrulanıyor...</span>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // 1. KATEGORİ: OPERASYON
  const operationsNav = [
    { 
      id: 'leads', 
      label: 'Talepler', 
      icon: Inbox,
      unreadCount: unreadLeadsCount
    },
    { id: 'schedule', label: 'Randevular', icon: Calendar },
    { id: 'accounting', label: 'Muhasebe', icon: PoundSterling },
  ];

  // 2. KATEGORİ: SİTE AYARLARI
  const siteSettingsNav = [
    { id: 'telegram', label: 'Telegram Bot', icon: Send },
    { id: 'business', label: 'İşletme Bilgileri', icon: Building2 },
    { id: 'hero', label: 'Ana Sayfa', icon: Sparkles },
    { id: 'services', label: 'Hizmetler', icon: Wrench },
    { id: 'gallery', label: 'Galeri', icon: Camera },
    { id: 'reviews', label: 'Yorumlar', icon: Star },
    { id: 'faq_areas', label: 'Bölgeler & SSS', icon: MapPin },
    { id: 'seo', label: 'SEO', icon: Search },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 flex flex-col antialiased">
      {/* Toast Bildirimi (Yalnızca Ekranda) */}
      {toastMessage && (
        <div className="print:hidden fixed bottom-6 right-6 z-50 bg-emerald-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Üst Bar (OLED Siyah) */}
      <header className="print:hidden h-16 bg-[#0b0e14]/95 backdrop-blur-md border-b border-zinc-800/90 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 md:hidden cursor-pointer shrink-0"
            aria-label="Menüyü Aç/Kapat"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <a href="/admin" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-sm shadow-blue-600/25 shrink-0">
              H
            </div>
            <div className="text-left min-w-0">
              <span className="font-extrabold text-xs sm:text-sm text-white tracking-tight block leading-tight truncate">
                Handyeco Panel
              </span>
              <span className="text-[9px] sm:text-[10px] text-blue-400 font-bold tracking-wider uppercase block truncate">
                Edinburgh Kontrol Merkezi
              </span>
            </div>
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold border border-zinc-800 transition-all"
          >
            <span className="hidden sm:inline">Siteyi Gör</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/60 transition-colors cursor-pointer"
            title="Oturumu Kapat"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Çıkış</span>
          </button>
        </div>
      </header>

      {/* Ana Çalışma Düzeni */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Backdrop Overlay */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs z-45 md:hidden transition-opacity"
            aria-hidden="true"
          />
        )}

        {/* Sol Menü (OLED Siyah) */}
        <aside className={`print:hidden fixed inset-y-16 left-0 z-50 w-64 sm:w-72 max-w-[85vw] bg-[#0b0e14] border-r border-zinc-800/90 p-3 space-y-4 overflow-y-auto transform transition-transform duration-200 md:relative md:inset-auto md:translate-x-0 shadow-2xl md:shadow-lg ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          
          {/* 1. KATEGORİ: OPERASYON */}
          <div className="space-y-1 text-left">
            <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Briefcase className="w-3 h-3" />
              <span>Operasyon</span>
            </div>

            {operationsNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-1 text-left">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate whitespace-nowrap">{item.label}</span>
                  </div>

                  {item.unreadCount > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white animate-pulse shadow-sm shadow-rose-600/40 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping shrink-0" />
                      <span>{item.unreadCount} YENİ</span>
                    </span>
                  ) : item.badge ? (
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                    }`}>
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="border-t border-zinc-800/80 my-2" />

          {/* 2. KATEGORİ: SİTE AYARLARI */}
          <div className="space-y-1 text-left">
            <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3 h-3" />
              <span>Site Ayarları</span>
            </div>

            {siteSettingsNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-1 text-left">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate whitespace-nowrap">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Alt Bilgi */}
          <div className="pt-4 border-t border-zinc-800/80 px-3 text-left">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Canlı Senkronizasyon Aktif</span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
              Tüm değişiklikler JSON veritabanına ve yayındaki siteye anında yansır.
            </p>
          </div>
        </aside>

        {/* Ana İçerik Bölgesi (OLED Siyah) */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 bg-[#07090e] print:p-0 print:bg-white print:overflow-visible">
          <div className="max-w-6xl mx-auto print:max-w-full">
            {activeTab === 'leads' && (
              <LeadsManager 
                token={token} 
                onScheduleLead={handleScheduleLead}
                onLogLeadToAccounting={handleLogLeadToAccounting} 
              />
            )}
            {activeTab === 'schedule' && (
              <ScheduleManager 
                token={token} 
                initialLeadData={initialLeadForSchedule}
                onClearInitialLead={() => setInitialLeadForSchedule(null)}
                onLogJobToAccounting={handleLogLeadToAccounting}
              />
            )}
            {activeTab === 'accounting' && (
              <AccountingManager 
                token={token} 
                initialLeadData={initialLeadForAccounting}
                onClearInitialLead={() => setInitialLeadForAccounting(null)}
              />
            )}
            {activeTab === 'telegram' && (
              <TelegramEditor data={content.siteConfig} onSave={handleSaveSection} token={token} />
            )}
            {activeTab === 'business' && (
              <BusinessEditor data={content.siteConfig} onSave={handleSaveSection} token={token} />
            )}
            {activeTab === 'hero' && (
              <HeroEditor data={content.hero} onSave={handleSaveSection} token={token} />
            )}
            {activeTab === 'services' && (
              <ServicesEditor data={content.services} onSave={handleSaveSection} />
            )}
            {activeTab === 'gallery' && (
              <GalleryManager data={content.gallery} onSave={handleSaveSection} token={token} />
            )}
            {activeTab === 'reviews' && (
              <ReviewsManager 
                data={content.reviews} 
                siteConfig={content.siteConfig}
                onSave={handleSaveSection} 
                token={token} 
                onRefresh={refreshContent} 
              />
            )}
            {activeTab === 'faq_areas' && (
              <FaqAreasEditor areasData={content.areas} faqData={content.faq} onSave={handleSaveSection} />
            )}
            {activeTab === 'seo' && (
              <SeoEditor data={content.seo} onSave={handleSaveSection} />
            )}
          </div>
        </main>

      </div>
    </div>
  );
}
