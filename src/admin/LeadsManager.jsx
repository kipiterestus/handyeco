import React, { useState, useEffect, useMemo } from 'react';
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
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Archive,
  X,
  Plus
} from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export default function LeadsManager({ token, onScheduleLead, onLogLeadToAccounting }) {
  const [quotes, setQuotes] = useState([]);
  const [finances, setFinances] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('new'); // Varsayılan olarak 'new' veya 'all'
  const [currentPage, setCurrentPage] = useState(1);
  const [savingId, setSavingId] = useState(null);

  // In-page Modal States (Avoid jumping between tabs)
  const [schedulingLead, setSchedulingLead] = useState(null);
  const [accountingLead, setAccountingLead] = useState(null);
  const [savingModal, setSavingModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Schedule modal form state
  const [scheduleForm, setScheduleForm] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '12:00',
    durationMinutes: 120,
    priceEstimate: '',
    notes: ''
  });

  // Accounting modal form state
  const [accountingForm, setAccountingForm] = useState({
    revenue: '',
    materialCost: '0',
    otherExpenses: '0',
    paymentStatus: 'paid_card',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

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

  // Calculate End Time based on duration
  const calculateEndTime = (startTime, durationMinutes) => {
    if (!startTime) return '12:00';
    const [h, m] = startTime.split(':').map(Number);
    const totalM = h * 60 + m + Number(durationMinutes);
    const endH = Math.floor(totalM / 60) % 24;
    const endM = totalM % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  };

  // Open In-Page Schedule Modal
  const handleOpenScheduleModal = (lead) => {
    const today = new Date().toISOString().split('T')[0];
    setScheduleForm({
      date: today,
      startTime: '10:00',
      endTime: calculateEndTime('10:00', 120),
      durationMinutes: 120,
      priceEstimate: '',
      notes: lead.details ? `Müşteri Notu: ${lead.details}` : ''
    });
    setSchedulingLead(lead);
  };

  // Save Schedule Modal Form (No page redirection)
  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    if (!schedulingLead) return;
    setSavingModal(true);
    try {
      const payload = {
        leadId: schedulingLead.id,
        customerName: schedulingLead.name || 'İsimsiz Müşteri',
        customerPhone: schedulingLead.phone || '',
        postcode: schedulingLead.postcode || 'EH1',
        address: schedulingLead.postcode ? `${schedulingLead.postcode}, Edinburgh` : 'Edinburgh',
        service: schedulingLead.service || 'Genel Usta İşi',
        date: scheduleForm.date,
        startTime: scheduleForm.startTime,
        endTime: scheduleForm.endTime,
        durationMinutes: Number(scheduleForm.durationMinutes) || 120,
        priceEstimate: scheduleForm.priceEstimate ? Number(scheduleForm.priceEstimate) : '',
        status: 'scheduled',
        notes: scheduleForm.notes
      };

      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSchedule(prev => [data.job, ...prev]);
        if (schedulingLead.status === 'new') {
          updateStatus(schedulingLead.id, 'contacted');
        }
        setSchedulingLead(null);
        setToastMsg('📅 Randevu başarıyla takvime kaydedildi!');
        setTimeout(() => setToastMsg(''), 4000);
      } else {
        alert(data.error || 'Randevu kaydedilemedi');
      }
    } catch (err) {
      alert('Hata: ' + err.message);
    } finally {
      setSavingModal(false);
    }
  };

  // Open In-Page Accounting Modal
  const handleOpenAccountingModal = (lead) => {
    const today = new Date().toISOString().split('T')[0];
    setAccountingForm({
      revenue: '',
      materialCost: '0',
      otherExpenses: '0',
      paymentStatus: 'paid_card',
      date: today,
      notes: lead.details ? `Müşteri: ${lead.name || ''} - ${lead.details}` : ''
    });
    setAccountingLead(lead);
  };

  // Save Accounting Modal Form (No page redirection)
  const handleSaveAccounting = async (e) => {
    e.preventDefault();
    if (!accountingLead) return;
    setSavingModal(true);
    try {
      const rev = Number(accountingForm.revenue) || 0;
      const mat = Number(accountingForm.materialCost) || 0;
      const oth = Number(accountingForm.otherExpenses) || 0;
      const net = rev - (mat + oth);

      const payload = {
        leadId: accountingLead.id,
        customerName: accountingLead.name || 'İsimsiz Müşteri',
        customerPhone: accountingLead.phone || '',
        postcode: accountingLead.postcode || 'Edinburgh',
        service: accountingLead.service || 'Usta Hizmeti',
        revenue: rev,
        materialCost: mat,
        otherExpenses: oth,
        netProfit: net,
        paymentStatus: accountingForm.paymentStatus,
        date: accountingForm.date,
        type: 'job',
        notes: accountingForm.notes
      };

      const res = await fetch('/api/finances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFinances(prev => [data.record, ...prev]);
        setAccountingLead(null);
        setToastMsg('💰 Muhasebe kaydı başarıyla oluşturuldu!');
        setTimeout(() => setToastMsg(''), 4000);
      } else {
        alert(data.error || 'Muhasebe kaydı oluşturulamadı');
      }
    } catch (err) {
      alert('Hata: ' + err.message);
    } finally {
      setSavingModal(false);
    }
  };

  // Yeni gelen talepler DAİMA İLK SIRADA (en yeni createdAt en üstte)
  const sortedQuotes = useMemo(() => {
    return [...quotes].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeB !== timeA) return timeB - timeA;
      // Fallback: ID timestamp
      const idA = parseInt(String(a.id).replace(/\D/g, '').slice(0, 13), 10) || 0;
      const idB = parseInt(String(b.id).replace(/\D/g, '').slice(0, 13), 10) || 0;
      return idB - idA;
    });
  }, [quotes]);

  // Duruma ve aramaya göre filtreleme
  const filteredQuotes = useMemo(() => {
    return sortedQuotes.filter(q => {
      const matchesStatus = statusFilter === 'all'
        ? true
        : statusFilter === 'new'
        ? (q.status === 'new' || !q.status)
        : q.status === statusFilter;

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
  }, [sortedQuotes, statusFilter, search]);

  // Sayfalama hesaplamaları
  const totalPages = Math.ceil(filteredQuotes.length / ITEMS_PER_PAGE) || 1;
  const paginatedQuotes = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredQuotes.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredQuotes, currentPage]);

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const counts = {
    all: sortedQuotes.length,
    new: sortedQuotes.filter(q => q.status === 'new' || !q.status).length,
    contacted: sortedQuotes.filter(q => q.status === 'contacted').length,
    booked: sortedQuotes.filter(q => q.status === 'booked').length,
    archived: sortedQuotes.filter(q => q.status === 'archived').length
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
      {/* Top Status Tabs & Quick Counts (OLED Near-Black) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div 
          onClick={() => handleStatusChange('all')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'all' 
              ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10' 
              : 'bg-[#0b0e14] border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block">Tümü</span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-white mt-1 block">{counts.all}</span>
        </div>

        <div 
          onClick={() => handleStatusChange('new')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'new' 
              ? 'bg-amber-600/20 border-amber-500 text-white shadow-md shadow-amber-500/10' 
              : 'bg-[#0b0e14] border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block">🟡 Yeni</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-amber-400 mt-1 block">{counts.new}</span>
        </div>

        <div 
          onClick={() => handleStatusChange('contacted')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'contacted' 
              ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10' 
              : 'bg-[#0b0e14] border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block">🔵 Görüşüldü</span>
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-indigo-400 mt-1 block">{counts.contacted}</span>
        </div>

        <div 
          onClick={() => handleStatusChange('booked')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'booked' 
              ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md shadow-emerald-500/10' 
              : 'bg-[#0b0e14] border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block">🟢 Yapıldı</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 block">{counts.booked}</span>
        </div>

        <div 
          onClick={() => handleStatusChange('archived')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'archived' 
              ? 'bg-zinc-700/30 border-zinc-500 text-white shadow-md' 
              : 'bg-[#0b0e14] border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block">⚪ Arşiv</span>
            <Archive className="w-3 h-3 text-zinc-400" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-zinc-300 mt-1 block">{counts.archived}</span>
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
            onChange={handleSearchChange}
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedQuotes.map((quote) => {
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
                      onClick={() => handleOpenScheduleModal(quote)}
                      className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-blue-950 to-indigo-950 hover:from-blue-900 hover:to-indigo-900 border border-blue-800/70 text-blue-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>📅 Randevu Planla</span>
                    </button>
                  )}

                  {/* 2. Accounting Badge or Add to Accounting Button */}
                  {linkedFinance ? (
                    <div 
                      onClick={() => alert(`Bu teklif zaten muhasebeye eklenmiştir.\n\nMüşteri: ${quote.name}\nTarih: ${linkedFinance.date}\nCiro: £${linkedFinance.revenue}\nNet Kâr: £${linkedFinance.netProfit}`)}
                      className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-900/60 flex items-center justify-between text-xs cursor-pointer hover:bg-emerald-950/60 transition-colors"
                      title="Muhasebeye eklendi"
                    >
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>✅ Muhasebede</span>
                      </div>
                      <div className="text-[11px] font-black text-white">
                        £{linkedFinance.revenue || 0} &bull; <span className="text-emerald-400">+£{linkedFinance.netProfit || 0}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="px-2.5 py-1.5 rounded-xl bg-amber-950/40 border border-amber-800/70 text-amber-300 text-xs font-bold flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>⚠️ Muhasebesiz</span>
                        </div>
                        <span className="text-[10px] text-amber-400/80 font-normal">Kayıt Bekliyor</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenAccountingModal(quote)}
                        className="w-full py-1.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <PoundSterling className="w-3.5 h-3.5 text-emerald-400" />
                        <span>+ Muhasebeye Ekle</span>
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

        {/* Sayfalama (Pagination) Kontrolleri */}
        {filteredQuotes.length > ITEMS_PER_PAGE && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-800/80">
            <span className="text-xs text-zinc-400">
              Toplam <strong className="text-white">{filteredQuotes.length}</strong> talep içinden{' '}
              <strong className="text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> -{' '}
              <strong className="text-white">{Math.min(currentPage * ITEMS_PER_PAGE, filteredQuotes.length)}</strong> arası gösteriliyor (Sayfa {currentPage}/{totalPages})
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-zinc-300 border border-zinc-800 flex items-center gap-1 cursor-pointer transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Önceki</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCurrentPage(num)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentPage === num
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-zinc-300 border border-zinc-800 flex items-center gap-1 cursor-pointer transition-all"
              >
                <span>Sonraki</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </>
    )}

    {/* 📅 Randevu Planla Modalı (Sayfa değiştirmeden) */}
    {schedulingLead && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-[#0b0e14] border border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-left space-y-4 animate-in fade-in zoom-in-95">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Randevu Planla</h3>
                <p className="text-xs text-zinc-400">Sayfadan ayrılmadan takvime iş kaydı oluşturun</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSchedulingLead(null)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Selected Lead Summary */}
          <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-1 text-zinc-300">
            <div className="flex justify-between font-bold text-white">
              <span>{schedulingLead.name || 'İsimsiz Müşteri'}</span>
              <span className="text-blue-400">{schedulingLead.phone || ''}</span>
            </div>
            <div className="flex justify-between text-zinc-400 text-[11px]">
              <span>{schedulingLead.service || 'Usta Hizmeti'}</span>
              <span>{schedulingLead.postcode || 'Edinburgh'}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveSchedule} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Randevu Tarihi</label>
              <input
                type="date"
                required
                value={scheduleForm.date}
                onChange={e => setScheduleForm(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:border-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Başlangıç</label>
                <input
                  type="time"
                  required
                  value={scheduleForm.startTime}
                  onChange={e => {
                    const newStart = e.target.value;
                    setScheduleForm(prev => ({
                      ...prev,
                      startTime: newStart,
                      endTime: calculateEndTime(newStart, prev.durationMinutes)
                    }));
                  }}
                  className="w-full px-2.5 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Süre</label>
                <select
                  value={scheduleForm.durationMinutes}
                  onChange={e => {
                    const mins = Number(e.target.value);
                    setScheduleForm(prev => ({
                      ...prev,
                      durationMinutes: mins,
                      endTime: calculateEndTime(prev.startTime, mins)
                    }));
                  }}
                  className="w-full px-2 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value={60}>1 Saat</option>
                  <option value={90}>1.5 Saat</option>
                  <option value={120}>2 Saat</option>
                  <option value={180}>3 Saat</option>
                  <option value={240}>4 Saat</option>
                  <option value={480}>Tam Gün</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Bitiş Saati</label>
                <input
                  type="time"
                  value={scheduleForm.endTime}
                  onChange={e => setScheduleForm(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full px-2.5 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Tahmini Fiyat / Ücret (£)</label>
              <input
                type="number"
                placeholder="Örn: 85 (Opsiyonel)"
                value={scheduleForm.priceEstimate}
                onChange={e => setScheduleForm(prev => ({ ...prev, priceEstimate: e.target.value }))}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Özel İş Notu / Hatırlatıcı</label>
              <textarea
                rows={2}
                placeholder="İş detayı, alet çantası hazırlığı..."
                value={scheduleForm.notes}
                onChange={e => setScheduleForm(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:border-blue-500 outline-none leading-relaxed"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setSchedulingLead(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 cursor-pointer transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                disabled={savingModal}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-md shadow-blue-600/30 cursor-pointer transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <span>{savingModal ? 'Kaydediliyor...' : 'Randevuyu Kaydet'}</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    )}

    {/* 💰 Muhasebeye Ekle Modalı (Sayfa değiştirmeden) */}
    {accountingLead && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-[#0b0e14] border border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-left space-y-4 animate-in fade-in zoom-in-95">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center">
                <PoundSterling className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Muhasebeye Kaydet</h3>
                <p className="text-xs text-zinc-400">Sayfadan ayrılmadan iş gelir ve giderini kaydedin</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAccountingLead(null)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Selected Lead Summary */}
          <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-1 text-zinc-300">
            <div className="flex justify-between font-bold text-white">
              <span>{accountingLead.name || 'İsimsiz Müşteri'}</span>
              <span className="text-emerald-400">{accountingLead.phone || ''}</span>
            </div>
            <div className="flex justify-between text-zinc-400 text-[11px]">
              <span>{accountingLead.service || 'Usta Hizmeti'}</span>
              <span>{accountingLead.postcode || 'Edinburgh'}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveAccounting} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Tarih</label>
                <input
                  type="date"
                  required
                  value={accountingForm.date}
                  onChange={e => setAccountingForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Müşteriden Alınan Ücret / Ciro (£)</label>
                <input
                  type="number"
                  required
                  placeholder="Örn: 120"
                  value={accountingForm.revenue}
                  onChange={e => setAccountingForm(prev => ({ ...prev, revenue: e.target.value }))}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-emerald-400 font-bold focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Harcanan Malzeme (£)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={accountingForm.materialCost}
                  onChange={e => setAccountingForm(prev => ({ ...prev, materialCost: e.target.value }))}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Diğer Masraflar (£)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={accountingForm.otherExpenses}
                  onChange={e => setAccountingForm(prev => ({ ...prev, otherExpenses: e.target.value }))}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1.5">Ödeme Durumu</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'paid_card', label: '💳 POS / Kart' },
                  { id: 'paid_cash', label: '💵 Nakit' },
                  { id: 'paid_bank', label: '🏦 Havale' },
                  { id: 'pending', label: '⏳ Bekleniyor' }
                ].map(pm => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setAccountingForm(prev => ({ ...prev, paymentStatus: pm.id }))}
                    className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer text-center ${
                      accountingForm.paymentStatus === pm.id
                        ? 'bg-emerald-950 border-emerald-600 text-emerald-300 shadow-sm'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Açıklama / Not</label>
              <textarea
                rows={2}
                placeholder="İş ve ödeme notları..."
                value={accountingForm.notes}
                onChange={e => setAccountingForm(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:border-blue-500 outline-none leading-relaxed"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setAccountingLead(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 cursor-pointer transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                disabled={savingModal}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 shadow-md shadow-emerald-600/30 cursor-pointer transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <span>{savingModal ? 'Kaydediliyor...' : 'Muhasebeye Kaydet'}</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    )}

    {/* Floating In-Page Toast Notification */}
    {toastMsg && (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5">
        <CheckCircle2 className="w-5 h-5" />
        <span>{toastMsg}</span>
      </div>
    )}
  </div>
);
}
