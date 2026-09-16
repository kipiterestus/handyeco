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
  MessageSquare
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

  // Form state
  const [formData, setFormData] = useState({
    leadId: null,
    customerName: '',
    customerPhone: '',
    postcode: 'EH1',
    service: 'General Handyman Work',
    revenue: '',
    materialCost: '',
    otherExpenses: '',
    paymentStatus: 'paid',
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
      console.error('Error fetching accounting data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // If redirected from LeadsManager with a lead to log
  useEffect(() => {
    if (initialLeadData) {
      setFormData({
        leadId: initialLeadData.id,
        customerName: initialLeadData.name || '',
        customerPhone: initialLeadData.phone || '',
        postcode: initialLeadData.postcode || 'Edinburgh',
        service: initialLeadData.service || 'Handyman Job',
        revenue: '',
        materialCost: '',
        otherExpenses: '',
        paymentStatus: 'paid',
        date: new Date().toISOString().split('T')[0],
        notes: initialLeadData.details ? `Müşteri talebi: ${initialLeadData.details}` : ''
      });
      setEditingId(null);
      setIsModalOpen(true);
      if (onClearInitialLead) onClearInitialLead();
    }
  }, [initialLeadData]);

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
    const matchesStatus = statusFilter === 'all' || item.paymentStatus === statusFilter;
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
      service: 'Handyman Service',
      revenue: '',
      materialCost: '',
      otherExpenses: '',
      paymentStatus: 'paid',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setEditingId(null);
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
      paymentStatus: item.paymentStatus || 'paid',
      date: item.date || new Date().toISOString().split('T')[0],
      notes: item.notes || ''
    });
    setEditingId(item.id);
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
    if (!quoteId) return;
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
      f.paymentStatus,
      `"${(f.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Handyeco_Finans_Raporu_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-black text-white tracking-tight">İş Muhasebesi & Kâr Takip Sistemi</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800 tracking-wider">
              Canlı Finans
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Her müşteriden alınan ücreti, harcanan malzeme masrafını ve net kârınızı iş bazlı takip edin.
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
            <span>Yeni İş / Gider Ekle</span>
          </button>
        </div>
      </div>

      {/* 5 Financial KPI Cards (Deep OLED Dark) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Total Revenue */}
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
          <span className="text-[10px] text-zinc-500 mt-1 block">Tüm faturalanan işler</span>
        </div>

        {/* Total Materials */}
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
          <span className="text-[10px] text-zinc-500 mt-1 block">Dübel, aparat, sarf malzeme</span>
        </div>

        {/* Net Profit */}
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
          <span className="text-[10px] text-emerald-500/80 font-semibold mt-1 block">Gelir - Malzeme/Masraflar</span>
        </div>

        {/* Profit Margin */}
        <div className="bg-[#0b0e14] border border-zinc-800/90 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Kâr Marjı</span>
            <span className="p-1.5 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-900/60">
              %
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">
            %{profitMargin}
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 block">Sağlıklı sermaye verimliliği</span>
        </div>

        {/* Total Jobs */}
        <div className="bg-[#0b0e14] border border-zinc-800/90 rounded-2xl p-4 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Kayıtlı İş</span>
            <span className="p-1.5 rounded-lg bg-purple-950/60 text-purple-400 border border-purple-900/60">
              <Wrench className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            {finances.length} <span className="text-xs text-zinc-500 font-normal">İş</span>
          </div>
          <span className="text-[10px] text-zinc-400 mt-1 block">Ort. Kâr: £{avgProfitPerJob}/iş</span>
        </div>

      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0b0e14] p-3 rounded-2xl border border-zinc-800/90">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Müşteri adı, telefon, Edinburgh posta kodu veya hizmet ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#06080d] border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'all' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-[#06080d] text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Tümü ({finances.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'paid' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'bg-[#06080d] text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Ödendi ({finances.filter(f => f.paymentStatus === 'paid').length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'pending' 
                ? 'bg-amber-600 text-white shadow-sm' 
                : 'bg-[#06080d] text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Bekliyor ({finances.filter(f => f.paymentStatus === 'pending').length})
          </button>
        </div>
      </div>

      {/* Grid of Customer Finance Cards */}
      {loading ? (
        <div className="p-12 text-center text-zinc-500 font-medium">Finansal veriler yükleniyor...</div>
      ) : filteredFinances.length === 0 ? (
        <div className="p-12 bg-[#0b0e14] rounded-3xl border border-zinc-800/90 text-center space-y-3">
          <FileSpreadsheet className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Henüz Muhasebe Kaydı Bulunmuyor</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Yukarıdaki <strong>"Yeni İş / Gider Ekle"</strong> butonuna basarak veya Live Leads üzerinden teklifleri tek tıkla buraya aktarabilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredFinances.map((item) => {
            const itemNet = (Number(item.revenue) || 0) - (Number(item.materialCost) || 0) - (Number(item.otherExpenses) || 0);
            const itemMargin = item.revenue > 0 ? ((itemNet / item.revenue) * 100).toFixed(0) : 0;

            let cleanPhone = (item.customerPhone || '').replace(/[^0-9]/g, '');
            if (cleanPhone.startsWith('0')) cleanPhone = '44' + cleanPhone.substring(1);
            const whatsappLink = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

            return (
              <div
                key={item.id}
                className="bg-[#0b0e14] border border-zinc-800/90 hover:border-zinc-700/90 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between transition-all"
              >
                <div>
                  {/* Top row: Customer Name & Payment Status */}
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-zinc-850">
                    <div>
                      <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                        <User className="w-4 h-4 text-blue-400" />
                        <span>{item.customerName || 'Anonim Müşteri'}</span>
                      </h4>
                      <p className="text-xs text-zinc-400 flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-zinc-300">
                          <MapPin className="w-3 h-3 text-blue-400" />
                          <span>{item.postcode || 'Edinburgh'}</span>
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 text-zinc-500">
                          <Calendar className="w-3 h-3" />
                          <span>{item.date}</span>
                        </span>
                      </p>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 border ${
                      item.paymentStatus === 'paid' 
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : item.paymentStatus === 'pending'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-blue-950 text-blue-300 border-blue-800'
                    }`}>
                      {item.paymentStatus === 'paid' ? 'Ödendi' : item.paymentStatus === 'pending' ? 'Bekliyor' : 'Faturalı'}
                    </span>
                  </div>

                  {/* Service badge */}
                  <div className="pt-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-zinc-900 text-zinc-300 border border-zinc-800">
                      {item.service || 'Genel Tamirat'}
                    </span>
                  </div>

                  {/* Financial Breakdown Box */}
                  <div className="mt-3.5 bg-[#06080d] p-3.5 rounded-xl border border-zinc-850 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Müşteriden Alınan (Gelir):</span>
                      <span className="font-bold text-white text-sm">
                        +£{Number(item.revenue || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-rose-400">
                      <span className="text-zinc-400">Harcanan Malzeme:</span>
                      <span className="font-bold">
                        -£{Number(item.materialCost || 0).toFixed(2)}
                      </span>
                    </div>

                    {Number(item.otherExpenses) > 0 && (
                      <div className="flex items-center justify-between text-rose-400/80">
                        <span className="text-zinc-400">Diğer Masraf (Yakıt/Otopark):</span>
                        <span>-£{Number(item.otherExpenses).toFixed(2)}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                      <span className="font-bold text-zinc-300 uppercase text-[10px] tracking-wider">Kişisel Net Kâr:</span>
                      <div className="text-right">
                        <span className="font-black text-emerald-400 text-base block">
                          £{itemNet.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-emerald-500 font-semibold block">
                          %{itemMargin} Kâr Marjı
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Material & Expense Notes */}
                  {item.notes && (
                    <div className="mt-3 p-2.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-[11px] text-zinc-400 leading-relaxed italic">
                      <span className="font-bold text-zinc-300 not-italic block mb-0.5">Malzeme / İş Notu:</span>
                      {item.notes}
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-zinc-850 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    {whatsappLink && (
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 hover:bg-emerald-900 border border-emerald-800/80 transition-colors"
                        title="Müşteriye WhatsApp'tan Yaz"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {item.customerPhone && (
                      <a
                        href={`tel:${item.customerPhone}`}
                        className="p-1.5 rounded-lg bg-zinc-850 text-zinc-300 hover:text-white transition-colors"
                        title="Telefonla Ara"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditRecord(item)}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Düzenle</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteRecord(item.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Kaydı Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Accounting Record Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0b0e14] border border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white">
                {editingId ? 'Gelir/Gider Kaydını Düzenle' : 'Yeni Müşteri Gelir & Gideri Ekle'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              
              {/* Optional: Link with incoming lead */}
              {!editingId && quotes.length > 0 && (
                <div className="p-3 bg-[#06080d] rounded-2xl border border-zinc-850 space-y-1">
                  <label className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                    ⚡ Live Leads'den Müşteri Seç (Opsiyonel)
                  </label>
                  <select
                    onChange={handleSelectLeadToLink}
                    defaultValue=""
                    className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="">-- Listeden Müşteri Seç (Otomatik Doldurur) --</option>
                    {quotes.map(q => (
                      <option key={q.id} value={q.id}>
                        {q.name || 'İsimsiz'} &bull; {q.service || 'Genel'} &bull; {q.postcode || 'Edinburgh'} ({q.phone || 'Tel yok'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Customer & Service Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Müşteri Adı *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: David Ross"
                    value={formData.customerName}
                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#06080d] border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Telefon Numarası</label>
                  <input
                    type="text"
                    placeholder="+44 7760..."
                    value={formData.customerPhone}
                    onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#06080d] border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Hizmet / Yapılan İş *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: TV Duvar Montajı"
                    value={formData.service}
                    onChange={e => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#06080d] border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Edinburgh Bölgesi / Posta Kodu</label>
                  <input
                    type="text"
                    placeholder="Örn: EH3 5AB, New Town"
                    value={formData.postcode}
                    onChange={e => setFormData({ ...formData, postcode: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#06080d] border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Financial Inputs: Revenue vs Material Cost */}
              <div className="p-4 bg-[#06080d] rounded-2xl border border-zinc-850 space-y-3">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Hesaplama & Finansal Değerler (£)
                </span>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-400 mb-1">Alınan Ücret (£) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="150.00"
                      value={formData.revenue}
                      onChange={e => setFormData({ ...formData, revenue: e.target.value })}
                      className="w-full px-3 py-2 text-sm font-bold bg-zinc-900 border border-zinc-700 rounded-xl text-emerald-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-rose-400 mb-1">Malzeme Masrafı (£)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="25.00"
                      value={formData.materialCost}
                      onChange={e => setFormData({ ...formData, materialCost: e.target.value })}
                      className="w-full px-3 py-2 text-sm font-bold bg-zinc-900 border border-zinc-700 rounded-xl text-rose-400 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Diğer Masraf (£)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.otherExpenses}
                      onChange={e => setFormData({ ...formData, otherExpenses: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-300 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Instant Live Profit Preview inside modal */}
                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs font-bold">
                  <span className="text-zinc-400">Hesaplanan Net Kâr:</span>
                  <span className="text-base text-emerald-400">
                    £{((Number(formData.revenue) || 0) - (Number(formData.materialCost) || 0) - (Number(formData.otherExpenses) || 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Status & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Ödeme Durumu</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={e => setFormData({ ...formData, paymentStatus: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#06080d] border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="paid">🟢 Ödendi (Nakit / Banka Alındı)</option>
                    <option value="pending">🟡 Bekliyor (Henüz Ödenmedi)</option>
                    <option value="invoiced">🔵 Faturalandı (İşlemde)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">İşlem Tarihi</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#06080d] border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Material Details Notes */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Kullanılan Malzeme & Masraf Detayı
                </label>
                <textarea
                  rows={2}
                  placeholder="Örn: 2 kutu dübel (£12), 1 tüp silikon (£8), Wickes'ten alındı."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#06080d] border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 cursor-pointer"
                >
                  İptal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Kaydediliyor...' : editingId ? 'Değişiklikleri Kaydet' : 'Gelir/Gideri Kaydet'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
