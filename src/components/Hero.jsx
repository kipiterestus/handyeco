import React from 'react';
import { 
  Star, 
  ShieldCheck, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  PhoneCall, 
  MapPin, 
  Clock 
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';

export default function Hero({ onOpenQuote }) {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50 to-white">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy, Badges & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Trust Badges Bar */}
            <div className="inline-flex flex-wrap items-center gap-2 p-1.5 pr-4 rounded-full bg-white border border-slate-200/80 shadow-sm text-xs text-slate-700">
              <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Live Google Rating</span>
              </span>
              <div className="flex items-center text-amber-500 font-bold">
                <div className="flex mr-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span>5.0 / 5.0</span>
              </div>
              <span className="text-slate-400">|</span>
              <span className="font-medium text-slate-600">Edinburgh & Surrounds</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl xl:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Edinburgh's Trusted Handyman for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
                Repairs, Assembly
              </span>{" "}
              & Home Renovations.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              Specialist in flat-pack furniture assembly, TV wall mounting into Edinburgh stone walls, interior painting, and mould-free bathroom silicone sealing. Fast, reliable, and exceptionally tidy workmanship.
            </p>

            {/* Key Bullet Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-sm text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fully Insured (£1M Public Liability)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Hidden Fees or Surprise Costs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tenement Specialists (Stone & Plaster)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Prompt WhatsApp Photo Estimates</span>
              </div>
            </div>

            {/* Conversion CTA Group */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={onOpenQuote}
                className="inline-flex items-center justify-center px-7 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35 transition-all duration-200 text-base active:scale-[0.98] cursor-pointer group"
              >
                <span>Get a Free Quote</span>
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all duration-200 text-base active:scale-[0.98] group"
              >
                <MessageSquare className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={"tel:" + BUSINESS_INFO.phone}
                className="inline-flex items-center justify-center px-4 py-4 rounded-xl font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors text-sm"
              >
                <PhoneCall className="w-4 h-4 mr-2 text-slate-500" />
                <span>{BUSINESS_INFO.displayPhone}</span>
              </a>
            </div>

            {/* Quick response disclaimer */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Average response time under 15 minutes on WhatsApp during working hours.</span>
            </div>
          </div>

          {/* Right Column: Visual Showcase & Floating Google Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual Image Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] sm:aspect-[3/4] bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1000&auto=format&fit=crop&q=80"
                  alt="Professional Handyman at work in Edinburgh"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/10" />

                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-300 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>Certified Craftsmanship</span>
                  </div>
                  <h3 className="text-xl font-bold leading-snug">
                    Over 500+ Edinburgh Homes Repaired & Maintained
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    From Morningside flats to New Town tenements & Lothian estates.
                  </p>
                </div>
              </div>

              {/* Floating Review Card Overlay */}
              <div className="absolute -top-6 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-200/80 max-w-[260px] animate-soft-pulse hidden sm:block text-left">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    G
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">Google Review</p>
                    <p className="text-[10px] text-slate-500">Morningside, Edinburgh</p>
                  </div>
                </div>
                <div className="flex text-amber-400 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 italic line-clamp-2">
                  "Assembled 2 huge IKEA wardrobes & mounted our 65" TV into brick. Spotless!"
                </p>
              </div>

              {/* Floating Shield Insurance Badge */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                  <ShieldCheck className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-white uppercase tracking-wider">
                    Fully Insured
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    £1M Public Liability Cover
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
