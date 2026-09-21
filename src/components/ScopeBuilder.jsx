import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Compass, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Send, 
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
    {
      id: 'saas',
      title: isNl ? 'SaaS & Webapplicatie' : 'SaaS & Web Platform',
      desc: isNl ? 'Op maat gebouwde software, dashboard & gebruikersbeheer' : 'Custom web application, authenticated dashboard & database',
    },
    {
      id: 'booking',
      title: isNl ? 'Conversiegerichte E-Commerce / Boekingen' : 'High-Converting Booking / Commerce',
      desc: isNl ? 'Snelle checkout, directe betalingen & geoptimaliseerde funnel' : 'Frictionless checkout, custom flows & localized UX funnel',
    },
    {
      id: 'ai_tools',
      title: isNl ? 'AI Agent & Bedrijfsautomatisering' : 'AI Agent & Workflow Automation',
      desc: isNl ? 'Data scraping, interne tools & LLM pijplijnen' : 'Autonomous data pipelines, scraping & internal operations tools',
    },
  ];

  // STEP 2: REPLACED OPTION AS REQUESTED (Core Business Priority & Strategic Impact)
  const businessPriorities = [
    {
      id: 'conversion',
      title: isNl ? 'Maximale Conversie & Omzetgroei' : 'Maximum Conversion & Revenue',
      desc: isNl ? 'Wrijvingsloze formulieren, sublieme UX en duidelijke CTA-paden' : 'Frictionless UX journeys, fast checkout & trust-first layout',
    },
    {
      id: 'speed_seo',
      title: isNl ? 'Sub-Seconde Laadtijd & SEO Dominantie' : 'Sub-Second Speed & Google SEO',
      desc: isNl ? '100/100 Core Web Vitals, supersnel laden & lokale SEO-structuur' : '100/100 Core Web Vitals, ultra-fast TTFB & structured data',
    },
    {
      id: 'ai_leverage',
      title: isNl ? 'AI-Ondersteuning & Handmatig Werk Elimineren' : 'Autonomous AI Leverage & Efficiency',
      desc: isNl ? 'Repetitieve bedrijfstaken automatiseren met slimme agents' : 'Automating manual operational bottlenecks with AI pipelines',
    },
    {
      id: 'modernize',
      title: isNl ? 'Verouderde Stack Vernieuwen (0 Downtime)' : 'Legacy Stack Modernization',
      desc: isNl ? 'Oude codebase vervangen door moderne React 19/Next.js stack' : 'Replacing brittle legacy code with clean, maintainable systems',
    },
  ];

  const timelines = [
    {
      id: 'sprint',
      title: isNl ? 'Snelle Sprint (2 – 3 Weken)' : 'Rapid Sprint (2 – 3 Weeks)',
      desc: isNl ? 'Gefocuste MVP of gerichte feature lancering' : 'Focused MVP release or high-priority feature sprint',
    },
    {
      id: 'full_build',
      title: isNl ? 'Volledig Platform (4 – 6 Weken)' : 'Full Production Build (4 – 6 Weeks)',
      desc: isNl ? 'End-to-end ontwerp, integraties en productie-inrichting' : 'Complete end-to-end architecture, API integrations & launch',
    },
    {
      id: 'partnership',
      title: isNl ? 'Bouw + Doorlopend Onderhoud' : 'Build + Ongoing Maintainer Partnership',
      desc: isNl ? 'Eerst bouwen, daarna proactief onderhoud en monitoring' : 'Initial delivery followed by proactive SLA systems maintenance',
    },
  ];

  const handleApplyToForm = () => {
    playSuccess();

    const selectedType = projectTypes.find((p) => p.id === projectType)?.title || '';
    const selectedPriority = businessPriorities.find((p) => p.id === businessPriority)?.title || '';
    const selectedTimeline = timelines.find((t) => t.id === timeline)?.title || '';

    const briefText = isNl
      ? `Projectscope Samenvatting:\n- Type: ${selectedType}\n- Belangrijkste Doelstelling: ${selectedPriority}\n- Gewenste Planning: ${selectedTimeline}\n\nGraag bespreek ik de technische architectuur en realisatie.`
      : `Project Scope Summary:\n- Scope: ${selectedType}\n- Strategic Priority: ${selectedPriority}\n- Target Timeline: ${selectedTimeline}\n\nLooking forward to reviewing the technical architecture and delivery plan.`;

    // Dispatch event to fill the contact form automatically
    window.dispatchEvent(new CustomEvent('scope_brief_applied', {
      detail: {
        projectType: selectedType,
        message: briefText,
      }
    }));

    // Smooth scroll to contact section
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="scope-builder" className="py-20 scroll-mt-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>{isNl ? 'INTERACTIEVE PROJECT SCOPE BUILDER' : 'INTERACTIVE PROJECT SCOPE BUILDER'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight mb-3">
            {isNl ? 'Definieer Uw Project in 30 Seconden' : 'Structure Your Project Scope in 30 Seconds'}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed text-balance">
            {isNl 
              ? 'Selecteer uw wensen en doelstellingen hieronder. De tool stelt direct een heldere technische briefing samen die u met één klik kunt versturen.'
              : 'Select your project goals and requirements below to generate an instant, structured technical brief ready for direct review.'}
          </p>
        </div>

        {/* Builder Container */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-8">
          
          {/* STEP 1: Project Type */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
              <Layers className="w-4 h-4" />
              <span>{isNl ? 'Stap 1: Type Software & Architectuur' : 'Step 1: Software Type & Architecture'}</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {projectTypes.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    playClick();
                    setProjectType(item.id);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    projectType === item.id
                      ? 'bg-blue-600/15 border-blue-500/60 shadow-lg shadow-blue-500/10'
                      : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold font-heading text-white">{item.title}</span>
                    {projectType === item.id && <Check className="w-4 h-4 text-blue-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: Business Priority (Replaced Step) */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
              <Target className="w-4 h-4" />
              <span>{isNl ? 'Stap 2: Strategische Prioriteit & Doelstelling' : 'Step 2: Strategic Priority & Target Impact'}</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {businessPriorities.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    playClick();
                    setBusinessPriority(item.id);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    businessPriority === item.id
                      ? 'bg-indigo-600/15 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-heading text-white">{item.title}</span>
                    {businessPriority === item.id && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 3: Timeline */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              <Calendar className="w-4 h-4" />
              <span>{isNl ? 'Stap 3: Gewenste Planning & Samenwerking' : 'Step 3: Target Timeline & Cadence'}</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {timelines.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    playClick();
                    setTimeline(item.id);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    timeline === item.id
                      ? 'bg-emerald-600/15 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-heading text-white">{item.title}</span>
                    {timeline === item.id && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Result Action Bar */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {isNl 
                  ? 'Aanbevolen Stack: React 19 + Next.js App Router + Supabase + Edge CDN' 
                  : 'Recommended Stack: React 19 + Next.js App Router + Supabase + Edge CDN'}
              </span>
            </div>

            <button
              onClick={handleApplyToForm}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:opacity-95 text-white text-xs font-semibold shadow-xl shadow-blue-500/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>{isNl ? 'Kopieer naar Contactformulier' : 'Apply Scope to Inquiry Form'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
