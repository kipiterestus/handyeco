import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  TrendingUp, 
  AlertCircle, 
  MapPin, 
  Calendar,
  Sparkles
} from 'lucide-react';

export default function ProjectModal({ project, onClose }) {
  const { language, t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!project) return null;

  const content = project.content[language] || project.content.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Dialog Box */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0F1322] border border-white/15 shadow-2xl z-10 text-slate-100 flex flex-col">
        
        {/* Modal Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#0F1322]/90 backdrop-blur-lg border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-mono font-medium">
              {project.badge}
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
              {project.period}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label={t.projects.modalClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Main Title & Subtitle */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white mb-3">
              {content.title}
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {content.subtitle}
            </p>
          </div>

          {/* Project Image Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video bg-slate-900 group">
            <img 
              src={project.image} 
              alt={content.title}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]" 
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1322] via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300 font-mono">
              <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {project.location}
              </span>
              <span className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                Client: {project.client}
              </span>
            </div>
          </div>

          {/* Metrics Spotlight */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              {t.projects.metricsLabel}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {project.metrics.map((metric, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-800/40 border border-white/5 flex flex-col">
                  <span className="text-xl sm:text-2xl font-bold font-heading text-emerald-400 mb-1">
                    {metric.value}
                  </span>
                  <span className="text-xs text-slate-400">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Challenge & Solution Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* The Challenge */}
            <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/20 flex flex-col">
              <div className="flex items-center gap-2 text-red-400 font-semibold mb-3 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{t.projects.challenge}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {content.challenge}
              </p>
            </div>

            {/* The Engineering Solution */}
            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex flex-col">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-3 text-sm">
                <Sparkles className="w-4 h-4" />
                <span>{t.projects.solution}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {content.solution}
              </p>
            </div>

          </div>

          {/* Key Features Built */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Key Architecture Features & Modules:</span>
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {content.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/30 border border-white/5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Badges */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              {t.projects.techUsed}
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 rounded-lg bg-slate-800 border border-white/10 text-xs font-mono text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Need a similar high-performance platform for your company or startup?
            </p>
            <a
              href="#contact"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20"
            >
              <span>Discuss Custom Development</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
