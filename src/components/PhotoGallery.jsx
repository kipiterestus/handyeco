import React, { useState, useRef, useEffect } from 'react';
import { 
  Maximize2, 
  ArrowRight,
  Sparkles,
  Repeat,
  ChevronLeft,
  ChevronRight,
  Camera
} from 'lucide-react';
import { GALLERY_ITEMS as FALLBACK_GALLERY } from '../data/galleryData';
import { useContent } from '../context/ContentContext';

export default function PhotoGallery({ onOpenLightbox }) {
  const { content } = useContent();
  const galleryItems = content.gallery && content.gallery.length > 0 
    ? content.gallery 
    : FALLBACK_GALLERY;

  const [beforeAfterStates, setBeforeAfterStates] = useState({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef(null);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < maxScroll - 15);
    if (maxScroll > 0) {
      setScrollProgress(Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100)));
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [galleryItems]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const card = container.querySelector('[data-gallery-card]');
    const cardWidth = card ? card.offsetWidth + 20 : 340;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const toggleBeforeAfter = (id, e) => {
    e.stopPropagation();
    setBeforeAfterStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="gallery" className="py-12 sm:py-16 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Gallery Header with Slider Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>{galleryItems.length} Proje Fotoğrafı</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Recent Completed Work
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Pristine results across Edinburgh tenements and Lothians homes. Sağa doğru kaydırarak tüm işlerimizi inceleyebilirsiniz.
            </p>
          </div>

          {/* Slider Prev / Next Navigation Buttons (Header) */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous work"
              className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${
                canScrollLeft
                  ? "bg-white text-slate-800 border-slate-300 hover:bg-slate-900 hover:text-white hover:border-slate-900 shadow-xs active:scale-95"
                  : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-40"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Next work"
              className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${
                canScrollRight
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-md active:scale-95"
                  : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-40"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container with Floating Edge Navigation Buttons */}
        <div className="relative group/slider">
          
          {/* Floating Left Arrow (Visible on hover on desktop, or when scrolled) */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 text-slate-900 shadow-xl border border-slate-200 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all backdrop-blur-md"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Floating Right Arrow (Always prominent to encourage scrolling forward/right) */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center cursor-pointer hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Horizontal Smooth Scroll Track */}
          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth scrollbar-none pb-4 pt-1 px-1 -mx-4 px-4 sm:mx-0 sm:px-0 touch-pan-x"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {galleryItems.map((item, index) => {
              const showBefore = item.isBeforeAfter && beforeAfterStates[item.id];
              const currentImg = showBefore ? item.beforeImage : item.image;

              return (
                <div
                  key={item.id}
                  data-gallery-card="true"
                  onClick={() => onOpenLightbox({
                    image: currentImg,
                    title: item.title,
                    location: item.location,
                    uploadedBy: item.uploadedBy
                  })}
                  className="min-w-[280px] xs:min-w-[320px] sm:min-w-[350px] md:min-w-[370px] max-w-[380px] shrink-0 group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-slate-200/90 aspect-[4/3]"
                >
                  {/* Full-bleed Photo */}
                  <img
                    src={currentImg}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                  />

                  {/* Subtle dark gradient for high contrast text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10 opacity-70 group-hover:opacity-85 transition-opacity" />

                  {/* Top Right: Only Before/After Toggle if exists */}
                  {item.isBeforeAfter && (
                    <div className="absolute top-3.5 right-3.5 z-10">
                      <button
                        onClick={(e) => toggleBeforeAfter(item.id, e)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md ${
                          showBefore 
                            ? "bg-amber-500 text-white hover:bg-amber-600" 
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                      >
                        <Repeat className="w-3.5 h-3.5" />
                        <span>{showBefore ? "Before" : "After"}</span>
                      </button>
                    </div>
                  )}

                  {/* Center Hover Magnifier */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="p-3 rounded-2xl bg-white/90 text-slate-900 shadow-2xl backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform">
                      <Maximize2 className="w-5 h-5 text-blue-600" />
                    </span>
                  </div>

                  {/* Bottom Info: Clean, Compact Typography */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-left text-white z-10">
                    <h3 className="text-sm sm:text-base font-bold leading-snug text-white drop-shadow-sm line-clamp-2">
                      {item.title}
                    </h3>
                    {item.location && (
                      <p className="text-[11px] text-slate-300 mt-1 font-medium truncate">
                        📍 {item.location}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Scroll Progress Bar & Counter */}
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex-1 max-w-xs h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-150"
              style={{ width: `${Math.max(10, scrollProgress)}%` }}
            />
          </div>

          <span className="text-[11px] font-bold text-slate-500 shrink-0">
            Toplam {galleryItems.length} Fotoğraf &bull; Sağa kaydırın &rarr;
          </span>
        </div>

        {/* Bottom Quote Link */}
        <div className="mt-8 sm:mt-10 text-center">
          <a
            href="#quote"
            className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs sm:text-sm border border-slate-200 shadow-xs hover:shadow-md transition-all active:scale-95"
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
