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
  FileImage
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';
import { SERVICES } from '../data/servicesData';
import confetti from 'canvas-confetti';

export default function QuoteForm({ preselectedService }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    postcode: "",
    urgency: "flexible",
    serviceId: preselectedService ? preselectedService.id : "furniture-assembly",
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

    const selectedServiceName = SERVICES.find(s => s.id === formData.serviceId)?.title || "Handyman Service";
    
    const message = [
      `*NEW QUOTE REQUEST - HANDYECO*`,
      `-----------------------------`,
      `*Customer Name:* ${formData.name}`,
      `*Phone Number:* ${formData.phone}`,
      `*Edinburgh Postcode:* ${formData.postcode || "Edinburgh Area"}`,
      `*Requested Service:* ${selectedServiceName}`,
      `*Urgency:* ${formData.urgency.toUpperCase()}`,
      `*Job Description:* ${formData.details || "Details to discuss"}`,
      uploadedPhotos.length > 0 ? `*(Attached ${uploadedPhotos.length} photo(s) ready to send)*` : ""
    ].filter(Boolean).join("\n");

    const waUrl = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  const handleSubmitOnline = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMsg("Please fill in your name and phone number so we can get back to you.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    // Simulate fast submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Confetti fallback
      }
    }, 800);
  };

  return (
    <section id="quote" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-bold border border-blue-800 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Fast & Transparent Estimates</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Request Your Free Quote in 60 Seconds
          </h2>
          <p className="text-base text-slate-300 mt-2">
            No obligation, zero hidden fees. Receive an exact fixed-price estimate or instant WhatsApp response.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Form */}
          <div className="lg:col-span-8 bg-slate-800/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-slate-700 shadow-2xl text-left">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Quote Request Received!
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-white font-semibold">{formData.name}</span>. Ekrem will review your job details and contact you via phone/WhatsApp within 15-30 minutes.
                </p>
                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => { setSubmitted(false); setUploadedPhotos([]); }}
                    className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                  <a
                    href={BUSINESS_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open Live WhatsApp Chat</span>
                  </a>
                </div>
              </div>
            ) : (
              <form className="space-y-6">
                
                {/* Service Selection Pills */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
                    1. Select Service Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SERVICES.map(service => (
                      <button
                        type="button"
                        key={service.id}
                        onClick={() => setFormData({ ...formData, serviceId: service.id })}
                        className={`p-2.5 sm:p-3 rounded-xl text-xs font-semibold text-left transition-all border cursor-pointer ${
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Robertson"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 07700 900123"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Postcode & Urgency Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Edinburgh Postcode
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. EH10 4BF (Morningside)"
                      value={formData.postcode}
                      onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Preferred Timeline
                    </label>
                    <select
                      value={formData.urgency}
                      onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                    >
                      <option value="flexible">Flexible (Within 1-2 weeks)</option>
                      <option value="this-week">This Week</option>
                      <option value="urgent">Urgent / Within 24-48 hours</option>
                      <option value="weekend">Weekend Preferred</option>
                    </select>
                  </div>
                </div>

                {/* Job Description Textarea */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Job Details & Specifics
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Tell us what needs done (e.g. Assemble 1 IKEA wardrobe, mount 55-inch TV into stone wall, re-seal bath with silicone)..."
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  ></textarea>
                </div>

                {/* Photo Upload Zone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Attach Photos of Job (Optional but Recommended)
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-4 text-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all group"
                  >
                    <UploadCloud className="w-7 h-7 text-slate-400 group-hover:text-blue-400 mx-auto mb-1.5 transition-colors" />
                    <p className="text-xs text-slate-300 font-semibold">
                      Click to upload photos of the items, damage, or wall
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      JPEG, PNG, HEIC up to 5MB each (Max 5 photos)
                    </p>
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
                    <div className="flex flex-wrap gap-2.5 mt-3">
                      {uploadedPhotos.map((photo, i) => (
                        <div key={i} className="relative group/preview rounded-xl overflow-hidden border border-slate-700 w-16 h-16 bg-slate-800">
                          <img src={photo.url} alt="upload preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            className="absolute top-1 right-1 p-0.5 rounded-full bg-red-600 text-white opacity-90 hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Dual Action Submit Buttons */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Option 1: WhatsApp Instant Send */}
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="w-full inline-flex items-center justify-center px-6 py-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 active:scale-98 transition-all cursor-pointer group"
                  >
                    <MessageSquare className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12" />
                    <span>Send via WhatsApp (Instant)</span>
                  </button>

                  {/* Option 2: Online Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={handleSubmitOnline}
                    className="w-full inline-flex items-center justify-center px-6 py-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>Processing...</span>
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        <span>Submit Quote Request</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>

          {/* Right Column: Direct Contact & Reassurance Card */}
          <div className="lg:col-span-4 space-y-6 text-left">
            
            {/* Direct WhatsApp Callout Card */}
            <div className="bg-gradient-to-br from-emerald-950/70 to-slate-900 border border-emerald-800/60 rounded-3xl p-6 sm:p-7 shadow-xl">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Prefer to Chat Directly?</h4>
                  <p className="text-xs text-emerald-300">Live WhatsApp Line</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-5">
                Have a quick question or want an instant quote from photos? Ekrem is usually online on WhatsApp:
              </p>

              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-md"
              >
                <MessageSquare className="w-4 h-4 mr-1.5" />
                <span>Message +44 7760 696723</span>
              </a>
            </div>

            {/* Reassurance Checklist */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 sm:p-7 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                The Handyeco Promise
              </h4>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-semibold block">£1M Public Liability Cover</span>
                    <span>Fully insured against any accidental property damage.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-semibold block">No Turn-Down for Small Jobs</span>
                    <span>Odd jobs and small repair lists are always welcomed.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-semibold block">Tenement Specialists</span>
                    <span>Equipped for stone, masonry, and lath-and-plaster walls.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
