import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Compass, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Target, 
  Calendar 
} from 'lucide-react';
import { playClick, playSuccess } from '../utils/soundFx';

export default function ScopeBuilder() {
  const { language } = useLanguage();
  const isNl = language === 'nl';

  const [projectType, setProjectType] = useState('saas');
  const [businessPriority, setBusinessPriority] = useState('conversion');
  const [timeline, setTimeline] = useState('sprint');

  const projectTypes = [
    { id: 'saas', title: isNl ? 'SaaS & Webapplicatie' : 'SaaS & Web Platform' },
    { id: 'booking', title: isNl ? 'E-Commerce / Boekingen' : 'E-Commerce & Booking' },
    { id: 'ai_tools', title: isNl ? 'AI Agent & Automatisering' : 'AI Automation & Tools' },
  ];

  const businessPriorities = [
    { id: 'conversion', title: isNl ? 'Maximale Conversie & Omzet' : 'High Conversion & Sales' },
    { id: 'speed_seo', title: isNl ? 'Supersnel Laden & Google SEO' : 'Fast Speed & Google SEO' },
    { id: 'ai_leverage', title: isNl ? 'AI & Automatisering' : 'AI & Process Automation' },
    { id: 'modernize', title: isNl ? 'Oude Codebase Vernieuwen' : 'Modernize Legacy Code' },
  ];

  const timelines = [
    { id: 'sprint', title: isNl ? 'Sprint (2 – 3 Weken)' : 'Fast Sprint (2 – 3 Weeks)' },
    { id: 'full_build', title: isNl ? 'Volledig Project (4 – 6 Weken)' : 'Full Build (4 – 6 Weeks)' },
    { id: 'partnership', title: isNl ? 'Bouw + Maandelijks Onderhoud' : 'Build + Monthly Support' },
  ];

  const handleApplyToForm = () => {
    playSuccess();

    const selectedType = projectTypes.find((p) => p.id === projectType)?.title || '';
    const selectedPriority = businessPriorities.find((p) => p.id === businessPriority)?.title || '';
    const selectedTimeline = timelines.find((t) => t.id === timeline)?.title || '';

    const briefText = isNl
      ? `Project Scope:\n- Type: ${selectedType}\n- Hoofddoel: ${selectedPriority}\n- Gewenste Planning: ${selectedTimeline}\n\nLaten we de details en planning bespreken.`
      : `Project Scope:\n- Type: ${selectedType}\n- Primary Goal: ${selectedPriority}\n- Target Timeline: ${selectedTimeline}\n\nLet's discuss the project details and delivery.`;

    window.dispatchEvent(new CustomEvent('scope_brief_applied', {
      detail: {
        projectType: selectedType,
        message: briefText,
      }
    }));

    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="scope-builder" className="py-14 scroll-mt-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>{isNl ? 'PROJECT SCOPE' : 'PROJECT SCOPE BUILDER'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight mb-2">
            {isNl ? 'Stel Uw Project Samen' : 'Plan Your Project in Seconds'}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            {isNl 
              ? 'Kies uw type, hoofddoel en planning. De samenvatting wordt direct overgenomen in het formulier.'
              : 'Pick your project type, primary goal, and timeline. The summary fills into the contact form automatically.'}
          </p>
        </div>

        {/* Minimal Compact Builder Container */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 shadow-xl space-y-6">
          
          {/* STEP 1: Project Type */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5 text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>{isNl ? '1. Type Software' : '1. Project Type'}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {projectTypes.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    playClick();
                    setProjectType(item.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-2 ${
                    projectType === item.id
                      ? 'bg-blue-600/20 border-blue-500/70 text-white shadow-sm shadow-blue-500/20'
                      : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <span>{item.title}</span>
                  {projectType === item.id && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: Main Priority */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5 text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
              <Target className="w-3.5 h-3.5" />
              <span>{isNl ? '2. Belangrijkste Doel' : '2. Primary Goal'}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {businessPriorities.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    playClick();
                    setBusinessPriority(item.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-2 ${
                    businessPriority === item.id
                      ? 'bg-indigo-600/20 border-indigo-500/70 text-white shadow-sm shadow-indigo-500/20'
                      : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <span>{item.title}</span>
                  {businessPriority === item.id && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 3: Timeline */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5 text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>{isNl ? '3. Planning' : '3. Timeline'}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {timelines.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    playClick();
                    setTimeline(item.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-2 ${
                    timeline === item.id
                      ? 'bg-emerald-600/20 border-emerald-500/70 text-white shadow-sm shadow-emerald-500/20'
                      : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <span>{item.title}</span>
                  {timeline === item.id && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>React 19 • Next.js • Supabase • High Speed</span>
            </span>

            <button
              onClick={handleApplyToForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>{isNl ? 'Plak in Bericht' : 'Apply to Contact Form'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
