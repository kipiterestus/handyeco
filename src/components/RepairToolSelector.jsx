import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  Zap
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';
import { useContent } from '../context/ContentContext';

export default function RepairToolSelector({ onSelectService, onOpenQuote }) {
  const { content } = useContent();
  const config = content.siteConfig || BUSINESS_INFO;
  const [activeToolId, setActiveToolId] = useState('drill');
  const [isToolTriggered, setIsToolTriggered] = useState(false);

  const tools = [
    {
      id: 'drill',
      title: 'TV Mounting & Stone Drilling',
      shortName: 'Hammer Drill',
      tagline: 'Tenement Sandstone Specialist',
      serviceId: 'mounting',
      badgeColor: 'from-blue-600 to-indigo-600',
      badgeLight: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'Solid wall mounting into tough Edinburgh Victorian sandstone, lath-and-plaster, or modern studwork with heavy-duty anchors.',
      features: [
        'Up to 85" TV brackets mounted dead-level',
        'Heavy mirrors, pictures & floating oak shelves',
        'Curtain poles & blinds into tough tenement stone',
        'Laser-level alignment & zero wall cracks'
      ],
      timeEst: '45–90 mins',
      rateHint: 'From £65 fixed quote',
      whatsappPrefill: 'Hi Ekrem, I need help with TV/Shelf mounting into my walls in Edinburgh. Could I get a quick quote?'
    },
    {
      id: 'driver',
      title: 'Flat-Pack Furniture Assembly',
      shortName: 'Precision Driver',
      tagline: 'IKEA, JYSK & Wayfair Pro',
      serviceId: 'assembly',
      badgeColor: 'from-amber-500 to-orange-600',
      badgeLight: 'bg-amber-50 text-amber-700 border-amber-200',
      description: 'Fast, precise assembly of complex flat-pack furniture. Assembled rock-solid, squared up, and wall-anchored for safety.',
      features: [
        'IKEA PAX wardrobes & sliding mirror doors',
        'Ottoman & storage bed frames',
        'Office desks, book-cases & dining tables',
        'Safety wall anchoring included'
      ],
      timeEst: '1–3 hours',
      rateHint: 'From £65 fixed quote',
      whatsappPrefill: 'Hi Ekrem, I have flat-pack furniture that needs assembling in Edinburgh. Could you quote for this?'
    },
    {
      id: 'plane',
      title: 'Sticking Doors & Floor Trimming',
      shortName: 'Wood Plane',
      tagline: 'Smooth Gliding Action',
      serviceId: 'repairs',
      badgeColor: 'from-emerald-600 to-teal-600',
      badgeLight: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Doors sticking on new carpets, binding in swollen frames, or refusing to latch shut correctly trimmed and realigned.',
      features: [
        'Precision bottom planing for new carpets',
        'Hinge adjustment & door latch repairs',
        'Draught excluders & weather seals fitted',
        'Vacuum extraction — no sawdust mess left'
      ],
      timeEst: '30–60 mins per door',
      rateHint: 'From £65 fixed quote',
      whatsappPrefill: 'Hi Ekrem, my doors are sticking and scraping the floor. Could I get an estimate to trim them?'
    },
    {
      id: 'silicone',
      title: 'Bathroom & Kitchen Resealing',
      shortName: 'Sealant Gun',
      tagline: '100% Watertight Mould Guard',
      serviceId: 'repairs',
      badgeColor: 'from-cyan-600 to-blue-600',
      badgeLight: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      description: 'Old black mouldy silicone stripped out, sanitized, and sealed with professional anti-fungal waterproof silicone for a crisp, hygienic finish.',
      features: [
        'Complete removal of old mouldy silicone',
        'Sanitised joint preparation against fungal growth',
        'Premium sanitary grade silicone application',
        'Shower trays, baths, basins & kitchen splashbacks'
      ],
      timeEst: '45–75 mins',
      rateHint: 'From £65 fixed quote',
      whatsappPrefill: 'Hi Ekrem, I need silicone resealing around my shower/bath in Edinburgh. Could I get a fixed price?'
    }
  ];

  const currentTool = tools.find(t => t.id === activeToolId) || tools[0];

  const handleToolSelect = (id) => {
    setActiveToolId(id);
    setIsToolTriggered(true);
    setTimeout(() => setIsToolTriggered(false), 900);
  };

  const cleanPhone = (config.phone || BUSINESS_INFO.phone || '+447760696723').replace(/[^0-9+]/g, '');
  const waBase = cleanPhone.replace(/^0/, '44');
  const waLink = `https://wa.me/${waBase}?text=${encodeURIComponent(currentTool.whatsappPrefill)}`;

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white via-slate-50 to-blue-50/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Interactive Toolkit &amp; Solution Finder</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Select a Tool to See How We Fix It
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl mx-auto">
            Click any trade tool below to preview Edinburgh-specific repairs, typical turnaround times, and upfront WhatsApp pricing.
          </p>
        </div>

        {/* 4 Interactive Tool Selector Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {tools.map((tool) => {
            const isActive = tool.id === activeToolId;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => handleToolSelect(tool.id)}
                className={`relative p-3.5 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer group flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-900 text-white border-blue-500 shadow-xl shadow-blue-500/10 scale-[1.02] ring-2 ring-blue-500/30'
                    : 'bg-white text-slate-800 border-slate-200/90 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                {/* Active Indicator Top Pill */}
                {isActive && (
                  <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>Selected</span>
                  </span>
                )}

                {/* Animated Tool Icon Showcase */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    isActive ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600'
                  }`}>
                    {tool.id === 'drill' && (
                      <svg 
                        viewBox="0 0 48 48" 
                        className={`w-7 h-7 ${isActive && isToolTriggered ? 'animate-drill-thrust' : 'group-hover:animate-drill-thrust'}`} 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        {/* Cordless Drill SVG Body */}
                        <path d="M12 18h16a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H14l-4 13h-6l2-13H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h8z" fill={isActive ? "#0284c7" : "#0f172a"} fillOpacity="0.2" />
                        <rect x="28" y="21" width="8" height="6" rx="1" fill={isActive ? "#38bdf8" : "#64748b"} />
                        <line x1="36" y1="24" x2="46" y2="24" stroke="#f59e0b" strokeWidth="3" className={isActive && isToolTriggered ? "animate-drill-spin origin-left" : ""} />
                        <circle cx="21" cy="24" r="2" fill="#ef4444" />
                      </svg>
                    )}

                    {tool.id === 'driver' && (
                      <svg 
                        viewBox="0 0 48 48" 
                        className={`w-7 h-7 ${isActive && isToolTriggered ? 'animate-screw-turn' : 'group-hover:animate-screw-turn'}`} 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        {/* Screwdriver / Hex Driver SVG */}
                        <rect x="6" y="20" width="16" height="8" rx="2" fill={isActive ? "#f59e0b" : "#475569"} fillOpacity="0.25" />
                        <path d="M22 22h14l6-2v8l-6-2H22z" fill={isActive ? "#f59e0b" : "#64748b"} />
                        <line x1="42" y1="24" x2="47" y2="24" stroke="#cbd5e1" strokeWidth="3" />
                      </svg>
                    )}

                    {tool.id === 'plane' && (
                      <svg 
                        viewBox="0 0 48 48" 
                        className={`w-7 h-7 ${isActive && isToolTriggered ? 'animate-shave-glide' : 'group-hover:animate-shave-glide'}`} 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        {/* Wood Hand Plane SVG */}
                        <path d="M4 32h38a2 2 0 0 0 2-2v-4a4 4 0 0 0-4-4h-8l-6-10H14l3 10H6a2 2 0 0 0-2 2v8z" fill={isActive ? "#10b981" : "#334155"} fillOpacity="0.25" />
                        <circle cx="12" cy="20" r="3" fill={isActive ? "#34d399" : "#64748b"} />
                        <line x1="26" y1="20" x2="22" y2="34" stroke="#e2e8f0" strokeWidth="2.5" />
                      </svg>
                    )}

                    {tool.id === 'silicone' && (
                      <svg 
                        viewBox="0 0 48 48" 
                        className="w-7 h-7" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        {/* Sealant Gun SVG */}
                        <rect x="14" y="18" width="20" height="10" rx="1.5" fill={isActive ? "#06b6d4" : "#475569"} fillOpacity="0.25" />
                        <path d="M34 23l10-2v4l-10-2z" fill={isActive ? "#22d3ee" : "#94a3b8"} />
                        <path d="M14 26l-6 12h-4l4-12" />
                        <line x1="6" y1="23" x2="14" y2="23" stroke="#cbd5e1" strokeWidth="3" />
                      </svg>
                    )}
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tool.timeEst}
                  </span>
                </div>

                <div>
                  <h3 className={`text-xs sm:text-sm font-black leading-snug mb-1 ${
                    isActive ? 'text-white' : 'text-slate-900'
                  }`}>
                    {tool.shortName}
                  </h3>
                  <p className={`text-[11px] sm:text-xs line-clamp-1 ${
                    isActive ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {tool.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Solution Showcase Card */}
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl overflow-hidden text-left p-6 sm:p-8 md:p-10 transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Left 7 cols: In-depth Service Details & Checklist */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${currentTool.badgeLight}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentTool.tagline}</span>
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  ⏱️ Typical Duration: {currentTool.timeEst}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                {currentTool.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {currentTool.description}
              </p>

              {/* Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {currentTool.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 cols: Fast Action & Upfront Quote Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-7 rounded-2xl text-white space-y-5 border border-slate-800 shadow-xl">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                  Guaranteed Upfront Pricing
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {currentTool.rateHint}
                  </span>
                  <span className="text-xs text-slate-400">
                    • Zero call-out fee
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Send a photo of your job on WhatsApp. You'll get a direct, fixed quote within 15–30 minutes.
                </p>
              </div>

              {/* CTAs */}
              <div className="space-y-2.5 pt-1">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-sm shadow-lg shadow-emerald-600/30 active:scale-98 transition-all cursor-pointer group"
                >
                  <MessageSquare className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>Get Quote on WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    if (onSelectService) onSelectService(currentTool.serviceId);
                    if (onOpenQuote) onOpenQuote();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold text-slate-200 text-xs transition-all cursor-pointer border border-slate-700"
                >
                  <span>Book Online Request Form</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Workmanship</span>
                </span>
                <span>Edinburgh EH1–EH17</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
