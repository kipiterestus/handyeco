import React, { useState } from 'react';
import { Save, CheckCircle2, Plus, Trash2, Upload, Camera, MapPin, Repeat, Image as ImageIcon } from 'lucide-react';

export default function GalleryManager({ data, onSave, token }) {
  const [items, setItems] = useState(data || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingFor, setUploadingFor] = useState(null); // { id, type: 'main' | 'before' }

  const handleUpdate = (id, field, val) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: val } : item));
    setSaved(false);
  };

  const handleAddItem = () => {
    const newId = 'gal-' + Date.now();
    const newItem = {
      id: newId,
      title: 'Yeni Tamamlanan İş',
      category: 'assembly',
      location: 'Edinburgh (EH10)',
      date: new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
      isBeforeAfter: false,
      image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=1000&auto=format&fit=crop&q=80',
      badge: 'Yapılan İş'
    };
    setItems(prev => [newItem, ...prev]);
  };

  const handleDeleteItem = (id) => {
    if (!window.confirm('Bu proje fotoğrafını galeriden silmek istediğinize emin misiniz?')) return;
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleFileUpload = (id, type) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFor({ id, type });
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
          if (type === 'before') {
            handleUpdate(id, 'beforeImage', resData.url);
          } else {
            handleUpdate(id, 'image', resData.url);
          }
        }
      } catch (err) {
        console.error('Upload failed:', err);
      } finally {
        setUploadingFor(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave('gallery', items);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-black text-white">Tamamlanan İşler & Fotoğraf Galerisi</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Edinburgh'da tamamladığınız iş fotoğraflarını yükleyin, konumlarını belirleyin veya Öncesi / Sonrası karşılaştırması ekleyin.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yeni Proje Fotoğrafı</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {saved ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Kaydediliyor...' : saved ? 'Kaydedildi!' : 'Galeriyi Kaydet'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-md flex flex-col justify-between hover:border-zinc-700 transition-all"
          >
            <div>
              {/* Photo Preview & Upload */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 mb-3 shadow-inner">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-lg bg-black/80 text-white text-[10px] font-bold">
                  {item.badge}
                </div>

                <label className="absolute bottom-2 right-2 px-3 py-1.5 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-md cursor-pointer transition-all">
                  <Upload className="w-3 h-3" />
                  <span>
                    {uploadingFor?.id === item.id && uploadingFor?.type === 'main' ? 'Yükleniyor...' : 'Fotoğrafı Değiştir'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload(item.id, 'main')}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Title & Badge */}
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-0.5">İş / Proje Başlığı</label>
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={e => handleUpdate(item.id, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-xl text-white font-bold focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-0.5">Konum / Bölge</label>
                    <input
                      type="text"
                      value={item.location || ''}
                      onChange={e => handleUpdate(item.id, 'location', e.target.value)}
                      placeholder="Örn: Morningside, EH10"
                      className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-0.5">Kategori</label>
                    <select
                      value={item.category || 'assembly'}
                      onChange={e => handleUpdate(item.id, 'category', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-blue-500 outline-none cursor-pointer"
                    >
                      <option value="assembly">Mobilya Montajı</option>
                      <option value="mounting">TV & Duvar Montajı</option>
                      <option value="repairs">Tamirat & Silikon</option>
                      <option value="painting">Boya</option>
                      <option value="kitchen">Mutfak Kaplama</option>
                    </select>
                  </div>
                </div>

                {/* Before / After toggle */}
                <div className="pt-2 border-t border-zinc-800">
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(item.isBeforeAfter)}
                      onChange={e => handleUpdate(item.id, 'isBeforeAfter', e.target.checked)}
                      className="rounded bg-zinc-900 border-zinc-700 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>"Öncesi" Fotoğrafı Ekle (Before/After)</span>
                  </label>

                  {item.isBeforeAfter && (
                    <div className="mt-2.5 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400">
                        <span>Öncesi Fotoğrafı:</span>
                        <label className="text-blue-400 hover:underline font-bold cursor-pointer">
                          <span>{uploadingFor?.id === item.id && uploadingFor?.type === 'before' ? 'Yükleniyor...' : 'Öncesi Fotoğrafını Yükle'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload(item.id, 'before')}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {item.beforeImage && (
                        <img
                          src={item.beforeImage}
                          alt="Before Preview"
                          className="w-full h-24 object-cover rounded-lg border border-zinc-700"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-mono">ID: {item.id}</span>
              <button
                type="button"
                onClick={() => handleDeleteItem(item.id)}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Fotoğrafı Sil</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
