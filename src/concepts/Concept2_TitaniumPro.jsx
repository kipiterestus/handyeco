import React, { useState } from 'react';
import { 
  Star, 
  MapPin, 
  ArrowRight, 
  MessageSquare, 
  ShieldCheck, 
  PackageCheck, 
  Tv, 
  Paintbrush, 
  Wrench, 
  Hammer, 
  CheckCircle2, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';
import { SERVICES } from '../data/servicesData';
import { REVIEWS } from '../data/reviewsData';
import { GALLERY_ITEMS } from '../data/galleryData';

export default function Concept2_TitaniumPro({ onOpenQuote }) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const iconMap = {
    PackageCheck,
    Tv,
    Paintbrush,
    Wrench,
    Hammer,
    ShieldCheck
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#F5F5F7] font-sans antialiased selection:bg-blue-500 selection:text-white pb-28 relative overflow-hidden">
      
      {/* Cinematic Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-blue-600/15 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Titanium Floating Header */}
      <nav className="sticky top-0 z-40 backdrop-blur-2xl bg-black/70 border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-white">
              Handy<span className="text-blue-500">eco</span>
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 bg-white/[0.08] px-2 py-0.5 rounded-full border border-white/[0.08]">
              Pro Titanium
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-7 text-xs font-semibold text-slate-400">
            <a href="#pro-services" className="hover:text-white transition-colors">Services</a>
            <a href="#pro-areas" className="hover:text-white transition-colors">Areas</a>
            <a href="#pro-reviews" className="hover:text-white transition-colors">Reviews</a>
            <a href="#pro-quote" className="hover:text-white transition-colors">Quote</a>
          </div>

          <a
            href={BUSINESS_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-white text-black hover:bg-slate-200 transition-all flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.12] text-xs font-medium text-slate-300 mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Edinburgh Area &bull; Minimum call-out fee £65</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Precision Handyman. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-slate-400 to-slate-500">
            Engineered for Edinburgh.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          From heavy OLED TVs anchored into stone tenement walls to flawless multi-door IKEA wardrobes. Clean, punctual, and uncompromising quality.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#pro-quote"
            className="px-7 py-3.5 rounded-full bg-white text-black hover:bg-slate-100 text-sm font-bold transition-all shadow-lg active:scale-98"
          >
            Get an Estimate
          </a>
          <a
            href={BUSINESS_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/[0.15] text-sm font-semibold transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </section>

      {/* Titanium Spec Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Spec Card 1: 5.0 Rating */}
          <div className="p-6 rounded-[24px] bg-[#121214] border border-white/[0.08] text-left hover:border-white/[0.2] transition-colors">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Rating</span>
            <div className="text-3xl font-black text-white mt-1">5.0 / 5.0</div>
            <p className="text-xs text-slate-400 mt-1">100% 5-star Google Reviews in Edinburgh</p>
          </div>

          {/* Spec Card 2: Fee */}
          <div className="p-6 rounded-[24px] bg-[#121214] border border-white/[0.08] text-left hover:border-white/[0.2] transition-colors">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Standard Rate</span>
            <div className="text-3xl font-black text-white mt-1">£65</div>
            <p className="text-xs text-slate-400 mt-1">Minimum call-out fee (Edinburgh Area)</p>
          </div>

          {/* Spec Card 3: Tenement Ready */}
          <div className="p-6 rounded-[24px] bg-[#121214] border border-white/[0.08] text-left hover:border-white/[0.2] transition-colors">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Structure</span>
            <div className="text-3xl font-black text-white mt-1">Stone & Masonry</div>
            <p className="text-xs text-slate-400 mt-1">Equipped for historic Edinburgh tenements</p>
          </div>

        </div>
      </section>

      {/* Services Hardware Grid */}
      <section id="pro-services" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 text-left">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-500">Capabilities</span>
          <h2 className="text-3xl font-extrabold text-white mt-1">Specialist Services</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((srv) => {
            const Icon = iconMap[srv.iconName] || Hammer;
            return (
              <div key={srv.id} className="p-6 rounded-[28px] bg-[#121214] border border-white/[0.08] hover:border-blue-500/40 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-white/[0.06] text-blue-400 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">{srv.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{srv.shortDesc}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-white/[0.06]">
                  <a
                    href="#pro-quote"
                    className="py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white text-slate-200 hover:text-black text-xs font-bold text-center transition-all"
                  >
                    Book Quote
                  </a>
                  <a
                    href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(`Hi Ekrem, quote for ${srv.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-800/40 text-xs font-bold text-center transition-all flex items-center justify-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Real Reviews Dark Cards */}
      <section id="pro-reviews" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 text-left">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Verified Feedback</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Client Reviews</h2>
          </div>
          <a
            href={BUSINESS_INFO.googleProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-blue-400 hover:underline"
          >
            Google Maps Profile &rarr;
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REVIEWS.slice(0, 3).map((rev) => (
            <div key={rev.id} className="p-6 rounded-[24px] bg-[#121214] border border-white/[0.08] flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />)}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">"{rev.text}"</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06]">
                <span className="text-xs font-bold text-white block">{rev.author}</span>
                <span className="text-[10px] text-slate-500 block">{rev.location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quote Callout */}
      <section id="pro-quote" className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 text-center">
        <div className="p-8 sm:p-12 rounded-[32px] bg-[#161618] border border-white/[0.12] text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Request an Estimate in 60 Seconds
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-6">
            Minimum call-out fee £65 (Edinburgh Area). Same-day response via WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={BUSINESS_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm text-center transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Message on WhatsApp</span>
            </a>
            <a
              href={"tel:" + BUSINESS_INFO.phone}
              className="py-3.5 px-6 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/[0.12] font-bold text-sm text-center transition-colors"
            >
              Call 07760 696723
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
