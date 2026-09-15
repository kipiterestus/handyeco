import React, { useState, useEffect } from 'react';
import { Menu, X, Star, MapPin, Phone, MessageSquare } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: "Where We Work", href: "#areas" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Services", href: "#services" },
    { label: "Google Reviews", href: "#reviews" },
    { label: "Client Photos", href: "#gallery" },
    { label: "FAQ", href: "#faq" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Announcement Strip */}
      <div className="bg-slate-900 text-slate-300 text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-between gap-2">
          
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center text-emerald-400 font-bold shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              Available for Booking
            </span>
            <span className="text-slate-500">|</span>
            <span className="inline-flex items-center text-slate-400 truncate">
              <MapPin className="w-3.5 h-3.5 mr-1 text-blue-400 shrink-0" />
              Edinburgh & Lothians
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-400 text-xs font-medium">
            <span>Minimum call-out fee £65 (Edinburgh Area)</span>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-sm py-2.5 border-b border-slate-200/80" 
          : "bg-white/95 backdrop-blur-sm py-3 sm:py-3.5 border-b border-slate-100"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Clean Logo without black background */}
          <a href="#" className="flex items-center gap-2 group">
            <img 
              src="/logo-transparent.png" 
              alt="Handyeco - Edinburgh Handyman Services" 
              className="h-8 xs:h-9 sm:h-11 md:h-12 w-auto max-w-[170px] xs:max-w-[210px] sm:max-w-none object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-7 text-sm font-semibold text-slate-700">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-blue-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-xl animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-xl text-base font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                {link.label}
              </a>
            ))}
            
            <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2">
              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
