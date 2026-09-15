import React from 'react';
import { 
  Star, 
  ShieldCheck, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Clock 
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { BUSINESS_INFO } from '../data/businessData';

export default function Hero({ onOpenQuote }) {
  const { content } = useContent();
  const hero = content.hero || {};
  const config = content.siteConfig || {};

  return (
    <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 md:pt-36 md:pb-20 overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50 to-white">
      {/* Background Soft Ambient Light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[300px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Copy, Badges & CTAs */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
            
            {/* Trust Badges Bar - Centered on Mobile, Clickable anchor linking to #reviews */}
            <div className="flex justify-center sm:justify-start">
              <a
                href="#reviews"
                className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 pr-3 sm:pr-4 rounded-full bg-white hover:bg-blue-50/50 border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-all text-[11px] sm:text-xs text-slate-700 cursor-pointer group"
              >
                <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-emerald-200 text-[10px] sm:text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>{hero.ratingPlatform || 'Google & MyBuilder'}</span>
                </span>
                <div className="flex items-center text-amber-500 font-bold">
                  <div className="flex mr-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span>{hero.ratingScore || '5.0 / 5.0'}</span>
                </div>
                <span className="text-slate-300">|</span>
                <span className="font-bold text-blue-600 group-hover:text-blue-800 flex items-center gap-0.5">
                  <span>Verified Reviews</span>
                  <span>&darr;</span>
                </span>
              </a>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.18] sm:leading-[1.15]">
              {hero.headlineStart || "Edinburgh's Trusted Handyman for"}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
                {hero.headlineHighlight || "Repairs, Assembly"}
              </span>{" "}
              {hero.headlineEnd || "& Home Renovations."}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              {hero.description || "Specialist in flat-pack furniture assembly, TV wall mounting into Edinburgh stone walls, interior painting, and mould-free bathroom silicone sealing. Fast, reliable, and exceptionally tidy workmanship."}
            </p>

            {/* Key Bullet Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs sm:text-sm text-slate-700 font-medium">
              {(hero.bullets || [
                'Punctual, Clean & Spotless Tidy',
                'Zero Hidden Fees • £65 Minimum Call-Out',
                'Tenement Specialists (Stone & Plaster)',
                'Prompt WhatsApp Photo Estimates'
              ]).map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            {/* Conversion CTA Group */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onOpenQuote}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 sm:px-7 sm:py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all text-sm sm:text-base cursor-pointer group"
              >
                <span>Get a Free Quote</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href={config.whatsappUrl || BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 active:scale-[0.98] transition-all text-sm sm:text-base group"
              >
                <MessageSquare className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Quick response disclaimer */}
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 pt-0.5">
              <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{config.responseTimeText || 'Average response time: 15–30 mins on WhatsApp.'}</span>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual Image Card */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 sm:border-4 border-white aspect-[4/3] sm:aspect-[4/5] bg-slate-900">
                <img
                  src={hero.heroImage || '/hero-handyman-edinburgh.jpg'}
                  alt="Edinburgh Handyman assembling furniture with cordless drill in a home apartment"
                  className="w-full h-full object-cover object-top"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/20" />

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 text-white text-left">
                  <h3 className="text-base sm:text-xl font-bold leading-snug">
                    {hero.completedCount || 'Over 500+ Edinburgh Homes Maintained'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                    {hero.completedSubtext || 'From Morningside flats to New Town tenements.'}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
