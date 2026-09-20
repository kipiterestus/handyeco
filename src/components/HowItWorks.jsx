import React from 'react';
import { Camera, Calculator, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HowItWorks({ onOpenQuote }) {
  const steps = [
    {
      num: "1",
      icon: Camera,
      title: "Send Photo or Details",
      desc: "Quick snap on WhatsApp or our online form."
    },
    {
      num: "2",
      icon: Calculator,
      title: "Get a Fixed Price",
      desc: "Clear upfront quote with zero surprise extras."
    },
    {
      num: "3",
      icon: CheckCircle2,
      title: "Punctual & Tidy Finish",
      desc: "Arrive on time, professional tools & clean work."
    }
  ];

  return (
    <section id="how-it-works" className="pt-0 pb-8 sm:pb-12 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Connected Bar Styled to Match Where We Work Banner */}
        <div className="relative bg-slate-50/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/70 shadow-2xs hover:border-slate-300 transition-all flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 sm:gap-6">
          
          {/* Left Anchor Notch indicating connection */}
          <div className="absolute -top-3.5 left-6 sm:left-12 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] sm:text-xs font-bold shadow-md border-2 border-white">
            &darr;
          </div>

          {/* Steps Flow (1 - 2 - 3 strictly) */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
            {steps.map((step, idx) => {
              return (
                <div key={idx} className="flex items-center gap-3 text-left p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 shadow-xs">
                    {step.num}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">
                      {step.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-snug mt-0.5 font-normal">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <button
            onClick={onOpenQuote}
            className="w-full lg:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <span>Start Free Quote</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </section>
  );
}
