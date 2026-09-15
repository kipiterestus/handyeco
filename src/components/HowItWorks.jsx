import React from 'react';
import { Camera, Calculator, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HowItWorks({ onOpenQuote }) {
  const steps = [
    {
      num: "1",
      icon: Camera,
      title: "1. Send Photo or Details",
      desc: "Quick snap on WhatsApp or our online form."
    },
    {
      num: "2",
      icon: Calculator,
      title: "2. Get a Fixed Price",
      desc: "Clear upfront quote with zero surprise extras."
    },
    {
      num: "3",
      icon: CheckCircle2,
      title: "3. Punctual & Tidy Finish",
      desc: "Arrive on time, professional tools & spotless cleanup."
    }
  ];

  return (
    <section id="how-it-works" className="pt-0 pb-12 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Connected Bar */}
        <div className="relative bg-white rounded-3xl p-5 sm:p-6 border-2 border-blue-100 shadow-sm hover:border-blue-300 transition-all flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Subtle Left Anchor Notch indicating connection */}
          <div className="hidden sm:block absolute -top-3.5 left-8 sm:left-12 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black shadow-md border-2 border-white">
            &darr;
          </div>

          {/* Label */}
          <div className="flex items-center gap-3 shrink-0 text-left pt-1 sm:pt-0">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                Simple 3-Step Process
              </h3>
              <p className="text-xs text-slate-500">Fast, transparent Edinburgh booking</p>
            </div>
          </div>

          {/* Steps Flow */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex items-center gap-3 text-left p-2.5 rounded-2xl bg-slate-50/70 hover:bg-blue-50/60 transition-colors border border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                    {step.num}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
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
            className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <span>Start Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </section>
  );
}
