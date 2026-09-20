import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServiceAreas from './components/ServiceAreas';
import HowItWorks from './components/HowItWorks';
import Services from './components/Services';
import GoogleReviews from './components/GoogleReviews';
import PhotoGallery from './components/PhotoGallery';
import QuoteForm from './components/QuoteForm';
import Footer from './components/Footer';
import MobileStickyBar from './components/MobileStickyBar';
import LightboxModal from './components/LightboxModal';
import AdminLayout from './admin/AdminLayout';
import { ContentProvider } from './context/ContentContext';

export default function App() {
  const [selectedService, setSelectedService] = useState(null);
  const [lightboxItem, setLightboxItem] = useState(null);
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
    <ContentProvider>
      {currentPath.startsWith('/admin') ? (
        <AdminLayout />
      ) : (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white font-sans">
          {/* Top Sticky Navigation */}
          <Navbar />

          {/* Main Content Sections */}
          <main className="flex-1">
            {/* 1. Hero Section with 5.0 Google Rating & Dual CTAs */}
            <Hero onOpenQuote={() => scrollToQuote()} />

            {/* 2. Where We Work in Scotland */}
            <ServiceAreas />

            {/* 3. Simple 3-Step Process */}
            <HowItWorks onOpenQuote={() => scrollToQuote()} />

            {/* 4. Quality Home Repairs & Assembly Done Right */}
            <Services onSelectService={(srv) => scrollToQuote(srv)} />

            {/* 5. Verified Customer Reviews (100% Real Google Reviews) */}
            <GoogleReviews />

            {/* 6. Recent Completed Work (Minimalist Apple-style Photo Gallery) */}
            <PhotoGallery onOpenLightbox={(item) => setLightboxItem(item)} />

            {/* 7. Interactive Free Quote Request Form & FAQ Side-by-Side */}
            <QuoteForm preselectedService={selectedService} />
          </main>

          {/* Footer */}
          <Footer />

          {/* Mobile Sticky Quick Action Bar */}
          <MobileStickyBar onOpenQuote={() => scrollToQuote()} />

          {/* Fullscreen Photo Lightbox Modal */}
          <LightboxModal item={lightboxItem} onClose={() => setLightboxItem(null)} />
        </div>
      )}
    </ContentProvider>
  );
}
