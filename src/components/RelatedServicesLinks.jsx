import React from 'react';
import { Wrench, Tv, Shield, Home, Paintbrush, Layers, Fence, MapPin, ArrowRight } from 'lucide-react';
import { handleInternalLinkClick } from '../utils/navigation';

const ALL_SERVICES = [
  {
    href: '/services/flat-pack-assembly-edinburgh',
    title: 'Flat-Pack & IKEA Assembly',
    desc: 'IKEA PAX wardrobes, bed frames, tables & desks.',
    icon: Wrench,
    badge: 'IKEA Specialists'
  },
  {
    href: '/services/tv-wall-mounting-edinburgh',
    title: 'TV Wall Mounting',
    desc: 'Sandstone stone walls, lath & plaster, stud frames.',
    icon: Tv,
    badge: 'Stone Wall Expert'
  },
  {
    href: '/services/silicone-sealing-edinburgh',
    title: 'Bathroom Silicone Sealing',
    desc: 'Anti-mould sanitary silicone for showers & bathtubs.',
    icon: Shield,
    badge: 'Mould-Free Guarantee'
  },
  {
    href: '/services/tenement-repairs-edinburgh',
    title: 'Tenement Repairs & Odd Jobs',
    desc: 'Victorian doors, locks, sash windows & fittings.',
    icon: Home,
    badge: 'Historic Edinburgh'
  },
  {
    href: '/services/painting-decorating-edinburgh',
    title: 'Painting & Decorating',
    desc: 'Walls, woodwork glossing, water stains & touch-ups.',
    icon: Paintbrush,
    badge: 'Dust-Free Tidy'
  },
  {
    href: '/services/kitchen-vinyl-wrapping-edinburgh',
    title: 'Kitchen Vinyl Wrapping',
    desc: 'Modernise cupboard doors at a fraction of full cost.',
    icon: Layers,
    badge: 'Smart Renovation'
  },
  {
    href: '/services/garden-gate-fencing-edinburgh',
    title: 'Garden Gate & Fencing',
    desc: 'Timber fence repairs, gate latches & post fixing.',
    icon: Fence,
    badge: 'Outdoor Repairs'
  }
];

const ALL_AREAS = [
  { href: '/areas/morningside-handyman', name: 'Morningside (EH10)' },
  { href: '/areas/leith-handyman', name: 'Leith & Shore (EH6)' },
  { href: '/areas/stockbridge-new-town-handyman', name: 'Stockbridge & New Town (EH3/EH4)' },
  { href: '/areas/old-town-southside-handyman', name: 'Old Town & Southside (EH1/EH8)' },
  { href: '/areas/portobello-handyman', name: 'Portobello (EH15)' },
  { href: '/areas/musselburgh-handyman', name: 'Musselburgh (EH21)' },
  { href: '/areas/livingston-handyman', name: 'Livingston (EH54)' }
];

export default function RelatedServicesLinks({ currentPath, category = 'service' }) {
  // Filter out the current page
  const relatedServices = ALL_SERVICES.filter(s => s.href !== currentPath).slice(0, 4);

  return (
    <section className="py-12 sm:py-16 bg-slate-100/70 border-t border-slate-200 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with strong internal link to Home for 'handyman edinburgh' keyword */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-blue-600 font-bold text-xs uppercase tracking-wider block mb-1">
              Complete Edinburgh Home Solutions
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Looking for other{' '}
              <a 
                href="/" 
                onClick={(e) => handleInternalLinkClick(e, '/')}
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
                title="Handyeco - Trusted Handyman in Edinburgh"
              >
                Handyman Services in Edinburgh?
              </a>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              We provide fixed upfront quotes, zero call-out charges, and clean, punctual craftsmanship across Edinburgh and the Lothians.
            </p>
          </div>

          <a
            href="/"
            onClick={(e) => handleInternalLinkClick(e, '/')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline shrink-0"
          >
            <span>View All Handyman Services</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* 4 Related Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
          {relatedServices.map((service, idx) => {
            const IconComponent = service.icon;
            return (
              <a
                key={idx}
                href={service.href}
                onClick={(e) => handleInternalLinkClick(e, service.href)}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    {service.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                    {service.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {service.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                  <span>Explore Service</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </a>
            );
          })}
        </div>

        {/* Coverage Areas Links */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-500 shrink-0" />
            <div>
              <span className="font-bold text-sm text-slate-900 block">
                Serving All Edinburgh Postcodes (EH1–EH17) &amp; Lothians
              </span>
              <span className="text-xs text-slate-500">
                Dedicated local handyman coverage across Edinburgh's top neighbourhoods.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {ALL_AREAS.map((area, idx) => (
              <a
                key={idx}
                href={area.href}
                onClick={(e) => handleInternalLinkClick(e, area.href)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                  currentPath === area.href
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-blue-600'
                }`}
              >
                {area.name}
              </a>
            ))}
          </div>
        </div>

        {/* Cost Guide Banner Link */}
        {currentPath !== '/pricing/handyman-edinburgh-cost-guide' && (
          <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm shadow-2xs">
            <div className="flex items-center gap-2 text-emerald-900 font-medium">
              <span className="font-bold text-emerald-800">Looking for transparent costs?</span>
              <span className="hidden md:inline text-emerald-700">&bull; Review typical rates, assembly times, and fixed prices across Edinburgh.</span>
            </div>
            <a
              href="/pricing/handyman-edinburgh-cost-guide"
              onClick={(e) => handleInternalLinkClick(e, '/pricing/handyman-edinburgh-cost-guide')}
              className="inline-flex items-center gap-1.5 font-bold text-emerald-800 hover:text-emerald-900 hover:underline shrink-0 bg-white px-3 py-1.5 rounded-xl border border-emerald-300 shadow-2xs"
            >
              <span>View 2026 Edinburgh Handyman Cost Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

      </div>
    </section>
  );
}
