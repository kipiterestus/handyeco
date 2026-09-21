import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, Star, ShieldCheck, Clock, MapPin, 
  MessageSquare, ArrowRight, Sparkles, Wrench, 
  ChevronDown, ChevronUp, Home, Hammer, Ruler
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';
import QuoteForm from '../components/QuoteForm';
import { useContent } from '../context/ContentContext';
import { BUSINESS_INFO } from '../data/businessData';
import { usePageSeo } from '../hooks/usePageSeo';
import { handleInternalLinkClick } from '../utils/navigation';

export default function TenementRepairsPage() {
  const { content } = useContent();
  const siteConfig = content.siteConfig || BUSINESS_INFO;
  const [openFaq, setOpenFaq] = useState(null);

  const pageSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Tenement Repairs & Odd Jobs Edinburgh",
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
    "description": "Specialist Edinburgh tenement repairs, internal door trimming after carpets, curtain pole fittings into masonry lintels, and general household maintenance.",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "GBP",
      "price": "65.00",
      "priceValidUntil": "2027-12-31"
    }
  }), [siteConfig.phone]);

  usePageSeo({
    title: "Tenement Repairs & Odd Jobs Edinburgh | Handyeco",
    description: "Specialist handyman for Edinburgh tenement repairs: door trimming after new carpet, curtain pole & blind installation into stone, locks & odd jobs from £65!",
    canonical: "https://handyeco.co.uk/services/tenement-repairs-edinburgh",
    schema: pageSchema
  });

  const tenementServices = [
    {
      title: "Door Trimming After New Carpets",
      desc: "Precision circular saw planing and trimming of heavy Victorian tenement pine doors so they swing freely over newly installed thick underlay and deep pile carpets."
    },
    {
      title: "Curtain Poles & Blinds into Stone Lintels",
      desc: "Rock-solid installation of heavy eyelet curtain poles, Roman blinds, and Venetian tracks into historic masonry lintels and hollow plaster recesses without crumbling."
    },
    {
      title: "Door Locks, Latches & Handles",
      desc: "Repairing or replacing mortice sashlocks, night latches (Yale style), modern tubular latches, door closers, and brass handles that have worked loose over decades."
    },
    {
      title: "High Tenement Ceiling Hanging",
      desc: "Safe ladder mounting of heavy chandeliers, pendant lights, ornate hallway mirrors, ceiling-mounted clothes airers (pulley airers), and smoke alarms up to 3.2m."
    },
    {
      title: "Sash Window Draught Exclusion & Catches",
      desc: "Fitting brush seals, silicone draught gaskets, brass Brighton fasteners, and sash cords to eliminate rattles and Edinburgh winter drafts without damaging frames."
    },
    {
      title: "Multi-Job 'Punch List' Sessions",
      desc: "Book a dedicated 2 to 4 hour handyman session to complete all your lingering household jobs in a single visit: shelving, leaky taps, squeaky floorboards, and picture hanging."
    }
  ];

  const faqs = [
    {
      q: "Can you trim heavy Edinburgh tenement doors without taking them outside?",
      a: "Yes! We use professional cordless plunge saws with integrated guide rails and HEPA dust extraction. We carefully remove the door from its brass hinges, trim the bottom edge with millimeter accuracy, bevel the edges to prevent snagging on the carpet, and re-hang the door perfectly without making a mess."
    },
    {
      q: "Why do curtain poles pull out of tenement walls?",
      a: "Tenement window surrounds typically consist of hard stone lintels or lath and plaster with deep voids. DIY plastic plugs cannot bridge the gap between the plaster and the stone. We use extended length SDS masonry bits and Fischer DuoPower anchors that grip directly into the structural sandstone lintel."
    },
    {
      q: "Can I book you for several small odd jobs in one visit?",
      a: "Absolutely! Most of our Edinburgh clients compile a list of 4 to 8 small tasks (e.g. reseal bath, trim 2 doors, hang 3 pictures, fit a curtain pole). We work through the entire punch-list efficiently in one morning or afternoon."
    },
    {
      q: "How does your pricing work for tenement repairs?",
      a: "Our jobs start from our standard £65 minimum booking (covering small repairs or initial work). We provide fixed transparent quotes upfront via WhatsApp photos or videos with zero hidden call-out fees."
    }
  ];

  const whatsappLink = `https://wa.me/${siteConfig.whatsappNumber || '447760696723'}?text=Hi%20Ekrem,%20I'm%20looking%20for%20a%20quote%20for%20tenement%20repairs%20in%20Edinburgh.`;

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
          <span className="text-blue-600 font-semibold">Tenement Repairs Edinburgh</span>
        </nav>

        {/* Hero */}
        <section className="bg-slate-900 text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/15 blur-3xl pointer-events-none rounded-full" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 text-amber-300 text-xs font-bold border border-amber-800 mb-4">
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>Specialist Edinburgh Tenement Handyman</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
              Tenement Repairs &amp; Odd Jobs Handyman in Edinburgh
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              From doors sticking on new carpets to curtain poles pulling out of sandstone lintels, we solve traditional Edinburgh tenement quirks with expert tools and care.
            </p>

            {/* Quick Benefits Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                <span className="font-semibold">5.0 Star Rated (73+ Reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">From £65 • No Call-Out Fee</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-semibold">15–30 Min WhatsApp Reply</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-semibold">All Edinburgh EH1–EH17</span>
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
                <span>WhatsApp Your Job List for Quick Quote</span>
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
              Common Tenement Repairs We Tackle
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Expert solutions designed specifically for Edinburgh's Victorian and Georgian architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenementServices.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-amber-500 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 font-bold">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Guide */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="bg-gradient-to-br from-slate-900 to-amber-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Clear &amp; Simple</span>
              <h2 className="text-2xl sm:text-3xl font-black mt-1 mb-4">Tenement Repair Pricing</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Whether you have one sticky door or a list of ten lingering repairs, we quote a fixed price upfront with zero hidden charges.
              </p>
              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-amber-400">From £65</span>
                <span className="text-xs sm:text-sm text-slate-400">Minimum job booking (Covers initial repairs and small jobs)</span>
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
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Answers regarding Edinburgh tenement carpentry, fixings, and bookings</p>
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
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-bold text-slate-900 hover:text-amber-600 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 shrink-0 text-amber-600" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
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
          <QuoteForm preselectedService="Repairs & Odd Jobs" />
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
