import React from 'react';
import { MapPin, CheckCircle, ArrowDown } from 'lucide-react';

export default function ServiceAreas() {
  const areaGroups = [
    { zone: "Central & City", postcodes: "EH1 - EH3, EH7 - EH8", areas: "Old Town, New Town, West End, Broughton" },
    { zone: "North & Coast", postcodes: "EH4 - EH6, EH15", areas: "Leith, Stockbridge, Trinity, Portobello" },
    { zone: "South & West", postcodes: "EH9 - EH14", areas: "Morningside, Bruntsfield, Corstorphine, Balerno" },
    { zone: "Lothians", postcodes: "EH21 - EH30, EH54", areas: "Musselburgh, Dalkeith, Queensferry, Livingston" },
  ];

  return (
    <section id="areas" className="pt-8 pb-3 bg-white border-b border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Minimal Chic Container */}
        <div className="bg-slate-50/90 rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs relative">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/70 text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  Where We Work in Scotland
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Full coverage across Edinburgh & Lothians &bull; <span className="font-semibold text-slate-700">Minimum call-out fee £65 (Edinburgh Area)</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200/80 shrink-0">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Zero extra travel fee across all EH zones</span>
            </div>
          </div>

          {/* Area Postcode Chips Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-5 text-left">
            {areaGroups.map((group, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200/70 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 block">
                  {group.zone}
                </span>
                <span className="text-xs font-bold text-slate-900 block mt-1">
                  {group.postcodes}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5 truncate" title={group.areas}>
                  {group.areas}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Seamless Visual Connector with Left-Hand Arrow to 3 Steps */}
        <div className="relative h-10 flex items-center pl-8 sm:pl-12">
          {/* Vertical dashed line */}
          <div className="absolute top-0 bottom-0 left-8 sm:left-12 w-0.5 border-l-2 border-dashed border-blue-400"></div>

          {/* Connected Arrow Pill on Left */}
          <div className="relative z-10 -ml-3 flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold shadow-2xs">
            <ArrowDown className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
            <span>Next: Easy 3-Step Booking</span>
          </div>
        </div>

      </div>
    </section>
  );
}
