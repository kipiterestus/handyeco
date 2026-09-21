import React, { useState } from 'react';
import { 
  Star, 
  MapPin, 
  ArrowRight, 
  MessageSquare, 
  CheckCircle2, 
  PackageCheck, 
  Tv, 
  Paintbrush, 
  Wrench, 
  Hammer, 
  ShieldCheck, 
  Camera,
  Layers,
  ChevronRight,
  Send,
  Calendar,
  Sparkles
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';
import { SERVICES } from '../data/servicesData';
import { REVIEWS } from '../data/reviewsData';
import { GALLERY_ITEMS } from '../data/galleryData';

export default function Concept1_AppleBento({ onOpenQuote }) {
  const [selectedService, setSelectedService] = useState('furniture-assembly');
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);

  const iconMap = {
    PackageCheck,
    Tv,
    Paintbrush,
    Wrench,
    Hammer,
    ShieldCheck
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans antialiased selection:bg-blue-600 selection:text-white pb-24">
      
      {/* 1. Apple-Style Floating Nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-black/[0.06] transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              Handy<span className="text-blue-600">eco</span>
            </span>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 bg-black/[0.04] px-2 py-0.5 rounded-full">
              Edinburgh
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-xs font-medium text-slate-600">
            <a href="#bento-services" className="hover:text-black transition-colors">Services</a>
            <a href="#bento-areas" className="hover:text-black transition-colors">Areas</a>
            <a href="#bento-reviews" className="hover:text-black transition-colors">Reviews</a>
            <a href="#bento-gallery" className="hover:text-black transition-colors">Work</a>
            <a href="#bento-quote" className="hover:text-black transition-colors">Quote</a>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={BUSINESS_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section: Apple Keynote Style */}
      <section className="pt-20 pb-12 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/[0.08] shadow-2xs text-xs font-semibold text-slate-600 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Edinburgh Handyman Services &bull; 5.0 Google Rated</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1D1D1F] max-w-4xl mx-auto leading-[1.08]">
          Craftsmanship. <br className="hidden sm:block" />
          <span className="text-slate-400">Re-engineered for Edinburgh.</span>
        </h1>

        <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Tenement stone wall mounting, IKEA flat-pack assembly, clean painting, and anti-mould silicone sealing. Fast, punctual, and spotless.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#bento-quote"
            className="px-6 py-3 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-sm font-semibold transition-all active:scale-98 shadow-sm"
          >
            Get a Free Quote
          </a>
          <a
            href={BUSINESS_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-900 border border-black/[0.12] text-sm font-semibold transition-all shadow-2xs flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </section>

      {/* 3. Apple Bento Grid Layout */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          
          {/* Bento Tile 1: Main Visual (2 cols x 2 rows) */}
          <div className="md:col-span-2 lg:col-span-2 md:row-span-2 bg-white rounded-[28px] p-6 border border-black/[0.06] shadow-sm flex flex-col justify-between overflow-hidden relative group text-left min-h-[380px]">
            <div className="relative z-10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                Precision Handyman
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-3">
                Built for Scottish Tenements & Modern Homes
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
                Equipped with trade-grade masonry fixings for 200-year-old stone walls, plus laser levels for millimeter accuracy.
              </p>
            </div>

            <div className="relative mt-6 rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-black/[0.05]">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80"
                alt="Edinburgh Handyman Work"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-3 left-3 text-white text-xs font-semibold">
                Over 500+ jobs completed in Edinburgh
              </div>
            </div>
          </div>

          {/* Bento Tile 2: 5.0 Google Rating (1x1) */}
          <div className="bg-white rounded-[28px] p-6 border border-black/[0.06] shadow-sm flex flex-col justify-between text-left">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Verified Reputation
              </span>
              <div className="text-4xl font-black text-slate-900 mt-2 tracking-tight">
                5.0<span className="text-amber-500 text-3xl font-bold">★</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                100% 5-star Google customer feedback
              </p>
            </div>
            <a
              href={BUSINESS_INFO.googleProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline pt-3"
            >
              <span>View Google Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Bento Tile 3: Minimum Call-out (1x1) */}
          <div className="bg-white rounded-[28px] p-6 border border-black/[0.06] shadow-sm flex flex-col justify-between text-left">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Transparent Pricing
              </span>
              <div className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
                £65
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Minimum job booking (Free quotes upfront)
              </p>
            </div>
            <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl font-semibold inline-block self-start">
              Zero hidden charges
            </div>
          </div>

          {/* Bento Tile 4: Connected 3-Step Process (2 cols x 1 row) */}
          <div className="md:col-span-2 lg:col-span-2 bg-white rounded-[28px] p-6 border border-black/[0.06] shadow-sm text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-2">
              Simple 3-Step Flow
            </span>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-black text-blue-600 block">01</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">Send Photo</span>
                <span className="text-[10px] text-slate-500 block leading-tight">WhatsApp or form</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-black text-blue-600 block">02</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">Fixed Price</span>
                <span className="text-[10px] text-slate-500 block leading-tight">Clear estimate</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-black text-blue-600 block">03</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">Spotless Job</span>
                <span className="text-[10px] text-slate-500 block leading-tight">Clean finish</span>
              </div>
            </div>
          </div>

          {/* Bento Tile 5: Where We Work (Full width / 4 cols) */}
          <div id="bento-areas" className="md:col-span-3 lg:col-span-4 bg-white rounded-[28px] p-6 sm:p-7 border border-black/[0.06] shadow-sm text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/[0.05]">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Where We Work in Scotland
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                EH1 through EH54 covered with £65 minimum job booking
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-blue-600 uppercase">Central</span>
                <span className="text-xs font-extrabold block text-slate-900">EH1 - EH3, EH7, EH8</span>
                <span className="text-[11px] text-slate-500 truncate block">Old Town, New Town, West End</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-blue-600 uppercase">North & Coast</span>
                <span className="text-xs font-extrabold block text-slate-900">EH4 - EH6, EH15</span>
                <span className="text-[11px] text-slate-500 truncate block">Leith, Stockbridge, Portobello</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-blue-600 uppercase">South & West</span>
                <span className="text-xs font-extrabold block text-slate-900">EH9 - EH14</span>
                <span className="text-[11px] text-slate-500 truncate block">Morningside, Bruntsfield, Balerno</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-blue-600 uppercase">Lothians</span>
                <span className="text-xs font-extrabold block text-slate-900">EH21 - EH30, EH54</span>
                <span className="text-[11px] text-slate-500 truncate block">Musselburgh, Dalkeith, Livingston</span>
              </div>
            </div>
          </div>

          {/* Bento Tile 6: Services Showcase (4 cols) */}
          <div id="bento-services" className="md:col-span-3 lg:col-span-4 bg-white rounded-[28px] p-6 sm:p-8 border border-black/[0.06] shadow-sm text-left">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Core Services</span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                Quality Home Repairs & Assembly
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICES.map((srv) => {
                const Icon = iconMap[srv.iconName] || Hammer;
                return (
                  <div key={srv.id} className="p-5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-blue-200 transition-all shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{srv.title}</h4>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{srv.shortDesc}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-5 pt-3 border-t border-slate-200/60">
                      <a
                        href="#bento-quote"
                        className="py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-bold text-center transition-colors"
                      >
                        Book Quote
                      </a>
                      <a
                        href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(`Hi Ekrem, quote for ${srv.title}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-xs font-bold text-center transition-colors flex items-center justify-center gap-1"
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

          {/* Bento Tile 7: Real Reviews (2 cols) */}
          <div id="bento-reviews" className="md:col-span-3 lg:col-span-2 bg-white rounded-[28px] p-6 border border-black/[0.06] shadow-sm text-left">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Google Verified</span>
                <h3 className="text-lg font-extrabold text-slate-900">Real Customer Feedback</h3>
              </div>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />)}
              </div>
            </div>

            <div className="space-y-3">
              {REVIEWS.slice(0, 2).map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900">{rev.author}</span>
                    <span className="text-[11px] text-slate-400">{rev.location}</span>
                  </div>
                  <p className="text-xs text-slate-600 italic">"{rev.text}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bento Tile 8: Completed Work Gallery Slider (2 cols) */}
          <div id="bento-gallery" className="md:col-span-3 lg:col-span-2 bg-white rounded-[28px] p-6 border border-black/[0.06] shadow-sm text-left">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Work Gallery</span>
                <h3 className="text-lg font-extrabold text-slate-900">Real Completed Jobs</h3>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setActiveGalleryIdx((prev) => (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs"
                >
                  &larr;
                </button>
                <button
                  onClick={() => setActiveGalleryIdx((prev) => (prev + 1) % GALLERY_ITEMS.length)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs"
                >
                  &rarr;
                </button>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-100">
              <img
                src={GALLERY_ITEMS[activeGalleryIdx]?.image}
                alt="Job Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 text-white text-xs">
                <p className="font-bold truncate">{GALLERY_ITEMS[activeGalleryIdx]?.title}</p>
                <p className="text-[10px] text-slate-300">{GALLERY_ITEMS[activeGalleryIdx]?.location}</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Quote Callout Section */}
      <section id="bento-quote" className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 text-center">
        <div className="bg-white rounded-[32px] p-8 sm:p-12 border border-black/[0.06] shadow-lg text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Quick Estimate</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Request Your Edinburgh Quote
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
            Free quotes & £65 minimum job booking (Edinburgh Area). Quick assessment on WhatsApp or form.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={BUSINESS_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm text-center transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Instant Quote via WhatsApp</span>
            </a>
            <a
              href={"tel:" + BUSINESS_INFO.phone}
              className="py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm text-center transition-colors"
            >
              Call 07760 696723
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
