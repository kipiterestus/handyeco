import React, { useState } from 'react';
import { 
  Star, 
  CheckCircle2, 
  ExternalLink, 
  ThumbsUp, 
  Search, 
  MapPin,
  Calendar,
  Award
} from 'lucide-react';
import { REVIEWS, REVIEWS_STATS } from '../data/reviewsData';
import { BUSINESS_INFO } from '../data/businessData';

export default function GoogleReviews() {
  const [selectedPlatform, setSelectedPlatform] = useState("all"); // 'all' | 'google' | 'mybuilder'
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
    const matchesPlatform = selectedPlatform === "all" || rev.platform === selectedPlatform;
    const matchesCategory = selectedFilter === "all" || rev.category === selectedFilter;
    const matchesSearch = searchQuery === "" || 
      rev.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesCategory && matchesSearch;
  });

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
        
        {/* Header with Google & MyBuilder Verification */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>100% Real Feedback &bull; Verified Google & MyBuilder Profiles</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Real Customer Reviews
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl mx-auto">
            Authentic reviews from Edinburgh homeowners and tenants on Google Maps and MyBuilder. Pure honest feedback on craftsmanship, punctuality, and spotless tidy work.
          </p>
        </div>

        {/* Dual Score Banners (Google & MyBuilder): Centered & Widened */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto mb-10 w-full">
          
          {/* Google Score Card - Expanded & Centered */}
          <div className="bg-white border-2 border-slate-200/90 hover:border-blue-300 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left group">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">Google Reviews</h3>
                  <p className="text-xs text-slate-500 font-medium">Google Maps Edinburgh Profile</p>
                </div>
              </div>

              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                Verified
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">5.0</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-500 ml-1">48 Reviews</span>
            </div>

            <a
              href={BUSINESS_INFO.googleProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold transition-all"
            >
              <span>View Google Profile & Reviews</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* MyBuilder Score Card - Expanded & Centered */}
          <div className="bg-white border-2 border-slate-200/90 hover:border-amber-400 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left group">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white shadow-xs border border-amber-600 flex items-center justify-center shrink-0 font-black text-sm">
                  MB
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">MyBuilder Profile</h3>
                  <p className="text-xs text-slate-500 font-medium">Verified Edinburgh Tradesperson</p>
                </div>
              </div>

              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                100% Positive
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">100%</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-500 ml-1">Feedback Score</span>
            </div>

            <a
              href={BUSINESS_INFO.myBuilderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-500 text-amber-800 hover:text-white text-xs font-bold transition-all"
            >
              <span>View MyBuilder Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Platform Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {/* Platform Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl shrink-0">
              <button
                onClick={() => setSelectedPlatform("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPlatform === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All (Google & MyBuilder)
              </button>
              <button
                onClick={() => setSelectedPlatform("google")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPlatform === "google" ? "bg-white text-blue-600 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Google Only
              </button>
              <button
                onClick={() => setSelectedPlatform("mybuilder")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPlatform === "mybuilder" ? "bg-white text-amber-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                MyBuilder Only
              </button>
            </div>

            {/* Category Pills */}
            <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-200">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFilter(cat.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedFilter === cat.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search reviews input */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
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

                    {isGoogle ? (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-blue-600" />
                        <span>Google Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
                        <Award className="w-3 h-3 text-amber-600" />
                        <span>MyBuilder Verified</span>
                      </div>
                    )}
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

                  {/* Review Text (Clean typography, no photos attached) */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "{review.text}"
                  </p>
                </div>

                {/* Bottom Source & Helpful Counter */}
                <div className="mt-5 pt-3.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px] font-medium text-slate-500">
                    {isGoogle ? "Posted on Google Maps" : "Posted on MyBuilder"}
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
              onClick={() => { setSearchQuery(""); setSelectedFilter("all"); setSelectedPlatform("all"); }}
              className="mt-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Dual Platform Verification Card below reviews */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto w-full">
          <div className="bg-gradient-to-r from-blue-50/90 via-white to-amber-50/90 border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              {/* Overlapping Brand Badges */}
              <div className="flex -space-x-2.5 shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white shadow-xs border-2 border-white flex items-center justify-center shrink-0 font-black text-sm">
                  MB
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <div className="flex text-amber-400 shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-slate-900 font-extrabold text-sm sm:text-base whitespace-nowrap">
                    5.0 Star Rated Tradesperson
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Verified across Google Maps & MyBuilder UK Edinburgh Directory
                </p>
              </div>
            </div>

            {/* Action Buttons: Never wrap text awkwardly */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <a
                href={BUSINESS_INFO.googleProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-all active:scale-95 whitespace-nowrap"
              >
                <span>Google Reviews</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>

              <a
                href={BUSINESS_INFO.myBuilderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-xs transition-all active:scale-95 whitespace-nowrap"
              >
                <span>MyBuilder Profile</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
