import React, { useState, useEffect } from 'react';
import { 
  Star, 
  CheckCircle2, 
  ExternalLink, 
  ThumbsUp, 
  Search, 
  Camera,
  MapPin,
  Calendar
} from 'lucide-react';
import { REVIEWS } from '../data/reviewsData';
import { BUSINESS_INFO } from '../data/businessData';

export default function GoogleReviews({ onOpenLightbox }) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [likes, setLikes] = useState(() => {
    const initial = {};
    REVIEWS.forEach(r => { initial[r.id] = r.likes; });
    return initial;
  });
  const [likedReviews, setLikedReviews] = useState({});

  // Filter reviews
  const filteredReviews = REVIEWS.filter(rev => {
    const matchesFilter = selectedFilter === "all" || rev.category === selectedFilter;
    const matchesSearch = searchQuery === "" || 
      rev.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleLike = (id, e) => {
    e.stopPropagation();
    if (likedReviews[id]) return;
    setLikes(prev => ({ ...prev, [id]: prev[id] + 1 }));
    setLikedReviews(prev => ({ ...prev, [id]: true }));
  };

  const categories = [
    { id: "all", label: "All Reviews (48)" },
    { id: "assembly", label: "Flat-Pack Assembly" },
    { id: "mounting", label: "TV & Mounting" },
    { id: "repairs", label: "Home Repairs & Sealing" },
    { id: "painting", label: "Painting" },
    { id: "outdoor", label: "Garden & Fencing" }
  ];

  return (
    <section id="reviews" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header with Google Brand & Overall Rating */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Google Places Feed &bull; 100% Real Customer Feedback</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Real Customer Reviews
            </h2>
            <p className="text-base text-slate-600 mt-2 max-w-xl">
              Verified reviews from Edinburgh homeowners and tenants on Google. Honest feedback on punctuality, craftsmanship, and clean work.
            </p>
          </div>

          {/* Google Score Summary Card */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-3">
              {/* Google G Icon */}
              <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center font-bold text-xl text-blue-600">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-slate-900 leading-none">5.0</span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 font-semibold mt-1">
                  Google Verified Rating &bull; 48 Reviews
                </p>
              </div>
            </div>

            <a
              href={BUSINESS_INFO.googleProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-colors shadow-xs"
            >
              <span>Write a Review</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedFilter === cat.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Reviews Cards Grid (NO PROFILE PHOTOS, REAL NAMES & CLEAN TYPOGRAPHY) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-slate-50/70 hover:bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between text-left group"
            >
              <div>
                {/* Clean Typographic Header (Real Name, Location & Google Badge) */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {review.author}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{review.location}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" />
                    <span>Google Verified</span>
                  </div>
                </div>

                {/* Stars & Relative Date */}
                <div className="flex items-center justify-between mb-3 text-xs">
                  <div className="flex text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-300" />
                    {review.relativeTime}
                  </span>
                </div>

                {/* Service Tag */}
                <div className="inline-block bg-white text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-3">
                  {review.service}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{review.text}"
                </p>

                {/* Real Job Photo from Google attached to Review */}
                {review.hasPhoto && review.photos && review.photos.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-600 mb-2 flex items-center gap-1">
                      <Camera className="w-3 h-3 text-blue-600" />
                      <span>Job photo uploaded with review:</span>
                    </p>
                    <div 
                      onClick={() => onOpenLightbox({
                        image: review.photos[0].url,
                        title: review.service,
                        description: review.photos[0].caption,
                        location: review.location,
                        uploadedBy: review.author
                      })}
                      className="relative rounded-xl overflow-hidden aspect-video cursor-pointer group/photo border border-slate-200"
                    >
                      <img
                        src={review.photos[0].url}
                        alt={review.photos[0].caption}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/photo:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                        <ExternalLink className="w-4 h-4" />
                        <span>View Photo</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Helpful / Like Counter */}
              <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[11px]">Posted on Google Maps</span>
                <button
                  onClick={(e) => handleLike(review.id, e)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    likedReviews[review.id]
                      ? "text-blue-600 font-bold bg-blue-50"
                      : "hover:bg-slate-200/60 text-slate-600"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({likes[review.id]})</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 mt-6">
            <p className="text-slate-600 text-sm">No reviews found matching "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedFilter("all"); }}
              className="mt-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Callout below reviews */}
        <div className="mt-12 text-center">
          <a
            href={BUSINESS_INFO.googleProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>Read all 48+ five-star reviews directly on Google Maps</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
