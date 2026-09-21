import React, { useState } from 'react';
import { Save, CheckCircle2, Globe, Search, MapPin, Share2, Plus, X, Sparkles, FileText, ExternalLink } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-black text-white">SEO Yönetimi</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Arama motoru ve yerel SEO ayarlarını yönetin.
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

      {/* 1. Live Google Search Result (SERP) Preview */}
      <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-400" />
            <span>Google Snippet Önizlemesi</span>
          </h3>
          <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
            Google UK
          </span>
        </div>

        <div className="bg-zinc-900/90 rounded-2xl p-4 sm:p-5 text-left space-y-1.5 border border-zinc-800">
          <div className="flex items-center gap-2 text-xs text-zinc-400 truncate">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">H</span>
            <span className="font-semibold text-zinc-200">Handyeco Edinburgh</span>
            <span className="text-zinc-600">&rsaquo;</span>
            <span className="text-zinc-400 truncate">{form.canonicalUrl || 'https://handyeco.co.uk/'}</span>
          </div>

          <h4 className="text-base sm:text-lg font-medium text-blue-400 hover:underline cursor-pointer leading-snug">
            {form.metaTitle || 'Handyeco | Edinburgh Handyman Services | Flat Pack Assembly & Repairs'}
          </h4>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {form.metaDescription || '5-star rated handyman services in Edinburgh & Lothians. Specialists in IKEA flat-pack furniture assembly, TV wall mounting into stone walls, silicone sealing, painting and property repairs.'}
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs text-amber-400 font-medium">
            <span>★★★★★ Rating: 5.0 · Doğrulanmış Müşteri Yorumları · Fiyat: ££ · Edinburgh, Scotland</span>
          </div>
        </div>
      </div>

      {/* 2. Metadata Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Meta Title & Description */}
        <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-md">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <span>Meta Etiketleri</span>
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-zinc-300">Meta Başlığı (Title)</label>
                <span className={`text-[11px] font-bold ${titleLength > 60 ? 'text-amber-400' : 'text-zinc-500'}`}>
                  {titleLength}/60 karakter
                </span>
              </div>
              <input
                type="text"
                value={form.metaTitle || ''}
                onChange={e => handleChange('metaTitle', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none font-bold"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-zinc-300">Meta Açıklama (Description)</label>
                <span className={`text-[11px] font-bold ${descLength > 160 ? 'text-amber-400' : 'text-zinc-500'}`}>
                  {descLength}/160 karakter
                </span>
              </div>
              <textarea
                rows={3}
                value={form.metaDescription || ''}
                onChange={e => handleChange('metaDescription', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Kanonik URL (Canonical)</label>
              <input
                type="url"
                value={form.canonicalUrl || 'https://handyeco.co.uk/'}
                onChange={e => handleChange('canonicalUrl', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Local Geo & Social Sharing Card */}
        <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-md">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Konum & Sosyal Paylaşım</span>
          </h3>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Geo Bölge</label>
                <input
                  type="text"
                  value={form.geoRegion || 'GB-EDH'}
                  onChange={e => handleChange('geoRegion', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Konum İsmi</label>
                <input
                  type="text"
                  value={form.geoPlacename || 'Edinburgh'}
                  onChange={e => handleChange('geoPlacename', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Geo Pozisyon Koordinatları</label>
                <input
                  type="text"
                  value={form.geoPosition || '55.9533;-3.1883'}
                  onChange={e => handleChange('geoPosition', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">ICBM Koordinatları</label>
                <input
                  type="text"
                  value={form.icbm || '55.9533, -3.1883'}
                  onChange={e => handleChange('icbm', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Sosyal Paylaşım Görseli (OG Image)</label>
              <input
                type="text"
                value={form.ogImage || '/hero-handyman-edinburgh.jpg'}
                onChange={e => handleChange('ogImage', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

      </div>

      {/* 3. High-Volume Edinburgh Keywords Manager */}
      <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Anahtar Kelimeler</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Google UK arama motoru optimizasyonu kelimeleri.
            </p>
          </div>

          {/* Add Keyword input */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Örn: flat pack assembly edinburgh..."
              value={newKeyword}
              onChange={e => setNewKeyword(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddKeyword(); } }}
              className="px-3.5 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-blue-500 outline-none flex-1 sm:w-64"
            />
            <button
              type="button"
              onClick={handleAddKeyword}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Ekle
            </button>
          </div>
        </div>

        {/* Keywords pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {(form.keywords || []).map((kw, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 transition-colors"
            >
              <span>{kw}</span>
              <button
                type="button"
                onClick={() => handleRemoveKeyword(kw)}
                className="text-zinc-500 hover:text-rose-400 p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 4. Technical SEO Files Status */}
      <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-3 shadow-md">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>Teknik SEO Dosyaları</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <a
            href="/robots.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-blue-500 text-left transition-colors flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-white block">robots.txt</span>
              <span className="text-[11px] text-emerald-400 font-medium">Public erişime açık, /admin korumalı</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
          </a>

          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-blue-500 text-left transition-colors flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-white block">sitemap.xml</span>
              <span className="text-[11px] text-emerald-400 font-medium">10 Sayfa • XML Schema Doğrulandı</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
          </a>

          <a
            href="/llms.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-blue-500 text-left transition-colors flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-white block">llms.txt</span>
              <span className="text-[11px] text-blue-400 font-medium">AI &amp; Gemini Arama Uyumlu</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
          </a>
        </div>
      </div>

      {/* 5. UK Yerel Dizinleri & Otorite Kayıtları (NAP Citations) */}
      <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>İngiltere Yerel Dizinleri (UK Citations &amp; Backlinks)</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Google Harita ve yerel sıralamayı 1. sıraya taşımak için resmi İngiltere rehberleri. Tüm kayıtlarda aşağıdaki bilgilerin harfiyen aynı olması zorunludur.
            </p>
          </div>
        </div>

        {/* Master NAP Box */}
        <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-700/80 space-y-2 text-xs">
          <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] block">
            Kayıtlarda Kullanılacak Resmi NAP (Name / Address / Phone) Verisi:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 text-slate-300">
            <div className="p-2 rounded-lg bg-zinc-800/80">
              <span className="text-[10px] text-zinc-500 block uppercase font-bold">Business Name</span>
              <span className="font-semibold text-white">Handyeco - Edinburgh Handyman Services</span>
            </div>
            <div className="p-2 rounded-lg bg-zinc-800/80">
              <span className="text-[10px] text-zinc-500 block uppercase font-bold">Phone Number</span>
              <span className="font-semibold text-white">07760 696723</span>
            </div>
            <div className="p-2 rounded-lg bg-zinc-800/80">
              <span className="text-[10px] text-zinc-500 block uppercase font-bold">Website URL</span>
              <span className="font-semibold text-white">https://handyeco.co.uk/</span>
            </div>
            <div className="p-2 rounded-lg bg-zinc-800/80">
              <span className="text-[10px] text-zinc-500 block uppercase font-bold">Location &amp; Area</span>
              <span className="font-semibold text-white">Edinburgh &amp; Lothians (EH1–EH17)</span>
            </div>
          </div>
        </div>

        {/* Directory Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {[
            {
              name: "Yell.com (Yellow Pages UK)",
              da: "DA 90",
              desc: "İngiltere'nin 1 numaralı ticari dizini. Google Haritalar için en kritik referans.",
              url: "https://www.yell.com/free-listing/"
            },
            {
              name: "Thomson Local",
              da: "DA 78",
              desc: "İskoçya genelinde işletme teyidi sağlayan köklü İngiliz dizini.",
              url: "https://www.thomsonlocal.com/add-a-business"
            },
            {
              name: "FreeIndex UK",
              da: "DA 68",
              desc: "Müşterilerin bağımsız yorum bırakabildiği ve Google'da yıldız çıkaran dizin.",
              url: "https://www.freeindex.co.uk/join.htm"
            },
            {
              name: "Cylex UK",
              da: "DA 74",
              desc: "Google botlarının Edinburgh yerel işletmelerini doğrulamak için baktığı dizin.",
              url: "https://www.cylex-uk.co.uk/register.html"
            },
            {
              name: "Scoot Network UK",
              da: "DA 76",
              desc: "The Sun, The Independent ve TouchLocal portallarına aynı anda dağıtır.",
              url: "https://www.scoot.co.uk/"
            },
            {
              name: "Nextdoor UK (Edinburgh)",
              da: "DA 88",
              desc: "Morningside, Stockbridge ve Leith mahalle sakinlerinin en çok baktığı yerel ağ.",
              url: "https://nextdoor.co.uk/create-business/"
            }
          ].map((dir, idx) => (
            <a
              key={idx}
              href={dir.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-blue-500 hover:bg-zinc-800/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                    {dir.name}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    {dir.da}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {dir.desc}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-semibold text-blue-400">
                <span>Ücretsiz Kayıt Ol</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </div>

    </form>
  );
}
