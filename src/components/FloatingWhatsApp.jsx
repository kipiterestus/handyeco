import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState("");

  const quickPrompts = [
    "Need IKEA furniture assembled",
    "TV wall mounting in Edinburgh",
    "Bathroom silicone re-sealing",
    "Painting a room / hallway",
    "Odd jobs & home maintenance"
  ];

  const handleStartChat = (text) => {
    const message = text || customMsg || "Hi Ekrem, I'd like to get a quote for a handyman job in Edinburgh.";
    const waUrl = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Mini Chat Popover */}
      {isOpen && (
        <div className="mb-4 w-[320px] sm:w-[360px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in slide-in-from-bottom-5 duration-200 text-left">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3.5 right-3.5 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-white text-emerald-700 font-extrabold flex items-center justify-center text-sm shadow-sm">
                  EK
                </div>
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white absolute bottom-0 right-0"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Ekrem (Handyeco)</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  <span>Online &bull; Replies in &lt;15m</span>
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 space-y-3">
            {/* Bubble from Ekrem */}
            <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-xs border border-slate-200/80 text-xs text-slate-800 leading-relaxed">
              Hello! 👋 How can I help with your Edinburgh home repairs today? Send me a quick description or photos for an instant estimate.
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Popular requests:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleStartChat(prompt)}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 transition-all text-left cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input & Send Button */}
            <div className="pt-2 flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Type your message..."
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleStartChat(); }}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleStartChat()}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
                aria-label="Send WhatsApp"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-900/30 hover:shadow-emerald-900/40 active:scale-95 transition-all duration-200 cursor-pointer group"
        aria-label="Open WhatsApp Chat"
      >
        <div className="relative">
          <MessageSquare className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span className="w-3 h-3 rounded-full bg-amber-400 border-2 border-emerald-600 absolute -top-1 -right-1 animate-ping"></span>
          <span className="w-3 h-3 rounded-full bg-amber-400 border-2 border-emerald-600 absolute -top-1 -right-1"></span>
        </div>
        <span className="text-xs sm:text-sm font-bold tracking-wide hidden sm:inline">
          Chat on WhatsApp
        </span>
      </button>
    </div>
  );
}
