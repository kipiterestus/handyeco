import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';
import MaintainerSimulator from './MaintainerSimulator';

export default function BuilderMaintainerSection() {
  const { t } = useLanguage();
  const bm = t.builderMaintainer;

  return (
    <section id="builder-maintainer" className="py-24 scroll-mt-24 relative overflow-hidden bg-[#0A0D18]/60 border-y border-white/5">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-emerald-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>{bm.tagline}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white tracking-tight mb-3 text-balance">
            {bm.title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed text-balance max-w-xl mx-auto">
            {bm.subtitle}
          </p>
        </div>

        {/* 2-Column Comparison Grid: Builder vs Maintainer */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Card 1: The Builder */}
          <div className="glass-card rounded-3xl p-7 sm:p-9 flex flex-col justify-between border border-blue-500/20 hover:border-blue-500/40 relative group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-mono font-bold tracking-widest text-blue-400 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                  {bm.builder.badge}
                </span>
                <div className="w-11 h-11 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mb-2.5 text-balance">
                {bm.builder.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 text-pretty">
                {bm.builder.desc}
              </p>

              <div className="space-y-2.5 pb-6">
                {bm.builder.points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-blue-400 font-medium">Rapid Architecture & Delivery</span>
              <span className="text-slate-500">Full-Stack Lifecycle</span>
            </div>
          </div>

          {/* Card 2: The Maintainer */}
          <div className="glass-card rounded-3xl p-7 sm:p-9 flex flex-col justify-between border border-emerald-500/20 hover:border-emerald-500/40 relative group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  {bm.maintainer.badge}
                </span>
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mb-2.5 text-balance">
                {bm.maintainer.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 text-pretty">
                {bm.maintainer.desc}
              </p>

              <div className="space-y-2.5 pb-6">
                {bm.maintainer.points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-emerald-400 font-medium">Continuous Systems Stewardship</span>
              <span className="text-slate-500">Long-Term Reliability</span>
            </div>
          </div>

        </div>

        {/* Interactive Incident & Remediation Simulator */}
        <MaintainerSimulator />

      </div>
    </section>
  );
}
