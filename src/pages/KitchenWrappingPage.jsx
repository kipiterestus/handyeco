import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, Star, ShieldCheck, Clock, MapPin, 
  MessageSquare, ArrowRight, Sparkles, Layers, 
  ChevronDown, ChevronUp, Sparkle, RefreshCw
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';
import QuoteForm from '../components/QuoteForm';
import { useContent } from '../context/ContentContext';
import { BUSINESS_INFO } from '../data/businessData';
import { usePageSeo } from '../hooks/usePageSeo';
import { handleInternalLinkClick } from '../utils/navigation';

export default function KitchenWrappingPage() {
  const { content } = useContent();
  const siteConfig = content.siteConfig || BUSINESS_INFO;
  const [openFaq, setOpenFaq] = useState(null);

  const pageSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Kitchen Vinyl Wrapping Edinburgh",
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
    "description": "Architectural vinyl wrap transformations for kitchen cabinets, doors, and worktops across Edinburgh. Modern finishes without the cost of a new kitchen.",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "GBP",
      "price": "65.00",
      "priceValidUntil": "2027-12-31"
    }
  }), [siteConfig.phone]);

  usePageSeo({
    title: "Kitchen Vinyl Wrapping Edinburgh | Cupboard Makeovers | Handyeco",
    description: "Modernise your kitchen for a fraction of replacement cost! Architectural vinyl wrapping for kitchen cabinets & doors in Edinburgh. Upfront quotes, 5-star finish.",
    canonical: "https://handyeco.co.uk/services/kitchen-vinyl-wrapping-edinburgh",
    schema: pageSchema
  });

  const wrapFeatures = [
    {
      title: "Cabinet & Drawer Fronts",
      desc: "Transform dated melamine, gloss, or orange oak doors with high-grade architectural vinyl wraps in modern matte anthracite, sage green, or navy."
    },
    {
      title: "End Panels, Pelmets & Cornices",
      desc: "Complete seamless colour matching across visible kitchen side panels, extractor housings, plinths, and kickboards for an authentic bespoke look."
    },
    {
      title: "Laminate Worktop Wrapping",
      desc: "Heavy-duty heat and scratch-resistant realistic marble, concrete, or butcher-block oak vinyl films applied directly over tired worktops."
    },
    {
      title: "Handle Upgrades & Adjustments",
      desc: "Replacing old brass knobs with modern brushed brass, matte black T-bars, or recessed cups, combined with soft-close hinge realignment."
    },
    {
      title: "Tenement Landlord Kitchen Revamps",
      desc: "A durable cosmetic refresh that increases rental yield by £150–£300/month without spending £8,000+ on a full kitchen tear-out."
    },
    {
      title: "Commercial & Office Kitchenettes",
      desc: "Durable wrap application for Edinburgh office staff kitchens and breakout areas with zero disruption to daily working hours."
    }
  ];

  const faqs = [
    {
      q: "How durable is kitchen architectural vinyl wrap?",
      a: "Commercial architectural films (such as Cover Styl' and 3M DI-NOC) are engineered specifically for high-touch domestic and commercial use. They are fully waterproof, heat resistant up to 110°C, and resistant to everyday kitchen spills and cleaning agents. With normal care, wraps easily last 7 to 10 years without peeling."
    },
    {
      q: "Can the wrap peel off near the oven or kettle?",
      a: "No. We apply heat-activated primer along all perimeter edges and wrap around the back of the doors with thermal shrinking tools. This creates an airtight seal that steam and heat cannot penetrate."
    },
    {
      q: "How much does kitchen wrapping save compared to a new kitchen?",
      a: "A new kitchen in Edinburgh costs £7,000 to £15,000+ and puts your home out of action for 2 to 3 weeks. Vinyl wrapping typically saves 70% to 80% of that cost, and is completed cleanly in just 1 to 2 days without ripping out plumbing or tiles."
    },
    {
      q: "How do I get a quote for my kitchen?",
      a: "Simply take 3 or 4 photos of your current kitchen showing all the cupboards and worktops, and send them to us on WhatsApp. We will count the doors/drawers and send you a fixed-price estimate within 30 minutes!"
    }
  ];

  const whatsappLink = `https://wa.me/${siteConfig.whatsappNumber || '447760696723'}?text=Hi%20Ekrem,%20I'm%20looking%20for%20a%20quote%20for%20kitchen%20vinyl%20wrapping%20in%20Edinburgh.`;

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
          <span className="text-blue-600 font-semibold">Kitchen Vinyl Wrapping Edinburgh</span>
        </nav>

        {/* Hero */}
        <section className="bg-slate-900 text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/15 blur-3xl pointer-events-none rounded-full" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-bold border border-emerald-800 mb-4">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Architectural Kitchen Transformations</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
              Kitchen Vinyl Wrapping in Edinburgh
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Transform your dated kitchen cabinets and worktops into a sleek designer showroom finish at up to 75% less cost than replacement. Zero mess, 1–2 day completion.
            </p>

            {/* Quick Benefits Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                <span className="font-semibold">5.0 Star Rated (78+ Reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">Commercial Architectural Film</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-semibold">Completed in 1–2 Days</span>
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
                <span>WhatsApp Kitchen Photos for Fast Quote</span>
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

        {/* Features Grid */}
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              What Can Be Wrapped in Your Kitchen?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Complete seamless cabinet, drawer, and worktop wrapping with edge thermal profiling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wrapFeatures.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Guide */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">70% Less Than Replacement</span>
              <h2 className="text-2xl sm:text-3xl font-black mt-1 mb-4">Kitchen Wrapping Pricing</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Prices depend on the number of doors and drawers. We provide a full fixed quote upfront so you can compare directly with kitchen replacement costs.
              </p>
              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-emerald-400">From £65</span>
                <span className="text-xs sm:text-sm text-slate-400">Starting minimum booking (Covers individual door/end-panel repair or small vinyl wrap)</span>
              </div>
              <div className="mt-6">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-transform active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Photos on WhatsApp for Quote</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Answers regarding vinyl finishes, heat resistance, and cleaning</p>
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
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-bold text-slate-900 hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 shrink-0 text-emerald-600" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
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
          <QuoteForm preselectedService="Kitchen Vinyl Wrap" />
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
