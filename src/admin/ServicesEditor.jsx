import React, { useState } from 'react';
import { Save, CheckCircle2, Plus, Trash2, Wrench, Sparkles, Star } from 'lucide-react';

export default function ServicesEditor({ data, onSave }) {
  const [services, setServices] = useState(data || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState(services[0]?.id || null);

  const activeService = services.find(s => s.id === editingId) || services[0];

  const handleUpdateActive = (field, val) => {
    setServices(prev => prev.map(s => s.id === activeService.id ? { ...s, [field]: val } : s));
    setSaved(false);
  };

  const handleBulletChange = (idx, val) => {
    const next = [...(activeService.bullets || [])];
    next[idx] = val;
    handleUpdateActive('bullets', next);
  };

  const handleAddBullet = () => {
    handleUpdateActive('bullets', [...(activeService.bullets || []), 'Yeni Edinburgh hizmet özelliği']);
  };

  const handleRemoveBullet = (idx) => {
    const next = (activeService.bullets || []).filter((_, i) => i !== idx);
    handleUpdateActive('bullets', next);
  };

  const handleAddService = () => {
    const newId = 'service-' + Date.now();
    const newS = {
      id: newId,
      title: 'Yeni Edinburgh Hizmeti',
      category: 'repairs',
      iconName: 'Wrench',
      badge: 'Yeni',
      description: 'Hizmet kapsamını, sürecini ve Edinburgh güvencesini buraya yazın.',
      popular: false,
      bullets: ['Önceden belirlenen şeffaf sabit fiyat', 'Profesyonel akülü el aletleri ve temiz çalışma']
    };
    setServices(prev => [newS, ...prev]);
    setEditingId(newId);
  };

  const handleDeleteService = (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Bu hizmeti silmek istediğinize emin misiniz?')) return;
    const next = services.filter(s => s.id !== id);
    setServices(next);
    if (editingId === id) setEditingId(next[0]?.id || null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave('services', services);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-black text-white">Hizmetler</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Hizmetleri, kategorileri ve detayları yönetin.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddService}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Hizmet Ekle</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {saved ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Kaydediliyor...' : saved ? 'Kaydedildi!' : 'Kaydet'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Services Selector List */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block px-1">
            Hizmetler ({services.length})
          </span>
          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {services.map((srv) => (
              <div
                key={srv.id}
                onClick={() => setEditingId(srv.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 text-left ${
                  editingId === srv.id
                    ? 'bg-blue-950/60 border-blue-500 text-white shadow-sm'
                    : 'bg-[#0b0e14] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="truncate">
                  <span className="text-xs font-bold block truncate text-white">{srv.title}</span>
                  <span className="text-[10px] text-zinc-500 capitalize">{srv.category} &bull; {srv.badge}</span>
                </div>
                
                <button
                  type="button"
                  onClick={(e) => handleDeleteService(srv.id, e)}
                  className="p-1 text-zinc-600 hover:text-rose-400 transition-colors shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Active Service Form */}
        {activeService ? (
          <div className="lg:col-span-8 bg-[#0b0e14] border border-zinc-800 rounded-2xl p-5 sm:p-7 space-y-4 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-400" />
                <span>{activeService.title}</span>
              </span>

              <label className="flex items-center gap-2 text-xs font-semibold text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(activeService.popular)}
                  onChange={e => handleUpdateActive('popular', e.target.checked)}
                  className="rounded bg-zinc-900 border-zinc-700 text-blue-600 focus:ring-0 cursor-pointer"
                />
                <span>Öne Çıkar</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Hizmet Başlığı</label>
                <input
                  type="text"
                  value={activeService.title || ''}
                  onChange={e => handleUpdateActive('title', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Rozet / Etiket (Badge)</label>
                <input
                  type="text"
                  value={activeService.badge || ''}
                  onChange={e => handleUpdateActive('badge', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Kategori Filtresi</label>
                <select
                  value={activeService.category || 'repairs'}
                  onChange={e => handleUpdateActive('category', e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="assembly">Mobilya & Montaj (Assembly)</option>
                  <option value="mounting">Duvar Montajı (TV, Ayna, Perde)</option>
                  <option value="repairs">Tamirat & Onarım (Silikon, Kapı)</option>
                  <option value="painting">Boya & Badana</option>
                  <option value="kitchen">Mutfak Kaplama / Yenileme</option>
                  <option value="outdoor">Bahçe & Dış Mekan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Lucide İkon Adı</label>
                <input
                  type="text"
                  value={activeService.iconName || 'Wrench'}
                  onChange={e => handleUpdateActive('iconName', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Hizmet Açıklaması</label>
              <textarea
                rows={3}
                value={activeService.description || ''}
                onChange={e => handleUpdateActive('description', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none leading-relaxed"
              />
            </div>

            {/* Bullets List */}
            <div className="pt-2 border-t border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-300">Öne Çıkan Özellik / Madde Listesi</label>
                <button
                  type="button"
                  onClick={handleAddBullet}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Madde Ekle</span>
                </button>
              </div>

              <div className="space-y-2">
                {(activeService.bullets || []).map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={bullet}
                      onChange={e => handleBulletChange(idx, e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(idx)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center text-zinc-500">
            Hizmet seçilmedi.
          </div>
        )}

      </div>
    </form>
  );
}
