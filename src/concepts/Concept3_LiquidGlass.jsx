import React, { useState } from 'react';
import { 
  Star, 
  MapPin, 
  ArrowRight, 
  MessageSquare, 
  Sparkles, 
  PackageCheck, 
  Tv, 
  Paintbrush, 
  Wrench, 
  Hammer, 
  ShieldCheck, 
  Check,
  ChevronRight
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';
import { SERVICES } from '../data/servicesData';
import { REVIEWS } from '../data/reviewsData';
import { GALLERY_ITEMS } from '../data/galleryData';

export default function Concept3_LiquidGlass({ onOpenQuote }) {
  const [activeTab, setActiveTab] = useState('services'); // 'services' | 'reviews' | 'areas'

  const iconMap = {
    PackageCheck,
    Tv,
    Paintbrush,
    Wrench,
    Hammer,
    ShieldCheck
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-[#F2F4F8] to-slate-200/60 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white pb-28 relative">
      
      {/* Background Soft Mesh Blobs */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-blue-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-[450px] h-[450px] bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Dynamic Island Navigation */}
      <header className="sticky top-4 z-40 max-w-xl mx-auto px-4">
        <div className="backdrop-blur-2xl bg-white/75 border border-white/90 shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-2 rounded-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 pl-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-extrabold text-sm text-slate-900 tracking-tight">
              Handy<span className="text-blue-600">eco</span>
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('services')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                activeTab === 'services' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-black'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                activeTab === 'reviews' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-black'
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => setActiveTab('areas')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                activeTab === 'areas' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-black'
              }`}
            >
              Areas
            </button>
          </div>

          <a
            href={BUSINESS_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-2xs"
            aria-label="WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Hero Liquid Card */}
      <section className="pt-16 pb-12 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-xl bg-white/80 border border-white shadow-2xs text-xs font-semibold text-slate-700 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Free quotes upfront &bull; Minimum job £65 (Edinburgh Area)</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto leading-[1.12]">
          Your Home, Maintained with Precision.
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
          Tenement flat repairs, furniture assembly, TV wall mounting, and bathroom silicone. Fluid, clean, and 5-star rated across Edinburgh.
        </p>

        {/* Liquid Action Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={BUSINESS_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-2xl backdrop-blur-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-900/15 flex items-center gap-2 transition-all active:scale-98"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Estimate</span>
          </a>
          <a
            href="#liquid-quote"
            className="px-6 py-3.5 rounded-2xl backdrop-blur-xl bg-white/80 hover:bg-white text-slate-800 border border-white text-sm font-bold shadow-2xs transition-all"
          >
            Request Free Quote
          </a>
        </div>
      </section>

      {/* Main Glass Cards Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Dynamic Content based on Segmented Control */}
        {activeTab === 'services' && (
          <div className="space-y-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICES.map((srv) => {
                const Icon = iconMap[srv.iconName] || Hammer;
                return (
                  <div
                    key={srv.id}
                    className="backdrop-blur-2xl bg-white/70 rounded-[28px] p-6 border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-blue-50/80 text-blue-600 flex items-center justify-center mb-4 shadow-2xs">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{srv.title}</h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">{srv.shortDesc}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-slate-200/50">
                      <a
                        href="#liquid-quote"
                        className="py-2.5 px-3 rounded-xl bg-slate-900 text-white text-xs font-bold text-center hover:bg-blue-600 transition-colors"
                      >
                        Book Quote
                      </a>
                      <a
                        href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(`Hi Ekrem, quote for ${srv.title}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-bold text-center hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {REVIEWS.map((rev) => (
                <div
                  key={rev.id}
                  className="backdrop-blur-2xl bg-white/70 rounded-[28px] p-6 border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex text-amber-400 mb-2">
                      {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />)}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed italic">"{rev.text}"</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{rev.author}</span>
                    <span className="text-slate-400">{rev.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'areas' && (
          <div className="backdrop-blur-2xl bg-white/70 rounded-[32px] p-8 border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-left">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Where We Work in Scotland</h3>
            </div>
            <p className="text-xs text-slate-600 mb-6">
              Complete coverage across Edinburgh and Lothians. Free quotes & £65 minimum job booking.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white/80 border border-white shadow-2xs">
                <span className="text-[10px] font-bold text-blue-600 block">Central</span>
                <span className="text-sm font-bold block mt-0.5">EH1 - EH3, EH7, EH8</span>
                <span className="text-xs text-slate-500">Old Town, New Town</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/80 border border-white shadow-2xs">
                <span className="text-[10px] font-bold text-blue-600 block">North & Coast</span>
                <span className="text-sm font-bold block mt-0.5">EH4 - EH6, EH15</span>
                <span className="text-xs text-slate-500">Leith, Portobello</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/80 border border-white shadow-2xs">
                <span className="text-[10px] font-bold text-blue-600 block">South & West</span>
                <span className="text-sm font-bold block mt-0.5">EH9 - EH14</span>
                <span className="text-xs text-slate-500">Morningside, Balerno</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/80 border border-white shadow-2xs">
                <span className="text-[10px] font-bold text-blue-600 block">Lothians</span>
                <span className="text-sm font-bold block mt-0.5">EH21 - EH30, EH54</span>
                <span className="text-xs text-slate-500">Musselburgh, Dalkeith</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Quote Bottom Card */}
      <section id="liquid-quote" className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 text-center">
        <div className="backdrop-blur-2xl bg-white/80 rounded-[32px] p-8 sm:p-10 border border-white shadow-xl text-left">
          <h3 className="text-2xl font-extrabold text-slate-900">
            Request an Estimate in 60 Seconds
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Free quotes upfront & £65 minimum job booking (Edinburgh Area). Fast response on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={BUSINESS_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm text-center shadow-sm flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Message on WhatsApp</span>
            </a>
            <a
              href={"tel:" + BUSINESS_INFO.phone}
              className="py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-sm text-center shadow-sm"
            >
              Call 07760 696723
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
