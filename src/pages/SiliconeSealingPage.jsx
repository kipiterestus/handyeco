import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, Star, ShieldCheck, Clock, MapPin, 
  MessageSquare, ArrowRight, Sparkles, Droplets, 
  ChevronDown, ChevronUp, ShieldAlert, Sparkle, Wrench
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';
import QuoteForm from '../components/QuoteForm';
import { useContent } from '../context/ContentContext';
import { BUSINESS_INFO } from '../data/businessData';
import { usePageSeo } from '../hooks/usePageSeo';
import { handleInternalLinkClick } from '../utils/navigation';

export default function SiliconeSealingPage() {
  const { content } = useContent();
  const siteConfig = content.siteConfig || BUSINESS_INFO;
  const [openFaq, setOpenFaq] = useState(null);

  const pageSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Silicone Sealing & Bath/Shower Resealing Edinburgh",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Handyeco",
      "telephone": siteConfig.phone || BUSINESS_INFO.phone,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Edinburgh",
        "addressRegion": "City of Edinburgh",
        "addressCountry": "GB"
      }
    },
    "areaServed": "Edinburgh and Lothians",
    "description": "Professional bathroom and kitchen silicone sealing in Edinburgh. Removal of black mould, anti-fungal sanitisation, and sanitary grade waterproof sealant.",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "GBP",
      "price": "65.00",
      "priceValidUntil": "2027-12-31"
    }
  }), [siteConfig.phone]);

  usePageSeo({
    title: "Bathroom & Shower Silicone Sealing Edinburgh | Handyeco",
    description: "Expert bath & shower silicone sealant replacement in Edinburgh. Stop leaks, eliminate black mould with sanitary anti-fungal sealant. Fixed price from £65!",
    canonical: "https://handyeco.co.uk/services/silicone-sealing-edinburgh",
    schema: pageSchema
  });

  const sealingServices = [
    {
      title: "Shower Trays & Enclosures",
      desc: "Complete stripping of leaking or mouldy silicone around shower trays and glass screen profiles, preventing costly subfloor water damage."
    },
    {
      title: "Bathtubs & Shower Over Baths",
      desc: "Removal of peeling sealant, anti-mould chemical treatment of joints, and precise sanitary bead application weighted to prevent future gaps."
    },
    {
      title: "Kitchen Worktops & Sinks",
      desc: "Waterproof sealing between kitchen stone/laminate worktops, upstands, tiles, and under-mount sinks to stop moisture ingress and swelling."
    },
    {
      title: "Wash Basins & Vanity Units",
      desc: "Crisp, razor-sharp silicone lines around bathroom vanity basins, splashbacks, and toilet base interfaces for a clean hotel finish."
    },
    {
      title: "External Window & Door Draft Sealing",
      desc: "Flexible weatherproof perimeter mastic sealing around window frames and external doors to stop drafts and rain penetration in Edinburgh weather."
    },
    {
      title: "Tenement Landlord Pre-Letting Reseals",
      desc: "Fast-turnaround bathroom resealing for letting agencies and landlords between tenancies to pass inspections and protect deposits."
    }
  ];

  const faqs = [
    {
      q: "Why does silicone go black and mouldy in Edinburgh flats?",
      a: "Edinburgh's high humidity and older tenement ventilation mean moisture lingers on surfaces. Once standard silicone degrades or traps soap scum, black mould (Aspergillus) feeds on the sealant from behind. Wiping it with bleach will not fix it because the fungal spores penetrate the core of the silicone. Complete removal and chemical sanitisation are necessary."
    },
    {
      q: "What is your process for resealing a bath or shower?",
      a: "We never 'seal over' old silicone. First, we 100% excise the old sealant using precision mechanical blades. Second, we use professional silicone remover solvent and an anti-fungal alcohol wipe to kill remaining spores. Third, we thoroughly dry the joint. Finally, we tool a smooth, concave bead of premium high-modulus sanitary silicone (such as BT1 or Dow Corning 785+) with zero voids."
    },
    {
      q: "How long before I can use the shower or bath after resealing?",
      a: "The premium sanitary silicone we use skins over within 20 minutes, but requires 12 to 24 hours of total curing time before direct exposure to running hot water. We advise booking appointments in the morning or early afternoon so you can shower the next day."
    },
    {
      q: "How much does silicone resealing cost in Edinburgh?",
      a: "Our resealing services start from our standard minimum booking of £65. A typical bath or shower tray reseal (including complete old removal and sanitisation) is agreed as a fixed price upfront. Send us a quick photo on WhatsApp for an instant exact quote."
    }
  ];

  const whatsappLink = `https://wa.me/${siteConfig.whatsappNumber || '447760696723'}?text=Hi%20Ekrem,%20I'm%20looking%20for%20a%20quote%20for%20silicone%20resealing%20in%20Edinburgh.`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-slate-500 flex items-center gap-2">
          <a href="/" onClick={(e) => handleInternalLinkClick(e, '/')} className="hover:text-blue-600 transition-colors">Home</a>
          <span>/</span>
          <span className="text-slate-700 font-medium">Services</span>
          <span>/</span>
          <span className="text-blue-600 font-semibold">Silicone Sealing Edinburgh</span>
        </nav>

        {/* Hero */}
        <section className="bg-slate-900 text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/15 blur-3xl pointer-events-none rounded-full" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-bold border border-cyan-800 mb-4">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>Anti-Mould Sanitary Sealing Specialists</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
              Bathroom &amp; Shower Silicone Sealing in Edinburgh
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Stop costly subfloor water leaks and banish unsightly black mould forever. Complete removal, chemical sanitisation, and razor-sharp sanitary silicone sealing.
            </p>

            {/* Quick Benefits Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                <span className="font-semibold">5.0 Star Rated (73+ Reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">Anti-Fungal BT1 / Dow Corning</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-semibold">Same-Week Booking Available</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-semibold">Edinburgh &amp; Lothians</span>
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
                <span>WhatsApp Photos for Fast Fixed Quote</span>
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

        {/* Services Grid */}
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Where We Apply Precision Silicone Sealant
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Clean, seamless waterproof seals that protect your property and look pristine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sealingServices.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-cyan-500 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 font-bold">
                  <Droplets className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4-Step Removal & Reseal Process */}
        <section className="py-12 bg-slate-100 border-y border-slate-200 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4">
                Our 4-Step Anti-Mould Sealing Standard
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Never accept a handyman who applies new silicone on top of old sealant. Within weeks, the mould will resurface and moisture will break the bond. Here is our professional protocol:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-7 h-7 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-black mb-2">1</span>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 block mb-1">100% Mechanical Strip</span>
                  <span className="text-xs text-slate-500 leading-relaxed">Old sealant completely removed down to clean tile &amp; acrylic.</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-7 h-7 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-black mb-2">2</span>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 block mb-1">Anti-Fungal Disinfection</span>
                  <span className="text-xs text-slate-500 leading-relaxed">Joint treated with solvent to destroy microscopic mould roots.</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-7 h-7 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-black mb-2">3</span>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 block mb-1">Sanitary Grade Silicone</span>
                  <span className="text-xs text-slate-500 leading-relaxed">Application of premium anti-mould, high-movement silicone.</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-7 h-7 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-black mb-2">4</span>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 block mb-1">Concave Tooling</span>
                  <span className="text-xs text-slate-500 leading-relaxed">Smooth profile tooling with no edges for water or soap to pool.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Guide */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="bg-gradient-to-br from-slate-900 to-cyan-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Upfront &amp; Fixed Pricing</span>
              <h2 className="text-2xl sm:text-3xl font-black mt-1 mb-4">How Much Does Resealing Cost?</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                We provide guaranteed fixed quotes that cover all materials, silicone removal, chemical treatment, and application.
              </p>
              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-cyan-400">From £65</span>
                <span className="text-xs sm:text-sm text-slate-400">Standard single bath or shower tray reseal (complete removal &amp; materials included)</span>
              </div>
              <div className="mt-6">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-transform active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send WhatsApp Photos for Quote</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Answers regarding silicone replacement, drying times, and leak prevention</p>
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
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-bold text-slate-900 hover:text-cyan-600 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 shrink-0 text-cyan-600" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
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
          <QuoteForm preselectedService="Silicone & Sealing" />
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
