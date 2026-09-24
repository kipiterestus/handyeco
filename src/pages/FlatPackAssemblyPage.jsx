import React, { useState } from 'react';
import { 
  CheckCircle2, Star, ShieldCheck, Clock, MapPin, 
  MessageSquare, ArrowRight, Sparkles, Hammer, 
  ChevronDown, ChevronUp, PackageCheck, Wrench, ThumbsUp
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';
import QuoteForm from '../components/QuoteForm';
import { useContent } from '../context/ContentContext';
import { BUSINESS_INFO } from '../data/businessData';
import { usePageSeo } from '../hooks/usePageSeo';
import { handleInternalLinkClick } from '../utils/navigation';

export default function FlatPackAssemblyPage() {
  const { content } = useContent();
  const siteConfig = content.siteConfig || BUSINESS_INFO;
  const [openFaq, setOpenFaq] = useState(null);

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Flat-Pack & IKEA Furniture Assembly Edinburgh",
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
    "description": "Professional assembly of IKEA PAX wardrobes, sliding doors, bed frames, and flat-pack furniture across Edinburgh. Fixed upfront quotes, £65 minimum.",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "GBP",
      "price": "65.00",
      "priceValidUntil": "2027-12-31"
    }
  };

  usePageSeo({
    title: "IKEA & Flat Pack Furniture Assembly Edinburgh | Handyeco",
    description: "Expert flat pack & IKEA PAX wardrobe assembly in Edinburgh. Stress-free, laser-levelled, fixed pricing from £65 with zero call-out fee. WhatsApp now!",
    canonical: "https://handyeco.co.uk/services/flat-pack-assembly-edinburgh",
    schema: pageSchema
  });

  const assemblyTypes = [
    {
      title: "IKEA PAX Wardrobes & Sliding Doors",
      desc: "Specialist assembly of complex PAX frames, sliding mirrored doors, soft-close hinges, internal KOMPLEMENT drawers, pull-out shoe racks, and LED lighting."
    },
    {
      title: "Beds, Divans & Ottoman Gas-Lift Storage",
      desc: "Secure building of king/double bed frames, complex hydraulic Ottoman lift mechanisms, bunk beds, and children's cabin beds with zero squeaks."
    },
    {
      title: "Bookcases, Sideboards & Wall Units",
      desc: "Precise assembly of IKEA BILLY, KALLAX, BESTÅ TV units, and dining sideboards, including safe anchoring into historic Edinburgh tenement walls."
    },
    {
      title: "Dining Sets, Tables & Chairs",
      desc: "Sturdy construction of extendable dining tables and matching chairs, ensuring level legs and perfectly tightened structural bolts."
    },
    {
      title: "Home Office Desks & Commercial Furniture",
      desc: "Ergonomic sit-stand motorised desks, executive workstations, filing cabinets, and multi-desk office setups across Edinburgh."
    },
    {
      title: "Non-IKEA Flat-Packs (Argos, Wayfair, Next)",
      desc: "Experience building furniture from Next Home, Wayfair, John Lewis, Dunelm, Dwell, and Amazon with all missing hardware problems solved."
    }
  ];

  const faqs = [
    {
      q: "How much does flat-pack assembly cost in Edinburgh?",
      a: "Our jobs start from our standard minimum booking of £65 (which covers small items like bedside tables or a chest of drawers). For larger jobs like multi-door IKEA PAX wardrobes, we provide a guaranteed fixed-price quote upfront when you send us the IKEA item links or pictures via WhatsApp."
    },
    {
      q: "Do you secure tall wardrobes into Edinburgh tenement stone walls?",
      a: "Yes! High tenement ceilings and uneven floors are very common in Edinburgh. We carry heavy-duty Fischer DuoPower anchors and specialized masonry drill bits to securely fasten all tall wardrobes and bookcases to the wall, preventing tipping."
    },
    {
      q: "What if screws or parts are missing from my flat-pack box?",
      a: "Don't worry. We carry a comprehensive mobile inventory of spare metric bolts, wood screws, cam-lock fittings, dowels, and shelf pins. We can almost always solve missing hardware on the spot without delaying the build."
    },
    {
      q: "Do you clear away the cardboard packaging?",
      a: "We neatly flatten and bundle all cardboard and packaging so you can easily put it into your building's recycling bin or council recycling point."
    },
    {
      q: "Can you dismantle furniture before I move flat?",
      a: "Yes. We frequently help tenants and home buyers in Edinburgh dismantle large wardrobes and bed frames before a move and re-assemble them properly at their new property."
    }
  ];

  const whatsappLink = `https://wa.me/${siteConfig.whatsappNumber || '447760696723'}?text=Hi%20Ekrem,%20I'm%20looking%20for%20a%20quote%20for%20flat%20pack%20furniture%20assembly%20in%20Edinburgh.`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-slate-500 flex items-center gap-2">
          <a href="/" onClick={(e) => handleInternalLinkClick(e, '/')} className="hover:text-blue-600 transition-colors">Home</a>
          <span>/</span>
          <span className="text-slate-700 font-medium">Services</span>
          <span>/</span>
          <span className="text-blue-600 font-semibold">Flat-Pack Furniture Assembly Edinburgh</span>
        </nav>

        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 blur-3xl pointer-events-none rounded-full" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-bold border border-blue-800 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Edinburgh's Trusted IKEA &amp; Flat-Pack Specialists</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
              Professional Flat-Pack &amp; IKEA Furniture Assembly in Edinburgh
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Eliminate the frustration of instruction manuals and missing bolts. We assemble IKEA PAX wardrobes, beds, desks, and all flat-pack brands quickly, cleanly, and rock-solid.
            </p>

            {/* Quick Benefits Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                <span className="font-semibold">5.0 Star Rated (78+ Reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">No Call-Out Fee • From £65</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-semibold">15–30 Min WhatsApp Reply</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-semibold">All Edinburgh (EH1–EH17)</span>
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
                <span>Send WhatsApp Photos for Instant Quote</span>
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

        {/* What We Assemble Grid */}
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Complete Flat-Pack Assembly Services
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              From single items to complete home fit-outs, we assemble all furniture brands with professional precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assemblyTypes.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 font-bold">
                  <PackageCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The Edinburgh Tenement Advantage */}
        <section className="py-12 bg-slate-100 border-y border-slate-200 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4">
                Why Edinburgh Furniture Assembly Needs a Tenement Specialist
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Edinburgh's traditional tenements present unique challenges: 3-metre high ceilings, unlevel historic pine flooring, and thick crumbling sandstone or hollow lathe-and-plaster walls. A flat-pack wardrobe assembled without proper laser levelling will have sticking doors and warped frames within months.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 block">Torque-Controlled Drivers</span>
                    <span className="text-xs text-slate-500">Zero stripped threads or blown particle board edges.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 block">Tenement Wall Anchors</span>
                    <span className="text-xs text-slate-500">Heavy-duty Fischer fixings to secure tall units to stone.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 block">Laser Door Alignment</span>
                    <span className="text-xs text-slate-500">Smooth sliding doors and flush hinge alignment guaranteed.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Guide */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Simple &amp; Transparent</span>
              <h2 className="text-2xl sm:text-3xl font-black mt-1 mb-4">How Much Does Assembly Cost?</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                We don't charge hourly rates that drag out the clock. We provide a **fixed upfront price** so you know exactly what you will pay before we arrive.
              </p>
              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-emerald-400">£65</span>
                <span className="text-xs sm:text-sm text-slate-400">Minimum job booking (Covers 1–2 smaller items or initial work)</span>
              </div>
              <p className="mt-4 text-xs text-slate-400">
                To get an instant exact price for your specific items, simply WhatsApp us the product links (e.g. IKEA PAX configuration) or photos of the boxes!
              </p>
              <div className="mt-6">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-transform active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Get Fixed Price via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Everything you need to know about our Edinburgh furniture assembly service</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
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
          <QuoteForm preselectedService="Flat Pack Assembly" />
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
