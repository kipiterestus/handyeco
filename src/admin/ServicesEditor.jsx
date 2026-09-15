import React, { useState } from 'react';
import { Save, CheckCircle, Plus, Trash2, Wrench, Sparkles, Star } from 'lucide-react';

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
    handleUpdateActive('bullets', [...(activeService.bullets || []), 'New Edinburgh service feature point']);
  };

  const handleRemoveBullet = (idx) => {
    const next = (activeService.bullets || []).filter((_, i) => i !== idx);
    handleUpdateActive('bullets', next);
  };

  const handleAddService = () => {
    const newId = 'service-' + Date.now();
    const newS = {
      id: newId,
      title: 'New Edinburgh Handyman Service',
      category: 'repairs',
      iconName: 'Wrench',
      badge: 'New Offering',
      description: 'Describe your service scope, process, and Edinburgh guarantee here.',
      popular: false,
      bullets: ['Fixed transparent quote upfront', 'Professional cordless tools & tidy cleanup']
    };
    setServices(prev => [newS, ...prev]);
    setEditingId(newId);
  };

  const handleDeleteService = (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this service?')) return;
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Services & Workmanship Scope</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Add, update, or reorder handyman services, category filters, descriptions, and highlights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddService}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {saved ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : saved ? 'Saved!' : 'Save All Services'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Services Selector List */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
            All Services ({services.length})
          </span>
          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {services.map((srv) => (
              <div
                key={srv.id}
                onClick={() => setEditingId(srv.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 text-left ${
                  editingId === srv.id
                    ? 'bg-blue-600/20 border-blue-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="truncate">
                  <span className="text-xs font-bold block truncate">{srv.title}</span>
                  <span className="text-[10px] text-slate-400 capitalize">{srv.category} &bull; {srv.badge}</span>
                </div>
                
                <button
                  type="button"
                  onClick={(e) => handleDeleteService(srv.id, e)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Active Service Form */}
        {activeService ? (
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-400" />
                <span>Editing: {activeService.title}</span>
              </span>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(activeService.popular)}
                  onChange={e => handleUpdateActive('popular', e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0"
                />
                <span>Highlight as Popular / Recommended</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Service Title</label>
                <input
                  type="text"
                  value={activeService.title || ''}
                  onChange={e => handleUpdateActive('title', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={activeService.badge || ''}
                  onChange={e => handleUpdateActive('badge', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Category Filter</label>
                <select
                  value={activeService.category || 'repairs'}
                  onChange={e => handleUpdateActive('category', e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="assembly">Assembly (Flat-pack)</option>
                  <option value="mounting">Mounting (TV, Shelves, Curtains)</option>
                  <option value="repairs">Repairs (Silicone, Doors, General)</option>
                  <option value="painting">Painting & Decor</option>
                  <option value="kitchen">Kitchen Wrap</option>
                  <option value="outdoor">Outdoor / Garden</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Lucide Icon Identifier</label>
                <input
                  type="text"
                  value={activeService.iconName || 'Wrench'}
                  onChange={e => handleUpdateActive('iconName', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Service Description</label>
              <textarea
                rows={3}
                value={activeService.description || ''}
                onChange={e => handleUpdateActive('description', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            {/* Bullets List */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-400">Included Features / Bullets</label>
                <button
                  type="button"
                  onClick={handleAddBullet}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Feature</span>
                </button>
              </div>

              <div className="space-y-2">
                {(activeService.bullets || []).map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={bullet}
                      onChange={e => handleBulletChange(idx, e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(idx)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center text-slate-500">
            No service selected.
          </div>
        )}

      </div>
    </form>
  );
}
