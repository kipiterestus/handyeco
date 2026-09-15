import React, { useState } from 'react';
import { Save, CheckCircle, Plus, Trash2, HelpCircle, MapPin } from 'lucide-react';

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
    setAreas(prev => [...prev, { zone: 'New Zone', postcodes: 'EH...', areas: 'Neighborhood names' }]);
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
    setFaqs(prev => [...prev, { q: 'New Frequently Asked Question?', a: 'Detailed answer for your Edinburgh clients.' }]);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Edinburgh Coverage Areas & FAQs</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage EH postcode zones and customer frequently asked questions.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
        >
          {saved ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : saved ? 'Saved!' : 'Save Areas & FAQ'}</span>
        </button>
      </div>

      {/* 1. Edinburgh Areas Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>Edinburgh & Lothians Coverage Zones</span>
          </h3>
          <button
            type="button"
            onClick={handleAddArea}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Zone</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {areas.map((area, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 relative group">
              <button
                type="button"
                onClick={() => handleDeleteArea(idx)}
                className="absolute top-3 right-3 text-slate-600 hover:text-rose-400 p-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">Zone Name</label>
                <input
                  type="text"
                  value={area.zone}
                  onChange={e => handleAreaUpdate(idx, 'zone', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-blue-400 font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">Postcodes (EH)</label>
                <input
                  type="text"
                  value={area.postcodes}
                  onChange={e => handleAreaUpdate(idx, 'postcodes', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">Key Neighborhoods</label>
                <input
                  type="text"
                  value={area.areas}
                  onChange={e => handleAreaUpdate(idx, 'areas', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. FAQ Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Frequently Asked Questions</span>
          </h3>
          <button
            type="button"
            onClick={handleAddFaq}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add FAQ</span>
          </button>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 relative group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Question {idx + 1}</label>
                  <input
                    type="text"
                    value={faq.q}
                    onChange={e => handleFaqUpdate(idx, 'q', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteFaq(idx)}
                  className="mt-6 text-slate-500 hover:text-rose-400 p-2 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Answer Content</label>
                <textarea
                  rows={3}
                  value={faq.a}
                  onChange={e => handleFaqUpdate(idx, 'a', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
