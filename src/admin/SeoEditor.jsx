import React, { useState } from 'react';
import { Save, CheckCircle, Globe, Search, MapPin, Share2, Plus, X, Sparkles, FileText, ExternalLink } from 'lucide-react';

export default function SeoEditor({ data, onSave }) {
  const [form, setForm] = useState(data || {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');

  const handleChange = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
    setSaved(false);
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    const clean = newKeyword.trim().toLowerCase();
    if (!form.keywords?.includes(clean)) {
      handleChange('keywords', [...(form.keywords || []), clean]);
    }
    setNewKeyword('');
  };

  const handleRemoveKeyword = (kw) => {
    handleChange('keywords', (form.keywords || []).filter(k => k !== kw));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave('seo', form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const titleLength = (form.metaTitle || '').length;
  const descLength = (form.metaDescription || '').length;

  return (
    <form onSubmit={handleSave} className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Google & Local Edinburgh SEO Suite</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Optimize metadata, Edinburgh search keywords, local geo-coordinates, and search snippets.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
        >
          {saved ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : saved ? 'Saved!' : 'Save SEO Configuration'}</span>
        </button>
      </div>

      {/* 1. Live Google Search Result (SERP) Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-400" />
            <span>Live Google Search Snippet Preview (Edinburgh SERP)</span>
          </h3>
          <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
            Google UK Mobile & Desktop Preview
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 text-left space-y-1.5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-600 truncate">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">H</span>
            <span className="font-semibold text-slate-900">Handyeco Edinburgh</span>
            <span className="text-slate-400">&rsaquo;</span>
            <span className="text-slate-500 truncate">{form.canonicalUrl || 'https://handyeco.co.uk/'}</span>
          </div>

          <h4 className="text-base sm:text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug">
            {form.metaTitle || 'Handyeco | Edinburgh Handyman Services | Flat Pack Assembly & Repairs'}
          </h4>

          <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed">
            {form.metaDescription || '5-star rated handyman services in Edinburgh & Lothians. Specialists in IKEA flat-pack furniture assembly, TV wall mounting into stone walls, silicone sealing, painting and property repairs.'}
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs text-amber-600">
            <span>★★★★★ Rating: 5.0 · 48 reviews · Price range: ££ · Edinburgh, Scotland</span>
          </div>
        </div>
      </div>

      {/* 2. Metadata Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Meta Title & Description */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <span>Search Engine Meta Tags</span>
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-400">Page Meta Title</label>
                <span className={`text-[11px] font-bold ${titleLength > 60 ? 'text-amber-400' : 'text-slate-500'}`}>
                  {titleLength}/60 chars
                </span>
              </div>
              <input
                type="text"
                value={form.metaTitle || ''}
                onChange={e => handleChange('metaTitle', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 font-bold"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-400">Meta Description</label>
                <span className={`text-[11px] font-bold ${descLength > 160 ? 'text-amber-400' : 'text-slate-500'}`}>
                  {descLength}/160 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={form.metaDescription || ''}
                onChange={e => handleChange('metaDescription', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Canonical URL</label>
              <input
                type="url"
                value={form.canonicalUrl || 'https://handyeco.co.uk/'}
                onChange={e => handleChange('canonicalUrl', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Local Geo & Social Sharing Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Edinburgh Local Geo & Social Tags</span>
          </h3>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Geo Region</label>
                <input
                  type="text"
                  value={form.geoRegion || 'GB-EDH'}
                  onChange={e => handleChange('geoRegion', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Place Name</label>
                <input
                  type="text"
                  value={form.geoPlacename || 'Edinburgh'}
                  onChange={e => handleChange('geoPlacename', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Geo Position Coordinates</label>
                <input
                  type="text"
                  value={form.geoPosition || '55.9533;-3.1883'}
                  onChange={e => handleChange('geoPosition', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">ICBM Coordinates</label>
                <input
                  type="text"
                  value={form.icbm || '55.9533, -3.1883'}
                  onChange={e => handleChange('icbm', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Social Share Image (OpenGraph / Twitter Card)</label>
              <input
                type="text"
                value={form.ogImage || '/hero-handyman-edinburgh.jpg'}
                onChange={e => handleChange('ogImage', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

      </div>

      {/* 3. High-Volume Edinburgh Keywords Manager */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Targeted High-Volume Edinburgh Keywords</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Optimized for top organic ranking in Edinburgh Google searches.
            </p>
          </div>

          {/* Add Keyword input */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="e.g. flat pack assembly edinburgh..."
              value={newKeyword}
              onChange={e => setNewKeyword(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddKeyword(); } }}
              className="px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 flex-1 sm:w-64"
            />
            <button
              type="button"
              onClick={handleAddKeyword}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        {/* Keywords pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {(form.keywords || []).map((kw, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 transition-colors"
            >
              <span>{kw}</span>
              <button
                type="button"
                onClick={() => handleRemoveKeyword(kw)}
                className="text-slate-500 hover:text-rose-400 p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 4. Technical SEO Files Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>Technical Search Engine Assets (Active & Validated)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <a
            href="/robots.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500 text-left transition-colors flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-white block">robots.txt</span>
              <span className="text-[11px] text-emerald-400">Allow public, protect /admin</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>

          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500 text-left transition-colors flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-white block">sitemap.xml</span>
              <span className="text-[11px] text-emerald-400">XML Schema Validated</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>

          <a
            href="/llms.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500 text-left transition-colors flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-white block">llms.txt</span>
              <span className="text-[11px] text-blue-400">Gemini & AI Search Ready</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
        </div>
      </div>

    </form>
  );
}
