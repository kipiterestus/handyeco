import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Handshake, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  PoundSterling, 
  Calendar, 
  MessageSquare, 
  FileText, 
  ExternalLink, 
  Check, 
  Trash2, 
  Edit3, 
  ArrowRight,
  TrendingUp,
  Briefcase,
  Copy,
  Receipt,
  Sparkles
} from 'lucide-react';

const TRADE_TYPE_LABELS = {
  letting_agent: 'Emlak & Kiralama Acentesi',
  main_contractor: 'Ana Yüklenici / Müteahhit',
  property_investor: 'Mülk Yatırımcısı',
  landlord: 'Ev Sahibi (Çoklu Daire)',
  other: 'Diğer Ticari İşletme'
};

const JOB_STATUS_CONFIG = {
  new: { label: 'Yeni Talep', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  quote_sent: { label: 'Fiyat Verildi', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  approved: { label: 'Onaylandı', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  scheduled: { label: 'Planlandı', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  in_progress: { label: 'Yapılıyor', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  completed: { label: 'Tamamlandı', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  cancelled: { label: 'İptal', bg: 'bg-zinc-800 text-zinc-500 border-zinc-700' }
};

export default function B2BManager({ token, onNavigateTab = null, initialSubTab = 'jobs' }) {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab); // 'jobs' | 'partners' | 'settlement'

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);
  const [partners, setPartners] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [partnerFilter, setPartnerFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all'); // 'all' | 'unpaid' | 'paid'

  // Job Modal
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState({
    partnerId: '',
    propertyAddress: '',
    tenantName: '',
    tenantPhone: '',
    accessMethod: '',
    jobTitle: '',
    jobDescription: '',
    urgency: 'this-week',
    status: 'new',
    scheduledDate: '',
    scheduledTime: '',
    myNetPrice: '',
    partnerGrossPrice: '',
    paymentTerms: 'weekly',
    paymentStatus: 'unpaid',
    adminNotes: ''
  });

  // Partner Modal
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [partnerForm, setPartnerForm] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    tradeType: 'letting_agent',
    jobVolumeEstimate: '5-10 jobs/month',
    paymentTerms: 'weekly',
    notes: '',
    status: 'approved'
  });

  // Friday settlement selected partner
  const [settlementPartnerId, setSettlementPartnerId] = useState('');
  const [copiedText, setCopiedText] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [partnersRes, jobsRes] = await Promise.all([
        fetch('/api/admin/b2b/partners', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/b2b/jobs', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (partnersRes.ok) {
        const pData = await partnersRes.json();
        if (pData.success) setPartners(pData.partners || []);
      }
      if (jobsRes.ok) {
        const jData = await jobsRes.json();
        if (jData.success) setJobs(jData.jobs || []);
      }
    } catch (err) {
      console.error('Error fetching B2B data:', err);
      showToast('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // Statistics
  const pendingPartners = partners.filter(p => p.status === 'pending');
  const activeJobs = jobs.filter(j => j.status !== 'completed' && j.status !== 'cancelled');
  const unpaidJobs = jobs.filter(j => j.paymentStatus === 'unpaid');
  const totalUnpaidNetBalance = unpaidJobs.reduce((acc, j) => acc + (Number(j.myNetPrice) || 0), 0);
  const totalCompletedPaidRevenue = jobs
    .filter(j => j.status === 'completed' && j.paymentStatus === 'paid')
    .reduce((acc, j) => acc + (Number(j.myNetPrice) || 0), 0);

  // Filtered jobs
  const filteredJobs = jobs.filter(job => {
    if (partnerFilter !== 'all' && job.partnerId !== partnerFilter) return false;
    if (statusFilter !== 'all' && job.status !== statusFilter) return false;
    if (paymentFilter !== 'all' && job.paymentStatus !== paymentFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchText = `${job.partnerCompanyName} ${job.propertyAddress} ${job.tenantName} ${job.jobTitle} ${job.jobDescription}`.toLowerCase();
      return matchText.includes(q);
    }
    return true;
  });

  // Handle Partner Approval
  const handleApprovePartner = async (partnerId, terms = 'weekly') => {
    try {
      const res = await fetch(`/api/admin/b2b/partners/${partnerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'approved', paymentTerms: terms })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('B2B ortak başarıyla onaylandı! Artık portala giriş yapabilir.');
        fetchData();
      } else {
        alert(data.error || 'Onaylama başarısız');
      }
    } catch (err) {
      alert('Ağ hatası: ' + err.message);
    }
  };

  const handleRejectPartner = async (partnerId) => {
    if (!window.confirm('Bu başvuruyu reddetmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`/api/admin/b2b/partners/${partnerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'rejected' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Başvuru reddedildi.');
        fetchData();
      } else {
        alert(data.error || 'İşlem başarısız');
      }
    } catch (err) {
      alert('Ağ hatası: ' + err.message);
    }
  };

  const handleDeletePartner = async (partnerId) => {
    if (!window.confirm('Bu B2B firmayı silmek istediğinize emin misiniz? Tüm geçmişi silinecektir.')) return;
    try {
      const res = await fetch(`/api/admin/b2b/partners/${partnerId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('B2B firma silindi.');
        fetchData();
      }
    } catch (err) {
      alert('Ağ hatası: ' + err.message);
    }
  };

  // Handle Save Job
  const handleSaveJob = async (e) => {
    e.preventDefault();
    try {
      const url = editingJob ? `/api/admin/b2b/jobs/${editingJob.id}` : '/api/admin/b2b/jobs';
      const method = editingJob ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(jobForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(editingJob ? 'İş güncellendi!' : 'Yeni B2B iş başarıyla kaydedildi!');
        setIsJobModalOpen(false);
        setEditingJob(null);
        fetchData();
      } else {
        alert(data.error || 'Kaydetme başarısız');
      }
    } catch (err) {
      alert('Ağ hatası: ' + err.message);
    }
  };

  // Handle Quick Job Status / Payment Update
  const handleQuickJobUpdate = async (jobId, updates) => {
    try {
      const res = await fetch(`/api/admin/b2b/jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('İş güncellendi');
        fetchData();
      }
    } catch (err) {
      alert('Hata: ' + err.message);
    }
  };

  // Sync to Accounting
  const handleSyncToAccounting = async (jobId) => {
    try {
      const res = await fetch(`/api/admin/b2b/jobs/${jobId}/sync-accounting`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('İş Handyeco Muhasebe modülüne net gelir olarak kaydedildi! 💰');
        fetchData();
      } else {
        alert(data.error || 'Muhasebeye aktarılamadı');
      }
    } catch (err) {
      alert('Ağ hatası: ' + err.message);
    }
  };

  // WhatsApp Message Generator for Job Completion
  const generateWhatsAppJobSummary = (job) => {
    const text = `Hi ${job.partnerCompanyName},\n\nJob completed at: ${job.propertyAddress}\nTenant: ${job.tenantName}\nWork: ${job.jobTitle}\n\nInvoice Amount: £${job.myNetPrice}\nSettlement: ${job.paymentTerms === 'daily' ? 'Daily on completion' : 'Weekly Friday settlement'}\nPayment details: Handyeco Bank Transfer\n\nPhotos & sign-off completed. Thank you!`;
    return encodeURIComponent(text);
  };

  // Friday Settlement Message Generator
  const generateFridaySettlementText = (partner, partnerUnpaidJobs) => {
    const total = partnerUnpaidJobs.reduce((acc, j) => acc + (Number(j.myNetPrice) || 0), 0);
    const dateStr = new Date().toLocaleDateString('en-GB');
    let text = `Hi ${partner.contactPerson || partner.companyName},\n\nHere is your weekly maintenance statement for Friday (${dateStr}):\n\n`;
    
    partnerUnpaidJobs.forEach((job, idx) => {
      text += `${idx + 1}. ${job.propertyAddress} - ${job.jobTitle}: £${job.myNetPrice}\n`;
    });

    text += `\n━━━━━━━━━━━━━━━━━━━━\nTOTAL BALANCE DUE: £${total}\nPayment Terms: Weekly Settlement (Every Friday)\n\nPlease confirm receipt and process transfer to our account. Thank you!`;
    return text;
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText('Kopyalandı!');
    setTimeout(() => setCopiedText(''), 2500);
  };

  const openNewJobModal = (preselectedPartnerId = '') => {
    setEditingJob(null);
    setJobForm({
      partnerId: preselectedPartnerId || (partners[0]?.id || ''),
      propertyAddress: '',
      tenantName: '',
      tenantPhone: '',
      accessMethod: 'Office key collection or direct tenant call',
      jobTitle: '',
      jobDescription: '',
      urgency: 'this-week',
      status: 'new',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '10:00',
      myNetPrice: '',
      partnerGrossPrice: '',
      paymentTerms: 'weekly',
      paymentStatus: 'unpaid',
      adminNotes: ''
    });
    setIsJobModalOpen(true);
  };

  const openEditJobModal = (job) => {
    setEditingJob(job);
    setJobForm({
      partnerId: job.partnerId,
      propertyAddress: job.propertyAddress,
      tenantName: job.tenantName,
      tenantPhone: job.tenantPhone,
      accessMethod: job.accessMethod || '',
      jobTitle: job.jobTitle,
      jobDescription: job.jobDescription || '',
      urgency: job.urgency || 'this-week',
      status: job.status,
      scheduledDate: job.scheduledDate || '',
      scheduledTime: job.scheduledTime || '',
      myNetPrice: job.myNetPrice || '',
      partnerGrossPrice: job.partnerGrossPrice || '',
      paymentTerms: job.paymentTerms || 'weekly',
      paymentStatus: job.paymentStatus || 'unpaid',
      adminNotes: job.adminNotes || ''
    });
    setIsJobModalOpen(true);
  };

  return (
    <div className="space-y-6 text-zinc-100">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                B2B Yönetim Portalı
                {pendingPartners.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-black animate-pulse">
                    {pendingPartners.length} Onay Bekliyor
                  </span>
                )}
              </h1>
              <p className="text-xs text-zinc-400">
                Emlak acenteleri, kurumsal ortaklar ve ana yükleniciler için B2B iş ve hakediş kontrol merkezi.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openNewJobModal()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:from-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni B2B İş Ekle</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Onay Bekleyenler */}
        <div 
          onClick={() => setActiveSubTab('partners')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            pendingPartners.length > 0 
              ? 'bg-amber-950/20 border-amber-600/40 hover:border-amber-500' 
              : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-400">Bekleyen Başvurular</span>
            <Users className={`w-4 h-4 ${pendingPartners.length > 0 ? 'text-amber-400' : 'text-zinc-500'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black ${pendingPartners.length > 0 ? 'text-amber-400' : 'text-white'}`}>
              {pendingPartners.length}
            </span>
            <span className="text-[10px] text-zinc-500">B2B</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">
            {pendingPartners.length > 0 ? '⚠️ Görüşüp onaylamanız bekleniyor' : 'Tüm başvurular güncel'}
          </p>
        </div>

        {/* Card 2: Aktif İşler */}
        <div 
          onClick={() => { setActiveSubTab('jobs'); setStatusFilter('all'); }}
          className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-400">Aktif B2B İşler</span>
            <Briefcase className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{activeJobs.length}</span>
            <span className="text-[10px] text-zinc-500">işlemde</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Teklif, planlanan ve devam edenler</p>
        </div>

        {/* Card 3: Bekleyen Net Hakediş */}
        <div 
          onClick={() => { setActiveSubTab('jobs'); setPaymentFilter('unpaid'); }}
          className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-400">Tahsil Edilecek Bakiye</span>
            <PoundSterling className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400">£{totalUnpaidNetBalance.toFixed(0)}</span>
            <span className="text-[10px] text-zinc-500">net kazanç</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">{unpaidJobs.length} ödenmemiş iş (Günlük/Haftalık)</p>
        </div>

        {/* Card 4: Toplam B2B Ciro */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-400">Tahsil Edilen Kazanç</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">£{totalCompletedPaidRevenue.toFixed(0)}</span>
            <span className="text-[10px] text-zinc-500">ödenen net</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Tamamlanan B2B işlerden tahsilat</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto no-scrollbar scroll-smooth">
        <button
          onClick={() => setActiveSubTab('jobs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
            activeSubTab === 'jobs'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>İş Takip Hattı ({jobs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('partners')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative shrink-0 whitespace-nowrap ${
            activeSubTab === 'partners'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Kayıtlı Firmalar ({partners.filter(p => p.status === 'approved').length})</span>
          {pendingPartners.length > 0 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-black animate-pulse">
              {pendingPartners.length} Onay Bekliyor
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('settlement')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
            activeSubTab === 'settlement'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Cuma Haftalık Mutabakatı</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* SUB-TAB 1: JOBS PIPELINE */}
      {/* ============================================================ */}
      {activeSubTab === 'jobs' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-zinc-900/70 p-3 rounded-2xl border border-zinc-800">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="İş, adres, kiracı veya firma ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <select
                value={partnerFilter}
                onChange={(e) => setPartnerFilter(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-blue-500"
              >
                <option value="all">Tüm B2B Firmaları &amp; Acenteler</option>
                {partners.map(p => (
                  <option key={p.id} value={p.id}>{p.companyName}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-blue-500"
              >
                <option value="all">Tüm İş Durumları</option>
                <option value="new">Yeni Talep</option>
                <option value="quote_sent">Fiyat Verildi</option>
                <option value="approved">Onaylandı</option>
                <option value="scheduled">Planlandı</option>
                <option value="in_progress">Yapılıyor</option>
                <option value="completed">Tamamlandı</option>
                <option value="cancelled">İptal</option>
              </select>
            </div>

            <div>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-blue-500"
              >
                <option value="all">Tüm Ödeme Durumları</option>
                <option value="unpaid">Ödenmedi / Bekliyor</option>
                <option value="paid">Tahsil Edildi (Ödendi)</option>
              </select>
            </div>
          </div>

          {/* Jobs List */}
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
              <Briefcase className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-zinc-400">Kriterlere uygun B2B iş bulunamadı</p>
              <p className="text-xs text-zinc-500 mt-1">Filtreleri temizleyebilir veya yeni bir iş kaydı oluşturabilirsiniz.</p>
              <button
                onClick={() => openNewJobModal()}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Yeni B2B İş Oluştur
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredJobs.map(job => {
                const statusCfg = JOB_STATUS_CONFIG[job.status] || JOB_STATUS_CONFIG.new;
                const cleanPhone = (job.tenantPhone || '').replace(/[^0-9+]/g, '');
                const waLink = cleanPhone ? `https://wa.me/${cleanPhone.replace(/^0/, '44')}` : null;
                const partnerWaText = generateWhatsAppJobSummary(job);
                const partnerObj = partners.find(p => p.id === job.partnerId);
                const partnerPhone = partnerObj?.phone?.replace(/[^0-9+]/g, '');
                const partnerWaLink = partnerPhone ? `https://wa.me/${partnerPhone.replace(/^0/, '44')}?text=${partnerWaText}` : null;

                return (
                  <div 
                    key={job.id} 
                    className="p-4 sm:p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all space-y-4"
                  >
                    {/* Top Row: Partner White Label & Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5">
                      {/* CRITICAL WHITE LABEL BADGE */}
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 font-bold text-xs shadow-inner">
                        <span className="text-sm">🎭</span>
                        <span>MÜŞTERİYE GİRİŞTE TANITIM:</span>
                        <span className="text-white font-extrabold uppercase tracking-wide">
                          "{job.partnerCompanyName}"
                        </span>
                        <span className="text-[10px] text-purple-400 font-normal">
                          (Handyeco denmeyecek!)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status badge & selector */}
                        <select
                          value={job.status}
                          onChange={(e) => handleQuickJobUpdate(job.id, { status: e.target.value })}
                          className={`px-3 py-1 rounded-xl text-xs font-bold border cursor-pointer focus:outline-none ${statusCfg.bg}`}
                        >
                          <option value="new">Yeni Talep</option>
                          <option value="quote_sent">Fiyat Verildi</option>
                          <option value="approved">Onaylandı</option>
                          <option value="scheduled">Planlandı</option>
                          <option value="in_progress">Yapılıyor</option>
                          <option value="completed">Tamamlandı</option>
                          <option value="cancelled">İptal</option>
                        </select>

                        {/* Payment Status badge & toggle */}
                        <button
                          onClick={() => handleQuickJobUpdate(job.id, { 
                            paymentStatus: job.paymentStatus === 'paid' ? 'unpaid' : 'paid' 
                          })}
                          className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            job.paymentStatus === 'paid'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                          }`}
                          title="Ödeme Durumunu Değiştir"
                        >
                          {job.paymentStatus === 'paid' ? '✓ Ödendi' : '⏳ Ödeme Bekliyor'}
                        </button>
                      </div>
                    </div>

                    {/* Middle: Job Details & Address */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Col 1: Job Description */}
                      <div className="md:col-span-2 space-y-2">
                        <h3 className="font-extrabold text-base text-white tracking-tight">
                          {job.jobTitle}
                        </h3>
                        {job.jobDescription && (
                          <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80">
                            {job.jobDescription}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 pt-1">
                          <span className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-blue-400" />
                            {job.propertyAddress}
                          </span>
                          {job.accessMethod && (
                            <span className="px-2 py-0.5 rounded-lg bg-zinc-800 text-[11px] text-zinc-300">
                              🔑 Erişim: {job.accessMethod}
                            </span>
                          )}
                          {job.scheduledDate && (
                            <span className="flex items-center gap-1 text-amber-400 font-bold">
                              <Calendar className="w-3.5 h-3.5" />
                              {job.scheduledDate} {job.scheduledTime && `(${job.scheduledTime})`}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Col 2: Tenant & Contact */}
                      <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2 text-xs">
                        <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                          Daire Sakini / Kiracı
                        </div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-zinc-500" />
                          {job.tenantName}
                        </div>
                        {job.tenantPhone ? (
                          <div className="flex items-center gap-2 pt-1">
                            <a
                              href={`tel:${job.tenantPhone}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold text-[11px] transition-colors"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{job.tenantPhone}</span>
                            </a>
                            {waLink && (
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-[11px] transition-colors"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-zinc-500 text-[11px]">Telefon numarası girilmedi</span>
                        )}

                        <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400">
                          <span>Firma: </span>
                          <span className="font-bold text-zinc-200">{job.partnerCompanyName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Matrix & Actions */}
                    <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                      {/* Dual Pricing Breakdown */}
                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 bg-zinc-950/90 px-3 py-2 rounded-xl border border-zinc-800">
                        <div>
                          <span className="text-[10px] text-zinc-500 block uppercase font-bold">Ekrem Net Kazanç</span>
                          <span className="text-sm font-black text-emerald-400">£{Number(job.myNetPrice || 0).toFixed(2)}</span>
                        </div>
                        <span className="text-zinc-600 font-bold">|</span>
                        <div>
                          <span className="text-[10px] text-zinc-500 block uppercase font-bold">Firma Satış Fiyatı</span>
                          <span className="text-sm font-bold text-zinc-300">£{Number(job.partnerGrossPrice || 0).toFixed(2)}</span>
                        </div>
                        <span className="text-zinc-600 font-bold">|</span>
                        <div>
                          <span className="text-[10px] text-zinc-500 block uppercase font-bold">B2B Kârı</span>
                          <span className="text-sm font-black text-blue-400">
                            £{Math.max(0, (Number(job.partnerGrossPrice || 0) - Number(job.myNetPrice || 0))).toFixed(2)}
                          </span>
                        </div>
                        <div className="hidden sm:block pl-2 border-l border-zinc-800">
                          <span className="text-[10px] text-zinc-500 block uppercase font-bold">Ödeme Şartı</span>
                          <span className="text-xs font-bold text-amber-400 uppercase">
                            {job.paymentTerms === 'daily' ? '⚡ Günlük' : '📅 Haftalık'}
                          </span>
                        </div>
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="flex items-center gap-2">
                        {/* One-click Sync to Accounting */}
                        <button
                          onClick={() => handleSyncToAccounting(job.id)}
                          disabled={job.syncedToAccounting}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            job.syncedToAccounting
                              ? 'bg-zinc-800/50 text-zinc-500 border-zinc-800 cursor-not-allowed'
                              : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/30'
                          }`}
                          title="Handyeco Gelir Tablosuna Kaydet"
                        >
                          <PoundSterling className="w-3.5 h-3.5" />
                          <span>{job.syncedToAccounting ? 'Muhasebeye Aktarıldı ✓' : 'Muhasebeye Aktar'}</span>
                        </button>

                        {/* WhatsApp Job Summary for Partner */}
                        {partnerWaLink && (
                          <a
                            href={partnerWaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all"
                            title="Firmaya WhatsApp'tan İş Tamamlandı Raporu Gönder"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                            <span>Firmaya Rapor Yaz</span>
                          </a>
                        )}

                        {/* Edit Button */}
                        <button
                          onClick={() => openEditJobModal(job)}
                          className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-all cursor-pointer"
                          title="İşi Düzenle"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={async () => {
                            if (window.confirm('Bu B2B işi silmek istediğinize emin misiniz?')) {
                              await fetch(`/api/admin/b2b/jobs/${job.id}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}` }
                              });
                              showToast('İş silindi');
                              fetchData();
                            }
                          }}
                          className="p-1.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-zinc-800 transition-all cursor-pointer"
                          title="İşi Sil"
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
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 2: PARTNERS DIRECTORY & PENDING APPROVALS */}
      {/* ============================================================ */}
      {activeSubTab === 'partners' && (
        <div className="space-y-6">
          {/* Section: Pending Approvals (Gatekeeping) */}
          {pendingPartners.length === 0 && (
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Onay bekleyen yeni B2B başvurusu bulunmuyor. Tüm başvurular güncel.</span>
              </div>
              <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-750">
                0 Bekleyen
              </span>
            </div>
          )}

          {pendingPartners.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-950/20 border-2 border-amber-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                  <h2 className="font-extrabold text-base text-amber-400">
                    Onay Bekleyen B2B Başvuruları ({pendingPartners.length})
                  </h2>
                </div>
                <span className="text-xs text-amber-300 font-semibold">
                  ⚠️ Bu firmalar siz onaylamadan panele giriş yapamaz!
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingPartners.map(partner => {
                  const cleanPhone = (partner.phone || '').replace(/[^0-9+]/g, '');
                  const waLink = cleanPhone ? `https://wa.me/${cleanPhone.replace(/^0/, '44')}` : null;

                  return (
                    <div 
                      key={partner.id} 
                      className="p-4 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-extrabold text-white text-base">{partner.companyName}</h3>
                          <p className="text-xs text-zinc-400">Yetkili: <span className="font-bold text-zinc-200">{partner.contactPerson}</span></p>
                        </div>
                        <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                          ONAY BEKLİYOR
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-400">
                        <div>
                          <span className="text-[10px] text-zinc-500 block">İşletme Türü:</span>
                          <span className="font-semibold text-zinc-200">{TRADE_TYPE_LABELS[partner.tradeType] || partner.tradeType}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-500 block">Tahmini Aylık Hacim:</span>
                          <span className="font-semibold text-zinc-200">{partner.jobVolumeEstimate || 'Belirtilmedi'}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[10px] text-zinc-500 block">İletişim:</span>
                          <span className="font-semibold text-zinc-200">{partner.phone} &bull; {partner.email}</span>
                        </div>
                        {partner.notes && (
                          <div className="col-span-2 bg-zinc-900 p-2 rounded-lg text-xs text-zinc-300 italic">
                            "{partner.notes}"
                          </div>
                        )}
                      </div>

                      {/* Approval Actions */}
                      <div className="pt-2 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2">
                        {waLink && (
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition-all"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>WhatsApp'tan Görüş</span>
                          </a>
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRejectPartner(partner.id)}
                            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
                          >
                            Reddet
                          </button>
                          <button
                            onClick={() => handleApprovePartner(partner.id, 'weekly')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Haftalık Şartla Onayla</span>
                          </button>
                          <button
                            onClick={() => handleApprovePartner(partner.id, 'daily')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Günlük Şartla Onayla</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Approved Partners Directory */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-base text-white">Kayıtlı B2B Ortakları &amp; Acenteler</h2>
              <button
                onClick={() => {
                  setEditingPartner(null);
                  setPartnerForm({
                    companyName: '',
                    contactPerson: '',
                    phone: '',
                    email: '',
                    tradeType: 'letting_agent',
                    jobVolumeEstimate: '5-10 jobs/month',
                    paymentTerms: 'weekly',
                    notes: '',
                    status: 'approved'
                  });
                  setIsPartnerModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Manuel B2B Firma Ekle</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partners.filter(p => p.status === 'approved').map(partner => {
                const partnerJobs = jobs.filter(j => j.partnerId === partner.id);
                const partnerUnpaid = partnerJobs.filter(j => j.paymentStatus === 'unpaid');
                const unpaidTotal = partnerUnpaid.reduce((acc, j) => acc + (Number(j.myNetPrice) || 0), 0);

                return (
                  <div 
                    key={partner.id} 
                    className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-extrabold text-white text-base leading-tight">{partner.companyName}</h3>
                        <p className="text-xs text-zinc-400 mt-0.5">Yetkili: <span className="font-bold text-zinc-300">{partner.contactPerson}</span></p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        partner.paymentTerms === 'daily'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {partner.paymentTerms === 'daily' ? '⚡ Günlük' : '📅 Haftalık'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-zinc-400 bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Telefon:</span>
                        <a href={`tel:${partner.phone}`} className="text-blue-400 font-semibold hover:underline">
                          {partner.phone}
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">E-posta:</span>
                        <span className="text-zinc-300 truncate max-w-[150px]">{partner.email}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Toplam İş:</span>
                        <span className="text-zinc-200 font-bold">{partnerJobs.length} adet</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
                        <span className="text-amber-400 font-bold">Ödenmemiş Bakiye:</span>
                        <span className="text-amber-400 font-black text-sm">£{unpaidTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    {partner.notes && (
                      <p className="text-[11px] text-zinc-400 italic bg-zinc-950/40 p-2 rounded-lg">
                        🎭 Not: {partner.notes}
                      </p>
                    )}

                    <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setSettlementPartnerId(partner.id);
                          setActiveSubTab('settlement');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Mutabakat Yap</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openNewJobModal(partner.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-all cursor-pointer"
                          title="Bu Firmaya Yeni İş Aç"
                        >
                          + İş Aç
                        </button>
                        <button
                          onClick={() => handleDeletePartner(partner.id)}
                          className="p-1.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                          title="Firmayı Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 3: FRIDAY WEEKLY SETTLEMENT STATEMENT BUILDER */}
      {/* ============================================================ */}
      {activeSubTab === 'settlement' && (
        <div className="space-y-6 max-w-4xl">
          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-5">
            <div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-400" />
                Cuma Haftalık Mutabakat Tablosu &amp; WhatsApp Mesajı
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Haftalık çalışan firmaların Cuma günü toplu hakediş özetini tek tıkla WhatsApp veya e-posta için hazırlar.
              </p>
            </div>

            {/* Select Partner */}
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1.5">Mutabakat Yapılacak B2B Firma:</label>
              <select
                value={settlementPartnerId}
                onChange={(e) => setSettlementPartnerId(e.target.value)}
                className="w-full sm:w-80 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Firma Seçin...</option>
                {partners.filter(p => p.status === 'approved').map(p => {
                  const unpCount = jobs.filter(j => j.partnerId === p.id && j.paymentStatus === 'unpaid').length;
                  return (
                    <option key={p.id} value={p.id}>
                      {p.companyName} ({unpCount} ödenmemiş iş)
                    </option>
                  );
                })}
              </select>
            </div>

            {settlementPartnerId && (() => {
              const partner = partners.find(p => p.id === settlementPartnerId);
              if (!partner) return null;
              const unpaidJobsForPartner = jobs.filter(j => j.partnerId === partner.id && j.paymentStatus === 'unpaid');
              const totalAmount = unpaidJobsForPartner.reduce((acc, j) => acc + (Number(j.myNetPrice) || 0), 0);
              const settlementText = generateFridaySettlementText(partner, unpaidJobsForPartner);
              const partnerPhone = partner.phone?.replace(/[^0-9+]/g, '');
              const waUrl = partnerPhone ? `https://wa.me/${partnerPhone.replace(/^0/, '44')}?text=${encodeURIComponent(settlementText)}` : null;

              return (
                <div className="space-y-5 pt-4 border-t border-zinc-800">
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                    <div>
                      <span className="text-xs text-zinc-500 block uppercase font-bold">B2B Firma</span>
                      <span className="text-base font-extrabold text-white">{partner.companyName}</span>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-500 block uppercase font-bold">Ödenmemiş İş Sayısı</span>
                      <span className="text-base font-extrabold text-blue-400">{unpaidJobsForPartner.length} Adet</span>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-500 block uppercase font-bold">Toplam Alacak</span>
                      <span className="text-xl font-black text-emerald-400">£{totalAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          if (!window.confirm(`${unpaidJobsForPartner.length} işin tümünü ÖDENDİ olarak işaretlemek istiyor musunuz?`)) return;
                          for (const j of unpaidJobsForPartner) {
                            await fetch(`/api/admin/b2b/jobs/${j.id}`, {
                              method: 'PATCH',
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`
                              },
                              body: JSON.stringify({ paymentStatus: 'paid' })
                            });
                          }
                          showToast('Tüm işler ödendi olarak güncellendi!');
                          fetchData();
                        }}
                        disabled={unpaidJobsForPartner.length === 0}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Tümünü Ödendi İşaretle
                      </button>
                    </div>
                  </div>

                  {/* WhatsApp Statement Preview */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-zinc-300">Hazır WhatsApp Mutabakat Metni:</span>
                      <div className="flex items-center gap-2">
                        {copiedText && <span className="text-xs text-emerald-400 font-bold">{copiedText}</span>}
                        <button
                          onClick={() => handleCopyText(settlementText)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Metni Kopyala</span>
                        </button>
                        {waUrl && (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp'ta Aç</span>
                          </a>
                        )}
                      </div>
                    </div>
                    <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed select-all">
                      {settlementText}
                    </pre>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: CREATE / EDIT B2B JOB */}
      {/* ============================================================ */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0b0e14] border border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-[#0b0e14]/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                <h3 className="font-extrabold text-base text-white">
                  {editingJob ? 'B2B İşi Düzenle' : 'Yeni B2B İş Kaydı Oluştur'}
                </h3>
              </div>
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="p-5 sm:p-6 space-y-4 text-xs">
              {/* Partner Select */}
              <div>
                <label className="font-bold text-zinc-300 block mb-1">B2B Firma / Acente *</label>
                <select
                  required
                  value={jobForm.partnerId}
                  onChange={(e) => setJobForm({ ...jobForm, partnerId: e.target.value })}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Firma Seçin...</option>
                  {partners.map(p => (
                    <option key={p.id} value={p.id}>{p.companyName} ({p.contactPerson})</option>
                  ))}
                </select>
              </div>

              {/* White Label Reminder Notice */}
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-200">
                <span className="font-extrabold text-white">🎭 Hatırlatma:</span> Bu işe giderken seçilen B2B firma adına gideceksiniz. Handyeco markası kullanılmayacak.
              </div>

              {/* Job Title & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-zinc-300 block mb-1">İş Başlığı / Hizmet *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Banyo Silikonu Yenileme & Menteşe Tamiri"
                    value={jobForm.jobTitle}
                    onChange={(e) => setJobForm({ ...jobForm, jobTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Aciliyet</label>
                  <select
                    value={jobForm.urgency}
                    onChange={(e) => setJobForm({ ...jobForm, urgency: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="urgent">Acil (Aynı Gün / Ertesi Gün)</option>
                    <option value="this-week">Bu Hafta İçinde</option>
                    <option value="flexible">Esnek Zamanlı</option>
                  </select>
                </div>
              </div>

              {/* Property Address & Access */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Mülk Adresi &amp; Posta Kodu *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: 14 Rose Street, Flat 2F1, EH2 2PR"
                    value={jobForm.propertyAddress}
                    onChange={(e) => setJobForm({ ...jobForm, propertyAddress: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Anahtar / Erişim Şekli</label>
                  <input
                    type="text"
                    placeholder="Örn: Ofisten anahtar teslim veya kiracı doğrudan evde"
                    value={jobForm.accessMethod}
                    onChange={(e) => setJobForm({ ...jobForm, accessMethod: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Tenant Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Kiracı Adı Soyadı</label>
                  <input
                    type="text"
                    placeholder="Örn: Sarah MacLeod"
                    value={jobForm.tenantName}
                    onChange={(e) => setJobForm({ ...jobForm, tenantName: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Kiracı Telefonu</label>
                  <input
                    type="text"
                    placeholder="Örn: 07700 900123"
                    value={jobForm.tenantPhone}
                    onChange={(e) => setJobForm({ ...jobForm, tenantPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label className="font-bold text-zinc-300 block mb-1">Yapılacak İş Detayları</label>
                <textarea
                  rows={2}
                  placeholder="Detaylı açıklamalar, ölçüler veya malzeme gereksinimleri..."
                  value={jobForm.jobDescription}
                  onChange={(e) => setJobForm({ ...jobForm, jobDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Planlanan Randevu Tarihi</label>
                  <input
                    type="date"
                    value={jobForm.scheduledDate}
                    onChange={(e) => setJobForm({ ...jobForm, scheduledDate: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Randevu Saati</label>
                  <input
                    type="text"
                    placeholder="Örn: 10:00 AM"
                    value={jobForm.scheduledTime}
                    onChange={(e) => setJobForm({ ...jobForm, scheduledTime: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* DUAL PRICING MATRIX */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <PoundSterling className="w-4 h-4 text-emerald-400" />
                  <span>Fiyatlandırma &amp; Komisyon Matrisi</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-emerald-400 block mb-1">Ekrem Net Kazanç (£) *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="Örn: 120"
                      value={jobForm.myNetPrice}
                      onChange={(e) => setJobForm({ ...jobForm, myNetPrice: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-zinc-500 mt-0.5 block">Sizin cebinize kalacak net</span>
                  </div>

                  <div>
                    <label className="font-bold text-zinc-300 block mb-1">Firma Satış Fiyatı (£)</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Örn: 170"
                      value={jobForm.partnerGrossPrice}
                      onChange={(e) => setJobForm({ ...jobForm, partnerGrossPrice: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 font-bold focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-zinc-500 mt-0.5 block">Firmanın ev sahibine kestiği</span>
                  </div>

                  <div>
                    <label className="font-bold text-blue-400 block mb-1">B2B Kârı (£)</label>
                    <div className="px-3 py-2 bg-zinc-900 border border-blue-500/30 rounded-xl text-blue-400 font-black text-sm">
                      £{Math.max(0, (Number(jobForm.partnerGrossPrice || 0) - Number(jobForm.myNetPrice || 0))).toFixed(2)}
                    </div>
                    <span className="text-[10px] text-zinc-500 mt-0.5 block">Otomatik kâr hesabı</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="font-bold text-zinc-300 block mb-1">Ödeme Şartı</label>
                    <select
                      value={jobForm.paymentTerms}
                      onChange={(e) => setJobForm({ ...jobForm, paymentTerms: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="weekly">📅 Haftalık (Cuma Mutabakatı)</option>
                      <option value="daily">⚡ Günlük (İş Bitimi)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-zinc-300 block mb-1">İş Durumu</label>
                    <select
                      value={jobForm.status}
                      onChange={(e) => setJobForm({ ...jobForm, status: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="new">Yeni Talep</option>
                      <option value="quote_sent">Fiyat Verildi</option>
                      <option value="approved">Onaylandı</option>
                      <option value="scheduled">Planlandı</option>
                      <option value="in_progress">Yapılıyor</option>
                      <option value="completed">Tamamlandı</option>
                      <option value="cancelled">İptal</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-zinc-300 block mb-1">Ödeme Durumu</label>
                    <select
                      value={jobForm.paymentStatus}
                      onChange={(e) => setJobForm({ ...jobForm, paymentStatus: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="unpaid">⏳ Ödenmedi / Bekliyor</option>
                      <option value="paid">✓ Tahsil Edildi (Ödendi)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="font-bold text-zinc-300 block mb-1">Yönetici Özel Notları</label>
                <input
                  type="text"
                  placeholder="Yalnızca sizin göreceğiniz özel operasyonel notlar..."
                  value={jobForm.adminNotes}
                  onChange={(e) => setJobForm({ ...jobForm, adminNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/25 cursor-pointer"
                >
                  {editingJob ? 'Değişiklikleri Kaydet' : 'İşi Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: CREATE / EDIT PARTNER */}
      {/* ============================================================ */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0b0e14] border border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                <h3 className="font-extrabold text-base text-white">Manuel B2B Firma Ekle</h3>
              </div>
              <button
                onClick={() => setIsPartnerModalOpen(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const res = await fetch('/api/admin/b2b/partners', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                      ...partnerForm,
                      password: 'PartnerDefault2026!'
                    })
                  });
                  const data = await res.json();
                  if (res.ok && data.success) {
                    showToast('B2B Firma eklendi!');
                    setIsPartnerModalOpen(false);
                    fetchData();
                  } else {
                    alert(data.error || 'Kaydetme başarısız');
                  }
                } catch (err) {
                  alert('Ağ hatası: ' + err.message);
                }
              }}
              className="p-5 space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-zinc-300 block mb-1">Firma / Ticari İsim *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Apex Property Management"
                  value={partnerForm.companyName}
                  onChange={(e) => setPartnerForm({ ...partnerForm, companyName: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Yetkili Kişi *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: David Ross"
                    value={partnerForm.contactPerson}
                    onChange={(e) => setPartnerForm({ ...partnerForm, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Telefon / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: +44 7700 900123"
                    value={partnerForm.phone}
                    onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-300 block mb-1">E-posta Adresi *</label>
                <input
                  type="email"
                  required
                  placeholder="Örn: david@apexproperty.co.uk"
                  value={partnerForm.email}
                  onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">İşletme Türü</label>
                  <select
                    value={partnerForm.tradeType}
                    onChange={(e) => setPartnerForm({ ...partnerForm, tradeType: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="letting_agent">Emlak &amp; Kiralama Acentesi</option>
                    <option value="main_contractor">Ana Yüklenici / Müteahhit</option>
                    <option value="property_investor">Mülk Yatırımcısı</option>
                    <option value="landlord">Ev Sahibi (Çoklu Daire)</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Ödeme Şartı</label>
                  <select
                    value={partnerForm.paymentTerms}
                    onChange={(e) => setPartnerForm({ ...partnerForm, paymentTerms: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="weekly">📅 Haftalık (Cuma)</option>
                    <option value="daily">⚡ Günlük (İş Bitimi)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-300 block mb-1">White-Label Giriş Notu (Önemli)</label>
                <input
                  type="text"
                  placeholder="Örn: Müşteriye giderken 'Apex Property Maintenance' olarak tanıtılacak"
                  value={partnerForm.notes}
                  onChange={(e) => setPartnerForm({ ...partnerForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPartnerModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/25 cursor-pointer"
                >
                  B2B Firmayı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
