import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, Star, ShieldCheck, Clock, MapPin, 
  MessageSquare, ArrowRight, Sparkles, Paintbrush, 
  ChevronDown, ChevronUp, Palette, Sparkle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';
import QuoteForm from '../components/QuoteForm';
import { useContent } from '../context/ContentContext';
import { BUSINESS_INFO } from '../data/businessData';
import { usePageSeo } from '../hooks/usePageSeo';
import { handleInternalLinkClick } from '../utils/navigation';

export default function PaintingDecoratingPage() {
  const { content } = useContent();
  const siteConfig = content.siteConfig || BUSINESS_INFO;
  const [openFaq, setOpenFaq] = useState(null);

  const pageSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Interior Painting & Decorating Edinburgh",
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
    "description": "Clean, high-quality interior painting, touch-ups, end-of-tenancy repaints, and plaster patch repairs across Edinburgh. Fixed quotes, £65 minimum.",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "GBP",
      "price": "65.00",
      "priceValidUntil": "2027-12-31"
    }
  }), [siteConfig.phone]);

  usePageSeo({
    title: "Interior Painting & Decorating Edinburgh | Handyeco",
    description: "Professional interior painting, end-of-tenancy touch-ups & plaster patch repairs in Edinburgh. Sharp lines, zero mess, fixed pricing from £65. WhatsApp now!",
    canonical: "https://handyeco.co.uk/services/painting-decorating-edinburgh",
    schema: pageSchema
  });

  const paintingServices = [
    {
      title: "End-of-Tenancy & Landlord Refreshes",
      desc: "Fast, spotless whole-room repainting and scuff removal to guarantee tenants receive full deposit refunds and letting agents pass inventory checks."
    },
    {
      title: "Plaster Cracks & Hole Patch Repairs",
      desc: "Skim coating and blending settlement cracks, picture hook holes, and damaged plasterboard with seamless sanding before painting."
    },
    {
      title: "Woodwork, Doors & Skirting Boards",
      desc: "Satinwood and gloss painting of yellowing skirting boards, door frames, architraves, internal pine doors, and window sills."
    },
    {
      title: "Water Stain & Mould Stain Blocking",
      desc: "Application of specialized stain-blocking primers (Zinsser Cover Stain / B-I-N) over water leaks or smoke marks to permanently prevent bleed-through."
    },
    {
      title: "Single Feature Walls & Full Rooms",
      desc: "Crisp laser-tape cut-ins between walls and ceilings, modern designer accent walls (Farrow & Ball, Little Greene, Dulux Heritage)."
    },
    {
      title: "Kitchen & Bathroom Mould-Resistant Painting",
      desc: "Applying durable, moisture-resistant washable paints (Dulux Easycare / Crown Clean Extreme) to bathrooms and kitchens prone to condensation."
    }
  ];

  const faqs = [
    {
      q: "Do I need to buy the paint, or do you supply it?",
      a: "Either way works! If you have a specific colour or brand already purchased (e.g. Dulux, Farrow & Ball), we can supply the labour and all prep materials (dust sheets, tape, rollers, brushes, fillers). Alternatively, we can supply trade-quality paint in your chosen colour code."
    },
    {
      q: "How do you protect my furniture and floors?",
      a: "Zero mess is our golden rule. We cover all flooring with heavy-duty cotton canvas drop sheets and mask all edges, sockets, switches, and woodwork with premium low-tack precision masking tape."
    },
    {
      q: "Can you touch up minor scuffs without painting the entire room?",
      a: "Yes, if you have the original leftover paint. For tenancies where wall paint has faded, we can paint just the affected wall corner-to-corner for a seamless finish without visible patches."
    },
    {
      q: "How much does painting cost in Edinburgh?",
      a: "Our painting services start from our £65 minimum booking (covering small touch-up jobs, patches, or a single door/frame). For bedrooms, living rooms, or full flats, simply send us photos or dimensions on WhatsApp for an exact fixed price quote."
    }
  ];

  const whatsappLink = `https://wa.me/${siteConfig.whatsappNumber || '447760696723'}?text=Hi%20Ekrem,%20I'm%20looking%20for%20a%20quote%20for%20interior%20painting%20in%20Edinburgh.`;

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
          <span className="text-blue-600 font-semibold">Painting &amp; Decorating Edinburgh</span>
        </nav>

        {/* Hero */}
        <section className="bg-slate-900 text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 blur-3xl pointer-events-none rounded-full" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 text-purple-300 text-xs font-bold border border-purple-800 mb-4">
              <Paintbrush className="w-3.5 h-3.5 text-purple-400" />
              <span>Clean &amp; Sharp Edinburgh Decorating</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
              Interior Painting &amp; Decorating in Edinburgh
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Sharp cut-in lines, meticulous preparation, and zero mess. High quality room repainting, end-of-tenancy refreshes, and woodwork glossing.
            </p>

            {/* Quick Benefits Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                <span className="font-semibold">5.0 Star Rated (75+ Reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">From £65 • Full Dust Protection</span>
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
                <span>WhatsApp Photos for Fast Painting Estimate</span>
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
              Our Painting &amp; Decorating Capabilities
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Clean, professional decorating with thorough preparation and dust extraction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paintingServices.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-purple-500 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 font-bold">
                  <Paintbrush className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Guide */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="bg-gradient-to-br from-slate-900 to-purple-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Fixed Upfront Rates</span>
              <h2 className="text-2xl sm:text-3xl font-black mt-1 mb-4">Transparent Painting Prices</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                We agree an upfront fixed quote so you never face unexpected extras. Complete surface protection and clean-up included.
              </p>
              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-purple-400">From £65</span>
                <span className="text-xs sm:text-sm text-slate-400">Minimum job booking (Covers touch-ups, patch repairs, or woodwork items)</span>
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
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Answers about paint brands, dust sheets, and drying times</p>
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
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-bold text-slate-900 hover:text-purple-600 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 shrink-0 text-purple-600" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
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
          <QuoteForm preselectedService="Painting & Decorating" />
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
