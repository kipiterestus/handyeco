import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, Star, ShieldCheck, Clock, MapPin, 
  MessageSquare, ArrowRight, Sparkles, Anchor, 
  ChevronDown, ChevronUp, Wrench
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';
import QuoteForm from '../components/QuoteForm';
import { useContent } from '../context/ContentContext';
import { BUSINESS_INFO } from '../data/businessData';
import { usePageSeo } from '../hooks/usePageSeo';
import { handleInternalLinkClick } from '../utils/navigation';

export default function LeithHandymanPage() {
  const { content } = useContent();
  const siteConfig = content.siteConfig || BUSINESS_INFO;
  const [openFaq, setOpenFaq] = useState(null);

  const pageSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "HandymanService",
    "name": "Handyeco Leith & Newhaven Handyman Services",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Handyeco",
      "telephone": siteConfig.phone || BUSINESS_INFO.phone,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Leith, Edinburgh",
        "postalCode": "EH6",
        "addressCountry": "GB"
      }
    },
    "areaServed": ["Leith EH6", "The Shore EH6", "Newhaven EH6", "Bonnington EH6"],
    "description": "5-star handyman service in Leith, The Shore & Newhaven (EH6). Tenement maintenance, modern apartment fittings, IKEA assembly, and TV wall mounting.",
    "priceRange": "£65 - £500"
  }), [siteConfig.phone]);

  usePageSeo({
    title: "Handyman Leith & The Shore (EH6) | 5-Star | Handyeco",
    description: "Trusted local handyman for Leith, The Shore & Newhaven EH6. Tenement & new-build repairs, TV wall mounting, IKEA flat pack, silicone reseals. From £65!",
    canonical: "https://handyeco.co.uk/areas/leith-handyman",
    schema: pageSchema
  });

  const faqs = [
    {
      q: "Do you charge extra for parking or call-outs in Leith?",
      a: "No call-out charges ever! Leith (EH6) is part of our daily core circuit. Our minimum booking is a simple £65 with transparent upfront pricing."
    },
    {
      q: "Can you mount TVs on modern plasterboard walls in new-build Leith apartments?",
      a: "Yes. While traditional Leith tenements have stone, many newer waterfront developments around Western Harbour and Ocean Terminal have metal stud partitions. We use heavy-duty hollow-wall toggle anchors (GripIt / Fischer Duotec) tested up to 80kg to hang large TVs safely."
    },
    {
      q: "Do you work with Leith landlords and letting agents?",
      a: "Yes, we regularly handle pre-tenancy repairs, deposit return punch-lists, lock replacements, and bath silicone resealing between leases across Leith."
    }
  ];

  const whatsappLink = `https://wa.me/${siteConfig.whatsappNumber || '447760696723'}?text=Hi%20Ekrem,%20I'm%20looking%20for%20a%20handyman%20in%20Leith%20EH6.`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-slate-500 flex items-center gap-2">
          <a href="/" onClick={(e) => handleInternalLinkClick(e, '/')} className="hover:text-blue-600 transition-colors">Home</a>
          <span>/</span>
          <span className="text-slate-700 font-medium">Areas</span>
          <span>/</span>
          <span className="text-blue-600 font-semibold">Leith &amp; The Shore (EH6)</span>
        </nav>

        {/* Hero */}
        <section className="bg-slate-900 text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600/15 blur-3xl pointer-events-none rounded-full" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950 text-teal-300 text-xs font-bold border border-teal-800 mb-4">
              <Anchor className="w-3.5 h-3.5 text-teal-400" />
              <span>Local Service in EH6: Leith, The Shore &amp; Newhaven</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
              Handyman in Leith, The Shore &amp; Newhaven
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Fast, 5-star rated property maintenance for Leith's tenements and modern waterfront flats. Furniture assembly, TV mounting, silicone sealing, and door adjustments.
            </p>

            {/* Quick Benefits Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                <span className="font-semibold">5.0 Star Rated (73+ Reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">Zero Call-Out Fee in EH6</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-semibold">15–30 Min WhatsApp Reply</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-semibold">EH6 Postcode Specialist</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-transform active:scale-95"
              >
                <MessageSquare className="w-5 h-5" />
                <span>WhatsApp Ekrem for Leith Handyman Quote</span>
              </a>
              <a
                href="#quote-form"
                className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm sm:text-base border border-slate-700 flex items-center gap-2 transition-colors"
              >
                <span>Online Quote Form</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Why Leith Residents Choose Handyeco */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-4">
              Expert Repairs for Both Traditional Tenements &amp; Modern Waterfront Flats
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Whether you live in a classic Leith Walk sandstone tenement with high ceilings, or a sleek apartment on The Shore, we have the exact tooling and fixing systems to ensure safe, flawless work.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-sm text-slate-900 block mb-1">Stud &amp; Stone TV Mounting</span>
                <span className="text-xs text-slate-500">Safe anchor systems for hollow stud walls or solid masonry.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-sm text-slate-900 block mb-1">IKEA PAX &amp; Flat-Pack Assembly</span>
                <span className="text-xs text-slate-500">Fast, flawless furniture building with all tools provided.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-sm text-slate-900 block mb-1">Bathroom Silicone Resealing</span>
                <span className="text-xs text-slate-500">Anti-fungal sealing to eliminate mould in rental &amp; residential flats.</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900">Frequently Asked Questions for EH6</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Common questions from Leith &amp; The Shore residents</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenFaq(openFaq === idx ? null : idx);
                  }}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-bold text-slate-900 hover:text-teal-600 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 shrink-0 text-teal-600" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Quote Form Section */}
        <div id="quote-form">
          <QuoteForm />
        </div>
      </main>

      <Footer />
      <MobileStickyBar onOpenQuote={() => {
        const el = document.getElementById('quote-form');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }} />
    </div>
  );
}
