import React, { useState } from 'react';
import { 
  CheckCircle2, Star, ShieldCheck, Clock, MapPin, 
  MessageSquare, ArrowRight, ChevronDown, ChevronUp, Wrench
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';
import QuoteForm from '../components/QuoteForm';
import { useContent } from '../context/ContentContext';
import { BUSINESS_INFO } from '../data/businessData';
import { usePageSeo } from '../hooks/usePageSeo';
import { handleInternalLinkClick } from '../utils/navigation';
import RelatedServicesLinks from '../components/RelatedServicesLinks';
import { buildPageSchema } from '../utils/seoSchema';

export default function PortobelloHandymanPage() {
  const { content } = useContent();
  const siteConfig = content.siteConfig || BUSINESS_INFO;
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "Do you travel out to Portobello, Joppa, and Duddingston without travel fees?",
      a: "Yes. Portobello and Joppa (EH15) are just a short drive along the coast for me. I never charge call-out fees or travel surcharges. You pay only for the work completed, starting from our standard £65 minimum booking."
    },
    {
      q: "Why do doors in Portobello stick so often, and can you fix them?",
      a: "Sea air and coastal humidity cause timber doors to absorb moisture and swell against their frames, especially in older Victorian terraces. I use a cordless plunge rail saw to plane and bevel the edges cleanly without splintering the paintwork, so your doors open and shut smoothly all year round."
    },
    {
      q: "Can you reseal coastal bathrooms and showers that keep going mouldy?",
      a: "Definitely. In seaside homes, damp air accelerates mould behind loose silicone. I completely strip away the old sealant, treat the joints with anti-fungal solution, dry the gap, and apply premium sanitary silicone that resists mildew."
    }
  ];

  const breadcrumbs = [
    { name: "Home", url: "https://handyeco.co.uk/" },
    { name: "Areas", url: "https://handyeco.co.uk/#areas" },
    { name: "Handyman Portobello & Joppa (EH15)", url: "https://handyeco.co.uk/areas/portobello-handyman" }
  ];

  usePageSeo({
    title: "Handyman Portobello & Joppa Edinburgh (EH15) | Handyeco",
    description: "Local 5-star handyman for Portobello, Joppa & Duddingston EH15. Door trimming, silicone resealing, flat-pack assembly & TV mounting. No call-out fee.",
    canonical: "https://handyeco.co.uk/areas/portobello-handyman",
    schema: buildPageSchema({
      title: "Handyman Portobello & Joppa Edinburgh (EH15) | Handyeco",
      description: "Trusted local handyman for Portobello, Joppa and Duddingston (EH15). Door trimming, silicone resealing, flat-pack assembly, TV wall mounting, and general home maintenance.",
      canonical: "https://handyeco.co.uk/areas/portobello-handyman",
      isAreaPage: true,
      areaName: "Portobello & Joppa",
      areaPostcodes: ["EH15", "Portobello", "Joppa", "Duddingston", "Craigentinny"],
      breadcrumbs,
      faqs,
      siteConfig
    })
  });

  const whatsappLink = `https://wa.me/${siteConfig.whatsappNumber || '447760696723'}?text=Hi%20Ekrem,%20I'm%20looking%20for%20a%20handyman%20in%20Portobello%20/%20Joppa%20(EH15).`;

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
          <span className="text-blue-600 font-semibold">Portobello &amp; Joppa (EH15)</span>
        </nav>

        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 blur-3xl pointer-events-none rounded-full" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-bold border border-blue-800 mb-4">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Local Service in EH15: Portobello, Joppa &amp; Duddingston</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
              Reliable Local Handyman in Portobello &amp; Joppa
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              From seaside terraces and Victorian flats on the High Street to family homes around Duddingston. I take on the home repairs you keep meaning to get to: sticking doors, fresh silicone, flat-pack assembly, and secure wall mounting.
            </p>

            {/* Quick Benefits Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                <span className="font-semibold">5.0 Star ({siteConfig.googleReviewCount || 87}+ Google Reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">Zero Call-Out Fee in EH15</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-semibold">Direct WhatsApp Quotes</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-semibold">EH15 Coastal Specialist</span>
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
                <span>WhatsApp Ekrem for a Portobello Quote</span>
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

        {/* Local Area Content */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-4">
              Practical Solutions for Seaside &amp; Period Properties
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Portobello properties have real character, but coastal weather can be tough on sealants, door timbers, and external fixtures. I arrive with professional cordless tools and trade materials so every fix lasts.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-sm text-slate-900 block mb-1">Timber Door Planing &amp; Trimming</span>
                <span className="text-xs text-slate-500">Precision rail saw trimming so swollen timber doors glide easily over carpets.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-sm text-slate-900 block mb-1">Bathroom &amp; Kitchen Resealing</span>
                <span className="text-xs text-slate-500">Thorough removal of mildewed mastic, anti-mould sanitising, and a tight waterproof seal.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-sm text-slate-900 block mb-1">Curtain Poles &amp; Blinds Fitting</span>
                <span className="text-xs text-slate-500">Laser-aligned fixings securely anchored into tough stone bay window lintels.</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900">Portobello &amp; Joppa FAQs</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Frequently asked questions from EH15 homeowners and tenants</p>
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
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 shrink-0 text-blue-600" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
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

        {/* Related Services Internal Links for SEO */}
        <RelatedServicesLinks currentPath="/areas/portobello-handyman" />

        <div id="quote-form">
          <QuoteForm hideFaq={true} />
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
