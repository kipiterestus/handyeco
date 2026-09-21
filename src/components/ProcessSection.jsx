import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { GitCommit, Compass, Sparkles, CheckCircle2, Rocket } from 'lucide-react';

export default function ProcessSection() {
  const { t } = useLanguage();

  const stepIcons = [Compass, Sparkles, GitCommit, Rocket];

  return (
    <section id="process" className="py-24 scroll-mt-24 relative bg-slate-950/40 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.process.tagline}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white tracking-tight mb-3 text-balance">
            {t.process.title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed text-balance max-w-lg mx-auto">
            {t.process.subtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative">
          {t.process.steps.map((step, idx) => {
            const Icon = stepIcons[idx] || Sparkles;

            return (
              <div 
                key={idx}
                className="glass-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/10 hover:border-emerald-500/30 group relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-extrabold font-mono text-slate-700 group-hover:text-emerald-400/80 transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold font-heading text-white mb-2.5 group-hover:text-emerald-300 transition-colors text-balance">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed text-pretty">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
