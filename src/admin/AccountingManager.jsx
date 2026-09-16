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
  ShieldAlert
} from 'lucide-react';

export default function AccountingManager({ token, initialLeadData = null, onClearInitialLead = null }) {
  const [finances, setFinances] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    leadId: null,
    customerName: '',
    customerPhone: '',
    postcode: 'EH1',
    service: 'Genel Usta İşi',
    revenue: '',
    materialCost: '',
    otherExpenses: '',
    paymentStatus: 'paid_card', // 'paid_card' | 'paid_cash' | 'paid_bank' | 'paid' | 'pending' | 'invoiced'
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
        alert(`⚠️ DİKKAT: Bu teklif / müşteri zaten muhasebeye eklenmiştir!\n\nMüşteri: ${initialLeadData.name}\nTarih: ${existing.date}\nAlınan Ciro: £${existing.revenue}\nNet Kâr: £${existing.netProfit}\n\nÇift kayıt oluşturulamaz.`);
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

  // Calculations
  const totalRevenue = finances.reduce((acc, curr) => acc + (Number(curr.revenue) || 0), 0);
  const totalMaterial = finances.reduce((acc, curr) => acc + (Number(curr.materialCost) || 0), 0);
  const totalOther = finances.reduce((acc, curr) => acc + (Number(curr.otherExpenses) || 0), 0);
  const totalExpenses = totalMaterial + totalOther;
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;
  const avgProfitPerJob = finances.length > 0 ? (netProfit / finances.length).toFixed(1) : 0;

  // Filtered entries
  const filteredFinances = finances.filter(item => {
    let matchesStatus = true;
    if (statusFilter === 'paid_card') {
      matchesStatus = item.paymentStatus === 'paid_card';
    } else if (statusFilter === 'paid_cash') {
      matchesStatus = item.paymentStatus === 'paid_cash';
    } else if (statusFilter === 'paid') {
      matchesStatus = item.paymentStatus?.startsWith('paid') || item.paymentStatus === 'paid';
    } else if (statusFilter === 'pending') {
      matchesStatus = item.paymentStatus === 'pending';
    }

    const matchesSearch = !search || 
      item.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      item.customerPhone?.includes(search) ||
      item.service?.toLowerCase().includes(search.toLowerCase()) ||
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

  const handleEditRecord = (item) => {
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
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Bu gelir/gider kaydını silmek istediğinize emin misiniz?')) return;
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
    if (finances.length === 0) return alert('Dışa aktarılacak kayıt bulunmuyor.');
    const headers = ['Tarih', 'Müşteri Adı', 'Telefon', 'Posta Kodu', 'Hizmet', 'Alınan Ücret (Gelir)', 'Malzeme Masrafı', 'Diğer Masraf', 'Net Kâr', 'Ödeme Durumu', 'Notlar'];
    const rows = finances.map(f => [
      f.date,
      `"${f.customerName || ''}"`,
      `"${f.customerPhone || ''}"`,
      `"${f.postcode || ''}"`,
      `"${f.service || ''}"`,
      f.revenue || 0,
      f.materialCost || 0,
      f.otherExpenses || 0,
      f.netProfit || 0,
      f.paymentStatus === 'paid_card' ? 'Kredi Kartıyla Ödeme Alındı' : f.paymentStatus,
      `"${(f.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Handyeco_Muhasebe_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderPaymentBadge = (status) => {
    switch (status) {
      case 'paid_card':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-950/80 text-purple-300 border border-purple-800/80">
            <CreditCard className="w-3.5 h-3.5 text-purple-400" />
            <span>Kredi Kartıyla Ödeme Alındı</span>
          </span>
        );
      case 'paid_cash':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
            <Banknote className="w-3.5 h-3.5 text-emerald-400" />
            <span>Nakit Ödendi</span>
          </span>
        );
      case 'paid_bank':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-950/80 text-blue-300 border border-blue-800/80">
            <Building className="w-3.5 h-3.5 text-blue-400" />
            <span>Banka Havalesi / EFT</span>
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Ödendi</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-amber-950/60 text-amber-300 border border-amber-800/60">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Ödeme Bekliyor</span>
          </span>
        );
      case 'invoiced':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-indigo-950/60 text-indigo-300 border border-indigo-800/60">
            <span>Faturalandı</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-zinc-900 text-zinc-400 border border-zinc-800">
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
            <h2 className="text-xl font-black text-white tracking-tight">İş Muhasebesi & Kâr Takip Sistemi</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800 tracking-wider">
              Canlı Finans
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Her müşteriden alınan iş ücretini, kredi kartı/nakit ödemelerini, harcanan malzeme masraflarını ve net kârınızı iş bazlı takip edin.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={exportCSV}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-bold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Excel / CSV İndir</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni İş / Gelir-Gider Ekle</span>
          </button>
        </div>
      </div>

      {/* 5 Finansal KPI Kartı (OLED Siyah) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Toplam Gelir / Ciro */}
        <div className="bg-[#0b0e14] border border-zinc-800/90 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Toplam Ciro / Gelir</span>
            <span className="p-1.5 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-900/60">
              <PoundSterling className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            £{totalRevenue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 block">Tüm tamamlanan işler</span>
        </div>

        {/* Malzeme Gideri */}
        <div className="bg-[#0b0e14] border border-zinc-800/90 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Malzeme Gideri</span>
            <span className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-900/60">
              <TrendingDown className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 mt-2">
            -£{totalMaterial.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 block">Dübel, aparat, vida, sarf</span>
        </div>

        {/* Net Kâr */}
        <div className="bg-[#0b0e14] border border-emerald-900/40 rounded-2xl p-4 shadow-md shadow-emerald-950/20 relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Net Kâr (Cebinize Kalan)</span>
            <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">
            £{netProfit.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-emerald-500/80 font-semibold mt-1 block">Ciro - Masraflar</span>
        </div>

        {/* Kâr Marjı */}
        <div className="bg-[#0b0e14] border border-zinc-800/90 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Kâr Marjı</span>
            <span className="p-1.5 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-900/60 font-black">
              %
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">
            %{profitMargin}
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 block">Brüt kârlılık yüzdesi</span>
        </div>

        {/* İş Başı Ortalama Kâr */}
        <div className="bg-[#0b0e14] border border-zinc-800/90 rounded-2xl p-4 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">İş Başı Ort. Kâr</span>
            <span className="p-1.5 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-900/60">
              <Wrench className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-300 mt-2">
            £{avgProfitPerJob}
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 block">Tamamlanan {finances.length} iş</span>
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
            Tümü ({finances.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('paid_card')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              statusFilter === 'paid_card' 
                ? 'bg-purple-600 text-white shadow-sm' 
                : 'bg-zinc-900 text-purple-300 hover:text-white border border-zinc-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Kredi Kartı ({finances.filter(f => f.paymentStatus === 'paid_card').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'paid' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Ödenenler ({finances.filter(f => f.paymentStatus?.startsWith('paid')).length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'pending' 
                ? 'bg-amber-600 text-white shadow-sm' 
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Bekleyenler ({finances.filter(f => f.paymentStatus === 'pending').length})
          </button>
        </div>
      </div>

      {/* Finansal Kayıtlar Tablosu & Kartları */}
      {loading ? (
        <div className="p-12 text-center text-zinc-500 font-medium">Muhasebe kayıtları yükleniyor...</div>
      ) : filteredFinances.length === 0 ? (
        <div className="p-12 bg-[#0b0e14] rounded-2xl border border-zinc-800 text-center space-y-2">
          <PoundSterling className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Muhasebe kaydı bulunamadı</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Gelen müşteri tekliflerinden tek tıkla veya sağ üstteki "+ Yeni İş / Gelir-Gider Ekle" butonuna tıklayarak ilk kaydınızı oluşturun.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFinances.map(item => {
            const revenue = Number(item.revenue) || 0;
            const material = Number(item.materialCost) || 0;
            const other = Number(item.otherExpenses) || 0;
            const net = revenue - material - other;
            const margin = revenue > 0 ? ((net / revenue) * 100).toFixed(0) : 0;

            return (
              <div 
                key={item.id}
                className="bg-[#0b0e14] border border-zinc-800/90 rounded-2xl p-4 sm:p-5 hover:border-zinc-700 transition-all shadow-md space-y-3"
              >
                {/* Üst Satır */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h4 className="text-base font-bold text-white">
                        {item.customerName || 'Müşteri Kaydı'}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-zinc-900 text-zinc-300 border border-zinc-800">
                        {item.service || 'Usta İşi'}
                      </span>
                      {renderPaymentBadge(item.paymentStatus)}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                        <span>{item.postcode || 'Edinburgh'}</span>
                      </span>
                      {item.customerPhone && (
                        <span>&bull; {item.customerPhone}</span>
                      )}
                      <span>&bull;</span>
                      <span className="flex items-center gap-1 text-zinc-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.date}</span>
                      </span>
                    </div>
                  </div>

                  {/* Sağ Taraf: Düzenle / Sil Butonları */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleEditRecord(item)}
                      className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Düzenle"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRecord(item.id)}
                      className="p-2 text-zinc-500 hover:text-rose-400 rounded-xl hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Finansal Sayılar Matrisi */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-zinc-900/70 p-3 rounded-xl border border-zinc-800/80">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Alınan Ücret (Ciro)</span>
                    <span className="text-base sm:text-lg font-black text-white">£{revenue.toFixed(2)}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Malzeme Masrafı</span>
                    <span className="text-base sm:text-lg font-black text-rose-400">-£{material.toFixed(2)}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Net Kâr (Cebinize)</span>
                    <span className="text-base sm:text-lg font-black text-emerald-400">+£{net.toFixed(2)}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Kâr Marjı</span>
                    <span className="text-base sm:text-lg font-black text-amber-400">%{margin}</span>
                  </div>
                </div>

                {/* Notlar */}
                {item.notes && (
                  <p className="text-xs text-zinc-400 italic">
                    📝 Not: {item.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: YENİ GELİR / GİDER EKLE VEYA DÜZENLE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b0e14] border border-zinc-800 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
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
                  <label className="text-xs font-semibold text-zinc-300">Telefon Numarası</label>
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
                  <label className="text-xs font-semibold text-zinc-300">Posta Kodu (EH)</label>
                  <input
                    type="text"
                    placeholder="Örn: EH3 9DJ"
                    value={formData.postcode}
                    onChange={e => setFormData({ ...formData, postcode: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Hizmet Türü</label>
                  <input
                    type="text"
                    placeholder="Örn: Gardırop Montajı"
                    value={formData.service}
                    onChange={e => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">İş Tarihi *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Finansal Girişler: Alınan Ücret & Malzeme Masrafı */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-400">Müşteriden Alınan Ücret (£) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Örn: 120"
                    value={formData.revenue}
                    onChange={e => setFormData({ ...formData, revenue: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm font-black focus:border-emerald-500 outline-none"
                  />
                  <span className="text-[10px] text-zinc-500">Müşterinin ödediği toplam para</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-rose-400">Harcanan Malzeme (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Örn: 25.50"
                    value={formData.materialCost}
                    onChange={e => setFormData({ ...formData, materialCost: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm font-black focus:border-rose-500 outline-none"
                  />
                  <span className="text-[10px] text-zinc-500">Dübel, aparat, vida, boya vb.</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-amber-400">Diğer Masraflar (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Örn: 5.00"
                    value={formData.otherExpenses}
                    onChange={e => setFormData({ ...formData, otherExpenses: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm font-black focus:border-amber-500 outline-none"
                  />
                  <span className="text-[10px] text-zinc-500">Otopark, yakıt vb. ek masraf</span>
                </div>
              </div>

              {/* Canlı Net Kâr Önizlemesi */}
              {formData.revenue && (
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-900/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">Tahmini Net Kârınız (Cebinize Kalan):</span>
                  <span className="text-lg font-black text-white">
                    £{(Number(formData.revenue || 0) - Number(formData.materialCost || 0) - Number(formData.otherExpenses || 0)).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Ödeme Yöntemi / Durumu (KREDİ KARTI İBARESİ EKLENDİ) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-200 block">Ödeme Durumu & Tahsilat Yöntemi *</label>
                <select
                  value={formData.paymentStatus}
                  onChange={e => setFormData({ ...formData, paymentStatus: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs sm:text-sm font-bold focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="paid_card">💳 Kredi Kartıyla Ödeme Alındı (POS / Kart)</option>
                  <option value="paid_cash">💵 Ödendi (Nakit Elden)</option>
                  <option value="paid_bank">🏦 Ödendi (Banka Havalesi / Transfer)</option>
                  <option value="paid">✅ Ödendi (Genel)</option>
                  <option value="pending">⏳ Ödeme Bekliyor</option>
                  <option value="invoiced">📑 Faturalandı (Vade Bekleniyor)</option>
                </select>
              </div>

              {/* Notlar */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Özel Notlar</label>
                <textarea
                  rows={2}
                  placeholder="Örn: 2 adet ağır ayna askı aparatı kullanıldı. Müşteri makbuz istedi."
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

    </div>
  );
}
