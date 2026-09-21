import React, { useState, useMemo } from 'react';
import { 
  Star, 
  CheckCircle2, 
  ExternalLink, 
  ThumbsUp, 
  Search, 
  MapPin,
  Calendar,
  Award,
  ArrowUpDown,
  Clock
} from 'lucide-react';
import { REVIEWS as FALLBACK_REVIEWS, REVIEWS_STATS } from '../data/reviewsData';
import { BUSINESS_INFO } from '../data/businessData';
import { useContent } from '../context/ContentContext';

/**
 * Calculates a comparable timestamp from explicit date, relativeTime string, or ID.
 */
export function getReviewTimestamp(review) {
  if (!review) return 0;

  // 1. Direct explicit date or createdAt (YYYY-MM-DD or ISO string)
  if (review.date) {
    const parsed = new Date(review.date).getTime();
    if (!isNaN(parsed)) return parsed;
  }
  if (review.createdAt) {
    const parsed = new Date(review.createdAt).getTime();
    if (!isNaN(parsed)) return parsed;
  }

  // 2. Parse relative time text (e.g. "3 days ago", "1 week ago", "2 months ago")
  const rel = (review.relativeTime || '').toLowerCase().trim();
  const now = Date.now();
  const HOUR = 60 * 60 * 1000;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  const MONTH = 30 * DAY;
  const YEAR = 365 * DAY;

  if (rel.includes('hour')) {
    const match = rel.match(/(\d+)/);
    const count = match ? parseInt(match[1], 10) : 1;
    return now - count * HOUR;
  }
  if (rel.includes('yesterday')) {
    return now - DAY;
  }
  if (rel.includes('day')) {
    const match = rel.match(/(\d+)/);
    const count = match ? parseInt(match[1], 10) : 1;
    return now - count * DAY;
  }
  if (rel.includes('week')) {
    const match = rel.match(/(\d+)/);
    const count = match ? parseInt(match[1], 10) : 1;
    return now - count * WEEK;
  }
  if (rel.includes('month')) {
    const match = rel.match(/(\d+)/);
    const count = match ? parseInt(match[1], 10) : 1;
    return now - count * MONTH;
  }
  if (rel.includes('year')) {
    const match = rel.match(/(\d+)/);
    const count = match ? parseInt(match[1], 10) : 1;
    return now - count * YEAR;
  }
  if (rel.includes('recently') || rel.includes('new')) {
    return now - 2 * DAY;
  }

  // 3. Fallback: Check for timestamp embedded in review ID (e.g. rev-1726000000)
  if (review.id) {
    const idMatch = review.id.match(/\d{10,13}/);
    if (idMatch) {
      let val = parseInt(idMatch[0], 10);
      if (val < 10000000000) val *= 1000;
      return val;
    }
  }

  return 0;
}

/**
 * Calculates human-readable relative time based on review's explicit date or relativeTime
 */
export function formatReviewTime(review) {
  if (review?.date) {
    const reviewDate = new Date(review.date);
    if (!isNaN(reviewDate.getTime())) {
      const now = new Date();
      const diffMs = now.getTime() - reviewDate.getTime();
      const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 14) return '1 week ago';
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 60) return '1 month ago';
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
    }
  }
  return review?.relativeTime || 'Recently';
}

export default function GoogleReviews() {
  const { content } = useContent();
  const reviewsList = content.reviews && content.reviews.length > 0 ? content.reviews : FALLBACK_REVIEWS;
  const siteConfig = content.siteConfig || BUSINESS_INFO;

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // 'newest' (Tarihe göre - en yeni ilk) | 'oldest' | 'helpful'
  const [searchQuery, setSearchQuery] = useState("");
  const [likes, setLikes] = useState(() => {
    const initial = {};
    reviewsList.forEach(r => { initial[r.id] = r.likes || 0; });
    return initial;
  });
  const [likedReviews, setLikedReviews] = useState({});

  // Filter & Sort reviews chronologically by date
  const filteredReviews = useMemo(() => {
    return reviewsList.filter(rev => {
      const matchesCategory = selectedFilter === "all" || rev.category === selectedFilter;
      const matchesSearch = searchQuery === "" || 
        rev.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rev.location && rev.location.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'oldest') {
        return getReviewTimestamp(a) - getReviewTimestamp(b);
      }
      if (sortBy === 'helpful') {
        return (likes[b.id] ?? b.likes ?? 0) - (likes[a.id] ?? a.likes ?? 0);
      }
      // Varsayılan: newest (Tarihe göre en yeni en üstte)
      return getReviewTimestamp(b) - getReviewTimestamp(a);
    });
  }, [reviewsList, selectedFilter, searchQuery, sortBy, likes]);

  const handleLike = (id, e) => {
    e.stopPropagation();
    if (likedReviews[id]) return;
    setLikes(prev => ({ ...prev, [id]: prev[id] + 1 }));
    setLikedReviews(prev => ({ ...prev, [id]: true }));
  };

  const categories = [
    { id: "all", label: "All Work" },
    { id: "assembly", label: "Flat-Pack Assembly" },
    { id: "mounting", label: "TV & Wall Mounting" },
    { id: "repairs", label: "Home Repairs & Sealing" },
    { id: "painting", label: "Painting" },
    { id: "kitchen", label: "Kitchen Wrap" },
    { id: "outdoor", label: "Garden & Fencing" }
  ];

  return (
    <section id="reviews" className="pt-4 sm:pt-8 pb-14 sm:pb-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header with 100% Real Google Reviews Verification */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 sm:px-6 py-2 rounded-full bg-emerald-50 border-2 border-emerald-300/80 text-emerald-900 text-xs sm:text-sm md:text-base font-extrabold shadow-xs mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span>100% Real Feedback &bull; Verified Google Reviews Profile</span>
          </div>
          
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl mx-auto leading-relaxed">
            Authentic reviews from Edinburgh homeowners and tenants on Google Maps. Pure honest feedback on craftsmanship, punctuality, and spotless tidy&nbsp;work.
          </p>
        </div>

        {/* 100% Official Google Reviews Banner at Top */}
        <div className="max-w-4xl mx-auto w-full mb-8">
          <div className="bg-gradient-to-r from-blue-50/90 via-white to-indigo-50/90 border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              {/* Google Brand Badge */}
              <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center shrink-0">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <div className="flex text-amber-400 shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-slate-900 font-extrabold text-sm sm:text-base whitespace-nowrap">
                    {siteConfig.googleRating || '5.0'} Star Rated Tradesperson
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Verified Google Business Profile &bull; Edinburgh & Lothians Handyman
                </p>
              </div>
            </div>

            {/* Google Reviews Direct Action Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <a
                href={siteConfig.googleProfileUrl || 'https://maps.app.goo.gl/jQH6GXAotpV1oXG78'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all active:scale-95 whitespace-nowrap"
              >
                <span>Google Reviews ({siteConfig.googleReviewCount || 73})</span>
                <ExternalLink className="w-4 h-4 shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* Category Filters, Search Bar & Chronological Sort */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedFilter === cat.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Right Side: Sort & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Sort Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl shrink-0">
              <div className="flex items-center gap-1 px-2 text-[11px] font-bold text-slate-500">
                <ArrowUpDown className="w-3 h-3 text-slate-400" />
                <span className="hidden lg:inline">Sort:</span>
              </div>
              <button
                type="button"
                onClick={() => setSortBy("newest")}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  sortBy === "newest"
                    ? "bg-white text-blue-600 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Sort by newest reviews first"
              >
                Newest First
              </button>
              <button
                type="button"
                onClick={() => setSortBy("oldest")}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  sortBy === "oldest"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Sort by oldest reviews first"
              >
                Oldest
              </button>
              <button
                type="button"
                onClick={() => setSortBy("helpful")}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  sortBy === "helpful"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Sort by most helpful reviews"
              >
                Helpful
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-48 pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Reviews Cards Grid (PHOTOLESS AS REQUESTED - PURE TEXTUAL TRUST & AUTHENTIC NAMES) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredReviews.map((review) => {
            const isGoogle = review.platform === "google";

            return (
              <div
                key={review.id}
                className="bg-slate-50/80 hover:bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between text-left group"
              >
                <div>
                  {/* Review Top Header: Author, Location & Platform Badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {review.author}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
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
                      {formatReviewTime(review)}
                    </span>
                  </div>

                  {/* Service Tag */}
                  <div className="inline-block bg-white text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-3">
                    {review.service}
                  </div>

                  {/* Review Text (Clean typography, no photos attached) */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "{review.text}"
                  </p>
                </div>

                {/* Bottom Source & Helpful Counter */}
                <div className="mt-5 pt-3.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-500" />
                    <span>Posted on Google Maps</span>
                  </span>
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
            );
          })}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 mt-6">
            <p className="text-slate-600 text-sm">No reviews found matching "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedFilter("all"); }}
              className="mt-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
