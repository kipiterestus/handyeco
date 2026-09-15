import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServiceAreas from './components/ServiceAreas';
import HowItWorks from './components/HowItWorks';
import Services from './components/Services';
import GoogleReviews from './components/GoogleReviews';
import PhotoGallery from './components/PhotoGallery';
import QuoteForm from './components/QuoteForm';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import MobileStickyBar from './components/MobileStickyBar';
import LightboxModal from './components/LightboxModal';

export default function App() {
  const [selectedService, setSelectedService] = useState(null);
  const [lightboxItem, setLightboxItem] = useState(null);

  const scrollToQuote = (service = null) => {
    if (service) {
      setSelectedService(service);
    }
    const element = document.getElementById('quote');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white font-sans">
      {/* Top Sticky Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section with 5.0 Google Rating & Dual CTAs */}
        <Hero onOpenQuote={() => scrollToQuote()} />

        {/* 2. Where We Work in Scotland (Compact & Minimal with £65 min call-out) */}
        <ServiceAreas />

        {/* 3. Simple 3-Step Process (Connected seamlessly via left-side arrow from Where We Work) */}
        <HowItWorks onOpenQuote={() => scrollToQuote()} />

        {/* 4. Quality Home Repairs & Assembly Done Right (Clean cards with Book Quote & WhatsApp only) */}
        <Services onSelectService={(srv) => scrollToQuote(srv)} />

        {/* 5. Verified Customer Reviews (Google & MyBuilder, Real names, pure text, no photos) */}
        <GoogleReviews />

        {/* 6. Recent Completed Work & Client Uploads (Rotating Carousel & Grid Modes) */}
        <PhotoGallery onOpenLightbox={(item) => setLightboxItem(item)} />

        {/* 7. Interactive Free Quote Request Form */}
        <QuoteForm preselectedService={selectedService} />

        {/* 8. Frequently Asked Questions (with updated £65 callout fee) */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Quick Action Bar */}
      <MobileStickyBar onOpenQuote={() => scrollToQuote()} />

      {/* Fullscreen Photo Lightbox Modal */}
      <LightboxModal item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </div>
  );
}
