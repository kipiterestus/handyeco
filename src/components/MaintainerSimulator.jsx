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
    "[SYSTEM] Automated health monitor active.",
    "[STATUS] All live services healthy (99.98% uptime).",
    "[SPEED] Page load time checked: 0.42s.",
  ]);

  const incidents = [
    {
      id: 'cve',
      title: isNl ? 'Beveiligingslek Oplossen' : 'Fix Security Bug',
      color: 'from-red-600 to-rose-600',
      description: isNl ? 'Softwarepakket heeft een veiligheidsupdate nodig.' : 'A package needs an urgent security patch.',
      triggerLog: "[WARNING] Outdated library detected in authentication flow.",
      resolveLogs: [
        "[CHECK] Safe package upgrade identified.",
        "[TEST] Automated tests run: 100% PASS.",
        "[DEPLOY] Update deployed without taking the site offline.",
        "[DONE] Fixed completely. Site 100% secure."
      ]
    },
    {
      id: 'ai_api',
      title: isNl ? 'AI API Update' : 'Update AI API Endpoint',
      color: 'from-amber-600 to-orange-600',
      description: isNl ? 'AI-leverancier heeft een model geüpdatet.' : 'AI provider updated model to newest version.',
      triggerLog: "[NOTICE] AI provider changed legacy model URL.",
      resolveLogs: [
        "[CHECK] Automatic switch to new AI streaming model.",
        "[LATENCY] Response speed improved to 180ms.",
        "[DONE] New AI model live without any downtime."
      ]
    },
    {
      id: 'db_latency',
      title: isNl ? 'Trage Database Versnellen' : 'Speed Up Database',
      color: 'from-purple-600 to-indigo-600',
      description: isNl ? 'Veel verkeer zorgt voor een trage query.' : 'Traffic spike caused slow database queries.',
      triggerLog: "[SLOW] Database query took 1200ms to respond.",
      resolveLogs: [
        "[DIAGNOSIS] Missing database index identified.",
        "[OPTIMIZE] Index created instantly in the background.",
        "[RESULT] Query time dropped from 1200ms to 8ms.",
        "[DONE] Fast database speed restored."
      ]
    }
  ];

  const triggerIncident = (inc) => {
    playAlert();
    setActiveIncident(inc.id);
    setSystemState('resolving');

    setLogs((prev) => [
      inc.triggerLog,
      ...prev.slice(0, 4)
    ]);

    inc.resolveLogs.forEach((logItem, idx) => {
      setTimeout(() => {
        setLogs((prev) => [logItem, ...prev.slice(0, 5)]);

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
      "[SYSTEM] Automated health monitor active.",
      "[STATUS] All live services healthy (99.98% uptime).",
      "[SPEED] Page load time checked: 0.42s.",
    ]);
  };

  return (
    <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-[#090C16] border border-white/10 shadow-2xl relative">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>{isNl ? 'LIVE ONDERHOUD SIMULATIE' : 'LIVE MAINTENANCE SIMULATION'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
            {isNl ? 'Hoe Onderhoud Uw Website Beschermt' : 'How Ongoing Maintenance Protects Your Site'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isNl 
              ? 'Klik op een scenario hieronder om te zien hoe updates en fixes automatisch worden opgelost zonder dat de site offline gaat.'
              : 'Click any scenario below to see how issues are diagnosed and fixed with zero downtime.'}
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
                ? (isNl ? 'Status: 100% Online' : 'Status: 100% Online')
                : systemState === 'resolving'
                ? (isNl ? 'Probleem Wordt Opgelost...' : 'Fixing in Background...')
                : (isNl ? 'Opgelost Zonder Downtime' : 'Fixed with Zero Downtime')}
            </span>
          </div>

          <button
            onClick={resetSimulator}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Reset Console"
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
            maintenance_monitor.log (Live Status)
          </span>
          <span>Buffer: 64KB</span>
        </div>
        <div className="space-y-1.5 min-h-[90px]">
          {logs.map((log, i) => (
            <div 
              key={i} 
              className={`leading-relaxed transition-all ${
                log.includes('CRITICAL') || log.includes('WARNING') || log.includes('SLOW')
                  ? 'text-red-400 font-semibold'
                  : log.includes('DONE') || log.includes('100%') || log.includes('PASS')
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
