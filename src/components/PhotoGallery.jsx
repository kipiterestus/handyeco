import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Layers, 
  Play, 
  Pause,
  Grid3X3,
  Sliders
} from 'lucide-react';
import { GALLERY_ITEMS } from '../data/galleryData';

export default function PhotoGallery({ onOpenLightbox }) {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("carousel"); // 'carousel' | 'grid'
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [beforeAfterStates, setBeforeAfterStates] = useState({});

  const tabs = [
    { id: "all", label: "All Projects" },
    { id: "assembly", label: "Furniture Assembly" },
    { id: "mounting", label: "TV & Wall Mounting" },
    { id: "painting", label: "Painting" },
    { id: "repairs", label: "Silicone & Repairs" },
    { id: "kitchen", label: "Kitchen Wrap" },
    { id: "outdoor", label: "Outdoor & Fencing" }
  ];

  const filteredItems = activeTab === "all"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeTab);

  // Auto-slide carousel
  useEffect(() => {
    if (!isAutoPlaying || viewMode !== "carousel" || filteredItems.length <= 1) return;
    const timer = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % filteredItems.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, viewMode, filteredItems.length]);

  // Keep carouselIndex in range when tab changes
  useEffect(() => {
    setCarouselIndex(0);
  }, [activeTab]);

  const toggleBeforeAfter = (id, e) => {
    e.stopPropagation();
    setBeforeAfterStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const nextSlide = () => {
    setCarouselIndex(prev => (prev + 1) % filteredItems.length);
  };

  const prevSlide = () => {
    setCarouselIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const currentItem = filteredItems[carouselIndex] || filteredItems[0];
  const showBefore = currentItem?.isBeforeAfter && beforeAfterStates[currentItem.id];
  const currentImg = showBefore ? currentItem?.beforeImage : currentItem?.image;

  return (
    <section id="gallery" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              <span>Real Job Photos & Client Uploads</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Recent Completed Work in Edinburgh
            </h2>
            <p className="text-base text-slate-600 mt-2 max-w-xl">
              Authentic photographs taken on-site across Edinburgh and Lothians. Browse using our rotating showcase or full grid.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200/90 shadow-2xs self-start md:self-auto">
            <button
              onClick={() => setViewMode("carousel")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "carousel"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Rotating Gallery</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>All Photos Grid</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. ROTATING CAROUSEL VIEW */}
        {viewMode === "carousel" && currentItem && (
          <div className="bg-white rounded-3xl p-4 sm:p-7 border border-slate-200/80 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Image Area */}
              <div 
                onClick={() => onOpenLightbox({
                  image: currentImg,
                  title: currentItem.title,
                  description: currentItem.description,
                  location: currentItem.location,
                  uploadedBy: currentItem.uploadedBy
                })}
                className="lg:col-span-8 relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 cursor-pointer group"
              >
                <img
                  src={currentImg}
                  alt={currentItem.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70 group-hover:opacity-80 transition-opacity" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between gap-2 z-10">
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-white/95 text-slate-900 shadow-sm backdrop-blur-xs truncate max-w-[140px] sm:max-w-none">
                    {currentItem.badge}
                  </span>

                  {currentItem.isBeforeAfter && (
                    <button
                      onClick={(e) => toggleBeforeAfter(currentItem.id, e)}
                      className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm flex items-center gap-1 sm:gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="hidden sm:inline">{showBefore ? "Showing: BEFORE (Click for After)" : "Showing: AFTER (Click for Before)"}</span>
                      <span className="sm:hidden">{showBefore ? "Before (Tap)" : "After (Tap)"}</span>
                    </button>
                  )}
                </div>

                {/* Hover Click to enlarge icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="p-2.5 sm:p-3 rounded-2xl bg-white/95 text-slate-900 shadow-xl flex items-center gap-2 text-xs font-bold">
                    <Maximize2 className="w-4 h-4 text-blue-600" />
                    <span>Click for Fullscreen Zoom</span>
                  </span>
                </div>

                {/* Navigation arrows directly over image */}
                <button
                  onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition-all cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition-all cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Bottom Image Info */}
                <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                  <p className="text-xs text-blue-300 font-semibold flex items-center gap-1 mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{currentItem.location}</span>
                  </p>
                  <h3 className="text-base sm:text-xl font-bold leading-tight drop-shadow-md">
                    {currentItem.title}
                  </h3>
                </div>
              </div>

              {/* Details & Controls Sidebar */}
              <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-6 text-left p-2">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-bold text-blue-600">Photo {carouselIndex + 1} of {filteredItems.length}</span>
                    <span>{currentItem.date}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {currentItem.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                    {currentItem.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{currentItem.uploadedBy}</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                      Verified Edinburgh Job
                    </span>
                  </div>
                </div>

                {/* Carousel Controls */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      {isAutoPlaying ? <Pause className="w-3.5 h-3.5 text-blue-600" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
                      <span>{isAutoPlaying ? "Auto-sliding active" : "Auto-slide paused"}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={prevSlide}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                        aria-label="Previous"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                        aria-label="Next"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Row */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {filteredItems.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => setCarouselIndex(idx)}
                        className={`w-14 h-11 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          carouselIndex === idx
                            ? "border-blue-600 scale-105 shadow-xs"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={item.image} alt="thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* 2. ALL PHOTOS GRID VIEW */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const showBeforeG = item.isBeforeAfter && beforeAfterStates[item.id];
              const currentImgG = showBeforeG ? item.beforeImage : item.image;

              return (
                <div
                  key={item.id}
                  onClick={() => onOpenLightbox({
                    image: currentImgG,
                    title: item.title,
                    description: item.description,
                    location: item.location,
                    uploadedBy: item.uploadedBy
                  })}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 group cursor-pointer flex flex-col justify-between text-left"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={currentImgG}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-slate-800 shadow-xs">
                        {item.badge}
                      </span>
                      {item.isBeforeAfter && (
                        <button
                          onClick={(e) => toggleBeforeAfter(item.id, e)}
                          className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Layers className="w-3 h-3" />
                          <span>{showBeforeG ? "After" : "Before"}</span>
                        </button>
                      )}
                    </div>

                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                      <span className="flex items-center gap-1 text-[11px] text-slate-200">
                        <MapPin className="w-3 h-3 text-blue-400" />
                        <span>{item.location}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">{item.uploadedBy}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
