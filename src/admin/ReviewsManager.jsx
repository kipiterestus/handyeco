import React, { useState } from 'react';
import { Save, CheckCircle, Plus, Trash2, Star, Award, ThumbsUp } from 'lucide-react';

export default function ReviewsManager({ data, onSave }) {
  const [reviews, setReviews] = useState(data || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleUpdate = (id, field, val) => {
    setReviews(prev => prev.map(rev => rev.id === id ? { ...rev, [field]: val } : rev));
    setSaved(false);
  };

  const handleAddReview = () => {
    const newId = 'rev-' + Date.now();
    const newRev = {
      id: newId,
      author: 'Edinburgh Customer Name',
      location: 'Morningside, Edinburgh (EH10)',
      rating: 5,
      relativeTime: 'Recently',
      service: 'Flat-Pack Assembly',
      platform: 'google',
      likes: 1,
      text: 'Write the authentic review feedback here. Punctual, spotless clean, and exceptional workmanship.'
    };
    setReviews(prev => [newRev, ...prev]);
  };

  const handleDeleteReview = (id) => {
    if (!window.confirm('Delete this customer review?')) return;
    setReviews(prev => prev.filter(rev => rev.id !== id));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave('reviews', reviews);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Customer Reviews (Google & MyBuilder)</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Add and manage verified text reviews, author postcodes, ratings, and platform tags.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddReview}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Review</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {saved ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : saved ? 'Saved!' : 'Save Reviews'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-md flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header: Author & Platform */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">Author Name</label>
                  <input
                    type="text"
                    value={rev.author || ''}
                    onChange={e => handleUpdate(rev.id, 'author', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">Platform</label>
                  <select
                    value={rev.platform || 'google'}
                    onChange={e => handleUpdate(rev.id, 'platform', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-blue-500"
                  >
                    <option value="google">🔵 Google Maps Verified</option>
                    <option value="mybuilder">🟡 MyBuilder UK Verified</option>
                  </select>
                </div>
              </div>

              {/* Location, Service & Rating */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">Location</label>
                  <input
                    type="text"
                    value={rev.location || ''}
                    onChange={e => handleUpdate(rev.id, 'location', e.target.value)}
                    placeholder="New Town (EH3)"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">Service Tag</label>
                  <input
                    type="text"
                    value={rev.service || ''}
                    onChange={e => handleUpdate(rev.id, 'service', e.target.value)}
                    placeholder="TV Mounting"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">Stars (1–5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={rev.rating || 5}
                    onChange={e => handleUpdate(rev.id, 'rating', Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">Review Body Text</label>
                <textarea
                  rows={4}
                  value={rev.text || ''}
                  onChange={e => handleUpdate(rev.id, 'text', e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed italic"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">ID: {rev.id}</span>
              <button
                type="button"
                onClick={() => handleDeleteReview(rev.id)}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Review</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
