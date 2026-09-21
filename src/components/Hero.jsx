import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowRight, 
  MapPin, 
  Zap, 
  ShieldCheck, 
  FileText,
  Mail,
  Cpu
} from 'lucide-react';

export default function Hero({ onOpenCv }) {
  const { t } = useLanguage();

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-emerald-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-6 mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium whitespace-nowrap">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{t.hero.statusBadge}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-white/10 text-slate-300 text-xs font-mono whitespace-nowrap">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.hero.locationBadge}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono whitespace-nowrap">
            <Cpu className="w-3.5 h-3.5" />
            <span>{t.hero.roleTag}</span>
          </div>
        </div>

        {/* Centered Main Heading and Content */}
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          
          <div className="text-xs sm:text-sm font-mono text-blue-400 uppercase tracking-wider mb-3 font-semibold">
            {t.hero.role}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] mb-6 text-balance max-w-3xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-white">
              {t.hero.pitchHighlight}
            </span>{" "}
            <span className="text-slate-200">
              {t.hero.pitchRest}
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10 font-normal text-balance">
            {t.hero.subPitch}
          </p>

          {/* Centered Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-14">
            
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 transition-all active:scale-95 group whitespace-nowrap"
            >
              <span>{t.hero.ctaWork}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-blue-500/30 hover:border-blue-500/60 text-blue-300 font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-blue-500/5 cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <Mail className="w-4 h-4 text-blue-400" />
              <span>{t.hero.ctaContact}</span>
            </a>

            <button
              onClick={onOpenCv}
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200 font-medium text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-4 h-4" />
              <span>{t.hero.ctaResume}</span>
            </button>

          </div>

          {/* Centered Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-white/10 w-full max-w-3xl">
            
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex flex-col items-center text-center">
              <div className="text-xl sm:text-2xl font-bold font-heading text-white mb-0.5">
                2
              </div>
              <div className="text-[11px] sm:text-xs text-slate-400 text-balance">
                {t.hero.stats.projects}
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex flex-col items-center text-center">
              <div className="text-xl sm:text-2xl font-bold font-heading text-blue-400 mb-0.5">
                &lt; 1.2s
              </div>
              <div className="text-[11px] sm:text-xs text-slate-400 text-balance">
                {t.hero.stats.speed}
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex flex-col items-center text-center">
              <div className="text-xl sm:text-2xl font-bold font-heading text-emerald-400 mb-0.5">
                React 19
              </div>
              <div className="text-[11px] sm:text-xs text-slate-400 text-balance">
                {t.hero.stats.stack}
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex flex-col items-center text-center">
              <div className="text-xl sm:text-2xl font-bold font-heading text-amber-400 mb-0.5">
                99.9%
              </div>
              <div className="text-[11px] sm:text-xs text-slate-400 text-balance">
                {t.hero.stats.reliability}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
