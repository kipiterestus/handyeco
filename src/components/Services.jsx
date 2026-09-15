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
  Clock,
  Sparkles
} from 'lucide-react';
import { SERVICES } from '../data/servicesData';
import { BUSINESS_INFO } from '../data/businessData';

const iconMap = {
  PackageCheck,
  Tv,
  Paintbrush,
  Wrench,
  Hammer,
  ShieldCheck
};

export default function Services({ onSelectService }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

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
    ? SERVICES
    : SERVICES.filter(s => s.id === selectedCategory);

  return (
    <section id="services" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Professional Scottish Handyman Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Quality Home Repairs & Assembly Done Right.
          </h2>
          <p className="text-base text-slate-600 mt-3 max-w-2xl mx-auto">
            From single-room repairs to full flat freshening. We bring all professional tooling, fixings, and high standards to every Edinburgh home.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  selectedCategory === tab.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredServices.map((service) => {
            const IconComponent = iconMap[service.iconName] || Hammer;
            const waServiceUrl = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(
              `Hi Ekrem, I'd like a quick quote for ${service.title} in Edinburgh.`
            )}`;

            return (
              <div
                key={service.id}
                className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group text-left"
              >
                <div>
                  {/* Card Top: Icon & Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white shadow-sm">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    {service.badge && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Short Description */}
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  {/* Feature Checklist */}
                  <ul className="mt-5 space-y-2.5 text-xs text-slate-700">
                    {service.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer: Action Buttons */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => onSelectService(service)}
                      className="w-full inline-flex items-center justify-center px-3 py-3 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white transition-all duration-200 cursor-pointer"
                    >
                      <span>Book Quote</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>

                    <a
                      href={waServiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-3 py-3 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white transition-all duration-200"
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
        <div className="mt-12 bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg text-left">
          <div className="space-y-1">
            <h4 className="text-lg sm:text-xl font-bold">
              Have a bespoke repair or multiple odd jobs on your list?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Send us a photo or short video on WhatsApp, and get an immediate fixed-price assessment.
            </p>
          </div>
          <a
            href={BUSINESS_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm text-slate-900 bg-emerald-400 hover:bg-emerald-300 shadow-md transition-all active:scale-95 shrink-0"
          >
            <MessageSquare className="w-4 h-4 mr-2 text-slate-900" />
            Send Video on WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
}
