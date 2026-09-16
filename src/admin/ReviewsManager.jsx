import React, { useState } from 'react';
import { Save, CheckCircle, Plus, Trash2, Star, Award, ThumbsUp, RefreshCw, AlertCircle, Check } from 'lucide-react';

export default function ReviewsManager({ data, onSave, token, onRefresh }) {
  const [reviews, setReviews] = useState(data || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

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

  const handleSyncReviews = async () => {
    setSyncing(true);
    setSyncStatus(null);
    try {
      const res = await fetch('/api/reviews/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        if (data.reviews) setReviews(data.reviews);
        setSyncStatus({ success: true, message: data.message });
        if (onRefresh) onRefresh();
      } else {
        setSyncStatus({ success: false, message: data.message || 'Sync failed.' });
      }
    } catch (err) {
      setSyncStatus({ success: false, message: 'Sync error: ' + err.message });
    } finally {
      setSyncing(false);
    }
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Customer Reviews (Google & MyBuilder)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add and manage verified text reviews, author postcodes, ratings, and platform tags.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddReview}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Review</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {saved ? <CheckCircle className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : saved ? 'Saved!' : 'Save Reviews'}</span>
          </button>
        </div>
      </div>

      {/* Google & MyBuilder Automated Sync Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Automated Google Maps & MyBuilder Review Sync
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              New 5-star reviews posted by customers are automatically synced hourly, or click below to pull the latest reviews immediately.
            </p>
          </div>

          <button
            type="button"
            disabled={syncing}
            onClick={handleSyncReviews}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-sm cursor-pointer disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync Reviews Now'}</span>
          </button>
        </div>

        {syncStatus && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            syncStatus.success 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}>
            {syncStatus.success ? <Check className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
            <span>{syncStatus.message}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div className="space-y-3">
              {/* Header: Author & Platform */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Author Name</label>
                  <input
                    type="text"
                    value={rev.author || ''}
                    onChange={e => handleUpdate(rev.id, 'author', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Platform</label>
                  <select
                    value={rev.platform || 'google'}
                    onChange={e => handleUpdate(rev.id, 'platform', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
                  >
                    <option value="google">🔵 Google Maps Verified</option>
                    <option value="mybuilder">🟡 MyBuilder UK Verified</option>
                  </select>
                </div>
              </div>

              {/* Location, Service & Rating */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Location</label>
                  <input
                    type="text"
                    value={rev.location || ''}
                    onChange={e => handleUpdate(rev.id, 'location', e.target.value)}
                    placeholder="New Town (EH3)"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Service Tag</label>
                  <input
                    type="text"
                    value={rev.service || ''}
                    onChange={e => handleUpdate(rev.id, 'service', e.target.value)}
                    placeholder="TV Mounting"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Stars (1–5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={rev.rating || 5}
                    onChange={e => handleUpdate(rev.id, 'rating', Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-amber-500 font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Review Body Text</label>
                <textarea
                  rows={4}
                  value={rev.text || ''}
                  onChange={e => handleUpdate(rev.id, 'text', e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white leading-relaxed italic"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">ID: {rev.id}</span>
              <button
                type="button"
                onClick={() => handleDeleteReview(rev.id)}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
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
