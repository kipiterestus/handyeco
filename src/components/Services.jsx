import React, { useState } from 'react';
import { 
  PackageCheck, 
  Tv, 
  Paintbrush, 
  Wrench, 
  Hammer, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { SERVICES as FALLBACK_SERVICES } from '../data/servicesData';
import { BUSINESS_INFO } from '../data/businessData';
import { useContent } from '../context/ContentContext';

const iconMap = {
  PackageCheck,
  Tv,
  Paintbrush,
  Wrench,
  Hammer,
  ShieldCheck
};

export default function Services({ onSelectService }) {
  const { content } = useContent();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const servicesList = content.services && content.services.length > 0 
    ? content.services 
    : FALLBACK_SERVICES;
  const siteConfig = content.siteConfig || BUSINESS_INFO;

  const filterTabs = [
    { id: "all", label: "All Services" },
    { id: "furniture-assembly", label: "Furniture Assembly" },
    { id: "wall-mounting", label: "TV & Mounting" },
    { id: "painting-decorating", label: "Painting" },
    { id: "kitchen-bathroom", label: "Kitchen & Bath" },
    { id: "home-maintenance", label: "Odd Jobs" },
    { id: "garden-outdoor", label: "Outdoor" },
  ];

  const filteredServices = selectedCategory === "all"
    ? servicesList
    : servicesList.filter(s => s.id === selectedCategory || s.category === selectedCategory);

  return (
    <section id="services" className="pt-10 sm:pt-16 md:pt-20 pb-6 sm:pb-8 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-blue-100/80 text-blue-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Scottish Handyman Solutions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Quality Home Repairs & Assembly Done Right.
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-slate-600 mt-2 max-w-2xl mx-auto">
            From single-room repairs to full flat refreshes. Free upfront quotes, clean workmanship, and £65 minimum job booking.
          </p>

          {/* Desktop-Only Filter Pills (Hidden on Mobile to keep page clean & avoid scroll friction) */}
          <div className="hidden sm:flex items-center gap-2 flex-wrap justify-center pt-5">
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === tab.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredServices.map((service) => {
            const IconComponent = iconMap[service.iconName] || Hammer;
            const waNumber = (siteConfig.whatsappNumber || siteConfig.phone || "").replace(/\D/g, '');
            const waServiceUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
              `Hi Ekrem, I'd like a quick quote for ${service.title} in Edinburgh.`
            )}`;

            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-2xs hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group text-left"
              >
                <div>
                  {/* Card Top: Icon & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white shadow-2xs">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    {service.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Short Description */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {service.shortDesc || service.description}
                  </p>

                  {/* Feature Checklist */}
                  <ul className="mt-4 space-y-2 text-xs text-slate-700">
                    {(service.features || service.bullets || []).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer: Action Buttons */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectService(service)}
                      className="w-full inline-flex items-center justify-center px-2.5 py-2.5 sm:py-3 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white transition-all duration-200 cursor-pointer"
                    >
                      <span>Book Quote</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>

                    <a
                      href={waServiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-2.5 py-2.5 sm:py-3 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white transition-all duration-200"
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Job Callout */}
        <div className="mt-8 sm:mt-12 bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sm:gap-6 shadow-md text-left">
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-bold">
              Have a bespoke repair or multiple odd jobs?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Send us a photo or short video on WhatsApp for an immediate assessment.
            </p>
          </div>
          <a
            href={siteConfig.whatsappUrl || `https://wa.me/${(siteConfig.whatsappNumber || "").replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-900 bg-emerald-400 hover:bg-emerald-300 shadow-sm transition-all active:scale-95 shrink-0"
          >
            <MessageSquare className="w-4 h-4 mr-1.5 text-slate-900" />
            <span>Send Video on WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
}
