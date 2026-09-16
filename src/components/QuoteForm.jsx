import React, { useState, useRef } from 'react';
import { 
  Send, 
  MessageSquare, 
  UploadCloud, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  X,
  AlertCircle,
  FileImage,
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';
import { SERVICES as FALLBACK_SERVICES } from '../data/servicesData';
import { useContent } from '../context/ContentContext';
import confetti from 'canvas-confetti';

export default function QuoteForm({ preselectedService }) {
  const { content } = useContent();
  const servicesList = content.services && content.services.length > 0 ? content.services : FALLBACK_SERVICES;
  const siteConfig = content.siteConfig || BUSINESS_INFO;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    postcode: "",
    urgency: "flexible",
    serviceId: preselectedService ? preselectedService.id : (servicesList[0]?.id || "furniture-assembly"),
    details: "",
  });

  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  // Update when preselected service changes
  React.useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({ ...prev, serviceId: preselectedService.id }));
    }
  }, [preselectedService]);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + uploadedPhotos.length > 5) {
      setErrorMsg("You can upload a maximum of 5 photos.");
      return;
    }

    const newPhotos = files.map(file => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      url: URL.createObjectURL(file)
    }));

    setUploadedPhotos(prev => [...prev, ...newPhotos]);
    setErrorMsg("");
  };

  const removePhoto = (index) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMsg("Please provide your name and contact phone number.");
      return;
    }

    const selectedServiceName = servicesList.find(s => s.id === formData.serviceId)?.title || "Handyman Service";
    
    const message = [
      `*NEW QUOTE REQUEST - ${siteConfig.businessName || "HANDYECO"}*`,
      `-----------------------------`,
      `*Customer Name:* ${formData.name}`,
      `*Phone Number:* ${formData.phone}`,
      formData.email ? `*Email:* ${formData.email}` : "",
      `*Edinburgh Postcode:* ${formData.postcode || "Edinburgh Area"}`,
      `*Requested Service:* ${selectedServiceName}`,
      `*Urgency:* ${formData.urgency.toUpperCase()}`,
      `*Job Description:* ${formData.details || "Details to discuss"}`,
      uploadedPhotos.length > 0 ? `*(Attached ${uploadedPhotos.length} photo(s) ready to send)*` : ""
    ].filter(Boolean).join("\n");

    const waNumber = (siteConfig.whatsappNumber || siteConfig.phone || BUSINESS_INFO.whatsappNumber).replace(/\D/g, '');
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  const handleSubmitOnline = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMsg("Please fill in your name and phone number so we can get back to you.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const selectedServiceName = servicesList.find(s => s.id === formData.serviceId)?.title || "Handyman Service";

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || "",
        postcode: formData.postcode || "Edinburgh Area",
        service: selectedServiceName,
        urgency: formData.urgency,
        details: formData.details || "No additional details provided",
        photosCount: uploadedPhotos.length,
        createdAt: new Date().toISOString()
      };

      await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn("Quote API notice:", err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Confetti fallback
      }
    }
  };

  const [openFaqIndex, setOpenFaqIndex] = useState(-1);
  const faqs = content.faq && content.faq.length > 0 ? content.faq : [
    {
      q: "How does your pricing work? Is there a call-out fee?",
      a: "Quotes are 100% free with zero call-out fees. You can send us photos or a video on WhatsApp to receive a fixed upfront price before booking. Our minimum job booking size is £65 across the Edinburgh area, which covers smaller odd jobs or initial assembly/repairs with no surprise charges."
    },
    {
      q: "How quickly can you attend to a job in Edinburgh?",
      a: "We regularly accommodate same-week and even next-day emergency appointments for urgent jobs like leaking silicone or pre-tenancy move-out repairs. Average response time on WhatsApp is 15–30 minutes."
    },
    {
      q: "Can you mount heavy items into traditional Edinburgh sandstone or tenement walls?",
      a: "Yes, absolutely. Edinburgh tenement walls require specialist masonry drill bits and heavy-duty Fischer DuoPower anchors to prevent crumbling. We routinely secure heavy 75-85\" TVs, solid oak bookshelves, and heavy ornate mirrors into both historic stone and stud partitions."
    },
    {
      q: "Do I need to supply tools or hardware fixings?",
      a: "No, we bring a comprehensive kit of professional 18V cordless power tools, laser levels, and industrial-grade fixings (screws, wall plugs, masonry anchors). For flat-pack furniture, all assembly hardware is included in your boxes; if any screws are missing, we carry spares in our kit."
    },
    {
      q: "Can you assemble IKEA PAX wardrobes and other flat-pack furniture?",
      a: "Yes, we specialize in IKEA PAX systems, sliding doors, bed frames, dining sets, and flat-pack furniture from Argos, Next, Wayfair, and John Lewis. We bring all specialized power tools to build your items securely and perfectly aligned."
    },
    {
      q: "What payment methods do you accept, and when do I pay?",
      a: "You only pay after the job is completed and you have inspected our work to your complete satisfaction. We accept direct bank transfer, debit/credit cards, and cash upon completion with an immediate digital receipt provided."
    },
    {
      q: "Can you handle multiple small odd jobs in a single visit?",
      a: "Absolutely. Many Edinburgh clients book a 2-3 hour session where we tackle a punch-list of small repairs all at once: hanging curtain poles, adjusting sticky doors, resealing baths, hanging art, and building furniture in one convenient visit."
    },
    {
      q: "What areas around Edinburgh do you cover?",
      a: "We cover all of Edinburgh (EH1 through EH17) as well as the surrounding Lothians including Musselburgh (EH21), Dalkeith (EH22), South Queensferry (EH30), and Livingston (EH54) with zero extra travel surcharge within standard zones."
    }
  ];

  return (
    <section id="quote" className="py-14 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Anchor target for navbar FAQ link */}
      <div id="faq" className="absolute -top-24 pointer-events-none" />

      {/* Background radial highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* 2-Column Side-by-Side Grid (Quote Form on Left + FAQ on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT COLUMN: Compact & Neat Quote Form */}
          <div className="lg:col-span-7">
            {/* Header */}
            <div className="text-left mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-bold border border-blue-800 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Fast &amp; Transparent Estimates</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Request Your Free Quote in 60 Seconds
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                No obligation, zero hidden fees. Exact fixed-price estimate or instant WhatsApp response.
              </p>
            </div>

            {/* Main Interactive Form Card */}
            <div className="bg-slate-800/90 backdrop-blur-md rounded-3xl p-5 sm:p-7 border border-slate-700 shadow-2xl text-left">
              {submitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Quote Request Received!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-white font-semibold">{formData.name}</span>. Ekrem will review your job details and contact you via phone/WhatsApp within {siteConfig.responseTime || "15-30 minutes"}.
                  </p>
                  <div className="pt-3 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => { setSubmitted(false); setUploadedPhotos([]); }}
                      className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Submit Another Request
                    </button>
                    <a
                      href={siteConfig.whatsappUrl || BUSINESS_INFO.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Open Live WhatsApp Chat</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form className="space-y-4">
                  
                  {/* Service Selection Pills */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      1. Select Service Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {servicesList.map(service => (
                        <button
                          type="button"
                          key={service.id}
                          onClick={() => setFormData({ ...formData, serviceId: service.id })}
                          className={`p-2 sm:p-2.5 rounded-xl text-xs font-bold text-left transition-all border cursor-pointer leading-snug ${
                            formData.serviceId === service.id
                              ? "bg-blue-600 text-white border-blue-500 shadow-md"
                              : "bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-700/60"
                          }`}
                        >
                          {service.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Information Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. David Robertson"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. david@example.co.uk"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone & Postcode Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 07700 900123"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                        Edinburgh Postcode
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. EH10 4BF (Morningside)"
                        value={formData.postcode}
                        onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Preferred Timeline */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Preferred Timeline
                    </label>
                    <select
                      value={formData.urgency}
                      onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                    >
                      <option value="flexible">Flexible (Within 1-2 weeks)</option>
                      <option value="this-week">This Week</option>
                      <option value="urgent">Urgent / 24-48 hours</option>
                      <option value="weekend">Weekend Preferred</option>
                    </select>
                  </div>

                  {/* Job Description Textarea */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Job Details &amp; Specifics
                    </label>
                    <textarea
                      rows="2"
                      placeholder="e.g. Assemble IKEA PAX wardrobe, mount 55-inch TV into stone wall, seal shower tray..."
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    ></textarea>
                  </div>

                  {/* Photo Upload Strip */}
                  <div>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border border-dashed border-slate-700 hover:border-blue-500 rounded-xl px-3.5 py-2 text-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all flex items-center justify-center gap-2 group"
                    >
                      <UploadCloud className="w-4 h-4 text-slate-400 group-hover:text-blue-400 shrink-0 transition-colors" />
                      <span className="text-xs text-slate-300 font-medium">
                        Attach Photos (Optional, max 5)
                      </span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </div>

                    {/* Uploaded Photo Previews */}
                    {uploadedPhotos.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {uploadedPhotos.map((photo, i) => (
                          <div key={i} className="relative group/preview rounded-lg overflow-hidden border border-slate-700 w-12 h-12 bg-slate-800">
                            <img src={photo.url} alt="upload preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removePhoto(i)}
                              className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-red-600 text-white opacity-90 hover:opacity-100"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {errorMsg && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Dual Action Submit Buttons */}
                  <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Option 1: WhatsApp Instant Send */}
                    <button
                      type="button"
                      onClick={handleSendWhatsApp}
                      className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 active:scale-98 transition-all cursor-pointer group"
                    >
                      <MessageSquare className="w-4 h-4 mr-1.5 transition-transform group-hover:rotate-12" />
                      <span>WhatsApp (Instant)</span>
                    </button>

                    {/* Option 2: Online Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      onClick={handleSubmitOnline}
                      className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          <span>Processing...</span>
                        </span>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-1.5" />
                          <span>Submit Online Quote</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Reassurance Trust Row */}
                  <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Free Quotes</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>15-30 Min Response</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Punctual &amp; Tidy</span>
                    </div>
                  </div>

                </form>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Frequently Asked Questions (FAQ) */}
          <div className="lg:col-span-5 text-left space-y-4">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-bold border border-blue-800 mb-2.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>Got Questions?</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Quick answers to common questions about our Edinburgh handyman bookings.
              </p>
            </div>

            {/* Accordion List */}
            <div className="space-y-2.5">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="bg-slate-800/90 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xs transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                      className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-white hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      <span className="leading-snug">{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-blue-400" : ""
                      }`} />
                    </button>

                    {isOpen && (
                      <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-700/60 pt-2.5">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
