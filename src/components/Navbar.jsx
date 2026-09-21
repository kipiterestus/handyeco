import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAmsterdamTime } from '../hooks/useAmsterdamTime';
import { 
  Terminal, 
  Globe, 
  Menu, 
  X, 
  Clock, 
  ArrowUpRight, 
  Zap,
  Mail,
  Layers,
  Cpu,
  GitCommit,
  Volume2,
  VolumeX
} from 'lucide-react';
import { getMuteState, toggleSound, playClick } from '../utils/soundFx';

export default function Navbar({ onOpenCmd }) {
  const { language, setLanguage, t } = useLanguage();
  const amsterdamTime = useAmsterdamTime();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(() => getMuteState());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    playClick();
    setLanguage(language === 'en' ? 'nl' : 'en');
  };

  const handleToggleSound = () => {
    const newSoundOn = toggleSound();
    setIsMuted(!newSoundOn);
    if (newSoundOn) {
      playClick();
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#090A10]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/50 py-2.5' 
        : 'bg-gradient-to-b from-[#090A10]/95 via-[#090A10]/70 to-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 flex-nowrap h-12">
          
          {/* Brand Monogram */}
          <a 
            href="#" 
            className="flex items-center gap-2.5 group focus:outline-none shrink-0"
            aria-label="Utku Portfolio Home"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 p-[1.5px] transition-transform duration-300 group-hover:scale-105 shrink-0 shadow-md shadow-blue-500/10">
              <div className="w-full h-full bg-[#090A10] rounded-[9.5px] flex items-center justify-center font-bold font-heading text-sm tracking-wider text-white">
                UD
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-white text-sm tracking-tight flex items-center gap-1.5 whitespace-nowrap">
                Utku
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </span>
              <span className="text-[10px] text-blue-400 font-mono tracking-wider uppercase whitespace-nowrap">
                Builder & Maintainer
              </span>
            </div>
          </a>

          {/* Center Navigation Links (Visible on desktop 1024px+) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-md shrink-0">
            <a 
              href="#builder-maintainer" 
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Zap className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{t.nav.builderRole}</span>
            </a>
            <a 
              href="#projects" 
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              {t.nav.projects}
            </a>
            <a 
              href="#skills" 
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              {t.nav.skills}
            </a>
            <a 
              href="#process" 
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              {t.nav.process}
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Amsterdam Live Time Pill (Visible on 1280px+) */}
            <div 
              className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-[11px] text-slate-300 font-mono whitespace-nowrap"
              title={amsterdamTime.statusText}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{amsterdamTime.timeString}</span>
              <span className="text-slate-500">• NL</span>
            </div>

            {/* Quick Command Palette Button */}
            <button
              onClick={onOpenCmd}
              className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs text-slate-300 transition-all cursor-pointer group shrink-0"
              title="Command Menu (Ctrl+K or ⌘K)"
            >
              <Terminal className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300 shrink-0" />
              <span className="font-mono text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-white/10">
                ⌘K
              </span>
            </button>

            {/* Language Toggle: EN / NL */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-mono font-medium text-slate-200 cursor-pointer transition-colors shrink-0"
              title="Toggle between English and Nederlands"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="whitespace-nowrap font-mono font-semibold">{language === 'en' ? 'EN' : 'NL'}</span>
            </button>

            {/* Sound FX Toggle (Linear / Stripe style) */}
            <button
              onClick={handleToggleSound}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-colors cursor-pointer shrink-0 ${
                !isMuted 
                  ? 'bg-blue-500/15 border-blue-500/30 text-blue-300 hover:bg-blue-500/25' 
                  : 'bg-slate-900/80 border-white/10 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
              }`}
              title={!isMuted ? "Mute interactive UI audio" : "Enable interactive UI audio"}
              aria-label={!isMuted ? "Sound on" : "Sound muted"}
            >
              {!isMuted ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              )}
              <span className="text-[10px] font-mono hidden sm:inline-block">
                {!isMuted ? 'FX ON' : 'FX OFF'}
              </span>
            </button>

            {/* Direct Email CTA */}
            <a
              href="#contact"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 hover:shadow-blue-600/40 transition-all active:scale-95 whitespace-nowrap shrink-0"
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span>{t.nav.contact}</span>
            </a>

            {/* Mobile / Tablet Menu Button (Visible on < 1024px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-200 border border-white/10 hover:bg-slate-700 transition-colors focus:outline-none cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile & Tablet Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-4 pb-5 border border-white/15 bg-[#0D1120]/95 backdrop-blur-2xl rounded-2xl px-5 flex flex-col gap-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {amsterdamTime.timeString}
              </span>
              <span className="text-slate-400">Amsterdam, NL</span>
            </div>

            <a 
              href="#builder-maintainer" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-medium text-blue-400 flex items-center gap-2.5 hover:text-blue-300 transition-colors"
            >
              <Zap className="w-4 h-4 text-blue-400" />
              <span>{t.nav.builderRole}</span>
            </a>
            
            <a 
              href="#projects" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-medium text-slate-200 hover:text-white flex items-center gap-2.5 transition-colors"
            >
              <Layers className="w-4 h-4 text-slate-400" />
              <span>{t.nav.projects}</span>
            </a>

            <a 
              href="#skills" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-medium text-slate-200 hover:text-white flex items-center gap-2.5 transition-colors"
            >
              <Cpu className="w-4 h-4 text-slate-400" />
              <span>{t.nav.skills}</span>
            </a>

            <a 
              href="#process" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-medium text-slate-200 hover:text-white flex items-center gap-2.5 transition-colors"
            >
              <GitCommit className="w-4 h-4 text-slate-400" />
              <span>{t.nav.process}</span>
            </a>

            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-medium text-slate-200 hover:text-white flex items-center gap-2.5 transition-colors"
            >
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{t.nav.contact}</span>
            </a>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCmd();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-blue-400" />
                <span>{t.cmd.title}</span>
              </button>

              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
              >
                {t.nav.contact}
              </a>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
