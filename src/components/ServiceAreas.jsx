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
        <div className="bg-slate-50/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-2xs relative">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-slate-200/80 text-left">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 leading-tight tracking-tight">
                  Where We Work in Scotland
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium mt-0.5">
                  Full coverage across Edinburgh &amp; Lothians
                </p>
                <p className="text-xs sm:text-sm md:text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                  <span>{callOutText}</span>
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 text-xs sm:text-sm md:text-base font-bold text-emerald-900 bg-emerald-100/80 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl border border-emerald-300 shadow-2xs self-start sm:self-auto">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
              <span>Free Quotes &amp; Zero Call-Out Charges</span>
            </div>
          </div>

          {/* Area Postcode Chips Grid - Enriched for high readability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-5 sm:pt-6 text-left">
            {areaGroups.map((group, idx) => (
              <div key={idx} className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-blue-300 transition-all">
                <span className="text-xs sm:text-xs font-black uppercase tracking-wider text-blue-600 block">
                  {group.zone}
                </span>
                <span className="text-base sm:text-lg font-black text-slate-900 block mt-1">
                  {group.postcodes}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-600 block mt-1 leading-snug">
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
          <div className="relative z-10 -ml-3 flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold shadow-2xs">
            <ArrowDown className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
            <span>Next: Easy 3-Step Booking</span>
          </div>
        </div>

      </div>
    </section>
  );
}
