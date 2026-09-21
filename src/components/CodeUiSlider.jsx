import React, { useState, useRef, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Code2, 
  Eye, 
  Sparkles, 
  Layers, 
  Check, 
  MoveHorizontal 
} from 'lucide-react';
import { playClick } from '../utils/soundFx';

export default function CodeUiSlider() {
  const { language } = useLanguage();
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const isNl = language === 'nl';

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(10, Math.min(90, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  const handleMouseDown = () => {
    setIsDragging(true);
    playClick();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <section id="code-ui-showcase" className="py-20 scroll-mt-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider mb-4">
            <Code2 className="w-3.5 h-3.5" />
            <span>{isNl ? 'INTERACTIEVE CODE-NAAR-UI VERGELIJKER' : 'INTERACTIVE CODE-TO-UI INSPECTOR'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight mb-3">
            {isNl ? 'Schone Architectuur, Vlekkeloze Interface' : 'Clean Architecture, Flawless Interface'}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed text-balance">
            {isNl 
              ? 'Sleep de hendel om de onderliggende React 19 / TypeScript architectuur te vergelijken met het daadwerkelijk renderende productieresultaat.'
              : 'Drag the interactive split handle to inspect the typed production architecture on the left and the living, interactive UI output on the right.'}
          </p>
        </div>

        {/* Split Comparison Window */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#090C16] shadow-2xl h-[420px] sm:h-[460px] select-none group"
        >
          {/* Top Window Bar */}
          <div className="absolute top-0 left-0 right-0 h-10 bg-slate-900/90 backdrop-blur-md border-b border-white/10 z-30 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              <span className="text-[11px] font-mono text-slate-400 ml-2 hidden sm:inline">
                HandyEcoQuoteEngine.tsx — React 19 Strict Architecture
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="text-blue-400 flex items-center gap-1">
                <Code2 className="w-3 h-3" />
                {isNl ? 'Broncode (Links)' : 'Source Code (Left)'}
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {isNl ? 'Live Interface (Rechts)' : 'Live Output (Right)'}
              </span>
            </div>
          </div>

          {/* LEFT PANEL: Production Source Code */}
          <div 
            className="absolute inset-y-0 left-0 pt-10 overflow-hidden bg-[#0A0D18] text-slate-300 font-mono text-xs leading-relaxed p-6"
            style={{ width: `${sliderPos}%` }}
          >
            <div className="w-[600px] sm:w-[720px] select-text">
              <div className="text-slate-500 mb-2">
                // @module HandyEco Instant Quote Engine — Strict TypeScript
              </div>
              <div>
                <span className="text-purple-400">export function </span>
                <span className="text-blue-400">calculateInstantQuote</span>
                <span className="text-slate-200">(</span>
              </div>
              <div className="pl-4">
                <span className="text-blue-300">sqm</span>
                <span className="text-slate-400">: number, </span>
                <span className="text-blue-300">serviceType</span>
                <span className="text-slate-400">: </span>
                <span className="text-emerald-400">'eco_wash' | 'full_remodel'</span>
              </div>
              <div className="text-slate-200">) &#123;</div>
              <div className="pl-4 text-slate-400">
                <span className="text-purple-400">const </span>
                <span className="text-blue-300">baseRate = </span>
                <span className="text-emerald-300">serviceType === 'eco_wash' ? 4.85 : 18.50;</span>
              </div>
              <div className="pl-4 text-slate-400">
                <span className="text-purple-400">const </span>
                <span className="text-blue-300">vatRate = </span>
                <span className="text-emerald-300">0.21; // 21% BTW Netherlands</span>
              </div>
              <div className="pl-4 text-slate-400">
                <span className="text-purple-400">const </span>
                <span className="text-blue-300">subtotal = </span>
                <span className="text-blue-300">sqm * baseRate;</span>
              </div>
              <div className="pl-4 text-emerald-400">
                // Real-time zero-re-render reactive memoization
              </div>
              <div className="pl-4">
                <span className="text-purple-400">return </span>
                <span className="text-slate-200">&#123;</span>
              </div>
              <div className="pl-8 text-blue-300">
                totalPrice: Number((subtotal * 1.21).toFixed(2)),
              </div>
              <div className="pl-8 text-blue-300">
                carbonOffsetKg: Number((sqm * 0.42).toFixed(1)),
              </div>
              <div className="pl-4 text-slate-200">&#125;;</div>
              <div className="text-slate-200">&#125;</div>
            </div>
          </div>

          {/* RIGHT PANEL: Living Rendered UI */}
          <div 
            className="absolute inset-y-0 right-0 pt-10 overflow-hidden bg-gradient-to-br from-slate-900 to-[#0F1424] flex items-center justify-center p-6"
            style={{ width: `${100 - sliderPos}%` }}
          >
            <div className="w-[300px] sm:w-[380px] p-5 rounded-2xl bg-black/60 border border-emerald-500/30 backdrop-blur-xl shadow-xl shrink-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  HandyEco Live Quote
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  Ready in 0.2s
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-300">Selected: Eco Facade Clean (85 m²)</span>
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>

                <div className="flex justify-between items-baseline p-3 rounded-xl bg-slate-900 border border-emerald-500/20">
                  <span className="text-xs text-slate-400">Total Est. (incl. 21% BTW):</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">€ 498.82</span>
                </div>

                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Carbon Offset Saved:</span>
                  <span className="text-teal-300 font-semibold">-35.7 kg CO₂</span>
                </div>
              </div>
            </div>
          </div>

          {/* DRAGGABLE VERTICAL SLIDER HANDLE */}
          <div 
            className="absolute top-10 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-indigo-400 to-emerald-400 z-30 cursor-ew-resize flex items-center justify-center"
            style={{ left: `${sliderPos}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div className="w-8 h-8 rounded-full bg-slate-950 border-2 border-indigo-400 shadow-xl flex items-center justify-center text-white -translate-x-1/2 group-hover:scale-110 active:scale-95 transition-transform cursor-ew-resize">
              <MoveHorizontal className="w-4 h-4 text-indigo-300" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
