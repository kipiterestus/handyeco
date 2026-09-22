import React, { useState } from 'react';
import { 
  Save, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Star, 
  Award, 
  ThumbsUp, 
  RefreshCw, 
  AlertCircle, 
  Check,
  ExternalLink,
  Info,
  ShieldCheck
} from 'lucide-react';

export default function ReviewsManager({ data, siteConfig = {}, onSave, token, onRefresh }) {
  const [reviews, setReviews] = useState(data || []);
  const [reviewCount, setReviewCount] = useState(siteConfig.googleReviewCount ?? 75);
  const [rating, setRating] = useState(siteConfig.googleRating ?? '5.0');
  const [placeId, setPlaceId] = useState(siteConfig.googlePlaceId || '');
  
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
    const today = new Date().toISOString().split('T')[0];
    const newRev = {
      id: newId,
      author: 'Yeni Edinburgh Müşterisi',
      location: 'Morningside, Edinburgh (EH10)',
      rating: 5,
      date: today,
      relativeTime: 'Bugün',
      service: 'Mobilya Montajı & Tamirat',
      platform: 'google',
      likes: 1,
      text: 'Zamanında geldi, temiz ve çok titiz çalıştı. Edinburgh usta ihtiyacı olan herkese gönül rahatlığıyla tavsiye ederim.'
    };
    setReviews(prev => [newRev, ...prev]);
  };

  const handleDeleteReview = (id) => {
    if (!window.confirm('Bu müşteri yorumunu silmek istediğinize emin misiniz?')) return;
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
        setSyncStatus({ success: true, message: data.message || 'Senkronizasyon tamamlandı.' });
        if (onRefresh) onRefresh();
      } else {
        setSyncStatus({ success: false, message: data.message || 'Senkronizasyon başarısız oldu.' });
      }
    } catch (err) {
      setSyncStatus({ success: false, message: 'Hata: ' + err.message });
    } finally {
      setSyncing(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Save reviews list
    const resReviews = await onSave('reviews', reviews);
    
    // Also save review count, rating and placeId to siteConfig
    const updatedConfig = {
      ...siteConfig,
      googleReviewCount: Number(reviewCount) || 75,
      googleRating: String(rating) || '5.0',
      googlePlaceId: placeId.trim()
    };
    const resConfig = await onSave('siteConfig', updatedConfig);

    setSaving(false);
    if (resReviews && resConfig) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-black text-white">Müşteri Yorumları</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Yorum sayısı, puanı ve referansları yönetin.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleAddReview}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 cursor-pointer transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Yorum Ekle</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            {saved ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Kaydediliyor...' : saved ? 'Kaydedildi!' : 'Kaydet'}</span>
          </button>
        </div>
      </div>

      {/* Google Yorumları Otomasyon & Rakam Açıklama Kutusu */}
      <div className="bg-[#0b0e14] border border-blue-900/50 rounded-2xl p-5 space-y-4 shadow-md">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-950/80 text-blue-400 border border-blue-800 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Google Senkronizasyonu</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Google Maps, botların yorumları doğrudan kazımasını (scraping) engellediği için, otomatik canlı çekim işlemi Google'ın resmi <strong>Google Places API</strong> anahtarı ile çalışır. 
              Lokalde çalışırken veya Google API kotası olmadan da sitenizin Google'daki gerçek yorum sayısını ve puanını aşağıdaki kutulardan istediğiniz gibi belirleyebilirsiniz. Sitedeki tüm butonlar ve sayaçlar buradaki rakamla anında güncellenir.
            </p>
          </div>
        </div>

        {/* Dynamic Number & Rating Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-zinc-800/80">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 block">Google Yorum Sayısı</label>
            <input
              type="number"
              value={reviewCount}
              onChange={(e) => setReviewCount(e.target.value)}
              className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-bold text-sm focus:border-blue-500 outline-none"
              placeholder="Örn: 54"
            />
            <span className="text-[10px] text-zinc-500 block">Profilinizdeki gerçek yorum sayısını girin</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 block">Ortalama Puan (Yıldız)</label>
            <input
              type="text"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-bold text-sm focus:border-blue-500 outline-none"
              placeholder="5.0"
            />
            <span className="text-[10px] text-zinc-500 block">Örn: 5.0 veya 4.9</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 block">Google Place ID</label>
            <input
              type="text"
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
              className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
              placeholder="ChIJ... (Google Haritalar Konum ID)"
            />
            <span className="text-[10px] text-zinc-500 block">Canlı API otomatik çekimi için opsiyonel</span>
          </div>
        </div>

        {/* Sync Trigger Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
          <div className="text-xs text-zinc-400">
            {syncStatus ? (
              <span className={syncStatus.success ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                {syncStatus.message}
              </span>
            ) : (
              <span>Google senkronizasyonu:</span>
            )}
          </div>

          <button
            type="button"
            disabled={syncing}
            onClick={handleSyncReviews}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Senkronize Ediliyor...' : 'Senkronize Et'}</span>
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Yorumlar ({reviews.length})
        </h3>

        {reviews.map((rev, index) => (
          <div 
            key={rev.id || index}
            className="bg-[#0b0e14] border border-zinc-800/90 rounded-2xl p-5 space-y-4 hover:border-zinc-700 transition-all"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-zinc-500">#{index + 1}</span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-blue-950 text-blue-400 border border-blue-800">
                  Google Maps
                </span>
                <div className="flex text-amber-400">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteReview(rev.id)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                title="Yorumu sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="space-y-1 sm:col-span-1 lg:col-span-1">
                <label className="text-[11px] font-semibold text-zinc-400">Müşteri Adı</label>
                <input
                  type="text"
                  value={rev.author || ''}
                  onChange={(e) => handleUpdate(rev.id, 'author', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div className="space-y-1 sm:col-span-1 lg:col-span-1">
                <label className="text-[11px] font-semibold text-zinc-400">Konum / Bölge</label>
                <input
                  type="text"
                  value={rev.location || ''}
                  onChange={(e) => handleUpdate(rev.id, 'location', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div className="space-y-1 sm:col-span-1 lg:col-span-1">
                <label className="text-[11px] font-semibold text-zinc-400">Yapılan Hizmet / İş</label>
                <input
                  type="text"
                  value={rev.service || ''}
                  onChange={(e) => handleUpdate(rev.id, 'service', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div className="space-y-1 sm:col-span-1 lg:col-span-1">
                <label className="text-[11px] font-semibold text-zinc-400">Tarih (GG/AA/YYYY)</label>
                <input
                  type="date"
                  value={rev.date || ''}
                  onChange={(e) => handleUpdate(rev.id, 'date', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div className="space-y-1 sm:col-span-1 lg:col-span-1">
                <label className="text-[11px] font-semibold text-zinc-400">Görünen Süre (Örn: 3 days ago)</label>
                <input
                  type="text"
                  value={rev.relativeTime || ''}
                  onChange={(e) => handleUpdate(rev.id, 'relativeTime', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                  placeholder="3 days ago"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-400">Müşteri Yorum Metni</label>
              <textarea
                rows={3}
                value={rev.text || ''}
                onChange={(e) => handleUpdate(rev.id, 'text', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-xl text-white leading-relaxed"
              />
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
