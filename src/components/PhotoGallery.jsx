import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Maximize2, 
  ArrowRight,
  Sparkles,
  Repeat
} from 'lucide-react';
import { GALLERY_ITEMS } from '../data/galleryData';

export default function PhotoGallery({ onOpenLightbox }) {
  const [activeTab, setActiveTab] = useState("all");
  const [beforeAfterStates, setBeforeAfterStates] = useState({});

  const categories = [
    { id: "all", label: "All Work" },
    { id: "assembly", label: "Assembly" },
    { id: "mounting", label: "TV & Wall Mounting" },
    { id: "repairs", label: "Repairs & Silicone" },
    { id: "painting", label: "Painting" },
    { id: "kitchen", label: "Kitchen Wrap" }
  ];

  const filteredItems = activeTab === "all"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeTab);

  const toggleBeforeAfter = (id, e) => {
    e.stopPropagation();
    setBeforeAfterStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="gallery" className="py-14 sm:py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Sleek Minimal Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold mb-3">
            <Camera className="w-3.5 h-3.5 text-blue-600" />
            <span>On-Site Craftsmanship</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Recent Completed Work
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Pristine results across Edinburgh tenements and Lothians homes.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === cat.id
                  ? "bg-slate-900 text-white shadow-sm scale-102"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:border-slate-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Visual-First Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredItems.map((item) => {
            const showBefore = item.isBeforeAfter && beforeAfterStates[item.id];
            const currentImg = showBefore ? item.beforeImage : item.image;

            return (
              <div
                key={item.id}
                onClick={() => onOpenLightbox({
                  image: currentImg,
                  title: item.title,
                  location: item.location,
                  uploadedBy: item.uploadedBy
                })}
                className="group relative rounded-3xl overflow-hidden bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200/80 aspect-[4/3] sm:aspect-[1/1]"
              >
                {/* Full-bleed Photo */}
                <img
                  src={currentImg}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Subtle dark gradient for high contrast text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10 opacity-70 group-hover:opacity-85 transition-opacity" />

                {/* Top Interactive Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
                  {/* Category / Work Tag */}
                  <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white/95 text-slate-900 backdrop-blur-md shadow-xs">
                    {item.badge || "Verified Work"}
                  </span>

                  {/* Interactive Before & After Pill */}
                  {item.isBeforeAfter && (
                    <button
                      onClick={(e) => toggleBeforeAfter(item.id, e)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md ${
                        showBefore 
                          ? "bg-amber-500 text-white hover:bg-amber-600" 
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      <Repeat className="w-3 h-3" />
                      <span>{showBefore ? "Before" : "After"}</span>
                    </button>
                  )}
                </div>

                {/* Center Hover Magnifier */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <span className="p-3 rounded-2xl bg-white/90 text-slate-900 shadow-2xl backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform">
                    <Maximize2 className="w-5 h-5 text-blue-600" />
                  </span>
                </div>

                {/* Minimal Bottom Info (Focused strictly on the work) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-left text-white z-10">
                  <div className="flex items-center gap-1 text-[11px] text-blue-300 font-semibold mb-1">
                    <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                    <span>{item.location}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold leading-tight text-white drop-shadow-sm line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimal Bottom Quote Link */}
        <div className="mt-12 text-center">
          <a
            href="#quote"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm border border-slate-200 shadow-xs hover:shadow-md transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Have a project in Edinburgh? Get a Free Instant Quote</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>

      </div>
    </section>
  );
}
