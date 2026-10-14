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

export default function LivingstonHandymanPage() {
  const { content } = useContent();
  const siteConfig = content.siteConfig || BUSINESS_INFO;
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "Do you travel across West Lothian and Livingston regularly?",
      a: "Yes. I frequently handle jobs around Livingston (EH54), Broxburn, Uphall, and Bathgate. We offer our standard transparent rates with no call-out surcharge, starting from our £65 minimum booking."
    },
    {
      q: "Can you mount a 65\" or 75\" TV onto modern plasterboard stud walls safely?",
      a: "Yes, absolutely. Modern new-builds in Livingston have hollow plasterboard partitions that will tear if standard plastic wall plugs are used. I use electronic wall scanners to locate timber uprights, and heavy-duty steel toggle anchors tested to over 80kg to hang your TV safely."
    },
    {
      q: "Why does the sealant in my new-build bathroom keep splitting?",
      a: "New-build timber frames naturally dry out and settle over the first 1 to 2 years, which pulls the bath or shower tray slightly away from the tiles and tears cheap builders' mastic. I cut out the split bead completely, ensure the gap is dry, and lay down an elastic, high-grade sanitary silicone bead that accommodates natural movement."
    }
  ];

  const breadcrumbs = [
    { name: "Home", url: "https://handyeco.co.uk/" },
    { name: "Areas", url: "https://handyeco.co.uk/#areas" },
    { name: "Handyman Livingston & West Lothian (EH54)", url: "https://handyeco.co.uk/areas/livingston-handyman" }
  ];

  usePageSeo({
    title: "Handyman Livingston & West Lothian (EH54) | Handyeco",
    description: "Reliable 5-star local handyman for Livingston, Broxburn, Bathgate & EH54. Plasterboard TV wall mounting, flat-pack assembly, mastic resealing. No call-out fee.",
    canonical: "https://handyeco.co.uk/areas/livingston-handyman",
    schema: buildPageSchema({
      title: "Handyman Livingston & West Lothian (EH54) | Handyeco",
      description: "Trusted local handyman across Livingston, Broxburn and West Lothian (EH54). New-build repairs, TV wall mounting, flat-pack assembly, and bathroom resealing.",
      canonical: "https://handyeco.co.uk/areas/livingston-handyman",
      isAreaPage: true,
      areaName: "Livingston & West Lothian",
      areaPostcodes: ["EH54", "Livingston", "Broxburn", "Bathgate", "Uphall", "West Lothian"],
      breadcrumbs,
      faqs,
      siteConfig
    })
  });

  const whatsappLink = `https://wa.me/${siteConfig.whatsappNumber || '447760696723'}?text=Hi%20Ekrem,%20I'm%20looking%20for%20a%20handyman%20in%20Livingston%20(EH54).`;

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
          <span className="text-blue-600 font-semibold">Livingston &amp; West Lothian (EH54)</span>
        </nav>

        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 blur-3xl pointer-events-none rounded-full" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-bold border border-blue-800 mb-4">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Local Service: Livingston, Broxburn, Bathgate &amp; Uphall</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
              Honest, Dependable Handyman in Livingston &amp; West Lothian
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Specialising in modern homes and new-build developments across West Lothian. Heavy-duty TV wall mounting into plasterboard studs, flat-pack furniture building, and clean bathroom mastic resealing.
            </p>

            {/* Quick Benefits Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                <span className="font-semibold">5.0 Star ({siteConfig.googleReviewCount || 87}+ Google Reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">Zero Call-Out Fee in EH54</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-semibold">Quick WhatsApp Pricing</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-semibold">West Lothian Coverage</span>
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
                <span>WhatsApp Ekrem for a Livingston Quote</span>
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
              Specialist Repairs for Modern Homes &amp; New Developments
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Livingston's modern housing requires different fixings than central Edinburgh stone tenements. Plasterboard walls, metal stud framework, and new-build settlement cracks need the right trade anchors and materials to prevent damage.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-sm text-slate-900 block mb-1">Stud-Wall TV &amp; Heavy Mirror Hanging</span>
                <span className="text-xs text-slate-500">Digital scanners locate timber studs, and heavy-duty gravity toggles secure up to 80kg safely.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-sm text-slate-900 block mb-1">Wardrobe &amp; Bed Assembly</span>
                <span className="text-xs text-slate-500">Ottoman storage beds, multi-door wardrobes, and desks assembled cleanly and levelled properly.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-sm text-slate-900 block mb-1">New-Build Shower Mastic Resealing</span>
                <span className="text-xs text-slate-500">Removes split settlement mastic and seals with flexible, mould-resistant sanitary silicone.</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900">Livingston &amp; West Lothian FAQs</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Direct answers for EH54 residents</p>
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
        <RelatedServicesLinks currentPath="/areas/livingston-handyman" />

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
