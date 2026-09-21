import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAmsterdamTime } from '../hooks/useAmsterdamTime';
import confetti from 'canvas-confetti';
import ScratchEmailReveal from './ScratchEmailReveal';
import { 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';

export default function ContactSection() {
  const { t } = useLanguage();
  const amsterdamTime = useAmsterdamTime();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Custom Web Platform / SaaS',
    message: '',
  });

  useEffect(() => {
    const handleScopeApplied = (e) => {
      if (e.detail) {
        setFormData((prev) => ({
          ...prev,
          projectType: e.detail.projectType || prev.projectType,
          message: e.detail.message || prev.message,
        }));
      }
    };
    window.addEventListener('scope_brief_applied', handleScopeApplied);
    return () => window.removeEventListener('scope_brief_applied', handleScopeApplied);
  }, []);

  const [status, setStatus] = useState('idle'); // idle | submitting | success

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 800);
  };

  return (
    <section id="contact" className="py-24 scroll-mt-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider mb-4">
            <Mail className="w-3.5 h-3.5" />
            <span>{t.contact.tagline}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white tracking-tight mb-4">
            {t.contact.title}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Email & Netherlands Info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Direct Email Card */}
            <div className="p-7 rounded-3xl bg-gradient-to-br from-blue-950/40 via-indigo-950/30 to-slate-900 border border-blue-500/30 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400">
                    Priority Channel
                  </span>
                </div>

                <h4 className="font-heading font-bold text-white text-lg mb-1">
                  {t.contact.directEmailTitle}
                </h4>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  {t.contact.directEmailDesc}
                </p>

                {/* Scratch-to-Reveal Protected Email */}
                <ScratchEmailReveal />
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Typical response time: &lt; 2-4 hours</span>
              </div>
            </div>

            {/* Netherlands Location Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-heading font-bold text-white text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  {t.contact.locationCard.title}
                </span>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {amsterdamTime.timeString}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p className="flex items-center gap-2">
                  <span className="text-slate-500">Region:</span>
                  <span className="font-medium text-white">{t.contact.locationCard.city}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.contact.locationCard.openHours}</span>
                </p>
                <p className="text-slate-400 pt-2 border-t border-white/5 leading-relaxed">
                  {t.contact.locationCard.remote}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct engineering partnership with zero agency overhead.</span>
              </div>
            </div>

          </div>

          {/* Right Column: Project Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-3xl p-8 border border-white/10 relative">
              
              {status === 'success' ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-white">
                    {t.contact.successTitle}
                  </h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    {t.contact.successDesc}
                  </p>
                  <button
                    onClick={() => {
                      setStatus('idle');
                      setFormData({
                        name: '',
                        email: '',
                        projectType: 'Custom Web Platform / SaaS',
                        message: '',
                      });
                    }}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-2">
                        {t.contact.formName} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Jan de Vries"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:border-blue-500 transition-colors placeholder:text-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-2">
                        {t.contact.formEmail} *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. jan@company.nl"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:border-blue-500 transition-colors placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-2">
                      {t.contact.formProjectType}
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:border-blue-500 transition-colors cursor-pointer"
                    >
                      <option value="Custom Web Platform / SaaS">Custom Web Platform / SaaS</option>
                      <option value="Booking Engine / Reservation Platform">Custom Booking Engine / E-Commerce</option>
                      <option value="AI Integration & Automation Tool">AI Integration & Automation Tool</option>
                      <option value="Long-term Maintainer Retainer">Dedicated Systems Maintainer Retainer</option>
                      <option value="Other Custom Inquiry">Other Custom Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-2">
                      {t.contact.formMessage} *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Outline your project scope, core problems to solve, or target timeline..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:border-blue-500 transition-colors placeholder:text-slate-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {status === 'submitting' ? (
                      <span>{t.contact.btnSending}</span>
                    ) : (
                      <>
                        <span>{t.contact.btnSend}</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-500 text-center font-mono">
                    Client confidentiality & NDA standards respected. Direct response within 2–4 hours.
                  </p>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
