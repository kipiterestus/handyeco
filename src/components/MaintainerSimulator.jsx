import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles,
  AlertOctagon
} from 'lucide-react';
import { playClick, playAlert, playSuccess } from '../utils/soundFx';

export default function MaintainerSimulator() {
  const { language } = useLanguage();
  const isNl = language === 'nl';

  const [activeIncident, setActiveIncident] = useState(null);
  const [systemState, setSystemState] = useState('healthy'); // healthy | resolving | resolved
  const [logs, setLogs] = useState([
    "[SYSTEM_INIT] AI Maintainer Telemetry Daemon active.",
    "[STATUS] All 4 production services nominal (Uptime: 99.98%).",
    "[HEALTH] Core Web Vitals monitor polling every 30s.",
  ]);

  const incidents = [
    {
      id: 'cve',
      title: isNl ? 'Simuleer Beveiligingslek (CVE)' : 'Simulate CVE Vulnerability',
      color: 'from-red-600 to-rose-600',
      description: isNl ? 'NPM dependency heeft een zero-day kwetsbaarheid ontdekt.' : 'NPM sub-dependency reported critical vulnerability.',
      triggerLog: "[CRITICAL] CVE-2026-4419 detected in auth middleware.",
      resolveLogs: [
        "[AI_DIAGNOSIS] Vulnerability isolated. No user data exposed.",
        "[AUTO_HOTFIX] Generating non-breaking dependency upgrade patch...",
        "[CANARY_TEST] Automated end-to-end regression tests: PASS (100%).",
        "[DEPLOYMENT] Zero-downtime rolling patch deployed to Edge CDN.",
        "[RESOLVED] Vulnerability eradicated. Production health: 100%."
      ]
    },
    {
      id: 'ai_api',
      title: isNl ? 'Simuleer AI Model Deprecation' : 'Simulate AI Model Deprecation',
      color: 'from-amber-600 to-orange-600',
      description: isNl ? 'LLM provider heeft v1 API-eindpunt uitgefaseerd.' : 'Upstream AI provider sunset v1 inference endpoint.',
      triggerLog: "[WARNING] Upstream model endpoint returning HTTP 410 Sunset.",
      resolveLogs: [
        "[AI_DIAGNOSIS] Legacy completion model deprecated by provider.",
        "[AUTO_HOTFIX] Fallback router redirected prompt schema to v2 streaming pipeline.",
        "[LATENCY] Real-time inference latency restored to 180ms.",
        "[RESOLVED] Pipeline modernized seamlessly without user downtime."
      ]
    },
    {
      id: 'db_latency',
      title: isNl ? 'Simuleer Trage Database Query' : 'Simulate Database Latency',
      color: 'from-purple-600 to-indigo-600',
      description: isNl ? 'Ongeïndexeerde query veroorzaakt 1200ms vertraging.' : 'Traffic spike caused unindexed table query latency spike.',
      triggerLog: "[LATENCY_SPIKE] Postgres table scan exceeding 1250ms threshold.",
      resolveLogs: [
        "[AI_DIAGNOSIS] Query planner analyzed: Missing composite index on order_status.",
        "[AUTO_HOTFIX] Executed non-blocking concurrent index creation.",
        "[PERFORMANCE] Query response reduced from 1250ms to 8ms.",
        "[RESOLVED] Sub-second database performance restored."
      ]
    }
  ];

  const triggerIncident = (inc) => {
    playAlert();
    setActiveIncident(inc.id);
    setSystemState('resolving');

    // Add trigger log
    setLogs((prev) => [
      inc.triggerLog,
      ...prev.slice(0, 4)
    ]);

    // Step-by-step resolution simulation
    inc.resolveLogs.forEach((logItem, idx) => {
      setTimeout(() => {
        setLogs((prev) => [logItem, ...prev.slice(0, 5)]);

        // Once last log is printed
        if (idx === inc.resolveLogs.length - 1) {
          setSystemState('resolved');
          playSuccess();
        }
      }, 700 * (idx + 1));
    });
  };

  const resetSimulator = () => {
    playClick();
    setActiveIncident(null);
    setSystemState('healthy');
    setLogs([
      "[SYSTEM_INIT] AI Maintainer Telemetry Daemon active.",
      "[STATUS] All production nodes healthy & nominal.",
      "[HEALTH] Core Web Vitals monitor polling every 30s.",
    ]);
  };

  return (
    <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-[#090C16] border border-white/10 shadow-2xl relative">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>{isNl ? 'INTERACTIEVE PROACTIEVE MAINTAINER SIMULATOR' : 'INTERACTIVE MAINTAINER INCIDENT SIMULATOR'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
            {isNl ? 'Ervaar Hoe een AI Maintainer Uw Systeem Beveiligt' : 'Experience How an AI Maintainer Protects Your Platform'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isNl 
              ? 'Klik op een van de knoppen hieronder om een realistisch incident te simuleren en te zien hoe de maintainer het autonoom oplost.'
              : 'Trigger a realistic production emergency below to see how proactive maintenance shields your business without downtime.'}
          </p>
        </div>

        {/* System Health Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-mono font-semibold transition-colors ${
            systemState === 'healthy' || systemState === 'resolved'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/15 border-red-500/30 text-red-400 animate-pulse'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              systemState === 'healthy' || systemState === 'resolved' ? 'bg-emerald-400' : 'bg-red-400'
            }`} />
            <span>
              {systemState === 'healthy'
                ? (isNl ? 'Systeem: 100% Online' : 'Status: 100% Healthy')
                : systemState === 'resolving'
                ? (isNl ? 'Incident Gedetecteerd...' : 'Auto-Remediation Active...')
                : (isNl ? 'Hersteld met 0 Downtime' : 'Healed with Zero Downtime')}
            </span>
          </div>

          <button
            onClick={resetSimulator}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Reset Telemetry Console"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Incident Trigger Buttons */}
      <div className="grid sm:grid-cols-3 gap-3 my-6">
        {incidents.map((inc) => (
          <button
            key={inc.id}
            onClick={() => triggerIncident(inc)}
            disabled={systemState === 'resolving'}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              activeIncident === inc.id
                ? 'bg-slate-800/80 border-indigo-500/50 shadow-lg'
                : 'bg-slate-900/60 border-white/10 hover:border-white/20 hover:bg-slate-800/40'
            } ${systemState === 'resolving' ? 'opacity-50 cursor-not-allowed' : 'active:scale-98'}`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold font-heading text-white">{inc.title}</span>
              <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {inc.description}
            </p>
          </button>
        ))}
      </div>

      {/* Live Terminal Log Stream */}
      <div className="rounded-2xl bg-black/80 border border-white/10 p-4 font-mono text-xs overflow-hidden">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-slate-500 text-[10px]">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-blue-400" />
            ai_maintainer_daemon.log (Live Telemetry Stream)
          </span>
          <span>Buffer: 64KB</span>
        </div>
        <div className="space-y-1.5 min-h-[90px]">
          {logs.map((log, i) => (
            <div 
              key={i} 
              className={`leading-relaxed transition-all ${
                log.includes('CRITICAL') || log.includes('WARNING') || log.includes('LATENCY_SPIKE')
                  ? 'text-red-400 font-semibold'
                  : log.includes('RESOLVED') || log.includes('PASS')
                  ? 'text-emerald-400 font-semibold'
                  : 'text-slate-300'
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
