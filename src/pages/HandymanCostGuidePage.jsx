import React, { useState } from 'react';
import { 
  CheckCircle2, Star, ShieldCheck, Clock, MapPin, 
  MessageSquare, ArrowRight, Sparkles, HelpCircle, 
  ChevronDown, ChevronUp, Calculator, PoundSterling,
  AlertCircle, Check, Info, FileText
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

export default function HandymanCostGuidePage() {
  const { content } = useContent();
  const siteConfig = content.siteConfig || BUSINESS_INFO;
  const [openFaq, setOpenFaq] = useState(null);

  const pricingEstimates = [
    {
      category: "Furniture & Flat-Pack Assembly",
      item: "Chest of Drawers Assembly",
      typicalRange: "£65 – £95",
      timeEstimate: "1 – 2 hours",
      notes: "Depends on complexity & number of drawers; includes wall safety anchor"
    },
    {
      category: "Furniture & Flat-Pack Assembly",
      item: "2-Door Wardrobe Assembly",
      typicalRange: "£120 – £150",
      timeEstimate: "2 – 3 hours",
      notes: "Hinged or sliding doors, shelving & secure wall anchoring"
    },
    {
      category: "Furniture & Flat-Pack Assembly",
      item: "3-Door Wardrobe Assembly",
      typicalRange: "£150 – £190",
      timeEstimate: "3.5 – 5 hours",
      notes: "Large multi-section wardrobe, drawers, hanging rails & wall anchor"
    },
    {
      category: "Furniture & Flat-Pack Assembly",
      item: "Ottoman Gas-Lift Storage Bed",
      typicalRange: "Single: £80 | Double: £100 | King: £130",
      timeEstimate: "1.5 – 2.5 hours",
      notes: "Hydraulic gas-lift piston alignment, frame squaring & safety check"
    },
    {
      category: "TV Wall Mounting & Hanging",
      item: "TV Wall Mounting (40\" to 55\")",
      typicalRange: "£65 fixed",
      timeEstimate: "1 – 1.5 hours",
      notes: "Same fixed rate for stone masonry or plasterboard; heavy-duty trade fixings included"
    },
    {
      category: "TV Wall Mounting & Hanging",
      item: "TV Wall Mounting (55\"+ / Large Screen)",
      typicalRange: "£80 fixed",
      timeEstimate: "1 – 2 hours",
      notes: "Large screen mounting into stone or hollow walls with heavy-duty anchors"
    },
    {
      category: "Bathroom & Kitchen Resealing",
      item: "Bath or Shower Silicone Reseal",
      typicalRange: "£70 – £120",
      timeEstimate: "1 – 2 hours",
      notes: "Depends on complexity & size; complete old silicone removal & sanitary seal"
    },
    {
      category: "Tenement Odd Jobs & Maintenance",
      item: "Internal Door Handle Fitting / Replacement",
      typicalRange: "£65 (1st door), £30/additional",
      timeEstimate: "45 mins/door",
      notes: "Old handle/latch removal, precision alignment & smooth latching mechanism"
    },
    {
      category: "Tenement Odd Jobs & Maintenance",
      item: "Internal Timber Door Trimming (after flooring/carpet)",
      typicalRange: "£65 (1st door), £30/additional",
      timeEstimate: "45 mins/door",
      notes: "Plunge rail saw cut, zero-splinter edge & clean bottom bevel"
    },
    {
      category: "Tenement Odd Jobs & Maintenance",
      item: "Curtains & Blinds Installation",
      typicalRange: "£65 (1st item), £30/additional",
      timeEstimate: "45 mins each",
      notes: "Laser-levelled with trade fixings; high ceiling flats excepted (subject to quote)"
    }
  ];

  const faqs = [
    {
      q: "How much does a handyman charge per hour in Edinburgh?",
      a: "In Edinburgh, typical handyman rates range from £35 to £60 per hour, often with an added £30–£50 call-out fee or a 2-hour minimum. At Handyeco, we do not charge any call-out fee. Instead, we offer a transparent minimum job booking of £65, and provide fixed upfront price quotes via WhatsApp so you know exactly what you will pay before we arrive."
    },
    {
      q: "Is there a call-out fee or hidden travel surcharge in Edinburgh?",
      a: "No! Handyeco has zero call-out charges and zero travel surcharges anywhere across Edinburgh (EH1–EH17) and adjacent Lothian zones (Musselburgh, Dalkeith, South Queensferry). You only pay for the completed work as quoted."
    },
    {
      q: "Why do you quote fixed prices instead of open hourly rates?",
      a: "Hourly rates create uncertainty—if a job takes longer due to a tricky screw or an old tenement wall, you pay more. With our fixed-price quotes, you send us pictures or details via WhatsApp, we give you a guaranteed flat price, and that is the exact price you pay upon satisfactory completion."
    },
    {
      q: "What is your minimum booking charge?",
      a: "Our standard minimum job booking is £65 across Edinburgh. This covers smaller odd jobs like hanging a couple of mirrors, resealing a basin, mounting a standard TV, or initial furniture assembly."
    },
    {
      q: "Are materials and fixings included in the price?",
      a: "All standard trade-quality wall fixings (heavy-duty masonry expansion plugs, concrete screws, masonry anchors, hollow-wall toggles) and professional tools are included in our price. For specialized items like replacement curtain poles, specific paint colours, or replacement door locks, you can either supply them or we can provide them at trade cost."
    },
    {
      q: "How can I save money when hiring an Edinburgh handyman?",
      a: "The most cost-effective approach is to bundle several tasks together into a single visit. Instead of booking separate visits for individual jobs, compile a full list of everything you need done and send it to us via WhatsApp. Bundling tasks allows us to offer a discounted combined package price that works out significantly cheaper than booking each job separately."
    }
  ];

  const breadcrumbs = [
    { name: "Home", url: "https://handyeco.co.uk/" },
    { name: "Pricing", url: "https://handyeco.co.uk/#pricing" },
    { name: "Handyman Edinburgh Cost & Pricing Guide 2026", url: "https://handyeco.co.uk/pricing/handyman-edinburgh-cost-guide" }
  ];

  usePageSeo({
    title: "Handyman Edinburgh Cost & Pricing Guide 2026 | Handyeco",
    description: "Complete 2026 pricing guide for Edinburgh handyman services. How much does flat-pack assembly, TV wall mounting & odd jobs cost? £65 minimum, zero hidden fees.",
    canonical: "https://handyeco.co.uk/pricing/handyman-edinburgh-cost-guide",
    schema: buildPageSchema({
      title: "Handyman Edinburgh Cost & Pricing Guide 2026 | Handyeco",
      description: "Comprehensive Edinburgh handyman pricing guide. Transparent prices for flat-pack assembly, TV mounting into stone, silicone sealing, and tenement repairs. From £65 minimum booking.",
      canonical: "https://handyeco.co.uk/pricing/handyman-edinburgh-cost-guide",
      serviceName: "Handyman Edinburgh Pricing & Cost Guide",
      breadcrumbs,
      faqs,
      siteConfig
    })
  });

  const whatsappLink = `https://wa.me/${siteConfig.whatsappNumber || '447760696723'}?text=Hi%20Ekrem,%20I'd%20like%20a%20fixed%20quote%20for%20a%20handyman%20job%20in%20Edinburgh.`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-slate-500 flex items-center gap-2">
          <a href="/" onClick={(e) => handleInternalLinkClick(e, '/')} className="hover:text-blue-600 transition-colors">Home</a>
          <span>/</span>
          <span className="text-slate-700 font-medium">Pricing</span>
          <span>/</span>
          <span className="text-blue-600 font-semibold">Handyman Edinburgh Cost Guide 2026</span>
        </nav>

        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/15 blur-3xl pointer-events-none rounded-full" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-bold border border-emerald-800 mb-4">
              <PoundSterling className="w-3.5 h-3.5 text-emerald-400" />
              <span>Transparent Pricing &bull; 2026 Market Guide</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
              How Much Does a Handyman Cost in Edinburgh? (2026 Price Guide)
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              No guesswork, no vague hourly rates, and zero call-out charges. Here is exactly what home repairs, flat-pack assembly, TV mounting, and maintenance cost across Edinburgh.
            </p>

            {/* Quick Benefits Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                <span className="font-semibold">5.0 Star Rated ({siteConfig.googleReviewCount || 87}+ Reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>£65 Minimum Booking</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Zero Call-Out Fees</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Fixed Upfront Quotes</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Get Exact WhatsApp Quote in 15 Mins</span>
              </a>
              <a 
                href="#pricing-table"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
              >
                <span>View Price Breakdown Table</span>
                <ChevronDown className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Overview Box: The Handyeco Difference */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 font-black text-lg">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">No Hidden Call-Out Fees</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Many companies charge £40–£60 just to turn up at your door before opening a toolbox. We charge <span className="font-semibold text-slate-900">£0 call-out fee</span> anywhere in Edinburgh.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 font-black text-lg">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Fixed Prices via WhatsApp</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Send us a quick photo or link to the item. We reply with a confirmed flat price. You will never be faced with surprises or runaway hourly clocks.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 font-black text-lg">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Pay Only Upon Satisfaction</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  No deposits required for standard handyman visits. Once the work is completed and inspected to your total delight, pay via bank transfer or card with an instant receipt.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Comparison Table Section */}
        <section id="pricing-table" className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left max-w-3xl mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-3">
                <Calculator className="w-3.5 h-3.5 text-blue-600" />
                <span>Edinburgh 2026 Price Index</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Typical Handyman Job Prices in Edinburgh
              </h2>
              <p className="mt-2 text-slate-600 text-sm sm:text-base">
                All prices include professional cordless tools, heavy-duty trade-grade fixings, and tidy cleanup.
              </p>
            </div>

            {/* Price Variation Notice Badge (Prominent Red Alert) */}
            <div className="mb-8 rounded-2xl bg-red-50/90 border-2 border-red-400 p-5 sm:p-6 text-left shadow-sm ring-1 ring-red-500/20">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[11px] font-extrabold uppercase tracking-wider mb-1.5 border border-red-200">
                      Average Estimated Rates
                    </div>
                    <h3 className="text-base font-bold text-red-950 leading-snug">
                      Important: Prices May Vary Based on Job Scope &amp; Complexity
                    </h3>
                    <p className="mt-1 text-red-900/90 text-xs sm:text-sm leading-relaxed max-w-2xl">
                      The figures listed below are average guide prices. Costs can vary depending on furniture design complexity, room dimensions, and tenement wall construction (solid stone vs plasterboard). For an exact, guaranteed fixed-price quote, please get in touch with photos and project details.
                    </p>
                  </div>
                </div>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/20 transition-all shrink-0 whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Get Exact Fixed Quote</span>
                </a>
              </div>
            </div>

            {/* Mobile View: Dedicated Card List (Zero horizontal scrolling) */}
            <div className="block md:hidden space-y-3.5">
              {pricingEstimates.map((row, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-left transition-all hover:border-slate-300"
                >
                  {/* Top row: Category & Time */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {row.category}
                    </span>
                    <span className="inline-flex items-center text-xs font-medium text-slate-500 gap-1 shrink-0">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{row.timeEstimate}</span>
                    </span>
                  </div>

                  {/* Service Title */}
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {row.item}
                  </h3>

                  {/* Prominent Price Banner */}
                  <div className="mt-2.5 flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-xs font-semibold text-emerald-900">Typical Cost:</span>
                    <span className="text-base font-black text-emerald-700">
                      {row.typicalRange}
                    </span>
                  </div>

                  {/* Included Details / Notes */}
                  <div className="mt-2.5 text-xs text-slate-600 flex items-start gap-2 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{row.notes}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Full Comparison Table */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider">
                    <th className="py-4 px-4 sm:px-6">Service / Job Description</th>
                    <th className="py-4 px-4 sm:px-6">Typical Cost</th>
                    <th className="py-4 px-4 sm:px-6">Est. Time</th>
                    <th className="py-4 px-4 sm:px-6">Included Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pricingEstimates.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">
                        <div>{row.item}</div>
                        <span className="text-[11px] font-normal text-slate-500 uppercase tracking-wide">{row.category}</span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-emerald-700 whitespace-nowrap">
                        {row.typicalRange}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-slate-600 whitespace-nowrap">
                        {row.timeEstimate}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-slate-600 text-xs leading-relaxed">
                        {row.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Why Edinburgh Tenements Affect Costs */}
        <section className="py-16 bg-white border-t border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-4">
              Why Edinburgh Property Construction Affects Handyman Work
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-3xl mb-8 leading-relaxed">
              Edinburgh has one of the UK's most unique architectural landscapes. Victorian and Georgian tenements in Leith, Morningside, New Town, and Marchmont present specific physical challenges that require specialist tools and trade experience:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-900 text-base mb-2">Thick Sandstone & Masonry</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Edinburgh tenement walls are made of centuries-old rubble sandstone behind horsehair plaster. Standard DIY cordless drills simply spin without penetrating, and cheap plastic wall plugs crumble loose. We use SDS hammer drills and heavy-duty trade masonry expansion sleeves.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-900 text-base mb-2">High Ceilings & Uneven Floors</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Tenement ceilings often measure 3.2m to 3.6m tall. Fitting high curtain poles, ceiling laundry pulleys, or anchoring tall wardrobes requires specialized step platforms and precision laser levels to compensate for century-old floor settlement.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-900 text-base mb-2">Deep Lath and Plaster Voids</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Internal tenement partitions have hollow timber laths that crack if drilled incorrectly. We use electronic stud and wire scanners combined with heavy-duty hollow-wall toggle anchors that grip securely behind the timber laths.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-3">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Edinburgh Handyman Pricing &amp; Booking FAQs
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full py-4 px-5 text-left font-bold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors text-sm sm:text-base"
                    aria-expanded={openFaq === idx}
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Internal Linking Mesh Component */}
        <RelatedServicesLinks currentPath="/pricing/handyman-edinburgh-cost-guide" />

        {/* Quote Form Section */}
        <div id="quote-form">
          <QuoteForm preselectedService="General Handyman & Odd Jobs" hideFaq={true} />
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
