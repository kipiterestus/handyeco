import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, Star, ShieldCheck, Clock, MapPin, 
  MessageSquare, ArrowRight, Sparkles, Trees, 
  ChevronDown, ChevronUp, Hammer, ShieldAlert, Wrench
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';
import QuoteForm from '../components/QuoteForm';
import { useContent } from '../context/ContentContext';
import { BUSINESS_INFO } from '../data/businessData';
import { usePageSeo } from '../hooks/usePageSeo';
import { handleInternalLinkClick } from '../utils/navigation';

export default function GardenFencingPage() {
  const { content } = useContent();
  const siteConfig = content.siteConfig || BUSINESS_INFO;
  const [openFaq, setOpenFaq] = useState(null);

  const pageSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Garden Gate & Fence Repairs Edinburgh",
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
    "description": "Professional timber garden gate and fence repairs in Edinburgh. Storm damage repair, rotten post replacement, spur installation, and new gate fitting.",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "GBP",
      "price": "65.00",
      "priceValidUntil": "2027-12-31"
    }
  }), [siteConfig.phone]);

  usePageSeo({
    title: "Garden Gate & Fence Repairs Edinburgh | Storm Damage | Handyeco",
    description: "Expert timber garden fence & gate repairs in Edinburgh. Fix storm damage, leaning fence posts with concrete spurs, new latches & gates. Fixed quote from £65!",
    canonical: "https://handyeco.co.uk/services/garden-gate-fencing-edinburgh",
    schema: pageSchema
  });

  const fencingServices = [
    {
      title: "Wind & Storm Damage Fence Repair",
      desc: "Replacing blown-down wooden lap panels, re-securing loose featheredge boards, and straightening leaning timber boundaries after Scottish coastal gales."
    },
    {
      title: "Broken or Rotten Post Replacement",
      desc: "Digging out snapped 3x3 or 4x4 rotten timber posts at ground level, setting new pressure-treated posts with fast-curing Postcrete, or installing bolt-down metal / concrete repair spurs."
    },
    {
      title: "Garden Gate Fitting & Realignment",
      desc: "Trimming dragging wooden gates, fitting heavy-duty tee hinges, Brenton padbolts, ring latches, and keyed security rim locks to keep pets and children safe."
    },
    {
      title: "Trellis & Privacy Screen Installation",
      desc: "Adding square or diamond timber trellis extensions onto existing walls and fences to increase garden privacy from neighbouring tenements."
    },
    {
      title: "Exterior Timber Weather Staining",
      desc: "Applying preservative wood stains (Cuprinol / Ronseal) to fences, sheds, and gates to shield against wet Edinburgh winters and rot."
    },
    {
      title: "Shed Door, Lock & Hasp Repairs",
      desc: "Re-hanging sagging timber garden shed doors, replacing corroded security padbolts, and re-felting leaking shed roofs before water causes rot."
    }
  ];

  const faqs = [
    {
      q: "Can you repair a leaning fence post without replacing the whole fence?",
      a: "Yes! In most cases, the fence panels are perfectly fine and only the post has rotted at ground level. We install concrete repair spurs or heavy gauge galvanized steel spurs bolted to the existing post and set in Postcrete. This saves hundreds of pounds compared to installing an entire new boundary."
    },
    {
      q: "How quickly can you attend after storm damage in Edinburgh?",
      a: "Following high winds in Edinburgh, we prioritize emergency fence stabilization to keep pets secure and prevent panels blowing into roads or neighboring gardens. We often attend within 24 to 48 hours."
    },
    {
      q: "What types of garden gates do you install?",
      a: "We fit standard pressure-treated timber tongue & groove gates, featheredge gates, and framed ledged & braced gates. We supply all heavy-duty galvanized outdoor ironmongery (hinges, drop bolts, and hasps)."
    },
    {
      q: "How much do fence and gate repairs cost?",
      a: "Our outdoor repairs start from our standard £65 minimum booking (covering small latch replacements or individual board re-securing). For post replacements or storm damage, send us 2 or 3 photos on WhatsApp for a clear fixed-price quote."
    }
  ];

  const whatsappLink = `https://wa.me/${siteConfig.whatsappNumber || '447760696723'}?text=Hi%20Ekrem,%20I'm%20looking%20for%20a%20quote%20for%20garden%20fence%20or%20gate%20repairs%20in%20Edinburgh.`;

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
          <span className="text-blue-600 font-semibold">Garden Gate &amp; Fence Repairs Edinburgh</span>
        </nav>

        {/* Hero */}
        <section className="bg-slate-900 text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/15 blur-3xl pointer-events-none rounded-full" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-bold border border-emerald-800 mb-4">
              <Trees className="w-3.5 h-3.5 text-emerald-400" />
              <span>Edinburgh Timber Fencing &amp; Storm Repairs</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
              Garden Gate &amp; Fence Repairs in Edinburgh
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Fast, sturdy timber fencing repairs across Edinburgh and Lothians. Storm damage fixes, rotten post replacements with concrete spurs, and custom garden gate fitting.
            </p>

            {/* Quick Benefits Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                <span className="font-semibold">5.0 Star Rated (75+ Reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">Pressure-Treated Timber &amp; Postcrete</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-semibold">Fast Storm Damage Response</span>
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
                <span>WhatsApp Fence Photos for Fast Quote</span>
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
              Outdoor Fencing &amp; Gate Solutions
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Reliable timber repairs to secure your garden, pets, and family.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fencingServices.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 font-bold">
                  <Hammer className="w-5 h-5" />
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
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Fixed Upfront Rates</span>
              <h2 className="text-2xl sm:text-3xl font-black mt-1 mb-4">Transparent Fence Repair Pricing</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                We assess the repair via WhatsApp photos and provide a fixed quote covering all posts, concrete, screws, and labour.
              </p>
              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-emerald-400">From £65</span>
                <span className="text-xs sm:text-sm text-slate-400">Minimum job booking (Covers gate adjustment, latch fitting, or loose panel re-securing)</span>
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
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Answers regarding timber posts, storm damage, and gate hardware</p>
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
          <QuoteForm preselectedService="Garden & Fencing" />
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
