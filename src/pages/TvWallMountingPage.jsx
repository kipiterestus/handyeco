import React, { useState } from 'react';
import { 
  CheckCircle2, Star, ShieldCheck, Clock, MapPin, 
  MessageSquare, ArrowRight, Sparkles, Tv, 
  ChevronDown, ChevronUp, Anchor, Compass, Wrench
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';
import QuoteForm from '../components/QuoteForm';
import { useContent } from '../context/ContentContext';
import { BUSINESS_INFO } from '../data/businessData';
import { usePageSeo } from '../hooks/usePageSeo';
import { handleInternalLinkClick } from '../utils/navigation';

export default function TvWallMountingPage() {
  const { content } = useContent();
  const siteConfig = content.siteConfig || BUSINESS_INFO;
  const [openFaq, setOpenFaq] = useState(null);

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "TV Wall Mounting into Stone & Plasterboard Walls Edinburgh",
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
    "description": "Professional TV wall mounting into historic Edinburgh sandstone tenement walls and stud partitions. Screens 32 to 85 inches, heavy mirrors and shelves.",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "GBP",
      "price": "65.00",
      "priceValidUntil": "2027-12-31"
    }
  };

  usePageSeo({
    title: "TV Wall Mounting Edinburgh into Stone Walls | Handyeco",
    description: "Professional TV wall mounting into Edinburgh tenement stone walls & stud partitions. Up to 85\" OLED/QLED, heavy mirrors. Fischer anchors included, from £65!",
    canonical: "https://handyeco.co.uk/services/tv-wall-mounting-edinburgh",
    schema: pageSchema
  });

  const mountTypes = [
    {
      title: "Full-Motion Articulating Brackets",
      desc: "Dual-arm swivel and extend brackets allowing you to pull your TV out and swivel it towards dining tables or open-plan kitchens."
    },
    {
      title: "Ultra-Slim Low-Profile Mounts",
      desc: "Sits your TV razor-thin against the wall for a minimalist artwork-like gallery finish. Perfect for living rooms and bedrooms."
    },
    {
      title: "Tilting Brackets (Anti-Glare)",
      desc: "Allows vertical downward angle adjustments (up to 15 degrees). Ideal when mounting higher up or above fireplaces to eliminate window glare."
    },
    {
      title: "Samsung 'The Frame' TV Mounting",
      desc: "Specialist installation of Samsung The Frame TVs with ultra-flush brackets and seamless One-Connect invisible optical cable routing."
    },
    {
      title: "Heavy Victorian Tenement Mirrors",
      desc: "Heavy antique gilt-wood and ornate hallway mirrors (up to 40kg) safely anchored into historic Edinburgh stone masonry."
    },
    {
      title: "Soundbars & Floating Media Shelves",
      desc: "Under-TV soundbar bracket mounting, floating media shelves, and neat cable trunking for a completely wire-free look."
    }
  ];

  const faqs = [
    {
      q: "Can you safely mount a large 75-inch TV into a Victorian sandstone tenement wall?",
      a: "Yes, this is our everyday specialty. Traditional Edinburgh stone walls crumble if ordinary DIY plastic wall plugs are used. We use SDS rotary hammer masonry drills and heavy-duty Fischer DuoPower / Fischer SX nylon expansion anchors with heavy gauge hex coach screws. Once installed, the bracket will easily support over 80kg."
    },
    {
      q: "Do I need to supply the bracket, or can you provide one?",
      a: "You can supply your own bracket (bought from Amazon, Currys, or Richer Sounds), or we can supply a premium heavy-duty tilt or full-motion bracket if you let us know your TV size in advance via WhatsApp."
    },
    {
      q: "What about stud partition walls and plasterboard?",
      a: "For modern apartments or stud partitions, we use professional digital wall scanners to locate timber studs. Where studs are not conveniently located, we use industrial heavy-duty hollow-wall toggle anchors (GripIt or Fischer Duotec) that grip behind the plasterboard without damaging the wall."
    },
    {
      q: "Can you hide or tidy the dangling cables?",
      a: "Yes! We provide clean white or colour-matched D-Line cable trunking to neatly enclose power and HDMI cables straight down the wall or skirting board."
    },
    {
      q: "How much does TV mounting cost in Edinburgh?",
      a: "Our jobs start from our standard minimum booking of £65 (for standard size TVs with customer-supplied bracket). Simply WhatsApp us your TV model/size, wall type (stone, brick, or stud), and preferred bracket style for an instant fixed quote."
    }
  ];

  const whatsappLink = `https://wa.me/${siteConfig.whatsappNumber || '447760696723'}?text=Hi%20Ekrem,%20I'm%20looking%20for%20a%20quote%20for%20TV%20wall%20mounting%20into%20a%20wall%20in%20Edinburgh.`;

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
          <span className="text-blue-600 font-semibold">TV Wall Mounting Edinburgh</span>
        </nav>

        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 blur-3xl pointer-events-none rounded-full" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-bold border border-blue-800 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Edinburgh Tenement Stone Wall Specialists</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
              Expert TV Wall Mounting into Stone &amp; Plasterboard in Edinburgh
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Laser-levelled TV wall mounting for screens 32" to 85"+ into historic Victorian sandstone, lathe-and-plaster, and modern stud walls. Rock-solid stability with zero mess.
            </p>

            {/* Quick Benefits Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                <span className="font-semibold">5.0 Star Rated (73+ Reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Anchor className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">Heavy-Duty Fischer Anchors</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-semibold">From £65 • No Call-Out Fee</span>
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
                <span>WhatsApp Ekrem for Instant TV Quote</span>
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

        {/* What We Mount Grid */}
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Precision Wall Hanging Services
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Whether mounting a premium OLED TV over a fireplace or hanging an antique Victorian mirror, we ensure total peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mountTypes.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 font-bold">
                  <Tv className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The Tenement Sandstone Wall Problem */}
        <section className="py-12 bg-slate-100 border-y border-slate-200 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4">
                Why Edinburgh Tenement Walls Require Specialist Masonry Equipment
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Edinburgh tenement flats feature 120+ year old sandstone, lime mortar, and lath-and-plaster. A generic DIY plug drilled into crumbling stone can easily pull out under the weight of an expensive 65" or 75" TV. Here is how we guarantee 100% safety:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 block">Digital Stud &amp; Cable Scanner</span>
                    <span className="text-xs text-slate-500">Detects hidden live electrics and pipes before any drilling starts.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 block">Heavy-Duty Fischer DuoPower</span>
                    <span className="text-xs text-slate-500">German-engineered anchors that expand securely into aged masonry.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 block">Laser Levelling &amp; Dust Capture</span>
                    <span className="text-xs text-slate-500">Micro-level precision with zero red stone dust on your floor or furniture.</span>
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
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Fixed Upfront Rates</span>
              <h2 className="text-2xl sm:text-3xl font-black mt-1 mb-4">TV Wall Mounting Pricing in Edinburgh</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                We believe in 100% transparent pricing with zero surprise charges. All standard Fischer masonry wall fixings are included.
              </p>
              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-emerald-400">From £65</span>
                <span className="text-xs sm:text-sm text-slate-400">Standard mounting with customer-supplied bracket</span>
              </div>
              <p className="mt-4 text-xs text-slate-400">
                Need us to supply the bracket, hide cables in trunking, or mount into historic stone? Simply send us a photo of your wall and TV size on WhatsApp!
              </p>
              <div className="mt-6">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-transform active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Get Instant Quote on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Answers to common Edinburgh TV wall mounting questions</p>
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
          <QuoteForm preselectedService="TV & Wall Mounting" />
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
