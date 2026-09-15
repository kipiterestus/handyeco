import React, { useEffect } from 'react';
import { X, MapPin, User, Calendar, ExternalLink } from 'lucide-react';

export default function LightboxModal({ item, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 text-white text-left flex flex-col max-h-[92vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white/90 hover:text-white hover:bg-black/90 transition-colors cursor-pointer"
          aria-label="Close image modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image Display */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[460px]">
          <img
            src={item.image}
            alt={item.title || "Customer job photograph"}
            className="w-full h-full object-contain max-h-[70vh]"
          />
        </div>

        {/* Details Footer */}
        <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-2">
          <h3 className="text-lg sm:text-xl font-bold text-white">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {item.description}
            </p>
          )}

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            {item.location && (
              <span className="flex items-center gap-1 text-blue-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>{item.location}</span>
              </span>
            )}
            {item.uploadedBy && (
              <span className="flex items-center gap-1 text-slate-300">
                <User className="w-3.5 h-3.5" />
                <span>{item.uploadedBy}</span>
              </span>
            )}
            <span className="text-[11px] text-emerald-400 font-semibold">
              &bull; Verified Edinburgh Job
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
