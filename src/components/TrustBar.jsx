import React from 'react';
import { Star, ShieldCheck, Sparkles, Clock, PoundSterling, Check } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';
import { useContent } from '../context/ContentContext';

export default function TrustBar() {
  const { content } = useContent();
  const siteConfig = content.siteConfig || BUSINESS_INFO;

  const trustPoints = [
    {
      icon: Star,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50",
      title: "5.0 / 5.0 Rated",
      subtitle: "Verified Google & MyBuilder Reviews",
      link: siteConfig.googleProfileUrl || BUSINESS_INFO.googleProfileUrl
    },
    {
      icon: PoundSterling,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      title: "Free Quotes • Min Job £65",
      subtitle: "Zero call-out fee (Edinburgh Area)",
      link: null
    },
    {
      icon: PoundSterling,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      title: "Transparent Pricing",
      subtitle: "Fixed quotes upfront, zero hidden extras",
      link: null
    },
    {
      icon: Clock,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
      title: "Punctual & Clean",
      subtitle: "Tenement care, dust sheets & spotless tidy",
      link: null
    }
  ];

  return (
    <section className="bg-white border-y border-slate-200/80 py-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {trustPoints.map((item, idx) => {
            const Icon = item.icon;
            const content = (
              <div className="flex items-center gap-3.5 group text-left">
                <div className={`w-12 h-12 rounded-2xl ${item.bgColor} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                  <Icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight flex items-center gap-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );

            return item.link ? (
              <a 
                key={idx} 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:opacity-90 transition-opacity"
              >
                {content}
              </a>
            ) : (
              <div key={idx}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
