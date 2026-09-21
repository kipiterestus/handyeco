import React from 'react';
import { Phone, Mail, MapPin, Star, ShieldCheck, Clock, ExternalLink, MessageSquare } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';
import { useContent } from '../context/ContentContext';
import { handleInternalLinkClick } from '../utils/navigation';

export default function Footer() {
  const { content } = useContent();
  const siteConfig = content.siteConfig || BUSINESS_INFO;

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-28 sm:pb-12 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="inline-block">
              <img 
                src="/logo-dark.png" 
                alt="Handyeco - Edinburgh Handyman Services" 
                className="h-12 w-auto object-contain" 
              />
            </a>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {siteConfig.businessName || "Handyeco"} provides trusted, 5-star rated handyman, assembly, mounting, painting, and maintenance services across Edinburgh and surrounding Lothians.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-white font-bold">5.0 Star</span>
              <span className="text-slate-500">&bull; Verified Google Reviews</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a 
                  href="/services/flat-pack-assembly-edinburgh" 
                  onClick={(e) => handleInternalLinkClick(e, '/services/flat-pack-assembly-edinburgh')} 
                  className="hover:text-white transition-colors"
                >
                  Flat-Pack Assembly (IKEA)
                </a>
              </li>
              <li>
                <a 
                  href="/services/tv-wall-mounting-edinburgh" 
                  onClick={(e) => handleInternalLinkClick(e, '/services/tv-wall-mounting-edinburgh')} 
                  className="hover:text-white transition-colors"
                >
                  TV &amp; Stone Wall Mounting
                </a>
              </li>
              <li>
                <a 
                  href="/services/silicone-sealing-edinburgh" 
                  onClick={(e) => handleInternalLinkClick(e, '/services/silicone-sealing-edinburgh')} 
                  className="hover:text-white transition-colors"
                >
                  Bathroom Silicone Sealing
                </a>
              </li>
              <li>
                <a 
                  href="/services/tenement-repairs-edinburgh" 
                  onClick={(e) => handleInternalLinkClick(e, '/services/tenement-repairs-edinburgh')} 
                  className="hover:text-white transition-colors"
                >
                  Tenement Repairs &amp; Odd Jobs
                </a>
              </li>
              <li>
                <a 
                  href="/services/painting-decorating-edinburgh" 
                  onClick={(e) => handleInternalLinkClick(e, '/services/painting-decorating-edinburgh')} 
                  className="hover:text-white transition-colors"
                >
                  Painting &amp; Decorating
                </a>
              </li>
              <li>
                <a 
                  href="/services/kitchen-vinyl-wrapping-edinburgh" 
                  onClick={(e) => handleInternalLinkClick(e, '/services/kitchen-vinyl-wrapping-edinburgh')} 
                  className="hover:text-white transition-colors"
                >
                  Kitchen Vinyl Wrapping
                </a>
              </li>
              <li><a href="/#services" className="hover:text-white transition-colors">Garden Gate &amp; Fencing</a></li>
            </ul>
          </div>

          {/* Col 3: Areas Covered */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Edinburgh Areas
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a 
                  href="/areas/morningside-handyman" 
                  onClick={(e) => handleInternalLinkClick(e, '/areas/morningside-handyman')} 
                  className="hover:text-white text-slate-300 transition-colors"
                >
                  Morningside &amp; Bruntsfield (EH10)
                </a>
              </li>
              <li>
                <a 
                  href="/areas/leith-handyman" 
                  onClick={(e) => handleInternalLinkClick(e, '/areas/leith-handyman')} 
                  className="hover:text-white text-slate-300 transition-colors"
                >
                  Leith &amp; The Shore (EH6)
                </a>
              </li>
              <li><span className="text-slate-300">Stockbridge &amp; New Town (EH3/EH4)</span></li>
              <li><span className="text-slate-300">Old Town &amp; Southside (EH1/EH8)</span></li>
              <li><span className="text-slate-300">Portobello &amp; Joppa (EH15)</span></li>
              <li><span className="text-slate-300">Musselburgh &amp; East Lothian (EH21)</span></li>
              <li><span className="text-slate-300">Livingston &amp; West Lothian (EH54)</span></li>
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={"tel:" + (siteConfig.phone || BUSINESS_INFO.phone)} className="hover:text-white text-slate-300 font-semibold">
                  {siteConfig.displayPhone || siteConfig.phone || BUSINESS_INFO.displayPhone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={siteConfig.whatsappUrl || BUSINESS_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white text-slate-300">
                  WhatsApp: {siteConfig.whatsappNumber || "+44 7760 696723"}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <a 
                  href={`mailto:${(siteConfig.email && siteConfig.email !== 'ekremguran@gmail.com') ? siteConfig.email : 'info@handyeco.co.uk'}`} 
                  className="hover:text-white text-slate-300"
                >
                  {(siteConfig.email && siteConfig.email !== 'ekremguran@gmail.com') ? siteConfig.email : 'info@handyeco.co.uk'}
                </a>
              </li>
              <li className="flex items-start gap-2 pt-1 text-slate-400">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{siteConfig.workingHours || "Mon - Sat: 8:00 AM - 6:00 PM"}</span>
              </li>
            </ul>

            <div className="pt-4 flex flex-col gap-2.5">
              <a
                href={siteConfig.googleProfileUrl || BUSINESS_INFO.googleProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
                <span>Google Profile & Reviews (5.0 ★)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>&copy; {new Date().getFullYear()} Handyeco - Edinburgh Handyman Services. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>Edinburgh, Scotland</span>
            <a href="#quote" className="hover:text-slate-300">Request Quote</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
