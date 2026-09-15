import React from 'react';
import { Phone, MessageSquare, Calculator } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';
import { useContent } from '../context/ContentContext';

export default function MobileStickyBar({ onOpenQuote }) {
  const { content } = useContent();
  const siteConfig = content.siteConfig || BUSINESS_INFO;

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pt-2 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-2 shadow-2xl">
      <a
        href={"tel:" + (siteConfig.phone || BUSINESS_INFO.phone)}
        className="flex-1 inline-flex items-center justify-center py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
      >
        <Phone className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
        <span>Call</span>
      </a>

      <a
        href={siteConfig.whatsappUrl || BUSINESS_INFO.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 inline-flex items-center justify-center py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors"
      >
        <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
        <span>WhatsApp</span>
      </a>

      <button
        onClick={onOpenQuote}
        className="flex-1 inline-flex items-center justify-center py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
      >
        <Calculator className="w-3.5 h-3.5 mr-1.5" />
        <span>Quote</span>
      </button>
    </div>
  );
}
