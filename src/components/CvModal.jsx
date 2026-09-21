import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  X, 
  Download, 
  MapPin, 
  Mail, 
  ExternalLink, 
  CheckCircle2, 
  Briefcase, 
  Zap,
  ShieldCheck,
  Globe 
} from 'lucide-react';

export default function CvModal({ isOpen, onClose }) {
  const { language } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0C101D] border border-white/15 shadow-2xl z-10 text-slate-100 flex flex-col">
        
        {/* Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#0C101D]/95 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-white text-base">
              Curriculum Vitae / Professional Summary
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CV Body */}
        <div className="p-6 sm:p-8 space-y-8 font-sans">
          
          {/* Top Profile Header */}
          <div className="pb-6 border-b border-white/10 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                Utku D.
              </h1>
              <h2 className="text-sm font-semibold text-blue-400 mt-1 font-mono flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                AI-Powered Product Builder & Maintainer
              </h2>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Based in Amsterdam, Netherlands • EU & Remote
              </p>
            </div>

            <div className="text-xs text-slate-400 font-mono space-y-1 sm:text-right">
              <a href="#contact" onClick={onClose} className="hover:text-blue-400 transition-colors">
                contact [at] utkudev.nl
              </a>
              <div>github.com/utkud</div>
              <div className="text-emerald-400 font-semibold">Open for Custom Builds & Maintainer Roles</div>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
              Executive Profile
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pioneering the new <strong>Builder & Maintainer</strong> discipline in modern software engineering. Leveraging autonomous AI agent workflows to build end-to-end, high-performance web platforms in record time — followed by proactive systems maintenance ensuring zero bit-rot, top-tier Core Web Vitals, and continuous AI feature integration.
            </p>
          </div>

          {/* Key Production Works */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 font-semibold flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-400" />
              Flagship Production Deliverables
            </h3>

            <div className="space-y-4">
              
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold font-heading text-white">
                    HandyEco Platform — Lead Builder & Maintainer
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">2025 – Present</span>
                </div>
                <p className="text-xs text-slate-300 mb-2">
                  Architected and deployed an on-demand property maintenance platform with dynamic interactive quote calculations, role-based admin panel, and high-ranking local SEO landing pages.
                </p>
                <div className="text-[11px] font-mono text-emerald-400">
                  Impact: +140% conversion rate increase in online quotes, sub-1.2s average LCP.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold font-heading text-white">
                    Northwest Tour Booking Engine — Full-Stack Builder
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">2025 – Present</span>
                </div>
                <p className="text-xs text-slate-300 mb-2">
                  Engineered an enterprise Next.js custom tour builder with real-time route budgeting, carbon sustainability tracking, and seamless checkout flows.
                </p>
                <div className="text-[11px] font-mono text-emerald-400">
                  Impact: 98/100 Lighthouse performance, 3.4x lift in custom package configurations.
                </div>
              </div>

            </div>
          </div>

          {/* Core Technical Competencies */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 font-semibold">
              Technical Arsenal & AI Workflows
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
                <span className="font-semibold text-white block mb-1">Frontend Engineering:</span>
                React 19, Next.js (App Router), TypeScript, Tailwind CSS v4, HTML5/CSS3, State Management, GSAP & Transitions.
              </div>
              <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
                <span className="font-semibold text-white block mb-1">Backend & Systems:</span>
                Node.js, Express, RESTful APIs, Python (Async, Scraping), PostgreSQL, Supabase, Webhooks, Docker.
              </div>
              <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
                <span className="font-semibold text-white block mb-1">AI Tooling & Automation:</span>
                Autonomous Agentic Coding, Context Engineering, AI Workflow Automation, Continuous Maintenance.
              </div>
              <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
                <span className="font-semibold text-white block mb-1">Languages:</span>
                English (Professional / Fluent), Dutch (Nederlands - Working Knowledge).
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-500 font-mono">
            Direct collaboration inquiries: contact@utkudev.nl
          </div>

        </div>

      </div>
    </div>
  );
}
