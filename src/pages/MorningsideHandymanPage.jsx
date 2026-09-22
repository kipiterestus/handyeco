import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, Star, ShieldCheck, Clock, MapPin, 
  MessageSquare, ArrowRight, Sparkles, Home, 
  ChevronDown, ChevronUp, Wrench, ShieldAlert
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';
import QuoteForm from '../components/QuoteForm';
import { useContent } from '../context/ContentContext';
import { BUSINESS_INFO } from '../data/businessData';
import { usePageSeo } from '../hooks/usePageSeo';
import { handleInternalLinkClick } from '../utils/navigation';

export default function MorningsideHandymanPage() {
  const { content } = useContent();
  const siteConfig = content.siteConfig || BUSINESS_INFO;
  const [openFaq, setOpenFaq] = useState(null);

  const pageSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "HandymanService",
    "name": "Handyeco Morningside & Bruntsfield Handyman Services",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Handyeco",
      "telephone": siteConfig.phone || BUSINESS_INFO.phone,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Morningside, Edinburgh",
        "postalCode": "EH10",
        "addressCountry": "GB"
      }
    },
    "areaServed": ["Morningside EH10", "Bruntsfield EH10", "Merchiston EH10", "Greenhill EH10"],
    "description": "5-star handyman service in Morningside & Bruntsfield (EH10). Specialist in Victorian tenement repairs, IKEA PAX assembly, TV wall mounting into stone, and painting.",
    "priceRange": "£65 - £500"
  }), [siteConfig.phone]);

  usePageSeo({
    title: "Handyman Morningside & Bruntsfield (EH10) | 5-Star | Handyeco",
    description: "Trusted local handyman for Morningside & Bruntsfield EH10. Victorian tenement repairs, stone wall TV mounting, flat-pack assembly & resealing. From £65, no call-out fee!",
    canonical: "https://handyeco.co.uk/areas/morningside-handyman",
    schema: pageSchema
  });

  const faqs = [
    {
      q: "Do you charge travel or call-out fees to Morningside or Bruntsfield?",
      a: "No, never! Morningside and Bruntsfield (EH10) are directly in our core daily coverage area. We have zero call-out charges. Our pricing starts from our transparent £65 minimum booking."
    },
    {
      q: "Can you mount heavy items into Victorian stone walls in Morningside?",
      a: "Yes. Morningside's Victorian tenements and villas have solid sandstone walls and deep ceiling heights. We specialize in Fischer DuoPower masonry fixings for heavy 75\" TVs, ornate mirrors, and ceiling-hung clothes pulleys."
    },
    {
      q: "How fast can you attend a job in EH10?",
      a: "We regularly attend jobs in Morningside within 24 to 48 hours for urgent repairs (e.g. leaking shower seals, broken door latches). Average response time on WhatsApp is 15–30 minutes."
    }
  ];

  const whatsappLink = `https://wa.me/${siteConfig.whatsappNumber || '447760696723'}?text=Hi%20Ekrem,%20I'm%20looking%20for%20a%20handyman%20in%20Morningside%20EH10.`;

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
          <span className="text-blue-600 font-semibold">Morningside &amp; Bruntsfield (EH10)</span>
        </nav>

        {/* Hero */}
        <section className="bg-slate-900 text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 blur-3xl pointer-events-none rounded-full" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-bold border border-blue-800 mb-4">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Local Service in EH10: Morningside, Bruntsfield &amp; Merchiston</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
              Trusted 5-Star Handyman in Morningside &amp; Bruntsfield
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Specialist property maintenance for Morningside's historic Victorian tenements and villas. From stone wall TV mounting and IKEA PAX building to door trimming and bathroom resealing.
            </p>

            {/* Quick Benefits Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                <span className="font-semibold">5.0 Star Rated (75+ Reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">Zero Call-Out Fee in EH10</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-semibold">15–30 Min WhatsApp Reply</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-semibold">EH10 Postcode Specialist</span>
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
                <span>WhatsApp Ekrem for Morningside Quote</span>
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

        {/* Why Morningside Residents Choose Handyeco */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-4">
              Careful, Reliable Craftsmanship for Victorian Tenements
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Morningside and Bruntsfield homes feature tall decorative cornices, lathe-and-plaster partitions, and sandstone chimney breasts. Generic DIY solutions frequently fail on these period walls. Ekrem brings over a decade of hands-on expertise, heavy-duty German fixings, laser alignment tools, and total respect for your home.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-sm text-slate-900 block mb-1">Stone Wall TV &amp; Mirror Hanging</span>
                <span className="text-xs text-slate-500">Safe, laser-levelled mounting into 120-year-old sandstone.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-sm text-slate-900 block mb-1">IKEA PAX &amp; Furniture Assembly</span>
                <span className="text-xs text-slate-500">Fixed against walls to accommodate uneven historic pine floorboards.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-sm text-slate-900 block mb-1">Door Trimming &amp; Carpentry</span>
                <span className="text-xs text-slate-500">Trimming bottom of original doors so they clear deep pile carpets.</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900">Frequently Asked Questions for EH10</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Common queries from Morningside and Bruntsfield clients</p>
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
