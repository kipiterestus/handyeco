import React, { useState, useEffect } from 'react';
import { 
  PoundSterling, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Wrench, 
  Phone, 
  MapPin, 
  User, 
  FileSpreadsheet, 
  X, 
  Calendar, 
  MessageSquare, 
  CreditCard, 
  Banknote, 
  Building, 
  ShieldAlert,
  Receipt
} from 'lucide-react';

const OVERHEAD_CATEGORIES = [
  { id: 'fuel', label: 'Araç Yakıtı & Ulaşım', icon: '⛽' },
  { id: 'tools', label: 'Alet & Ekipman Alımı', icon: '🛠️' },
  { id: 'maintenance', label: 'Araç Bakım, Tamir & MOT', icon: '🚐' },
  { id: 'insurance', label: 'Sigorta & Ruhsatlar', icon: '🛡️' },
  { id: 'ads', label: 'Reklam & Pazarlama (Google/Meta)', icon: '📢' },
  { id: 'phone', label: 'Telefon & İnternet Faturası', icon: '📱' },
  { id: 'ppe', label: 'İş Kıyafeti & İSG / Koruyucu', icon: '🦺' },
  { id: 'software', label: 'Muhasebe, Yazılım & Lisans', icon: '📁' },
  { id: 'other', label: 'Diğer Genel İşletme Gideri', icon: '☕' }
];

export default function AccountingManager({ token, initialLeadData = null, onClearInitialLead = null }) {
  const [finances, setFinances] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'paid_card' | 'paid_cash' | 'paid_bank' | 'pending'
  const [timeRange, setTimeRange] = useState('month'); // 'week' | 'month' | 'year' | 'all'
  const [entryTypeFilter, setEntryTypeFilter] = useState('all'); // 'all' | 'job' | 'overhead'
  
  // Job Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState('');

  // Overhead Modal state
  const [isOverheadModalOpen, setIsOverheadModalOpen] = useState(false);
  const [overheadFormData, setOverheadFormData] = useState({
    title: '',
    category: 'fuel',
    amount: '',
    paymentStatus: 'paid_card',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Form state for Jobs
  const [formData, setFormData] = useState({
    leadId: null,
    customerName: '',
    customerPhone: '',
    postcode: 'EH1',
    service: 'Genel Usta İşi',
    revenue: '',
    materialCost: '',
    otherExpenses: '',
    paymentStatus: 'paid_card', // 'paid_card' | 'paid_cash' | 'paid_bank' | 'pending'
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Fetch finances & quotes
  const fetchData = async () => {
    try {
      const [resFin, resQuotes] = await Promise.all([
        fetch('/api/finances', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/quotes', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      if (resFin.ok) {
        const dataFin = await resFin.json();
        if (dataFin.success) setFinances(dataFin.finances || []);
      }

      if (resQuotes.ok) {
        const dataQ = await resQuotes.json();
        if (dataQ.success) setQuotes(dataQ.quotes || []);
      }
    } catch (err) {
      console.error('Muhasebe verileri alınırken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // If redirected from LeadsManager or Schedule with a lead to log
  useEffect(() => {
    if (initialLeadData) {
      // Check duplicate prevention: is this lead already in finances?
      const existing = finances.find(f => f.leadId === initialLeadData.id);
      if (existing) {
        alert(`⚠️ DİKKAT: Bu teklif / müşteri zaten muhasebeye eklenmiştir!\n\nMüşteri: ${initialLeadData.name}\nTarih: ${existing.date}\nAlınan: £${existing.revenue}\nNet Kâr: £${existing.netProfit}\n\nÇift kayıt oluşturulamaz.`);
        if (onClearInitialLead) onClearInitialLead();
        return;
      }

      setFormData({
        leadId: initialLeadData.id,
        customerName: initialLeadData.name || '',
        customerPhone: initialLeadData.phone || '',
        postcode: initialLeadData.postcode || 'Edinburgh',
        service: initialLeadData.service || 'Usta Hizmeti',
        revenue: initialLeadData.priceEstimate || '',
        materialCost: '',
        otherExpenses: '',
        paymentStatus: 'paid_card',
        date: new Date().toISOString().split('T')[0],
        notes: initialLeadData.details ? `Müşteri talebi: ${initialLeadData.details}` : ''
      });
      setEditingId(null);
      setDuplicateWarning('');
      setIsModalOpen(true);
      if (onClearInitialLead) onClearInitialLead();
    }
  }, [initialLeadData, finances]);

  // Date Math Helpers for Week, Month, Year
  const todayIso = new Date().toISOString().split('T')[0];
  const now = new Date();
  const currentYear = String(now.getFullYear());
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const getCurrentWeekRange = () => {
    const d = new Date(now);
    const day = d.getDay();
    const distanceToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + distanceToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return {
      start: monday.toISOString().split('T')[0],
      end: sunday.toISOString().split('T')[0]
    };
  };
  const weekRange = getCurrentWeekRange();

  // 1. Filter by Time Range (Haftalık / Aylık / Yıllık / Tümü)
  const periodFinances = finances.filter(item => {
    if (!item.date) return timeRange === 'all';
    if (timeRange === 'week') {
      return item.date >= weekRange.start && item.date <= weekRange.end;
    }
    if (timeRange === 'month') {
      return item.date.startsWith(currentYearMonth);
    }
    if (timeRange === 'year') {
      return item.date.startsWith(currentYear);
    }
    return true; // 'all'
  });

  const jobFinances = periodFinances.filter(f => f.type !== 'overhead');
  const overheadFinances = periodFinances.filter(f => f.type === 'overhead');

  // KPI Calculations based on selected period
  const totalRevenue = jobFinances.reduce((acc, curr) => acc + (Number(curr.revenue) || 0), 0);
  const totalMaterial = jobFinances.reduce((acc, curr) => acc + (Number(curr.materialCost) || 0), 0);
  const totalOverhead = overheadFinances.reduce((acc, curr) => acc + (Number(curr.otherExpenses) || 0), 0);
  const totalJobOther = jobFinances.reduce((acc, curr) => acc + (Number(curr.otherExpenses) || 0), 0);
  const totalExpenses = totalMaterial + totalOverhead + totalJobOther;
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;
  const avgProfitPerJob = jobFinances.length > 0 ? (netProfit / jobFinances.length).toFixed(1) : 0;

  const periodLabel = timeRange === 'week' ? 'Haftalık' : timeRange === 'month' ? 'Aylık' : timeRange === 'year' ? 'Yıllık' : 'Toplam';

  // 2. Further Filter by Entry Type (All / Jobs / Overhead), Payment Status & Search
  const filteredFinances = periodFinances.filter(item => {
    if (entryTypeFilter === 'job' && item.type === 'overhead') return false;
    if (entryTypeFilter === 'overhead' && item.type !== 'overhead') return false;

    let matchesStatus = true;
    if (statusFilter === 'paid_card') {
      matchesStatus = item.paymentStatus === 'paid_card';
    } else if (statusFilter === 'paid_cash') {
      matchesStatus = item.paymentStatus === 'paid_cash';
    } else if (statusFilter === 'paid_bank') {
      matchesStatus = item.paymentStatus === 'paid_bank';
    } else if (statusFilter === 'pending') {
      matchesStatus = item.paymentStatus === 'pending';
    }

    const matchesSearch = !search || 
      item.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.customerPhone?.includes(search) ||
      item.service?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.toLowerCase().includes(search.toLowerCase()) ||
      item.postcode?.toLowerCase().includes(search.toLowerCase()) ||
      item.notes?.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setFormData({
      leadId: null,
      customerName: '',
      customerPhone: '',
      postcode: 'Edinburgh',
      service: 'Usta Hizmeti',
      revenue: '',
      materialCost: '',
      otherExpenses: '',
      paymentStatus: 'paid_card',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setEditingId(null);
    setDuplicateWarning('');
    setIsModalOpen(true);
  };

  const handleOpenAddOverheadModal = () => {
    setOverheadFormData({
      title: '',
      category: 'fuel',
      amount: '',
      paymentStatus: 'paid_card',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setEditingId(null);
    setIsOverheadModalOpen(true);
  };

  const handleEditRecord = (item) => {
    if (item.type === 'overhead') {
      setOverheadFormData({
        title: item.customerName || item.title || '',
        category: item.category || 'other',
        amount: item.otherExpenses ?? '',
        paymentStatus: item.paymentStatus || 'paid_card',
        date: item.date || new Date().toISOString().split('T')[0],
        notes: item.notes || ''
      });
      setEditingId(item.id);
      setIsOverheadModalOpen(true);
    } else {
      setFormData({
        leadId: item.leadId || null,
        customerName: item.customerName || '',
        customerPhone: item.customerPhone || '',
        postcode: item.postcode || '',
        service: item.service || '',
        revenue: item.revenue ?? '',
        materialCost: item.materialCost ?? '',
        otherExpenses: item.otherExpenses ?? '',
        paymentStatus: item.paymentStatus || 'paid_card',
        date: item.date || new Date().toISOString().split('T')[0],
        notes: item.notes || ''
      });
      setEditingId(item.id);
      setDuplicateWarning('');
      setIsModalOpen(true);
    }
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Bu finans kaydını silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`/api/finances/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setFinances(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      alert('Silme işlemi başarısız: ' + err.message);
    }
  };

  const handleSaveOverheadForm = async (e) => {
    e.preventDefault();
    setSaving(true);

    const catObj = OVERHEAD_CATEGORIES.find(c => c.id === overheadFormData.category);
    const payload = {
      type: 'overhead',
      title: overheadFormData.title,
      category: overheadFormData.category,
      categoryLabel: catObj ? `${catObj.icon} ${catObj.label}` : 'Şirket Gideri',
      amount: Number(overheadFormData.amount) || 0,
      paymentStatus: overheadFormData.paymentStatus,
      date: overheadFormData.date,
      notes: overheadFormData.notes
    };

    try {
      const url = editingId ? `/api/finances/${editingId}` : '/api/finances';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        if (editingId) {
          setFinances(prev => prev.map(f => f.id === editingId ? resData.record : f));
        } else {
          setFinances(prev => [resData.record, ...prev]);
        }
        setIsOverheadModalOpen(false);
      } else {
        alert(resData.error || 'Masraf kaydetme başarısız oldu');
      }
    } catch (err) {
      alert('Hata: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSelectLeadToLink = (e) => {
    const quoteId = e.target.value;
    if (!quoteId) {
      setDuplicateWarning('');
      return;
    }

    // Check duplicate check
    const existing = finances.find(f => f.leadId === quoteId && f.id !== editingId);
    if (existing) {
      const msg = `⚠️ Bu müşteri teklifini zaten muhasebeye eklediniz! (Tarih: ${existing.date}, Ciro: £${existing.revenue}, Net Kâr: £${existing.netProfit}). Çift kayıt yapılamaz.`;
      setDuplicateWarning(msg);
      alert(msg);
      e.target.value = '';
      return;
    }

    setDuplicateWarning('');
    const selectedQuote = quotes.find(q => q.id === quoteId);
    if (selectedQuote) {
      setFormData(prev => ({
        ...prev,
        leadId: selectedQuote.id,
        customerName: selectedQuote.name || prev.customerName,
        customerPhone: selectedQuote.phone || prev.customerPhone,
        postcode: selectedQuote.postcode || prev.postcode,
        service: selectedQuote.service || prev.service,
        notes: selectedQuote.details ? `Müşteri talebi: ${selectedQuote.details}` : prev.notes
      }));
    }
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();

    // Duplicate Check
    if (formData.leadId && !editingId) {
      const existing = finances.find(f => f.leadId === formData.leadId);
      if (existing) {
        alert('⚠️ Bu teklif zaten muhasebeye eklendi! Çift kayıt yapılamaz.');
        return;
      }
    }

    setSaving(true);

    try {
      const url = editingId ? `/api/finances/${editingId}` : '/api/finances';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        if (editingId) {
          setFinances(prev => prev.map(f => f.id === editingId ? resData.record : f));
        } else {
          setFinances(prev => [resData.record, ...prev]);
        }
        setIsModalOpen(false);
      } else {
        alert(resData.error || 'Kaydetme başarısız oldu');
      }
    } catch (err) {
      alert('Hata: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const exportCSV = () => {
    if (filteredFinances.length === 0) return alert('Dışa aktarılacak kayıt bulunmuyor.');
    const headers = ['Tarih', 'Müşteri Adı', 'Telefon', 'Posta Kodu', 'Hizmet', 'Müşteriden Alınan', 'Malzeme Masrafı', 'Diğer Masraf', 'Net Kâr', 'Ödeme Durumu', 'Notlar'];
    const rows = filteredFinances.map(f => [
      f.date,
      `"${f.customerName || ''}"`,
      `"${f.customerPhone || ''}"`,
      `"${f.postcode || ''}"`,
      `"${f.service || ''}"`,
      f.revenue || 0,
      f.materialCost || 0,
      f.otherExpenses || 0,
      f.netProfit || 0,
      f.paymentStatus === 'paid_card' ? 'POS / Kart' : f.paymentStatus === 'paid_cash' ? 'Nakit' : f.paymentStatus === 'paid_bank' ? 'Banka Havalesi' : 'Ödeme Bekliyor',
      `"${(f.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Handyeco_Muhasebe_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderPaymentBadge = (status) => {
    switch (status) {
      case 'paid_card':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-purple-950/80 text-purple-300 border border-purple-800/80">
            <CreditCard className="w-3 h-3 text-purple-400" />
            <span>POS / Kart</span>
          </span>
        );
      case 'paid_cash':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
            <Banknote className="w-3 h-3 text-emerald-400" />
            <span>Nakit</span>
          </span>
        );
      case 'paid_bank':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-blue-950/80 text-blue-300 border border-blue-800/80">
            <Building className="w-3 h-3 text-blue-400" />
            <span>Banka Havalesi</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-950/60 text-amber-300 border border-amber-800/60">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Ödeme Bekliyor</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-zinc-900 text-zinc-400 border border-zinc-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Üst Başlık & Butonlar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-black text-white tracking-tight">Muhasebe</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Her müşteriden alınan iş ücretini, malzeme harcamalarını ve net kârınızı haftalık, aylık veya yıllık takip edin.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          <button
            type="button"
            onClick={exportCSV}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Excel / CSV</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddOverheadModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-600/25 transition-all cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>+ Masraf Ekle</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Gelir Ekle</span>
          </button>
        </div>
      </div>

      {/* Zaman Aralığı ve Kayıt Türü Seçici */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0b0e14] p-3 rounded-2xl border border-zinc-800">
        {/* Kayıt Türü Sekmeleri */}
        <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 overflow-x-auto">
          <button
            type="button"
            onClick={() => setEntryTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              entryTypeFilter === 'all'
                ? 'bg-zinc-700 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Tümü ({periodFinances.length})
          </button>
          <button
            type="button"
            onClick={() => setEntryTypeFilter('job')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              entryTypeFilter === 'job'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>🛠️ İşler</span>
            <span className="text-[10px] opacity-80">({jobFinances.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setEntryTypeFilter('overhead')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              entryTypeFilter === 'overhead'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>🏢 Masraflar</span>
            <span className="text-[10px] opacity-80">({overheadFinances.length})</span>
          </button>
        </div>

        {/* Dönem Filtresi: Hafta / Ay / Yıl / Tümü */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
          <button
            type="button"
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              timeRange === 'week'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            📅 Hafta
          </button>

          <button
            type="button"
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              timeRange === 'month'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            🗓️ Ay
          </button>

          <button
            type="button"
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              timeRange === 'year'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            📊 Yıl
          </button>

          <button
            type="button"
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              timeRange === 'all'
                ? 'bg-zinc-800 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            🌐 Tümü
          </button>
        </div>
      </div>

      {/* 5 Finansal KPI Kartı (OLED Siyah) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4">
        
        {/* Toplam Gelir / Ciro */}
        <div className="bg-[#0b0e14] border border-zinc-800/90 rounded-2xl p-3 sm:p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">{periodLabel} Ciro</span>
            <span className="p-1.5 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-900/60 shrink-0">
              <PoundSterling className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white mt-2 truncate">
            £{totalRevenue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 block truncate">{jobFinances.length} müşteri işi</span>
        </div>

        {/* İş Malzemesi Gideri */}
        <div className="bg-[#0b0e14] border border-zinc-800/90 rounded-2xl p-3 sm:p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">{periodLabel} Malzeme</span>
            <span className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-900/60 shrink-0">
              <TrendingDown className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-black text-rose-400 mt-2 truncate">
            -£{totalMaterial.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 block truncate">Sarf malzeme</span>
        </div>

        {/* Genel Şirket Masrafları */}
        <div className="bg-[#0b0e14] border border-zinc-800/90 rounded-2xl p-3 sm:p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">{periodLabel} Masraf</span>
            <span className="p-1.5 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-900/60 shrink-0">
              <Receipt className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-400 mt-2 truncate">
            -£{totalOverhead.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 block truncate">{overheadFinances.length} gider (yakıt vb.)</span>
        </div>

        {/* Net Kâr */}
        <div className="bg-[#0b0e14] border border-emerald-900/40 rounded-2xl p-3 sm:p-4 shadow-md shadow-emerald-950/20 relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">{periodLabel} Net Kâr</span>
            <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-400 mt-2 truncate">
            £{netProfit.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-emerald-500/80 font-semibold mt-1 block truncate">Ciro - Giderler</span>
        </div>

        {/* Kâr Marjı */}
        <div className="bg-[#0b0e14] border border-zinc-800/90 rounded-2xl p-3 sm:p-4 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Kâr Marjı</span>
            <span className="p-1.5 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-900/60 font-black text-xs shrink-0">
              %
            </span>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-black text-indigo-300 mt-2 truncate">
            %{profitMargin}
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 block truncate">Net kârlılık oranı</span>
        </div>

      </div>

      {/* Arama ve Filtreleme Çubuğu */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0b0e14] p-3 rounded-2xl border border-zinc-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Müşteri adı, telefon, posta kodu, hizmet veya not ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* 4 Ödeme Durumu Filtresi (Nakit, POS, Banka Havalesi, Bekleyen) */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'all' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Tümü ({periodFinances.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('paid_card')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'paid_card' 
                ? 'bg-purple-600 text-white shadow-sm' 
                : 'bg-zinc-900 text-purple-300 hover:text-white border border-zinc-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>POS / Kart ({periodFinances.filter(f => f.paymentStatus === 'paid_card').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('paid_cash')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'paid_cash' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'bg-zinc-900 text-emerald-300 hover:text-white border border-zinc-800'
            }`}
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>Nakit ({periodFinances.filter(f => f.paymentStatus === 'paid_cash').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('paid_bank')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'paid_bank' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-zinc-900 text-blue-300 hover:text-white border border-zinc-800'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Banka Havalesi ({periodFinances.filter(f => f.paymentStatus === 'paid_bank').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'pending' 
                ? 'bg-amber-600 text-white shadow-sm' 
                : 'bg-zinc-900 text-amber-300 hover:text-white border border-zinc-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Ödeme Bekliyor ({periodFinances.filter(f => f.paymentStatus === 'pending').length})</span>
          </button>
        </div>
      </div>

      {/* Finansal Kayıtlar GRID Sistemi (Bir önceki leads gibi modern kart ızgarası) */}
      {loading ? (
        <div className="p-12 text-center text-zinc-500 font-medium">Muhasebe kayıtları yükleniyor...</div>
      ) : filteredFinances.length === 0 ? (
        <div className="p-12 bg-[#0b0e14] rounded-2xl border border-zinc-800 text-center space-y-2">
          <PoundSterling className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Seçilen dönemde muhasebe kaydı bulunamadı</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Üstteki dönem filtresini değiştirebilir veya sağ üstteki "+ Yeni Kayıt Ekle" butonuyla yeni iş işleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredFinances.map(item => {
            const revenue = Number(item.revenue) || 0;
            const material = Number(item.materialCost) || 0;
            const other = Number(item.otherExpenses) || 0;
            const net = revenue - material - other;

            if (item.type === 'overhead') {
              const catObj = OVERHEAD_CATEGORIES.find(c => c.id === item.category);
              const overheadAmount = Number(item.otherExpenses || item.amount || 0);

              return (
                <div 
                  key={item.id}
                  className="bg-[#0b0e14] border border-rose-950/60 rounded-2xl p-4 sm:p-5 hover:border-rose-800/60 transition-all shadow-md flex flex-col justify-between space-y-3 group relative"
                >
                  {/* Üst Kısım: Başlık, Tarih ve İşlemler */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-950/80 text-rose-300 border border-rose-800/80 tracking-wider">
                            🏢 Şirket Masrafı
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white truncate group-hover:text-rose-300 transition-colors">
                          {item.customerName || item.title || 'Genel Gider'}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                          <Calendar className="w-3 h-3 text-zinc-500" />
                          <span>{item.date}</span>
                        </div>
                      </div>

                      {/* Düzenle / Sil */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEditRecord(item)}
                          className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                          title="Düzenle"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRecord(item.id)}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Rozetler: Kategori & Ödeme Durumu */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-zinc-900 text-zinc-300 border border-zinc-800">
                        {catObj ? `${catObj.icon} ${catObj.label}` : (item.categoryLabel || 'Genel Masraf')}
                      </span>
                      {renderPaymentBadge(item.paymentStatus)}
                    </div>
                  </div>

                  {/* Gider Tutar Kartı */}
                  <div className="bg-rose-950/20 border border-rose-900/50 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Gider Tutarı</span>
                      <span className="text-[11px] text-zinc-400">Şirket kârından düşüldü</span>
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-rose-400">
                      -£{overheadAmount.toFixed(2)}
                    </span>
                  </div>

                  {/* Not Varsa */}
                  {item.notes && (
                    <p className="text-[11px] text-zinc-400 italic line-clamp-2 bg-zinc-900/40 p-2 rounded-lg border border-zinc-800/50">
                      🧾 {item.notes}
                    </p>
                  )}
                </div>
              );
            }

            return (
              <div 
                key={item.id}
                className="bg-[#0b0e14] border border-zinc-800/90 rounded-2xl p-4 sm:p-5 hover:border-zinc-700 transition-all shadow-md flex flex-col justify-between space-y-3 group relative"
              >
                {/* Üst Kısım: Müşteri Adı, Tarih ve İşlemler */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-base font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                        {item.customerName || 'Müşteri Kaydı'}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        <span>{item.date}</span>
                        {item.postcode && (
                          <>
                            <span>&bull;</span>
                            <span className="text-zinc-300 font-semibold">{item.postcode}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Düzenle / Sil */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditRecord(item)}
                        className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                        title="Düzenle"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRecord(item.id)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Rozetler: Hizmet & Ödeme Durumu & Telefon */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-zinc-900 text-zinc-300 border border-zinc-800">
                      {item.service || 'Usta İşi'}
                    </span>
                    {renderPaymentBadge(item.paymentStatus)}
                    {item.customerPhone && (
                      <a 
                        href={`tel:${item.customerPhone}`} 
                        className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-900/70 border border-zinc-800"
                        title="Müşteriyi ara"
                      >
                        <Phone className="w-3 h-3 text-blue-400" />
                        <span>{item.customerPhone}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Finansal Sayılar Matrisi */}
                <div className="grid grid-cols-3 gap-2 bg-zinc-900/70 p-3 rounded-xl border border-zinc-800/80 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Alınan</span>
                    <span className="text-sm sm:text-base font-black text-white">£{revenue.toFixed(2)}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Masraf</span>
                    <span className="text-sm sm:text-base font-black text-rose-400">-£{(material + other).toFixed(2)}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Net Kâr</span>
                    <span className="text-sm sm:text-base font-black text-emerald-400">+£{net.toFixed(2)}</span>
                  </div>
                </div>

                {/* Not Varsa */}
                {item.notes && (
                  <p className="text-[11px] text-zinc-400 italic line-clamp-2 bg-zinc-900/40 p-2 rounded-lg border border-zinc-800/50">
                    📝 {item.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: YENİ GELİR / GİDER EKLE VEYA DÜZENLE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl sm:rounded-3xl max-w-xl w-full p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center">
                  <PoundSterling className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingId ? 'Gelir & Gider Kaydını Düzenle' : 'Yeni İş Gelir & Masraf Kaydı Ekle'}
                  </h3>
                  <p className="text-xs text-zinc-400">Müşteri ücreti, malzeme harcaması ve ödeme yöntemi</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Duplicate Warning if detected */}
            {duplicateWarning && (
              <div className="p-3.5 rounded-2xl bg-amber-950/60 border border-amber-800 text-amber-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{duplicateWarning}</span>
              </div>
            )}

            {/* Gelen Tekliflerden Hızlı Bağla */}
            {!editingId && quotes.length > 0 && (
              <div className="p-3 bg-zinc-900/80 rounded-2xl border border-zinc-800 space-y-1.5">
                <label className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                  ⚡ Gelen Tekliflerden (Live Leads) Müşteri Seç & Otomatik Doldur
                </label>
                <select
                  onChange={handleSelectLeadToLink}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="">Bir müşteri seçin (İsim, telefon ve iş otomatik aktarılır)...</option>
                  {quotes.map(q => {
                    const isAlreadyAdded = finances.some(f => f.leadId === q.id);
                    return (
                      <option key={q.id} value={q.id} disabled={isAlreadyAdded}>
                        {isAlreadyAdded ? '🔒 (Zaten Eklendi) ' : ''}{q.name} ({q.postcode}) - {q.service} - {new Date(q.createdAt || Date.now()).toLocaleDateString('tr-TR')}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            <form onSubmit={handleSaveForm} className="space-y-4">
              {/* Müşteri Adı & Telefon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Müşteri Adı *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Callum Robertson"
                    value={formData.customerName}
                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Telefon</label>
                  <input
                    type="tel"
                    placeholder="Örn: +44 7760 123456"
                    value={formData.customerPhone}
                    onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Posta Kodu, Hizmet ve Tarih */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Posta Kodu</label>
                  <input
                    type="text"
                    placeholder="Örn: EH3 9DJ"
                    value={formData.postcode}
                    onChange={e => setFormData({ ...formData, postcode: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Hizmet</label>
                  <input
                    type="text"
                    placeholder="Örn: Gardırop Montajı"
                    value={formData.service}
                    onChange={e => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Tarih *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Finansal Girişler (Kısa Başlıklar ve Sabit Yükseklik ile Buton Kaymasını Önler) */}
              <div className="grid grid-cols-3 gap-2.5 bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-400 block truncate">Müşteriden Alınan (£) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="120"
                    value={formData.revenue}
                    onChange={e => setFormData({ ...formData, revenue: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm font-black focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-rose-400 block truncate">Malzeme (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="25"
                    value={formData.materialCost}
                    onChange={e => setFormData({ ...formData, materialCost: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm font-black focus:border-rose-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-amber-400 block truncate">Diğer Masraf (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="5"
                    value={formData.otherExpenses}
                    onChange={e => setFormData({ ...formData, otherExpenses: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm font-black focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Sabit Net Kâr Önizlemesi - Her zaman sabit kalarak butonların kaymasını kesin olarak engeller */}
              <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300">Tahmini Net Kâr (Cebinize Kalan):</span>
                <span className="text-base font-black text-emerald-400">
                  £{(Number(formData.revenue || 0) - Number(formData.materialCost || 0) - Number(formData.otherExpenses || 0)).toFixed(2)}
                </span>
              </div>

              {/* Ödeme Durumu (Sadece POS, Nakit, Banka Havalesi ve Bekleyen) */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 block">Ödeme Durumu *</label>
                <select
                  value={formData.paymentStatus}
                  onChange={e => setFormData({ ...formData, paymentStatus: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs sm:text-sm font-bold focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="paid_card">💳 POS / Kredi Kartı</option>
                  <option value="paid_cash">💵 Nakit</option>
                  <option value="paid_bank">🏦 Banka Havalesi</option>
                  <option value="pending">⏳ Ödeme Bekliyor</option>
                </select>
              </div>

              {/* Notlar */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Notlar</label>
                <textarea
                  rows={2}
                  placeholder="Örn: 2 adet ağır ayna askı aparatı kullanıldı."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                />
              </div>

              {/* Butonlar */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 cursor-pointer"
                >
                  Vazgeç
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/25 cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Kaydediliyor...' : editingId ? 'Değişiklikleri Güncelle' : 'Muhasebeye Kaydet'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: ŞİRKET MASRAFI EKLE VEYA DÜZENLE */}
      {isOverheadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingId ? 'Şirket Masrafını Düzenle' : 'Yeni Şirket Masrafı Ekle'}
                  </h3>
                  <p className="text-xs text-zinc-400">Araç yakıtı, ekipman, sigorta, reklam ve genel giderler</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOverheadModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOverheadForm} className="space-y-4">
              {/* Masraf Kategorisi */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Masraf Kategorisi *</label>
                <select
                  value={overheadFormData.category}
                  onChange={e => setOverheadFormData({ ...overheadFormData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs sm:text-sm font-semibold focus:border-rose-500 outline-none cursor-pointer"
                >
                  {OVERHEAD_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Masraf Başlığı / Açıklaması */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Masraf Başlığı / Açıklaması *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: BP Shell Dizel Yakıt veya DeWalt Darbeli Matkap"
                  value={overheadFormData.title}
                  onChange={e => setOverheadFormData({ ...overheadFormData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:border-rose-500 outline-none"
                />
              </div>

              {/* Tutar ve Tarih */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-rose-400">Gider Tutarı (£) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="65.00"
                    value={overheadFormData.amount}
                    onChange={e => setOverheadFormData({ ...overheadFormData, amount: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm font-black focus:border-rose-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">İşlem Tarihi *</label>
                  <input
                    type="date"
                    required
                    value={overheadFormData.date}
                    onChange={e => setOverheadFormData({ ...overheadFormData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:border-rose-500 outline-none"
                  />
                </div>
              </div>

              {/* Ödeme Durumu */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 block">Ödeme Yöntemi / Durumu *</label>
                <select
                  value={overheadFormData.paymentStatus}
                  onChange={e => setOverheadFormData({ ...overheadFormData, paymentStatus: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs sm:text-sm font-bold focus:border-rose-500 outline-none cursor-pointer"
                >
                  <option value="paid_card">💳 POS / Kredi Kartı</option>
                  <option value="paid_cash">💵 Nakit</option>
                  <option value="paid_bank">🏦 Banka Havalesi</option>
                  <option value="pending">⏳ Ödeme Bekliyor</option>
                </select>
              </div>

              {/* Fiş / Fatura No & Ek Notlar */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Fiş / Fatura No & Detay Notu</label>
                <textarea
                  rows={2}
                  placeholder="Örn: Fiş No: 048291, Screwfix Edinburgh şubesinden alındı."
                  value={overheadFormData.notes}
                  onChange={e => setOverheadFormData({ ...overheadFormData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:border-rose-500 outline-none"
                />
              </div>

              {/* Butonlar */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsOverheadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 cursor-pointer"
                >
                  Vazgeç
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/25 cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Kaydediliyor...' : editingId ? 'Değişiklikleri Güncelle' : 'Masrafı Kaydet'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
