import React from 'react';
import { MapPin, CheckCircle, ArrowDown } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function ServiceAreas() {
  const { content } = useContent();
  const areaGroups = content.areas && content.areas.length > 0 ? content.areas : [
    { zone: "Central & City", postcodes: "EH1 - EH3, EH7 - EH8", areas: "Old Town, New Town, West End, Broughton" },
    { zone: "North & Coast", postcodes: "EH4 - EH6, EH15", areas: "Leith, Stockbridge, Trinity, Portobello" },
    { zone: "South & West", postcodes: "EH9 - EH14", areas: "Morningside, Bruntsfield, Corstorphine, Balerno" },
    { zone: "Lothians", postcodes: "EH21 - EH30, EH54", areas: "Musselburgh, Dalkeith, Queensferry, Livingston" },
  ];
  const callOutText = content.siteConfig?.callOutText || "Free Quotes • Minimum Job £65 (Edinburgh Area)";

  return (
    <section id="areas" className="pt-6 pb-2 sm:pt-8 sm:pb-3 bg-white border-b border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Minimal Chic Container */}
        <div className="bg-slate-50/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/70 shadow-2xs relative">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-5 border-b border-slate-200/70 text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 leading-tight tracking-tight">
                  Local Handyman Near Me — Edinburgh &amp; Lothians Coverage
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 font-normal mt-0.5">
                  Looking for a trusted local handyman near you? Full coverage across all EH postcodes with zero travel surcharge.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80 shadow-2xs self-start sm:self-auto">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{callOutText}</span>
            </div>
          </div>

          {/* Area Postcode Chips Grid - Static informational chips, not clickable */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 pt-4 sm:pt-5 text-left select-none">
            {areaGroups.map((group, idx) => (
              <div key={idx} className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all pointer-events-none">
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-blue-600 block">
                  {group.zone}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 block mt-0.5 tracking-tight">
                  {group.postcodes}
                </span>
                <span className="text-[11px] sm:text-xs font-normal text-slate-500 block mt-0.5 leading-snug">
                  {group.areas}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Seamless Visual Connector with Left-Hand Arrow to 3 Steps */}
        <div className="relative h-9 sm:h-10 flex items-center pl-6 sm:pl-12">
          {/* Vertical dashed line */}
          <div className="absolute top-0 bottom-0 left-6 sm:left-12 w-0.5 border-l-2 border-dashed border-blue-400"></div>

          {/* Connected Arrow Pill on Left */}
          <div className="relative z-10 -ml-3 flex items-center gap-1.5 bg-blue-50/90 text-blue-700 border border-blue-200/80 px-3 py-1 rounded-full text-xs font-medium shadow-2xs">
            <ArrowDown className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
            <span>Next: Easy 3-Step Booking</span>
          </div>
        </div>

      </div>
    </section>
  );
}
