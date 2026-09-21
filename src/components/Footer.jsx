import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAmsterdamTime } from '../hooks/useAmsterdamTime';
import { ArrowUp, Terminal, Zap, Clock } from 'lucide-react';

export default function Footer({ onOpenCmd }) {
  const { t } = useLanguage();
  const amsterdamTime = useAmsterdamTime();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="pt-16 pb-12 border-t border-white/10 bg-[#07080E] relative text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Layout */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-10 border-b border-white/5 text-center lg:text-left">
          
          {/* Brand Info */}
          <div className="flex flex-col items-center lg:items-start max-w-sm">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 p-[1.5px] shrink-0">
                <div className="w-full h-full bg-[#07080E] rounded-[6.5px] flex items-center justify-center font-bold text-white text-xs">
                  UD
                </div>
              </div>
              <span className="font-heading font-bold text-white text-base tracking-tight">
                Utku D.
              </span>
              <span className="text-[11px] font-mono text-blue-400 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                Builder & Maintainer
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed text-balance">
              Full-Stack Software Engineering & Systems Maintenance based in Amsterdam, Netherlands.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-mono">
            <a href="#builder-maintainer" className="hover:text-blue-400 transition-colors flex items-center gap-1 whitespace-nowrap">
              <Zap className="w-3 h-3 text-blue-400 shrink-0" />
              <span>{t.nav.builderRole}</span>
            </a>
            <a href="#projects" className="hover:text-white transition-colors whitespace-nowrap">{t.nav.projects}</a>
            <a href="#skills" className="hover:text-white transition-colors whitespace-nowrap">{t.nav.skills}</a>
            <a href="#process" className="hover:text-white transition-colors whitespace-nowrap">{t.nav.process}</a>
            <a href="#contact" className="hover:text-white transition-colors whitespace-nowrap">{t.nav.contact}</a>
          </div>

          {/* Back to top */}
          <div className="shrink-0">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{t.footer.toTop}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom Credits & Status */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} Utku D. • {t.footer.rights}
          </div>

          <div className="flex items-center gap-2">
            <span>🇳🇱 {t.footer.location}</span>
            <span>•</span>
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{amsterdamTime.timeString}</span>
          </div>

          <div className="text-[11px] text-slate-500 text-pretty">
            {t.footer.designedWith}
          </div>
        </div>

      </div>
    </footer>
  );
}
