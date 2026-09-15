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
  LogOut, 
  ExternalLink, 
  Menu, 
  X,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import AdminLogin from './AdminLogin';
import LeadsManager from './LeadsManager';
import BusinessEditor from './BusinessEditor';
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
  const [activeTab, setActiveTab] = useState('leads'); // leads | business | hero | services | gallery | reviews | faq_areas | seo
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { content, refreshContent, updateSectionLocally } = useContent();

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
        const data = await res.json();
        if (data.valid) {
          setIsAuth(true);
        } else {
          localStorage.removeItem('handyeco_admin_token');
          setIsAuth(false);
        }
      } catch (e) {
        setIsAuth(false);
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
        showToast(`Saved ${section} changes successfully!`);
        refreshContent();
        return true;
      } else {
        alert(resData.error || 'Failed to save changes');
        return false;
      }
    } catch (err) {
      alert('Network error while saving: ' + err.message);
      return false;
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Verifying admin session...
      </div>
    );
  }

  if (!isAuth) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const navItems = [
    { id: 'leads', label: 'Inquiries & Quotes', icon: Inbox, badge: 'Live Leads' },
    { id: 'business', label: 'Business & Pricing', icon: Building2 },
    { id: 'hero', label: 'Hero & Headings', icon: Sparkles },
    { id: 'services', label: 'Services & Scope', icon: Wrench },
    { id: 'gallery', label: 'Photo Gallery', icon: Camera },
    { id: 'reviews', label: 'Customer Reviews', icon: Star },
    { id: 'faq_areas', label: 'Areas & FAQs', icon: MapPin },
    { id: 'seo', label: 'Edinburgh SEO Suite', icon: Search, badge: '100% SEO' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 md:hidden cursor-pointer"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <a href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-600/20">
              H
            </div>
            <div className="text-left">
              <span className="font-extrabold text-sm text-white tracking-tight block leading-none">
                Handyeco Admin
              </span>
              <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">
                Edinburgh Full Control Panel
              </span>
            </div>
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
            title="Sign out of admin"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar Navigation */}
        <aside className={`fixed inset-y-16 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 p-3 space-y-1 transform transition-transform duration-200 md:relative md:inset-auto md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 text-left">
            Site Management Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-6 mt-6 border-t border-slate-800/80 px-3 text-left">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Hot Sync Active</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
              Edits instantly update the public site and persistent JSON store.
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'leads' && <LeadsManager token={token} />}
            {activeTab === 'business' && <BusinessEditor data={content.siteConfig} onSave={handleSaveSection} token={token} />}
            {activeTab === 'hero' && <HeroEditor data={content.hero} onSave={handleSaveSection} token={token} />}
            {activeTab === 'services' && <ServicesEditor data={content.services} onSave={handleSaveSection} />}
            {activeTab === 'gallery' && <GalleryManager data={content.gallery} onSave={handleSaveSection} token={token} />}
            {activeTab === 'reviews' && <ReviewsManager data={content.reviews} onSave={handleSaveSection} token={token} onRefresh={refreshContent} />}
            {activeTab === 'faq_areas' && <FaqAreasEditor areasData={content.areas} faqData={content.faq} onSave={handleSaveSection} />}
            {activeTab === 'seo' && <SeoEditor data={content.seo} onSave={handleSaveSection} />}
          </div>
        </main>

      </div>
    </div>
  );
}
