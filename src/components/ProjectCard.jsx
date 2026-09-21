import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowUpRight, 
  Layers, 
  TrendingUp, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function ProjectCard({ project, onSelect }) {
  const { language, t } = useLanguage();
  const content = project.content[language] || project.content.en;

  return (
    <div className="glass-card rounded-3xl overflow-hidden flex flex-col group border border-white/10 hover:border-blue-500/30">
      
      {/* Image Container with Overlay */}
      <div 
        className="relative aspect-[16/10] overflow-hidden bg-slate-900 cursor-pointer"
        onClick={() => onSelect(project)}
      >
        <img 
          src={project.image} 
          alt={content.title}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A10] via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-blue-400 font-mono text-xs font-medium">
            {project.badge}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-slate-300 font-mono text-[11px]">
            {project.period}
          </span>
        </div>

        {/* Hover Cue */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-lg">
            <span>{t.projects.viewCaseStudy}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between">
        
        <div>
          {/* Client & Title */}
          <div className="text-xs font-mono text-slate-400 mb-1">
            {project.client}
          </div>
          <h3 
            onClick={() => onSelect(project)}
            className="text-xl sm:text-2xl font-bold font-heading text-white mb-3 group-hover:text-blue-300 transition-colors cursor-pointer"
          >
            {content.title}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-6">
            {content.summary}
          </p>

          {/* Quick Metrics Pills */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {project.metrics.slice(0, 2).map((m, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col">
                <span className="text-base sm:text-lg font-bold font-heading text-emerald-400">
                  {m.value}
                </span>
                <span className="text-[11px] text-slate-400 truncate">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Badges & Action */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-1.5 overflow-hidden">
            {project.technologies.slice(0, 3).map((tech, i) => (
              <span 
                key={i} 
                className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[11px] font-mono text-slate-300 border border-white/5 whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
          </div>

          <button
            onClick={() => onSelect(project)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer shrink-0 ml-2"
          >
            <span>Case Study</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>

    </div>
  );
}
