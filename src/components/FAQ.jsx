import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';
import { useContent } from '../context/ContentContext';

const DEFAULT_FAQS = [
  {
    q: "How does your pricing work? Is there a call-out fee?",
    a: "Quotes are 100% free with zero call-out fees. You can send us photos or a video on WhatsApp to receive a fixed upfront price before booking. Our minimum job booking size is £65 across the Edinburgh area, which covers smaller odd jobs or initial assembly/repairs with no surprise charges."
  },
  {
    q: "Can you mount TVs and heavy mirrors onto Edinburgh tenement walls?",
    a: "Yes, absolutely. Edinburgh tenement flats usually have either solid stone masonry or delicate lath-and-plaster over stud partitions. We carry specialized heavy-duty fixings (Corefix, GripIt, rawlbolts, and hollow wall anchors) designed specifically to hold 65-inch+ TVs and heavy Victorian mirrors safely and securely."
  },
  {
    q: "Do I need to supply screws, brackets, or silicone?",
    a: "We carry a fully stocked van with professional trade-grade fixings, wall plugs, masonry screws, and anti-mould sanitary silicone. For TV wall mounting, you can supply your preferred bracket or we can provide one upon request. For painting, clients usually supply their chosen paint shade, or we can pick it up for you."
  },
  {
    q: "How quickly can you assemble my flat-pack furniture?",
    a: "Most flat-pack jobs (e.g. IKEA PAX wardrobes, beds, dining tables) are completed in 1.5 to 3 hours. We are often able to offer same-day or next-day appointments, including Saturday slots for working professionals."
  },
  {
    q: "How do I get an instant estimate?",
    a: "The fastest way is to send a photo or quick video of what needs done via WhatsApp to 07760 696723. Ekrem typically replies within 15 minutes with an accurate fixed estimate."
  }
];

export default function FAQ() {
  const { content } = useContent();
  const [openIndex, setOpenIndex] = useState(-1);

  const faqs = content.faq && content.faq.length > 0 ? content.faq : DEFAULT_FAQS;
  const siteConfig = content.siteConfig || BUSINESS_INFO;

  return (
    <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200/80 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600 mt-2">
            Everything you need to know about our Edinburgh handyman and maintenance services.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3.5 text-left">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base leading-snug">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-blue-600" : ""
                  }`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
