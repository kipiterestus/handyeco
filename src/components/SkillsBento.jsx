import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { skillsCategories } from '../data/skillsData';
import { 
  Layers, 
  Server, 
  Palette, 
  Globe, 
  Cpu 
} from 'lucide-react';

const iconMap = {
  Layout: Layers,
  Server: Server,
  Palette: Palette,
  Globe: Globe,
};

export default function SkillsBento() {
  const { language, t } = useLanguage();

  return (
    <section id="skills" className="py-24 scroll-mt-24 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-xs font-semibold uppercase tracking-wider mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>{t.skills.tagline}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white tracking-tight mb-3 text-balance">
            {t.skills.title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed text-balance max-w-lg mx-auto">
            {t.skills.subtitle}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {skillsCategories.map((cat) => {
            const Icon = iconMap[cat.icon] || Layers;
            const title = cat.title[language] || cat.title.en;
            const subtitle = cat.subtitle[language] || cat.subtitle.en;

            return (
              <div 
                key={cat.id}
                className="glass-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between border border-white/10 hover:border-indigo-500/30 group transition-all"
              >
                <div>
                  <div className="flex items-start gap-3.5 mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 group-hover:bg-indigo-500/20 transition-all shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold font-heading text-white">
                        {title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6">
                    {cat.skills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-300 font-medium hover:border-white/15 hover:text-white transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                        <span className="truncate">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
