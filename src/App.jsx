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

// 3 New Apple / iPhone Concepts
import ConceptSelector from './concepts/ConceptSelector';
import Concept1_AppleBento from './concepts/Concept1_AppleBento';
import Concept2_TitaniumPro from './concepts/Concept2_TitaniumPro';
import Concept3_LiquidGlass from './concepts/Concept3_LiquidGlass';

export default function App() {
  const [currentConcept, setCurrentConcept] = useState('original');
  const [selectedService, setSelectedService] = useState(null);
  const [lightboxItem, setLightboxItem] = useState(null);

  const scrollToQuote = (service = null) => {
    if (service) {
      setSelectedService(service);
    }
    const element = document.getElementById('quote') || document.getElementById('bento-quote') || document.getElementById('pro-quote') || document.getElementById('liquid-quote');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans pt-[42px]">
      {/* Floating Top Concept Selector - Allows switching live between Original and the 3 iPhone Concepts */}
      <ConceptSelector
        currentConcept={currentConcept}
        onSelectConcept={(conceptId) => {
          setCurrentConcept(conceptId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* RENDER CONCEPT 1: Apple Bento Minimal (Cupertino Light) */}
      {currentConcept === 'bento' && (
        <Concept1_AppleBento onOpenQuote={() => scrollToQuote()} />
      )}

      {/* RENDER CONCEPT 2: iPhone Pro Titanium (Dark OLED Edition) */}
      {currentConcept === 'titanium' && (
        <Concept2_TitaniumPro onOpenQuote={() => scrollToQuote()} />
      )}

      {/* RENDER CONCEPT 3: iOS 18 Liquid Glass (Translucent Spatial) */}
      {currentConcept === 'glass' && (
        <Concept3_LiquidGlass onOpenQuote={() => scrollToQuote()} />
      )}

      {/* RENDER ORIGINAL: The exact approved current site (100% Preserved) */}
      {currentConcept === 'original' && (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
          {/* Top Sticky Navigation */}
          <Navbar />

          <main className="flex-1">
            {/* 1. Hero Section */}
            <Hero onOpenQuote={() => scrollToQuote()} />

            {/* 2. Where We Work in Scotland */}
            <ServiceAreas />

            {/* 3. Simple 3-Step Process (Connected with Left-side arrow) */}
            <HowItWorks onOpenQuote={() => scrollToQuote()} />

            {/* 4. Quality Home Repairs & Assembly Done Right */}
            <Services onSelectService={(srv) => scrollToQuote(srv)} />

            {/* 5. Real Customer Reviews */}
            <GoogleReviews onOpenLightbox={(item) => setLightboxItem(item)} />

            {/* 6. Recent Completed Work & Client Uploads */}
            <PhotoGallery onOpenLightbox={(item) => setLightboxItem(item)} />

            {/* 7. Interactive Free Quote Request Form */}
            <QuoteForm preselectedService={selectedService} />

            {/* 8. FAQ */}
            <FAQ />
          </main>

          {/* Footer */}
          <Footer />

          {/* Mobile Sticky Quick Action Bar */}
          <MobileStickyBar onOpenQuote={() => scrollToQuote()} />
        </div>
      )}

      {/* Fullscreen Photo Lightbox Modal (Shared across all versions) */}
      <LightboxModal item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </div>
  );
}
