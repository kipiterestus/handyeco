import React, { useState } from 'react';
import { Save, CheckCircle2, Upload, Sparkles, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';

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
    handleChange('bullets', [...(form.bullets || []), 'Yeni Edinburgh Hizmet Güvencesi']);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-black text-white">Ana Sayfa (Hero)</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Başlık, açıklama ve görsel yönetimi.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Kaydediliyor...' : saved ? 'Kaydedildi!' : 'Kaydet'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Headlines & Bullets */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Başlık & Metinler</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Başlık Başlangıcı (Prefix)</label>
                <input
                  type="text"
                  value={form.headlineStart || ''}
                  onChange={e => handleChange('headlineStart', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Renkli Vurgulanan Kelime (Highlight)</label>
                <input
                  type="text"
                  value={form.headlineHighlight || ''}
                  onChange={e => handleChange('headlineHighlight', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-blue-400 font-bold focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Başlık Bitişi (Suffix)</label>
                <input
                  type="text"
                  value={form.headlineEnd || ''}
                  onChange={e => handleChange('headlineEnd', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Detaylı Açıklama Metni</label>
                <textarea
                  rows={3}
                  value={form.description || ''}
                  onChange={e => handleChange('description', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Checklist Bullets */}
          <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Güvence Maddeleri</h3>
              <button
                type="button"
                onClick={handleAddBullet}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Madde Ekle</span>
              </button>
            </div>

            <div className="space-y-2">
              {(form.bullets || []).map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={bullet}
                    onChange={e => handleBulletChange(idx, e.target.value)}
                    className="flex-1 px-3 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveBullet(idx)}
                    className="p-2 text-zinc-500 hover:text-rose-400 cursor-pointer"
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
          <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-400" />
              <span>Görsel Önizleme</span>
            </h3>

            {/* Current Image Preview */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-inner">
              <img
                src={form.heroImage || '/hero-handyman-edinburgh.jpg'}
                alt="Hero Preview"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090e]/90 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white text-xs">
                <p className="font-bold">{form.completedCount}</p>
                <p className="text-[11px] text-zinc-300 mt-0.5">{form.completedSubtext}</p>
              </div>
            </div>

            {/* Upload Button */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Fotoğraf Değiştir</label>
              <label className="w-full py-3 px-4 rounded-xl border border-dashed border-zinc-700 hover:border-blue-500 bg-zinc-900 text-zinc-300 hover:text-white flex items-center justify-center gap-2 text-xs font-bold cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-blue-400" />
                <span>{uploading ? 'Yükleniyor...' : 'Fotoğraf Yükle'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-zinc-500 mt-1">
                JPG, PNG, WebP desteklenir. Sharp ile otomatik boyutlandırılır ve sıkıştırılır.
              </p>
            </div>

            <div className="pt-2 border-t border-zinc-800 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Rozet Başlığı</label>
                <input
                  type="text"
                  value={form.completedCount || ''}
                  onChange={e => handleChange('completedCount', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Rozet Alt Metni</label>
                <input
                  type="text"
                  value={form.completedSubtext || ''}
                  onChange={e => handleChange('completedSubtext', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </form>
  );
}
