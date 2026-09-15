import React from 'react';
import { Smartphone, Sparkles, Check, Layers, ArrowRight } from 'lucide-react';

export default function ConceptSelector({ currentConcept, onSelectConcept }) {
  const concepts = [
    { id: 'original', name: 'Orijinal (Mevcut)', sub: 'İskoçya Standartı' },
    { id: 'bento', name: 'Örnek 1: Apple Bento', sub: 'Cupertino Light' },
    { id: 'titanium', name: 'Örnek 2: iPhone Pro', sub: 'Dark Titanium' },
    { id: 'glass', name: 'Örnek 3: iOS Liquid Glass', sub: 'Translucent' },
  ];

  return (
    <>
      {/* 1. ULTRA-PROMINENT FIXED TOP BAR (Always fixed at top-0 above all elements) */}
      <header className="fixed top-0 left-0 right-0 z-[100002] bg-slate-950 text-white border-b-2 border-blue-500 shadow-xl px-3 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-amber-400 uppercase tracking-wider text-[11px] font-extrabold">Tasarım Seçici:</span>
            <span className="hidden sm:inline text-slate-300">İncelemek istediğiniz konsepti seçin &rarr;</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
            {concepts.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectConcept(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                  currentConcept === c.id
                    ? "bg-blue-600 text-white shadow-md ring-2 ring-white scale-102"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

        </div>
      </header>

      {/* 2. FLOATING BOTTOM DOCK */}
      <aside aria-label="Hızlı Konsept Geçiş Çubuğu" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100002] w-full max-w-xl px-4 pointer-events-auto">
        <div className="bg-slate-950/95 text-white backdrop-blur-2xl border-2 border-blue-500/80 p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-center justify-between gap-1.5">
          <div className="grid grid-cols-4 gap-1.5 w-full">
            {concepts.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectConcept(c.id)}
                className={`py-2 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                  currentConcept === c.id
                    ? "bg-blue-600 text-white shadow-md scale-102"
                    : "bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10"
                }`}
              >
                <span className="text-[11px] sm:text-xs truncate w-full">{c.name.split(':')[0]}</span>
                <span className="text-[9px] text-slate-400 font-normal hidden sm:block truncate w-full">{c.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
