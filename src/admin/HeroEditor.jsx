import React, { useState } from 'react';
import { Save, CheckCircle, Upload, Sparkles, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';

export default function HeroEditor({ data, onSave, token }) {
  const [form, setForm] = useState(data || {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
    setSaved(false);
  };

  const handleBulletChange = (idx, val) => {
    const next = [...(form.bullets || [])];
    next[idx] = val;
    handleChange('bullets', next);
  };

  const handleAddBullet = () => {
    handleChange('bullets', [...(form.bullets || []), 'New Edinburgh Service Guarantee']);
  };

  const handleRemoveBullet = (idx) => {
    const next = (form.bullets || []).filter((_, i) => i !== idx);
    handleChange('bullets', next);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            dataUrl: reader.result,
            filename: file.name
          })
        });

        const resData = await res.json();
        if (res.ok && resData.success && resData.url) {
          handleChange('heroImage', resData.url);
        }
      } catch (err) {
        console.error('Upload failed:', err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave('hero', form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Hero Section & Headings</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Customize main title, marketing description, bullet guarantees, and active hero photo.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
        >
          {saved ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : saved ? 'Saved Successfully!' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Headlines & Bullets */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Headline & Value Proposition</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Headline Prefix</label>
                <input
                  type="text"
                  value={form.headlineStart || ''}
                  onChange={e => handleChange('headlineStart', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Gradient Highlighted Text</label>
                <input
                  type="text"
                  value={form.headlineHighlight || ''}
                  onChange={e => handleChange('headlineHighlight', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-blue-400 font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Headline Suffix</label>
                <input
                  type="text"
                  value={form.headlineEnd || ''}
                  onChange={e => handleChange('headlineEnd', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={form.description || ''}
                  onChange={e => handleChange('description', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Checklist Bullets */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Key Guarantee Bullets</h3>
              <button
                type="button"
                onClick={handleAddBullet}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bullet</span>
              </button>
            </div>

            <div className="space-y-2">
              {(form.bullets || []).map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={bullet}
                    onChange={e => handleBulletChange(idx, e.target.value)}
                    className="flex-1 px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveBullet(idx)}
                    className="p-2 text-slate-500 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Hero Image & Overlay Card */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-400" />
              <span>Hero Photo Display</span>
            </h3>

            {/* Current Image Preview */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src={form.heroImage || '/hero-handyman-edinburgh.jpg'}
                alt="Hero Preview"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white text-xs">
                <p className="font-bold">{form.completedCount}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{form.completedSubtext}</p>
              </div>
            </div>

            {/* Upload Button */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Change Hero Photo</label>
              <label className="w-full py-3 px-4 rounded-xl border border-dashed border-slate-700 hover:border-blue-500 bg-slate-950 text-slate-300 hover:text-white flex items-center justify-center gap-2 text-xs font-bold cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-blue-400" />
                <span>{uploading ? 'Optimizing & Uploading...' : 'Upload New Photo (Auto WebP)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-500 mt-1">
                Accepts JPG, PNG, WebP. Auto-scaled and optimized by Sharp.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Badge Title</label>
                <input
                  type="text"
                  value={form.completedCount || ''}
                  onChange={e => handleChange('completedCount', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Badge Subtext</label>
                <input
                  type="text"
                  value={form.completedSubtext || ''}
                  onChange={e => handleChange('completedSubtext', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </form>
  );
}
