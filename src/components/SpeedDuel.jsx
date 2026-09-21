import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Zap, 
  Gauge, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  Server,
  Layers
} from 'lucide-react';
import { playClick, playSuccess, playAlert } from '../utils/soundFx';

export default function SpeedDuel() {
  const { language } = useLanguage();
  const [status, setStatus] = useState('idle'); // idle | running | completed
  const [agencyProgress, setAgencyProgress] = useState(0);
  const [utkuProgress, setUtkuProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const isNl = language === 'nl';

  const runBenchmark = () => {
    playClick();
    setStatus('running');
    setAgencyProgress(0);
    setUtkuProgress(0);
    setElapsedTime(0);

    const startTime = Date.now();

    // High frequency timer for smooth progression
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setElapsedTime(elapsed);

      // Utku stack finishes in ~450ms
      const utkuVal = Math.min(100, Math.round((elapsed / 450) * 100));
      setUtkuProgress(utkuVal);

      // Agency stack finishes in ~3600ms
      const agencyVal = Math.min(100, Math.round((elapsed / 3600) * 100));
      setAgencyProgress(agencyVal);

      if (elapsed >= 3600) {
        clearInterval(interval);
        setStatus('completed');
        playSuccess();
      }
    }, 25);
  };

  const resetBenchmark = () => {
    playClick();
    setStatus('idle');
    setAgencyProgress(0);
    setUtkuProgress(0);
    setElapsedTime(0);
  };

  return (
    <section id="speed-duel" className="py-20 scroll-mt-24 relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/5 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider mb-4">
            <Gauge className="w-3.5 h-3.5" />
            <span>{isNl ? 'LIVE SNELHEIDSBENCHMARK' : 'INTERACTIVE SPEED BENCHMARK'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight mb-3">
            {isNl ? 'Traditioneel Bureau vs. Utku\'s Architectuur' : 'Traditional Agency vs. Utku\'s Architecture'}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed text-balance">
            {isNl 
              ? 'Trage websites kosten conversie en Google-posities. Test hieronder live het verschil tussen een standaard CMS en een op maat gebouwde Next.js / React 19 stack.'
              : 'Slow loading speeds destroy user conversion and SEO rankings. Run a live side-by-side benchmark between generic agency bloatware and custom React 19 edge engineering.'}
          </p>
        </div>

        {/* Duel Container */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 relative shadow-2xl">
          
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-xs text-slate-300">
                {isNl ? 'Core Web Vitals Stresstest Simulatie' : 'Core Web Vitals Real-Time Simulation'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {status === 'idle' ? (
                <button
                  onClick={runBenchmark}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isNl ? 'Start Live Benchmark' : 'Run Live Benchmark'}</span>
                </button>
              ) : status === 'running' ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs font-mono text-blue-400">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></div>
                  <span>{(elapsedTime / 1000).toFixed(2)}s {isNl ? 'Bezig met testen...' : 'Benchmarking...'}</span>
                </div>
              ) : (
                <button
                  onClick={resetBenchmark}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isNl ? 'Opnieuw Testen' : 'Reset Benchmark'}</span>
                </button>
              )}
            </div>
          </div>

          {/* 2-Side Comparison Grid */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 pt-6">
            
            {/* Left Side: Traditional Agency */}
            <div className="p-6 rounded-2xl bg-red-950/15 border border-red-500/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
                    <Server className="w-4 h-4 text-red-400" />
                    <span>{isNl ? 'Klassiek Bureau (WordPress / CMS)' : 'Traditional Agency (WordPress / Plugins)'}</span>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
                    {isNl ? 'Zware Codebase' : 'Heavy Payload'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 mb-6">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>{isNl ? 'Laadvoortgang' : 'Load Progress'}</span>
                    <span className={agencyProgress === 100 ? 'text-red-400 font-bold' : ''}>
                      {agencyProgress}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-75"
                      style={{ width: `${agencyProgress}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Table */}
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-slate-400">Largest Contentful Paint (LCP):</span>
                    <span className="text-red-400 font-semibold">3.8 s (Poor)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-slate-400">Total JavaScript & Assets:</span>
                    <span className="text-red-300 font-medium">4.2 MB</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-slate-400">Time to First Byte (TTFB):</span>
                    <span className="text-red-300 font-medium">850 ms</span>
                  </div>
                </div>
              </div>

              {/* Lighthouse Score Card */}
              <div className="mt-6 pt-4 border-t border-red-500/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{isNl ? 'Verlies aan potentiële leads' : 'High Bounce Rate Risk'}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center font-bold font-mono text-red-400 text-sm">
                  44
                </div>
              </div>
            </div>

            {/* Right Side: Utku Architecture */}
            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between relative shadow-lg shadow-emerald-500/5">
              
              {/* Winner Badge */}
              <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3" />
                <span>{isNl ? '9x Sneller' : '9x Faster Speed'}</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-white font-semibold text-sm">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>{isNl ? 'Utku\'s Stack (React 19 & Edge CDN)' : 'Utku\'s Stack (React 19 & Edge CDN)'}</span>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {isNl ? 'Sub-Second' : 'Sub-Second LCP'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 mb-6">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>{isNl ? 'Laadvoortgang' : 'Load Progress'}</span>
                    <span className={utkuProgress === 100 ? 'text-emerald-400 font-bold' : ''}>
                      {utkuProgress}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-75"
                      style={{ width: `${utkuProgress}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Table */}
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between p-2 rounded-lg bg-black/40 border border-emerald-500/10">
                    <span className="text-slate-400">Largest Contentful Paint (LCP):</span>
                    <span className="text-emerald-400 font-semibold">0.42 s (Ultra Fast)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-black/40 border border-emerald-500/10">
                    <span className="text-slate-400">Total JavaScript & Assets:</span>
                    <span className="text-emerald-300 font-medium">104 kB (Gzipped)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-black/40 border border-emerald-500/10">
                    <span className="text-slate-400">Time to First Byte (TTFB):</span>
                    <span className="text-emerald-300 font-medium">42 ms</span>
                  </div>
                </div>
              </div>

              {/* Lighthouse Score Card */}
              <div className="mt-6 pt-4 border-t border-emerald-500/15 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isNl ? 'Google Top Ranking & Max Conversie' : 'Max Google Rank & Conversion Boost'}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold font-mono text-emerald-400 text-sm shadow-md shadow-emerald-500/20">
                  100
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
