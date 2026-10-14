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

export default function OldTownSouthsidePage() {
  const { content } = useContent();
  const siteConfig = content.siteConfig || BUSINESS_INFO;
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "Do you charge extra for parking or narrow closes in the Old Town?",
      a: "No. Parking around the Royal Mile, Grassmarket, and Southside can be tricky, but I factor that into my day. I never add surprise travel, congestion, or parking surcharges to your bill."
    },
    {
      q: "Can you safely hang heavy mirrors and TVs on fragile lath-and-plaster walls?",
      a: "Yes. Old Town and Southside tenements typically have crumbly lime plaster over wooden laths, or solid stone chimney breasts. I use electronic wall scanners to locate original timber studs, and heavy-duty hollow-wall anchors or masonry coach bolts that grip properly without cracking your plaster."
    },
    {
      q: "Do you help students and landlords with deposit return repairs?",
      a: "Regularly. Every term end in Newington, Pleasance, and Marchmont, I help tenants and landlords fix mirror holes, reseal stained shower trays, repair wardrobe hinges, and plane sticky doors so deposits are protected."
    }
  ];

  const breadcrumbs = [
    { name: "Home", url: "https://handyeco.co.uk/" },
    { name: "Areas", url: "https://handyeco.co.uk/#areas" },
    { name: "Handyman Old Town & Southside (EH1/EH8)", url: "https://handyeco.co.uk/areas/old-town-southside-handyman" }
  ];

  usePageSeo({
    title: "Handyman Old Town & Southside Edinburgh (EH1/EH8) | Handyeco",
    description: "Reliable local handyman for Old Town, Southside, Newington & Pleasance (EH1/EH8). Period tenement repairs, stone wall mounting, furniture assembly. No call-out fee.",
    canonical: "https://handyeco.co.uk/areas/old-town-southside-handyman",
    schema: buildPageSchema({
      title: "Handyman Old Town & Southside Edinburgh (EH1/EH8) | Handyeco",
      description: "Local handyman service across Edinburgh Old Town, Southside, Newington and Holyrood. Tenement maintenance, TV mounting, flat-pack assembly and bathroom resealing.",
      canonical: "https://handyeco.co.uk/areas/old-town-southside-handyman",
      isAreaPage: true,
      areaName: "Old Town & Southside",
      areaPostcodes: ["EH1", "EH8", "Old Town", "Southside", "Newington", "Pleasance", "Holyrood"],
      breadcrumbs,
      faqs,
      siteConfig
    })
  });

  const whatsappLink = `https://wa.me/${siteConfig.whatsappNumber || '447760696723'}?text=Hi%20Ekrem,%20I'm%20looking%20for%20a%20handyman%20in%20Old%20Town%20/%20Southside%20(EH1/EH8).`;

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
          <span className="text-blue-600 font-semibold">Old Town &amp; Southside (EH1/EH8)</span>
        </nav>

        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 blur-3xl pointer-events-none rounded-full" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-bold border border-blue-800 mb-4">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Local Service: Old Town, Southside, Newington, Pleasance &amp; Holyrood</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
              Honest, Experienced Handyman in Old Town &amp; Southside Edinburgh
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Living in a 200-year-old tenement flat comes with uneven pine floors, thick sandstone walls, and fragile lath-and-plaster. I help Old Town and Southside residents get repairs done properly without the runaround.
            </p>

            {/* Quick Benefits Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                <span className="font-semibold">5.0 Star ({siteConfig.googleReviewCount || 87}+ Google Reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">Zero Call-Out Fee in EH1 &amp; EH8</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-semibold">Quick WhatsApp Quotes</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-semibold">Old Town Specialist</span>
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
                <span>WhatsApp Ekrem for an Old Town Quote</span>
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
              Practical Repairs for Edinburgh’s Historic Tenements &amp; Student Flats
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Between the steep stairs of the Royal Mile closes and the busy student corridors of Newington and Nicolson Street, property maintenance here requires practical know-how. I carry heavy-duty masonry drills, laser levellers, and a full range of specialist plugs to tackle jobs cleanly on the first visit.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-sm text-slate-900 block mb-1">Stone Wall TV &amp; Shelf Fitting</span>
                <span className="text-xs text-slate-500">Secure anchors into structural sandstone so shelves and TVs stay completely rigid.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-sm text-slate-900 block mb-1">Flat-Pack Furniture Assembly</span>
                <span className="text-xs text-slate-500">Wardrobes, desks, and storage beds squared up properly on old, sloping floors.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-sm text-slate-900 block mb-1">Shower &amp; Bath Resealing</span>
                <span className="text-xs text-slate-500">Full strip of degraded silicone, anti-fungal cleanup, and fresh sanitary bead.</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900">Old Town &amp; Southside FAQs</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Direct answers to common questions in EH1 &amp; EH8</p>
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
        <RelatedServicesLinks currentPath="/areas/old-town-southside-handyman" />

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
