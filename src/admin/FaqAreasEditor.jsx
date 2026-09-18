import React, { useState } from 'react';
import { Save, CheckCircle2, Plus, Trash2, HelpCircle, MapPin } from 'lucide-react';

export default function FaqAreasEditor({ areasData, faqData, onSave }) {
  const [areas, setAreas] = useState(areasData || []);
  const [faqs, setFaqs] = useState(faqData || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleAreaUpdate = (idx, field, val) => {
    const next = [...areas];
    next[idx] = { ...next[idx], [field]: val };
    setAreas(next);
    setSaved(false);
  };

  const handleAddArea = () => {
    setAreas(prev => [...prev, { zone: 'Yeni Bölge', postcodes: 'EH...', areas: 'Semt isimleri' }]);
  };

  const handleDeleteArea = (idx) => {
    setAreas(prev => prev.filter((_, i) => i !== idx));
  };

  const handleFaqUpdate = (idx, field, val) => {
    const next = [...faqs];
    next[idx] = { ...next[idx], [field]: val };
    setFaqs(next);
    setSaved(false);
  };

  const handleAddFaq = () => {
    setFaqs(prev => [...prev, { q: 'Yeni Sıkça Sorulan Soru?', a: 'Edinburgh müşterileriniz için detaylı ve net cevap.' }]);
  };

  const handleDeleteFaq = (idx) => {
    setFaqs(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave('areas', areas);
    await onSave('faq', faqs);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-black text-white">Bölgeler & SSS</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Hizmet bölgeleri ve sık sorulan soruları yönetin.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Kaydediliyor...' : saved ? 'Kaydedildi!' : 'Kaydet'}</span>
        </button>
      </div>

      {/* 1. Edinburgh Areas Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>Hizmet Bölgeleri</span>
          </h3>
          <button
            type="button"
            onClick={handleAddArea}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Bölge Ekle</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {areas.map((area, idx) => (
            <div key={idx} className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-4 space-y-3 relative group shadow-md hover:border-zinc-700 transition-all">
              <button
                type="button"
                onClick={() => handleDeleteArea(idx)}
                className="absolute top-3 right-3 text-zinc-500 hover:text-rose-400 p-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-0.5">Bölge Adı</label>
                <input
                  type="text"
                  value={area.zone}
                  onChange={e => handleAreaUpdate(idx, 'zone', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-xl text-blue-400 font-bold focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-0.5">Posta Kodları (EH)</label>
                <input
                  type="text"
                  value={area.postcodes}
                  onChange={e => handleAreaUpdate(idx, 'postcodes', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-0.5">Öne Çıkan Semtler</label>
                <input
                  type="text"
                  value={area.areas}
                  onChange={e => handleAreaUpdate(idx, 'areas', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-300 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. FAQ Section */}
      <div className="space-y-4 pt-4 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Sık Sorulan Sorular</span>
          </h3>
          <button
            type="button"
            onClick={handleAddFaq}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Soru Ekle</span>
          </button>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-5 space-y-3 relative group shadow-md hover:border-zinc-700 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Soru {idx + 1}</label>
                  <input
                    type="text"
                    value={faq.q}
                    onChange={e => handleFaqUpdate(idx, 'q', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white font-bold focus:border-blue-500 outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteFaq(idx)}
                  className="mt-6 text-zinc-500 hover:text-rose-400 p-2 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Cevap Metni</label>
                <textarea
                  rows={3}
                  value={faq.a}
                  onChange={e => handleFaqUpdate(idx, 'a', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-300 focus:border-blue-500 outline-none leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
