import React, { useState, useEffect } from 'react';
import { 
  Inbox, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Search, 
  Mail,
  PoundSterling,
  Calendar,
  AlertCircle,
  TrendingUp,
  FileText,
  ExternalLink
} from 'lucide-react';

export default function LeadsManager({ token, onScheduleLead, onLogLeadToAccounting }) {
  const [quotes, setQuotes] = useState([]);
  const [finances, setFinances] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [savingId, setSavingId] = useState(null);

  const fetchData = async () => {
    try {
      const [resQuotes, resFinances, resSchedule] = await Promise.all([
        fetch('/api/quotes', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/finances', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/schedule', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (resQuotes.ok) {
        const data = await resQuotes.json();
        if (data.success) setQuotes(data.quotes || []);
      }

      if (resFinances.ok) {
        const dataFin = await resFinances.json();
        if (dataFin.success) setFinances(dataFin.finances || []);
      }

      if (resSchedule.ok) {
        const dataSched = await resSchedule.json();
        if (dataSched.success) setSchedule(dataSched.schedule || []);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const updateStatus = async (id, newStatus) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/quotes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setSavingId(null);
    }
  };

  const updateNotes = async (id, notes) => {
    try {
      await fetch(`/api/quotes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notes })
      });
      setQuotes(prev => prev.map(q => q.id === id ? { ...q, notes } : q));
    } catch (err) {
      console.error('Error saving notes:', err);
    }
  };

  const filteredQuotes = quotes.filter(q => {
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    const matchesSearch = !search || 
      q.name?.toLowerCase().includes(search.toLowerCase()) ||
      q.phone?.includes(search) ||
      q.email?.toLowerCase().includes(search.toLowerCase()) ||
      q.postcode?.toLowerCase().includes(search.toLowerCase()) ||
      q.service?.toLowerCase().includes(search.toLowerCase()) ||
      q.details?.toLowerCase().includes(search.toLowerCase()) ||
      q.notes?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const counts = {
    all: quotes.length,
    new: quotes.filter(q => q.status === 'new' || !q.status).length,
    contacted: quotes.filter(q => q.status === 'contacted').length,
    booked: quotes.filter(q => q.status === 'booked').length
  };

  const getCleanPhone = (phone) => {
    if (!phone) return '';
    let p = phone.replace(/[^0-9]/g, '');
    if (p.startsWith('0')) p = '44' + p.substring(1);
    return p;
  };

  // Find linked finance entry for a quote
  const getLinkedFinance = (quoteId) => {
    return finances.find(f => f.leadId === quoteId);
  };

  // Find linked schedule job for a quote
  const getLinkedSchedule = (quoteId) => {
    return schedule.find(s => s.leadId === quoteId);
  };

  return (
    <div className="space-y-5 text-left">
      {/* Top Banner & Stats (OLED Near-Black) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div 
          onClick={() => setStatusFilter('all')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'all' 
              ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10' 
              : 'bg-[#0b0e14] border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider block">Tüm Talepler</span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">{counts.all}</span>
        </div>

        <div 
          onClick={() => setStatusFilter('new')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'new' 
              ? 'bg-amber-600/20 border-amber-500 text-white shadow-md shadow-amber-500/10' 
              : 'bg-[#0b0e14] border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider block">Yeni / Bekleyen</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 block">{counts.new}</span>
        </div>

        <div 
          onClick={() => setStatusFilter('contacted')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'contacted' 
              ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10' 
              : 'bg-[#0b0e14] border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider block">İletişime Geçildi</span>
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-indigo-400 mt-1 block">{counts.contacted}</span>
        </div>

        <div 
          onClick={() => setStatusFilter('booked')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'booked' 
              ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md shadow-emerald-500/10' 
              : 'bg-[#0b0e14] border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider block">Tamamlandı / Yapıldı</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block">{counts.booked}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0b0e14] p-3 rounded-2xl border border-zinc-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="İsim, telefon, EH posta kodu veya hizmet ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-zinc-900/80 border border-zinc-700/80 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-zinc-300 border border-zinc-800 transition-colors cursor-pointer"
          >
            Yenile
          </button>
        </div>
      </div>

      {/* Leads Compact Grid Layout */}
      {loading ? (
        <div className="p-12 text-center text-zinc-500 font-medium">Gelen müşteri talepleri yükleniyor...</div>
      ) : filteredQuotes.length === 0 ? (
        <div className="p-12 bg-[#0b0e14] rounded-3xl border border-zinc-800 text-center space-y-2">
          <Inbox className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Henüz müşteri talebi bulunmuyor</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Web sitesi teklif formundan veya Telegram botundan gelen talepler otomatik olarak buraya düşer.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredQuotes.map((quote) => {
            const cleanPhone = getCleanPhone(quote.phone);
            const whatsappText = encodeURIComponent(`Hi ${quote.name || 'there'}, this is Ekrem from Handyeco Edinburgh. Thanks for requesting a quote for ${quote.service || 'handyman services'}!`);
            const whatsappLink = `https://wa.me/${cleanPhone}?text=${whatsappText}`;
            const linkedFinance = getLinkedFinance(quote.id);
            const linkedSchedule = getLinkedSchedule(quote.id);

            return (
              <div 
                key={quote.id}
                className="bg-[#0b0e14] border border-zinc-800/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:border-zinc-700 transition-all shadow-md group relative"
              >
                {/* Top Card Row */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-base font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                        {quote.name || 'İsimsiz Müşteri'}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-0.5">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span>{quote.createdAt ? new Date(quote.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Yeni'}</span>
                      </div>
                    </div>

                    {/* Status Dropdown */}
                    <select
                      value={quote.status || 'new'}
                      onChange={(e) => updateStatus(quote.id, e.target.value)}
                      disabled={savingId === quote.id}
                      className={`text-[11px] font-bold rounded-lg px-2 py-1 border cursor-pointer focus:outline-none ${
                        quote.status === 'booked' 
                          ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                          : quote.status === 'contacted'
                          ? 'bg-indigo-950/80 border-indigo-800 text-indigo-300'
                          : quote.status === 'archived'
                          ? 'bg-zinc-900 border-zinc-700 text-zinc-400'
                          : 'bg-amber-950/80 border-amber-800 text-amber-300'
                      }`}
                    >
                      <option value="new">🟡 Yeni</option>
                      <option value="contacted">🔵 Görüşüldü</option>
                      <option value="booked">🟢 Yapıldı</option>
                      <option value="archived">⚪ Arşiv</option>
                    </select>
                  </div>

                  {/* Badges: Service & Postcode */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-950/60 text-blue-300 border border-blue-900/60">
                      {quote.service || 'Genel Usta İşi'}
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-zinc-900 text-zinc-300 border border-zinc-800">
                      <MapPin className="w-3 h-3 text-red-400" />
                      <span>{quote.postcode || 'Edinburgh'}</span>
                    </span>
                    {quote.urgency && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-950/50 text-amber-400 border border-amber-900/50">
                        {quote.urgency === 'urgent' ? 'Acil / 24-48 Saat' : quote.urgency === 'soon' ? 'Birkaç Gün İçinde' : 'Standart Planlama'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Job Description Box */}
                <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-3 text-xs text-zinc-300 leading-relaxed max-h-24 overflow-y-auto">
                  <p className="line-clamp-3">
                    {quote.details || 'Müşteri detaylı açıklama eklemedi.'}
                  </p>
                </div>

                {/* Contact Links */}
                <div className="space-y-1 text-xs text-zinc-400">
                  {quote.phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-zinc-500">Tel:</span>
                      <a href={`tel:${quote.phone}`} className="font-semibold text-zinc-200 hover:text-white">
                        {quote.phone}
                      </a>
                    </div>
                  )}
                  {quote.email && (
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-zinc-500">E-posta:</span>
                      <a href={`mailto:${quote.email}`} className="text-zinc-400 hover:text-blue-400 truncate max-w-[180px]">
                        {quote.email}
                      </a>
                    </div>
                  )}
                </div>

                {/* Private Note Input */}
                <div>
                  <input
                    type="text"
                    placeholder="Özel not ekle (örn: £120 teklif verildi)..."
                    defaultValue={quote.notes || ''}
                    onBlur={(e) => updateNotes(quote.id, e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-zinc-900/60 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Schedule & Accounting Actions */}
                <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                  
                  {/* 1. Schedule Badge or Schedule Button */}
                  {linkedSchedule ? (
                    <div className="p-2 rounded-xl bg-blue-950/40 border border-blue-900/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-blue-300 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span>Randevu: {linkedSchedule.date}</span>
                      </div>
                      <span className="text-[11px] font-black text-white bg-blue-900/60 px-2 py-0.5 rounded-md border border-blue-800/60">
                        {linkedSchedule.startTime}
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onScheduleLead && onScheduleLead(quote)}
                      className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-blue-950 to-indigo-950 hover:from-blue-900 hover:to-indigo-900 border border-blue-800/70 text-blue-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>📅 Randevuya / İşe Planla</span>
                    </button>
                  )}

                  {/* 2. Accounting Badge or Add to Accounting Button */}
                  {linkedFinance ? (
                    <div 
                      onClick={() => alert(`⚠️ Bu teklif zaten muhasebeye eklenmiştir!\n\nMüşteri: ${quote.name}\nTarih: ${linkedFinance.date}\nCiro: £${linkedFinance.revenue}\nNet Kâr: £${linkedFinance.netProfit}\n\nTekrar kayıt yapılamaz.`)}
                      className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-900/60 flex items-center justify-between text-xs cursor-pointer hover:bg-emerald-950/60 transition-colors"
                      title="Bu teklif zaten muhasebeye eklendi (Çift kayıt engellendi)"
                    >
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>✅ Muhasebeye Eklendi</span>
                      </div>
                      <div className="text-[11px] font-black text-white">
                        £{linkedFinance.revenue || 0} &bull; <span className="text-emerald-400">+£{linkedFinance.netProfit || 0} Kâr</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="px-2.5 py-1.5 rounded-xl bg-amber-950/40 border border-amber-800/70 text-amber-300 text-xs font-bold flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>⚠️ Muhasebeye Eklenmedi</span>
                        </div>
                        <span className="text-[10px] text-amber-400/80 font-normal">Kayıt Bekliyor</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onLogLeadToAccounting && onLogLeadToAccounting(quote)}
                        className="w-full py-1.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <PoundSterling className="w-3.5 h-3.5 text-emerald-400" />
                        <span>+ Muhasebeye / Kâra Ekle</span>
                      </button>
                    </div>
                  )}

                  {/* Call & WhatsApp Quick Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <a
                      href={`tel:${quote.phone}`}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-bold border border-zinc-800 transition-all"
                    >
                      <Phone className="w-3 h-3 text-blue-400" />
                      <span>Ara</span>
                    </a>

                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
