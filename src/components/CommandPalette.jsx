import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, 
  Terminal, 
  Layers, 
  Cpu, 
  Mail, 
  Globe, 
  Copy, 
  ArrowRight,
  Zap,
  GitCommit
} from 'lucide-react';

export default function CommandPalette({ isOpen, onClose }) {
  const { language, setLanguage, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'builder-maintainer',
      label: t.cmd.builderRole,
      category: 'Concept & Role',
      icon: Zap,
      action: () => {
        window.location.hash = '#builder-maintainer';
        onClose();
      },
    },
    {
      id: 'projects',
      label: t.cmd.projects,
      category: 'Navigation',
      icon: Layers,
      action: () => {
        window.location.hash = '#projects';
        onClose();
      },
    },
    {
      id: 'skills',
      label: t.cmd.skills,
      category: 'Navigation',
      icon: Cpu,
      action: () => {
        window.location.hash = '#skills';
        onClose();
      },
    },
    {
      id: 'process',
      label: t.cmd.process,
      category: 'Navigation',
      icon: GitCommit,
      action: () => {
        window.location.hash = '#process';
        onClose();
      },
    },
    {
      id: 'contact',
      label: t.cmd.contact,
      category: 'Navigation',
      icon: Mail,
      action: () => {
        window.location.hash = '#contact';
        onClose();
      },
    },
    {
      id: 'copy-email',
      label: t.cmd.copyEmail,
      category: 'Quick Contact',
      icon: Copy,
      action: () => {
        navigator.clipboard.writeText('contact@utkudev.nl');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
    },
    {
      id: 'lang-en',
      label: 'Switch language to English (🇬🇧)',
      category: 'Localization',
      icon: Globe,
      action: () => {
        setLanguage('en');
        onClose();
      },
    },
    {
      id: 'lang-nl',
      label: 'Schakel naar Nederlands (🇳🇱)',
      category: 'Localization',
      icon: Globe,
      action: () => {
        setLanguage('nl');
        onClose();
      },
    },
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 sm:px-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0F1322] border border-white/15 shadow-2xl z-10 overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.cmd.placeholder}
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-white/10">
            Esc
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 font-mono">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/10 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-200 group-hover:text-white">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {item.category}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>{copied ? '✓ ' + t.cmd.emailCopied : 'Navigate with ⌘K'}</span>
          <span>Utku Portfolio Command</span>
        </div>

      </div>
    </div>
  );
}
