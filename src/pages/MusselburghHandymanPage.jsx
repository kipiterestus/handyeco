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

export default function MusselburghHandymanPage() {
  const { content } = useContent();
  const siteConfig = content.siteConfig || BUSINESS_INFO;
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "Do you charge extra travel fees to come out to Musselburgh or East Lothian?",
      a: "No extra fees at all. Musselburgh, Fisherrow, Wallyford, and Inveresk (EH21) sit right along my daily route. You get the same transparent pricing and £65 minimum booking as central Edinburgh, with zero hidden travel charges."
    },
    {
      q: "What types of jobs do you most commonly handle in Musselburgh?",
      a: "A lot of garden gate adjustments, replacing broken latches and hinges, building flat-pack wardrobes and garden sheds, resealing family bathrooms, and wall-mounting TVs into brick or plasterboard partitions."
    },
    {
      q: "Can you fix garden gates and timber fences that drag on the ground?",
      a: "Yes. Timber posts settle and latches slip over winter. I re-align sagging gate frames, install heavy-duty galvanised hinges, brace the timber structure, and set new ground catches so your gate latches shut cleanly."
    }
  ];

  const breadcrumbs = [
    { name: "Home", url: "https://handyeco.co.uk/" },
    { name: "Areas", url: "https://handyeco.co.uk/#areas" },
    { name: "Handyman Musselburgh & East Lothian (EH21)", url: "https://handyeco.co.uk/areas/musselburgh-handyman" }
  ];

  usePageSeo({
    title: "Handyman Musselburgh & East Lothian (EH21) | Handyeco",
    description: "Friendly, reliable local handyman for Musselburgh, Fisherrow, Wallyford & EH21. Gate repairs, flat-pack assembly, TV mounting, silicone sealing. No call-out fee.",
    canonical: "https://handyeco.co.uk/areas/musselburgh-handyman",
    schema: buildPageSchema({
      title: "Handyman Musselburgh & East Lothian (EH21) | Handyeco",
      description: "Trusted local handyman across Musselburgh, Fisherrow, Wallyford and Inveresk (EH21). Garden gate repairs, furniture assembly, TV wall mounting, and general home repairs.",
      canonical: "https://handyeco.co.uk/areas/musselburgh-handyman",
      isAreaPage: true,
      areaName: "Musselburgh & East Lothian",
      areaPostcodes: ["EH21", "Musselburgh", "Fisherrow", "Wallyford", "Inveresk", "East Lothian"],
      breadcrumbs,
      faqs,
      siteConfig
    })
  });

  const whatsappLink = `https://wa.me/${siteConfig.whatsappNumber || '447760696723'}?text=Hi%20Ekrem,%20I'm%20looking%20for%20a%20handyman%20in%20Musselburgh%20(EH21).`;

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
          <span className="text-blue-600 font-semibold">Musselburgh &amp; East Lothian (EH21)</span>
        </nav>

        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 blur-3xl pointer-events-none rounded-full" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-bold border border-blue-800 mb-4">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Local Service: Musselburgh, Fisherrow, Wallyford &amp; Inveresk</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
              Friendly, Experienced Handyman in Musselburgh &amp; East Lothian
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Straightforward, tidy home repairs without the hassle of unreturned phone calls. I help homeowners across Musselburgh with furniture assembly, hanging jobs, gate fixes, and bathroom mastic.
            </p>

            {/* Quick Benefits Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                <span className="font-semibold">5.0 Star ({siteConfig.googleReviewCount || 87}+ Google Reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">Zero Call-Out Fee in EH21</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-semibold">Fast WhatsApp Quotes</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-semibold">Musselburgh &amp; Lothian Base</span>
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
                <span>WhatsApp Ekrem for a Musselburgh Quote</span>
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
              Quality Maintenance for Modern Developments &amp; Period Cottages
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Whether you live in a new-build near Wallyford station or a traditional stone property in Fisherrow, I treat your home with care, lay down floor protection, and always clean up before leaving.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-sm text-slate-900 block mb-1">Garden Gates &amp; Fence Latches</span>
                <span className="text-xs text-slate-500">Re-hanging dragging gates, fitting new barrel bolts, and securing loose boundary boards.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-sm text-slate-900 block mb-1">Flat-Pack Furniture Assembly</span>
                <span className="text-xs text-slate-500">Wardrobes, desks, chest of drawers, and storage beds assembled cleanly and tethered safely.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-sm text-slate-900 block mb-1">TV &amp; Heavy Mirror Wall Mounting</span>
                <span className="text-xs text-slate-500">Stud detection in modern plasterboard walls and heavy-duty anchors into brick chimneys.</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900">Musselburgh &amp; East Lothian FAQs</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Helpful answers for EH21 clients</p>
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
        <RelatedServicesLinks currentPath="/areas/musselburgh-handyman" />

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
