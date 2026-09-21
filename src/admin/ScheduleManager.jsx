import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Navigation, 
  MessageSquare, 
  PoundSterling, 
  CalendarDays, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  ArrowRight,
  Briefcase,
  Bell
} from 'lucide-react';

export default function ScheduleManager({ 
  token, 
  initialLeadData = null, 
  onClearInitialLead = null, 
  onLogJobToAccounting = null,
  onNavigateTab = null 
}) {
  const [schedule, setSchedule] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('agenda'); // 'agenda' | 'free_slots'
  const [dateFilter, setDateFilter] = useState('this_week'); // 'all' | 'today' | 'this_week' | 'this_month' | 'next_month' | 'upcoming'
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [sendingReminder, setSendingReminder] = useState(false);
  const [reminderStatus, setReminderStatus] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    leadId: null,
    customerName: '',
    customerPhone: '',
    postcode: 'EH1',
    address: '',
    service: 'Genel Usta İşi',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '12:00',
    durationMinutes: 120,
    status: 'scheduled',
    priceEstimate: '',
    notes: ''
  });

  const fetchData = async () => {
    try {
      const [resSchedule, resQuotes, resFinances] = await Promise.all([
        fetch('/api/schedule', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/quotes', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/finances', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (resSchedule.ok) {
        const dataSched = await resSchedule.json();
        if (dataSched.success) setSchedule(dataSched.schedule || []);
      }

      if (resQuotes.ok) {
        const dataQ = await resQuotes.json();
        if (dataQ.success) setQuotes(dataQ.quotes || []);
      }

      if (resFinances.ok) {
        const dataFin = await resFinances.json();
        if (dataFin.success) setFinances(dataFin.finances || []);
      }
    } catch (err) {
      console.error('İş takip verileri alınırken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // If redirected from LeadsManager with a lead to schedule
  useEffect(() => {
    if (initialLeadData) {
      setFormData({
        leadId: initialLeadData.id,
        customerName: initialLeadData.name || '',
        customerPhone: initialLeadData.phone || '',
        postcode: initialLeadData.postcode || 'EH1',
        address: initialLeadData.postcode ? `${initialLeadData.postcode}, Edinburgh` : '',
        service: initialLeadData.service || 'Handyman Job',
        date: new Date().toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '12:00',
        durationMinutes: 120,
        status: 'scheduled',
        priceEstimate: '',
        notes: initialLeadData.details ? `Müşteri Notu: ${initialLeadData.details}` : ''
      });
      setEditingId(null);
      setIsModalOpen(true);
      if (onClearInitialLead) onClearInitialLead();
    }
  }, [initialLeadData]);

  // Open modal to add new
  const handleOpenAddModal = (presetDate = null, presetStartTime = null) => {
    setFormData({
      leadId: null,
      customerName: '',
      customerPhone: '',
      postcode: 'EH1',
      address: '',
      service: 'General Handyman Job',
      date: presetDate || new Date().toISOString().split('T')[0],
      startTime: presetStartTime || '10:00',
      endTime: presetStartTime ? calculateEndTime(presetStartTime, 120) : '12:00',
      durationMinutes: 120,
      status: 'scheduled',
      priceEstimate: '',
      notes: ''
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const calculateEndTime = (startTime, durationMinutes) => {
    if (!startTime) return '12:00';
    const [h, m] = startTime.split(':').map(Number);
    const totalM = h * 60 + m + Number(durationMinutes);
    const endH = Math.floor(totalM / 60) % 24;
    const endM = totalM % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  };

  const handleStartTimeChange = (newStartTime) => {
    const newEnd = calculateEndTime(newStartTime, formData.durationMinutes);
    setFormData(prev => ({
      ...prev,
      startTime: newStartTime,
      endTime: newEnd
    }));
  };

  const handleDurationChange = (minutes) => {
    const newEnd = calculateEndTime(formData.startTime, minutes);
    setFormData(prev => ({
      ...prev,
      durationMinutes: minutes,
      endTime: newEnd
    }));
  };

  // Open modal to edit existing
  const handleEditJob = (job) => {
    setFormData({
      leadId: job.leadId || null,
      customerName: job.customerName || '',
      customerPhone: job.customerPhone || '',
      postcode: job.postcode || '',
      address: job.address || '',
      service: job.service || '',
      date: job.date || new Date().toISOString().split('T')[0],
      startTime: job.startTime || '10:00',
      endTime: job.endTime || '12:00',
      durationMinutes: job.durationMinutes || 120,
      status: job.status || 'scheduled',
      priceEstimate: job.priceEstimate ?? '',
      notes: job.notes || ''
    });
    setEditingId(job.id);
    setIsModalOpen(true);
  };

  // Delete Job
  const handleDeleteJob = async (id) => {
    if (!window.confirm('Bu randevu / iş kaydını silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`/api/schedule/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSchedule(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      alert('Silme işlemi başarısız: ' + err.message);
    }
  };

  // Quick Status Update
  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/schedule/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const data = await res.json();
        setSchedule(prev => prev.map(item => item.id === id ? data.job : item));
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  // Select a lead from incoming quotes to autofill
  const handleSelectLeadToAutofill = (e) => {
    const quoteId = e.target.value;
    if (!quoteId) return;
    const selected = quotes.find(q => q.id === quoteId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        leadId: selected.id,
        customerName: selected.name || prev.customerName,
        customerPhone: selected.phone || prev.customerPhone,
        postcode: selected.postcode || prev.postcode,
        address: selected.postcode ? `${selected.postcode}, Edinburgh` : prev.address,
        service: selected.service || prev.service,
        notes: selected.details ? `Müşteri Talebi: ${selected.details}` : prev.notes
      }));
    }
  };

  // Save Modal Form
  const handleSaveForm = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingId ? `/api/schedule/${editingId}` : '/api/schedule';
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
          setSchedule(prev => prev.map(s => s.id === editingId ? resData.job : s));
        } else {
          setSchedule(prev => [resData.job, ...prev]);
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

  // Date Math Helpers
  const todayIso = new Date().toISOString().split('T')[0];
  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const nextMonthObj = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextYearMonth = `${nextMonthObj.getFullYear()}-${String(nextMonthObj.getMonth() + 1).padStart(2, '0')}`;
  
  // Calculate current week range (Monday to Sunday)
  const getCurrentWeekDays = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday...
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const monday = new Date(now);
    monday.setDate(now.getDate() + distanceToMonday);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push(d);
    }
    return week;
  };

  const weekDays = getCurrentWeekDays();
  const weekStartIso = weekDays[0].toISOString().split('T')[0];
  const weekEndIso = weekDays[6].toISOString().split('T')[0];

  // Helper to check if a job is already in finances
  const getLinkedFinanceForJob = (job) => {
    return finances.find(f => 
      (job.leadId && f.leadId === job.leadId) ||
      (f.leadId === `manual-${job.id}`) ||
      (f.customerName && job.customerName && f.customerName.trim().toLowerCase() === job.customerName.trim().toLowerCase() && f.date === job.date) ||
      (f.customerPhone && job.customerPhone && f.customerPhone.replace(/[^0-9]/g, '') === job.customerPhone.replace(/[^0-9]/g, ''))
    );
  };

  // Helper to check if a job's scheduled time has already passed
  const isJobTimePassed = (job) => {
    if (!job?.date) return false;
    if (job.date < todayIso) return true;
    if (job.date > todayIso) return false;
    // For today, compare current local/UK time with job end or start time
    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHours}:${currentMinutes}`;
    const jobTime = job.endTime || job.startTime || '23:59';
    return currentTimeStr > jobTime;
  };

  // Quick counts for upcoming vs past
  const activeUpcomingCount = schedule.filter(j => (j.date || '') >= todayIso).length;
  const pastCount = schedule.filter(j => (j.date || '') < todayIso).length;

  // Filtering
  const filteredSchedule = schedule.filter(job => {
    const matchesSearch = !search || 
      job.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      job.customerPhone?.includes(search) ||
      job.postcode?.toLowerCase().includes(search.toLowerCase()) ||
      job.address?.toLowerCase().includes(search.toLowerCase()) ||
      job.service?.toLowerCase().includes(search.toLowerCase()) ||
      job.notes?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    // GEÇMİŞ TARİHLER SEKMESİ: Sadece tarihi bugünden önce olanlar
    if (activeView === 'past') {
      return (job.date || '') < todayIso;
    }

    // GÜNCEL & GELECEK SEKMESİ: Bugünün tarihi geçtikten sonra otomatik olarak geçmişe düşer
    if (activeView === 'agenda') {
      if ((job.date || '') < todayIso) return false;

      if (dateFilter === 'today') {
        return job.date === todayIso;
      } else if (dateFilter === 'this_week') {
        return job.date >= weekStartIso && job.date <= weekEndIso;
      } else if (dateFilter === 'this_month') {
        return Boolean(job.date && job.date.startsWith(currentYearMonth));
      } else if (dateFilter === 'next_month') {
        return Boolean(job.date && job.date.startsWith(nextYearMonth));
      }
      return true; // 'all' (güncel ve gelecekteki tüm randevular)
    }

    return true;
  }).sort((a, b) => {
    // Geçmiş sekmesinde en yeni geçmiş randevudan eskiye doğru sırala
    if (activeView === 'past') {
      const dateComp = (b.date || '').localeCompare(a.date || '');
      if (dateComp !== 0) return dateComp;
      return (b.startTime || '').localeCompare(a.startTime || '');
    }
    // Güncel randevularda en yakın tarihten ileriye doğru sırala
    const dateComp = (a.date || '').localeCompare(b.date || '');
    if (dateComp !== 0) return dateComp;
    return (a.startTime || '').localeCompare(b.startTime || '');
  });

  // Calculate Free Slots for This Week
  // Standard Working Hours: 08:00 - 18:00 (Mon - Sat)
  const calculateFreeSlotsForDay = (dateIso) => {
    const dayJobs = schedule
      .filter(j => j.date === dateIso && j.status !== 'cancelled')
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

    const slots = [];
    let currentCursor = '08:00';
    const dayEnd = '18:00';

    dayJobs.forEach(job => {
      const jobStart = job.startTime || '09:00';
      const jobEnd = job.endTime || '11:00';

      if (jobStart > currentCursor) {
        // There is a free gap
        slots.push({
          type: 'free',
          start: currentCursor,
          end: jobStart,
          label: `${currentCursor} - ${jobStart} (Boş)`
        });
      }

      slots.push({
        type: 'busy',
        start: jobStart,
        end: jobEnd,
        job
      });

      if (jobEnd > currentCursor) {
        currentCursor = jobEnd;
      }
    });

    if (currentCursor < dayEnd) {
      slots.push({
        type: 'free',
        start: currentCursor,
        end: dayEnd,
        label: `${currentCursor} - ${dayEnd} (Boş)`
      });
    }

    return slots;
  };

  // Group scheduled jobs by date for the agenda view
  const jobsByDate = filteredSchedule.reduce((acc, job) => {
    const dateKey = job.date || 'Tarih Yok';
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(job);
    return acc;
  }, {});

  // Send Tomorrow's Appointment Reminder via Telegram
  const handleSendTomorrowReminder = async () => {
    setSendingReminder(true);
    setReminderStatus(null);
    try {
      const res = await fetch('/api/telegram/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.delivered) {
          if (data.count === 0) {
            setReminderStatus({ type: 'info', message: `ℹ️ ${data.message || 'Yarın için planlanmış iş olmadığı Telegram\'a iletildi.'}` });
          } else {
            setReminderStatus({ type: 'success', message: `✅ ${data.count} adet randevu Telegram'a başarıyla iletildi!` });
          }
        } else {
          setReminderStatus({ type: 'info', message: `ℹ️ ${data.message || 'Yarın için randevu bulunamadı.'}` });
        }
      } else {
        setReminderStatus({ type: 'error', message: `❌ ${data.error || 'Hatırlatıcı gönderilemedi.'}` });
      }
    } catch (err) {
      setReminderStatus({ type: 'error', message: `❌ Hata: ${err.message}` });
    } finally {
      setSendingReminder(false);
      setTimeout(() => setReminderStatus(null), 6000);
    }
  };

  // Send 30-Minute Upcoming Job Reminder Test
  const handleTestUpcomingReminder = async () => {
    setSendingReminder(true);
    setReminderStatus(null);
    try {
      const res = await fetch('/api/telegram/test-upcoming-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReminderStatus({ 
          type: 'success', 
          message: `✅ 30 Dk Telegram Hatırlatması Test Edildi! Telefonunuza bildirim iletildi.` 
        });
      } else {
        setReminderStatus({ type: 'error', message: `❌ ${data.error || 'Test hatırlatması gönderilemedi.'}` });
      }
    } catch (err) {
      setReminderStatus({ type: 'error', message: `❌ Hata: ${err.message}` });
    } finally {
      setSendingReminder(false);
      setTimeout(() => setReminderStatus(null), 6000);
    }
  };

  // Print PDF function
  const handlePrintPDF = () => {
    window.print();
  };

  const getCleanPhone = (phone) => {
    if (!phone) return '';
    let p = phone.replace(/[^0-9]/g, '');
    if (p.startsWith('0')) p = '44' + p.substring(1);
    return p;
  };

  return (
    <div className="space-y-6 text-left schedule-page-container">
      
      {/* PRINT-ONLY HEADER (Invisible on screen, visible on PDF / Print) */}
      <div className="hidden print:block mb-6 p-4 border-b border-black text-black">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black uppercase">Handyeco - Edinburgh Handyman Services</h1>
            <p className="text-sm font-semibold">Usta: Ekrem • Tel: +44 7760 696723 • Edinburgh, UK</p>
            <p className="text-xs text-gray-600">Haftalık İş & Randevu Takip Programı ({weekStartIso} - {weekEndIso})</p>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold">Yazdırma Tarihi: {new Date().toLocaleDateString('tr-TR')}</p>
            <p>Toplam {filteredSchedule.length} İş Planlandı</p>
          </div>
        </div>
      </div>

      {/* Top Header & Action Controls (Screen Only) */}
      <div className="print:hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-black text-white tracking-tight">Randevular</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Müşteri randevuları, otomatik 30 dk hatırlatması ve boş saat yönetimi.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-1.5 sm:flex sm:items-center sm:gap-2 w-full sm:w-auto">
          {/* Telegram Tomorrow Reminder Button */}
          <button
            type="button"
            onClick={handleSendTomorrowReminder}
            disabled={sendingReminder}
            className="flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-sky-950/60 hover:bg-sky-900/60 text-sky-300 hover:text-white border border-sky-800/60 text-[10px] sm:text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50 whitespace-nowrap"
            title="Yarınki işleri Telegram'a bildirim olarak gönder"
          >
            <Bell className={`w-3.5 h-3.5 text-sky-400 shrink-0 ${sendingReminder ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline">{sendingReminder ? 'Gönderiliyor...' : 'Yarınki İşleri Gönder'}</span>
            <span className="sm:hidden">{sendingReminder ? '...' : 'Yarın'}</span>
          </button>

          {/* Telegram 30-Min Test Button */}
          <button
            type="button"
            onClick={handleTestUpcomingReminder}
            disabled={sendingReminder}
            className="flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 hover:text-white border border-indigo-800/60 text-[10px] sm:text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50 whitespace-nowrap"
            title="30 dakika kala hatırlatmasını Telegram'a test gönder"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="hidden sm:inline">30 Dk Test</span>
            <span className="sm:hidden">30 Dk</span>
          </button>

          {/* PDF Download Button */}
          <button
            type="button"
            onClick={handlePrintPDF}
            className="flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 text-[10px] sm:text-xs font-bold transition-all cursor-pointer shadow-sm whitespace-nowrap"
            title="PDF İndir / Yazdır"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="hidden sm:inline">PDF İndir</span>
            <span className="sm:hidden">PDF</span>
          </button>

          {/* Add Job Button */}
          <button
            type="button"
            onClick={() => handleOpenAddModal()}
            className="flex items-center justify-center gap-1 sm:gap-2 px-1.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-[10px] sm:text-sm font-bold shadow-lg shadow-blue-600/25 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline">Yeni Randevu</span>
            <span className="sm:hidden">Randevu</span>
          </button>
        </div>
      </div>

      {/* Reminder Status Alert */}
      {reminderStatus && (
        <div className={`print:hidden p-3 rounded-xl border text-xs flex items-center gap-2 ${
          reminderStatus.type === 'success' 
            ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' 
            : reminderStatus.type === 'info'
            ? 'bg-blue-950/60 border-blue-800 text-blue-300'
            : 'bg-rose-950/60 border-rose-800 text-rose-300'
        }`}>
          {reminderStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{reminderStatus.message}</span>
        </div>
      )}

      {/* 4 Weekly Quick Stat Cards (Screen Only) */}
      <div className="print:hidden grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div 
          onClick={() => setActiveView('agenda')}
          className="bg-[#0b0e14] border border-zinc-800 hover:border-blue-500/70 hover:bg-blue-950/10 rounded-2xl p-3 sm:p-4 shadow-sm cursor-pointer transition-all active:scale-[0.98] group"
          title="Tüm randevu listesine geç"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider group-hover:text-blue-400 transition-colors">Haftalık İş</span>
            <span className="p-1.5 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-900/60 group-hover:scale-110 transition-transform">
              <CalendarDays className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white mt-1 truncate">
            {schedule.filter(j => j.date >= weekStartIso && j.date <= weekEndIso).length} Randevu
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
            <span className="truncate">{weekStartIso} - {weekEndIso}</span>
            <span className="text-blue-400 font-bold group-hover:translate-x-0.5 transition-transform hidden sm:inline">&rarr;</span>
          </div>
        </div>

        <div 
          onClick={() => {
            setActiveView('agenda');
            setDateFilter('today');
          }}
          className="bg-[#0b0e14] border border-zinc-800 hover:border-amber-500/70 hover:bg-amber-950/10 rounded-2xl p-3 sm:p-4 shadow-sm cursor-pointer transition-all active:scale-[0.98] group"
          title="Bugünün randevularına filtrele"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider group-hover:text-amber-400 transition-colors">Bugün</span>
            <span className="p-1.5 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-900/60 group-hover:scale-110 transition-transform">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1 truncate">
            {schedule.filter(j => j.date === todayIso).length} Müşteri
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
            <span className="truncate">Gidilecek işler</span>
            <span className="text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform hidden sm:inline">&rarr;</span>
          </div>
        </div>

        <div 
          onClick={() => handleOpenAddModal(todayIso, '10:00')}
          className="bg-[#0b0e14] border border-zinc-800 hover:border-emerald-500/70 hover:bg-emerald-950/10 rounded-2xl p-3 sm:p-4 shadow-sm cursor-pointer transition-all active:scale-[0.98] group"
          title="Yeni randevu oluştur"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider group-hover:text-emerald-400 transition-colors">Müsaitlik</span>
            <span className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-900/60 group-hover:scale-110 transition-transform">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-lg sm:text-2xl font-black text-emerald-400 mt-1 truncate">
            🟢 Boş Saatler
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
            <span className="truncate">Teklif alınabilir</span>
            <span className="text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform hidden sm:inline">+ Ekle</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab && onNavigateTab('leads')}
          className="bg-[#0b0e14] border border-indigo-900/60 hover:border-indigo-500 hover:bg-indigo-950/30 rounded-2xl p-3 sm:p-4 shadow-sm cursor-pointer transition-all active:scale-[0.98] group relative"
          title="Talepler sayfasına git"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-300 group-hover:text-white transition-colors">Bekleyen Talepler</span>
            <span className="p-1.5 rounded-lg bg-indigo-950/90 text-indigo-400 border border-indigo-800 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Briefcase className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-indigo-300 mt-1 truncate">
            {quotes.filter(q => q.status === 'new' || !q.status).length} Talep
          </div>
          <div className="flex items-center justify-between text-[10px] text-indigo-400 font-bold mt-1">
            <span className="truncate">Taleplere git</span>
            <span className="group-hover:translate-x-1 transition-transform inline-block">&rarr;</span>
          </div>
        </div>
      </div>

      {/* View Switcher & Filters (Screen Only) */}
      <div className="print:hidden flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0b0e14] p-3 rounded-2xl border border-zinc-800">
        
        {/* View Toggle Tabs */}
        <div className="flex items-center gap-1.5 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveView('agenda')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeView === 'agenda'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            📅 Randevular ({activeUpcomingCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveView('past')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeView === 'past'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            ⏳ Geçmiş ({pastCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveView('free_slots')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeView === 'free_slots'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            ⏰ Boş Saatler
          </button>
        </div>

        {/* Date Filter & Search (Only shown on agenda view) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Müşteri, adres, EH kodu ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setDateFilter('today')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap ${
                dateFilter === 'today' ? 'bg-zinc-800 text-white border border-zinc-700' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Bugün
            </button>
            <button
              type="button"
              onClick={() => setDateFilter('this_week')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap ${
                dateFilter === 'this_week' ? 'bg-zinc-800 text-white border border-zinc-700' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Bu Hafta
            </button>
            <button
              type="button"
              onClick={() => setDateFilter('this_month')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap ${
                dateFilter === 'this_month' ? 'bg-zinc-800 text-white border border-zinc-700' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Bu Ay
            </button>
            <button
              type="button"
              onClick={() => setDateFilter('next_month')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap ${
                dateFilter === 'next_month' ? 'bg-zinc-800 text-white border border-zinc-700' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Gelecek Ay
            </button>
            <button
              type="button"
              onClick={() => setDateFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap ${
                dateFilter === 'all' ? 'bg-zinc-800 text-white border border-zinc-700' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Tümü
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1 & 2: AGENDA (UPCOMING) OR PAST (COMPLETED/HISTORY) JOB CARDS */}
      {(activeView === 'agenda' || activeView === 'past') && (
        <div className="space-y-8">
          {loading ? (
            <div className="p-12 text-center text-zinc-500 font-medium">İş takvimi yükleniyor...</div>
          ) : Object.keys(jobsByDate).length === 0 ? (
            <div className="p-12 bg-[#0b0e14] rounded-2xl border border-zinc-800 text-center space-y-3">
              <CalendarIcon className="w-10 h-10 text-zinc-600 mx-auto" />
              <h3 className="text-base font-bold text-white">
                {activeView === 'past' 
                  ? 'Henüz geçmiş tarihli randevu bulunmuyor' 
                  : 'Seçilen aralıkta planlanmış randevu bulunmuyor'}
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                {activeView === 'past'
                  ? 'Bugünün tarihi geçtikten sonra tamamlanan veya yapılan randevular otomatik olarak bu geçmiş sayfasına aktarılır.'
                  : 'Gelen tekliflerden veya sağ üstteki "+ Yeni Randevu / İş Planla" butonuna tıklayarak yeni iş ekleyebilirsiniz.'}
              </p>
              {activeView !== 'past' && (
                <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenAddModal()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 cursor-pointer shadow-md shadow-blue-600/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>İlk İşi Planla</span>
                  </button>
                  {quotes.filter(q => q.status === 'new' || !q.status).length > 0 && onNavigateTab && (
                    <button
                      type="button"
                      onClick={() => onNavigateTab('leads')}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 hover:text-white text-xs font-bold cursor-pointer transition-all"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Bekleyen Talepleri Gör ({quotes.filter(q => q.status === 'new' || !q.status).length}) &rarr;</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            Object.entries(jobsByDate).map(([dateStr, jobs], groupIdx) => {
              const dateObj = new Date(dateStr);
              const isToday = dateStr === todayIso;
              const isPastDate = dateStr < todayIso;
              const formattedDate = dateObj.toLocaleDateString('tr-TR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              });

              return (
                <div key={dateStr} className="space-y-4 print:space-y-2">
                  
                  {/* FARKLI TARİHLER ARASINDAKİ BELİRGİN AYIRICI ÇİZGİ */}
                  {groupIdx > 0 && (
                    <div className="relative py-2 print:hidden">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t-2 border-zinc-800" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-[#07090e] px-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                          &bull; Farklı Tarih &bull;
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Belirgin Tarih Banner Kartı (Göz Yormayan Net Ayrım) */}
                  <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg transition-all ${
                    isToday 
                      ? 'bg-amber-950/30 border-amber-500/80 shadow-amber-950/20' 
                      : isPastDate
                      ? 'bg-[#0e1118] border-zinc-700/80'
                      : 'bg-[#0d121f] border-blue-900/60 shadow-blue-950/20'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                        isToday 
                          ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30' 
                          : isPastDate
                          ? 'bg-zinc-800 text-zinc-300'
                          : 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      }`}>
                        <CalendarDays className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-extrabold text-white tracking-tight">
                            {formattedDate}
                          </h3>
                          {isToday && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-black shadow-xs">
                              BUGÜN
                            </span>
                          )}
                          {isPastDate && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-zinc-800 text-zinc-400 border border-zinc-700">
                              GEÇMİŞ TARİH
                            </span>
                          )}
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-zinc-900/90 text-zinc-400 border border-zinc-800">
                            {jobs.length} randevu
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 font-medium">
                          {isToday 
                            ? 'Bugün gidilecek randevular ve saatleri' 
                            : isPastDate 
                            ? 'Geçmişte tamamlanmış / kaydedilmiş usta işleri' 
                            : 'Planlanmış müşteri randevusu ve usta işi'}
                        </p>
                      </div>
                    </div>

                    {!isPastDate && (
                      <button
                        type="button"
                        onClick={() => handleOpenAddModal(dateStr, '14:00')}
                        className="print:hidden inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold border border-zinc-700 transition-colors cursor-pointer shadow-xs shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5 text-blue-400" />
                        <span>Bu Güne İş Ekle</span>
                      </button>
                    )}
                  </div>

                  {/* Jobs List for this day */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {jobs.map(job => {
                      const isPassed = isJobTimePassed(job);
                      const linkedFinance = getLinkedFinanceForJob(job);
                      const cleanPhone = getCleanPhone(job.customerPhone);
                      const whatsappText = encodeURIComponent(`Merhaba ${job.customerName || ''}, ben Handyeco'dan Ekrem. ${job.date} tarihindeki saat ${job.startTime} randevumuz için yazıyorum.`);
                      const whatsappLink = `https://wa.me/${cleanPhone}?text=${whatsappText}`;
                      const mapsQuery = encodeURIComponent(`${job.address || job.postcode}, Edinburgh, UK`);
                      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

                      return (
                        <div 
                          key={job.id}
                          className={`rounded-2xl p-3 sm:p-4 space-y-2.5 sm:space-y-3 transition-all relative group print:bg-white print:border-black print:text-black print:p-2 ${
                            isPassed
                              ? 'bg-[#080a0f]/90 border border-zinc-800/60 opacity-85 hover:opacity-100'
                              : 'bg-[#0b0e14] border border-zinc-800/90 hover:border-zinc-700 shadow-md'
                          }`}
                        >
                          {/* Card Header: Time & Status */}
                          <div className="flex items-start justify-between gap-1.5 sm:gap-2 pb-2 border-b border-zinc-800/70 print:border-gray-300">
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                              <span className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-black border print:bg-gray-100 print:text-black ${
                                isPassed 
                                  ? 'bg-zinc-800/60 text-zinc-400 border-zinc-700/50' 
                                  : 'bg-rose-950/60 text-rose-300 border-rose-800/70'
                              }`}>
                                <Clock className={`w-3 h-3 ${isPassed ? 'text-zinc-400' : 'text-rose-400'}`} />
                                <span>{job.startTime} - {job.endTime}</span>
                              </span>

                              {job.durationMinutes && (
                                <span className="text-[10px] text-zinc-500 print:text-gray-600 font-semibold">
                                  ({job.durationMinutes} dk)
                                </span>
                              )}

                              {isPassed && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-zinc-800/90 text-zinc-400 border border-zinc-700/60">
                                  ⏱️ Saati Geçti
                                </span>
                              )}
                            </div>

                            {/* Status Selector */}
                            <select
                              value={job.status || 'scheduled'}
                              onChange={(e) => handleQuickStatusChange(job.id, e.target.value)}
                              className={`text-[10px] sm:text-[11px] font-bold rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1 border cursor-pointer focus:outline-none shrink-0 print:hidden ${
                                job.status === 'completed'
                                  ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                                  : job.status === 'in_progress'
                                  ? 'bg-amber-950/80 border-amber-800 text-amber-300'
                                  : job.status === 'rescheduled'
                                  ? 'bg-purple-950/80 border-purple-800 text-purple-300'
                                  : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                              }`}
                            >
                              <option value="scheduled">🔵 Planlandı</option>
                              <option value="in_progress">🟡 Yolda / Başlandı</option>
                              <option value="completed">🟢 Tamamlandı</option>
                              <option value="rescheduled">🟣 Ertelendi</option>
                              <option value="cancelled">⚪ İptal</option>
                            </select>
                          </div>

                          {/* Customer & Service Info */}
                          <div className="space-y-0.5 sm:space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm sm:text-base font-bold text-white print:text-black">
                                {job.customerName || 'İsimsiz Müşteri'}
                              </h4>
                              {job.priceEstimate && (
                                <span className="text-xs sm:text-sm font-black text-emerald-400 print:text-black">
                                  £{job.priceEstimate}
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] sm:text-xs font-semibold text-blue-400 print:text-black">
                              🛠️ {job.service || 'Genel Usta İşi'}
                            </p>
                          </div>

                          {/* Address & Navigation */}
                          <div className="bg-zinc-900/80 print:bg-gray-50 rounded-xl p-2 sm:p-2.5 space-y-1 text-xs border border-zinc-800/80 print:border-gray-200">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-1.5 text-zinc-300 print:text-black">
                                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-semibold block text-xs">{job.address || 'Adres belirtilmedi'}</span>
                                  <span className="text-[10px] sm:text-[11px] text-zinc-400 print:text-gray-600 font-bold">{job.postcode}</span>
                                </div>
                              </div>

                              <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="print:hidden inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-[10px] sm:text-[11px] font-bold text-zinc-200 hover:text-white shrink-0 transition-colors"
                                title="Google Haritalar'da yol tarifi aç"
                              >
                                <Navigation className="w-3 h-3 text-blue-400" />
                                <span>Harita</span>
                              </a>
                            </div>

                            {job.notes && (
                              <p className="pt-1 text-[10px] sm:text-[11px] text-zinc-400 print:text-gray-700 italic border-t border-zinc-800 print:border-gray-200">
                                📝 {job.notes}
                              </p>
                            )}
                          </div>

                          {/* Contact and Actions Row */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-zinc-800/60">
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                              {job.customerPhone && (
                                <>
                                  <a
                                    href={`tel:${job.customerPhone}`}
                                    className="print:hidden inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[11px] sm:text-xs font-bold text-zinc-300 border border-zinc-800 transition-colors"
                                  >
                                    <Phone className="w-3 h-3 text-blue-400" />
                                    <span>{job.customerPhone}</span>
                                  </a>

                                  <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="print:hidden inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-[11px] sm:text-xs font-bold text-emerald-300 border border-emerald-800/60 transition-colors"
                                    title="WhatsApp'tan müşteriye yaz"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                    <span>WhatsApp</span>
                                  </a>
                                </>
                              )}
                            </div>

                            <div className="print:hidden flex items-center justify-between sm:justify-end gap-1.5 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-zinc-800/40">
                              {/* Accounting Link Status & Action */}
                              {(() => {
                                if (linkedFinance) {
                                  return (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (onNavigateTab) {
                                          onNavigateTab('accounting');
                                        } else {
                                          alert(`⚠️ Bu iş zaten muhasebeye eklenmiştir!\n\nMüşteri: ${job.customerName}\nTarih: ${linkedFinance.date}\nAlınan Ciro: £${linkedFinance.revenue}\nNet Kâr: £${linkedFinance.netProfit}\n\nTekrar kayıt yapılamaz.`);
                                        }
                                      }}
                                      className="p-1.5 px-2 rounded-xl bg-emerald-950/70 border border-emerald-800 hover:border-emerald-600 text-emerald-300 text-[10px] sm:text-[11px] font-bold flex items-center gap-1 cursor-pointer hover:bg-emerald-900 transition-colors shrink-0"
                                      title="Muhasebe sayfasına git"
                                    >
                                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                      <span className="hidden sm:inline">Muhasebeye Eklendi (£{linkedFinance.revenue}) &rarr;</span>
                                      <span className="sm:hidden">Eklendi (£{linkedFinance.revenue}) &rarr;</span>
                                    </button>
                                  );
                                } else {
                                  return (
                                    <div className="flex items-center gap-1.5">
                                      <span 
                                        className="p-1 px-1.5 sm:px-2 rounded-lg bg-amber-950/40 border border-amber-800/70 text-amber-300 text-[10px] font-bold flex items-center gap-1 shrink-0 whitespace-nowrap"
                                        title="Bu randevu henüz muhasebeye kâr/gelir olarak işlenmedi"
                                      >
                                        <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                                        <span className="hidden sm:inline">Muhasebeye Eklenmedi</span>
                                        <span className="sm:hidden">Muhasebesiz</span>
                                      </span>
                                      {onLogJobToAccounting && (
                                        isPassed ? (
                                          /* Saati geçen randevular için öne çıkarılmış, dikkat çekici buton */
                                          <button
                                            type="button"
                                            onClick={() => onLogJobToAccounting({
                                              id: job.leadId || `manual-${job.id}`,
                                              name: job.customerName,
                                              phone: job.customerPhone,
                                              postcode: job.postcode,
                                              service: job.service,
                                              priceEstimate: job.priceEstimate,
                                              details: job.notes
                                            })}
                                            className="py-1 px-2.5 sm:px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 active:scale-95 text-white text-[11px] sm:text-xs font-black flex items-center gap-1 border border-emerald-300 shadow-md shadow-emerald-950/60 cursor-pointer shrink-0 transition-all ring-2 ring-emerald-500/40"
                                            title="⚠️ Bu işin saati tamamlandı! Şimdi kazancı doğrudan muhasebeye işle"
                                          >
                                            <PoundSterling className="w-3.5 h-3.5 text-white shrink-0" />
                                            <span>Muhasebeye İşle</span>
                                          </button>
                                        ) : (
                                          /* Henüz saati gelmemiş randevular için standart buton */
                                          <button
                                            type="button"
                                            onClick={() => onLogJobToAccounting({
                                              id: job.leadId || `manual-${job.id}`,
                                              name: job.customerName,
                                              phone: job.customerPhone,
                                              postcode: job.postcode,
                                              service: job.service,
                                              priceEstimate: job.priceEstimate,
                                              details: job.notes
                                            })}
                                            className="p-1 px-2 sm:px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-emerald-400 hover:text-emerald-300 text-[10px] sm:text-[11px] font-bold flex items-center gap-1 border border-zinc-700 hover:border-emerald-700 cursor-pointer shrink-0 transition-colors"
                                            title="Bu işi Muhasebeye Kâr/Gelir olarak işle"
                                          >
                                            <PoundSterling className="w-3 h-3 shrink-0" />
                                            <span>Muhasebeye İşle</span>
                                          </button>
                                        )
                                      )}
                                    </div>
                                  );
                                }
                              })()}

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleEditJob(job)}
                                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                                  title="Düzenle"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteJob(job.id)}
                                  className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 transition-colors cursor-pointer"
                                  title="Sil"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW 2: WEEKLY FREE SLOTS & TIMETABLE ("Bu Hafta Hangi Saatlerim Boş?") */}
      {activeView === 'free_slots' && (
        <div className="space-y-4">
          <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Haftalık Boş Saatler (08:00 - 18:00)</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Yeşil kutular randevu alabileceğiniz <strong>boş saat aralıklarını</strong>, kırmızı kutular ise randevulu <strong>dolu saatleri</strong> gösterir. Boş kutuya tıklayarak o saate anında randevu oluşturabilirsiniz.
                </p>
              </div>

              <span className="text-xs font-bold text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
                Hafta: {weekStartIso} &bull; {weekEndIso}
              </span>
            </div>

            {/* Daily Column Grid for Mon - Sat */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              {weekDays.slice(0, 6).map((dayObj) => {
                const dayIso = dayObj.toISOString().split('T')[0];
                const dayName = dayObj.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'short' });
                const isToday = dayIso === todayIso;
                const slots = calculateFreeSlotsForDay(dayIso);

                return (
                  <div 
                    key={dayIso}
                    className={`rounded-2xl border p-4 space-y-3 ${
                      isToday 
                        ? 'bg-zinc-900/90 border-amber-500/60 shadow-md shadow-amber-500/5' 
                        : 'bg-zinc-950/60 border-zinc-800'
                    }`}
                  >
                    {/* Day Card Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                      <div>
                        <span className={`text-xs font-black block ${isToday ? 'text-amber-400' : 'text-white'}`}>
                          {dayName} {isToday && '(BUGÜN)'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenAddModal(dayIso, '10:00')}
                        className="text-[11px] font-bold text-blue-400 hover:text-blue-300 cursor-pointer"
                      >
                        + Ekle
                      </button>
                    </div>

                    {/* Slots for this day */}
                    <div className="space-y-2">
                      {slots.map((slot, sIdx) => {
                        if (slot.type === 'free') {
                          return (
                            <div 
                              key={sIdx}
                              onClick={() => handleOpenAddModal(dayIso, slot.start)}
                              className="group p-2.5 rounded-xl bg-emerald-950/30 hover:bg-emerald-950/60 border border-dashed border-emerald-700/60 hover:border-emerald-500 flex items-center justify-between cursor-pointer transition-all"
                            >
                              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span>{slot.start} - {slot.end} Boş Saat</span>
                              </div>
                              <span className="text-[10px] text-emerald-500 font-semibold group-hover:text-emerald-300">
                                + Randevu Oluştur
                              </span>
                            </div>
                          );
                        } else {
                          const job = slot.job;
                          return (
                            <div 
                              key={sIdx}
                              onClick={() => handleEditJob(job)}
                              className="p-2.5 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/60 hover:border-rose-700 space-y-1 cursor-pointer transition-all shadow-sm group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-rose-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-rose-400" />
                                  <span>{job.startTime} - {job.endTime}</span>
                                </span>
                                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                  Dolu Saat
                                </span>
                              </div>
                              <p className="text-xs font-bold text-white truncate group-hover:text-rose-200 transition-colors">
                                {job.customerName}
                              </p>
                              <p className="text-[11px] text-zinc-400 truncate">
                                {job.service} &bull; {job.postcode}
                              </p>
                            </div>
                          );
                        }
                      })}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SCHEDULE JOB */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl sm:rounded-3xl max-w-xl w-full flex flex-col max-h-[90vh] shadow-2xl relative my-auto">
            
            {/* Modal Header (Fixed) */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center shrink-0">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingId ? 'Randevuyu / İşi Düzenle' : 'Yeni Randevu Planla'}
                  </h3>
                  <p className="text-xs text-zinc-400">Tarih, saat ve adres bilgileri</p>
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

            {/* Form with scrollable body & pinned footer */}
            <form onSubmit={handleSaveForm} className="flex flex-col flex-1 overflow-hidden min-h-0">
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
                {/* Quick Autofill from Leads Dropdown */}
                {!editingId && quotes.length > 0 && (
                  <div className="p-3 bg-zinc-900/80 rounded-2xl border border-zinc-800 space-y-1.5">
                    <label className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                      ⚡ Gelen Tekliflerden Hızlı Doldur (Live Leads)
                    </label>
                    <select
                      onChange={handleSelectLeadToAutofill}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="">Bir teklif seçin (Müşteri bilgileri otomatik dolar)...</option>
                      {quotes.map(q => (
                        <option key={q.id} value={q.id}>
                          {q.name} ({q.postcode}) - {q.service} - {new Date(q.createdAt || Date.now()).toLocaleDateString('tr-TR')}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Date & Time Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Başlangıç Saati *</label>
                    <input
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={e => handleStartTimeChange(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Tahmini Süre</label>
                    <select
                      value={formData.durationMinutes}
                      onChange={e => handleDurationChange(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:border-blue-500 outline-none cursor-pointer"
                    >
                      <option value="60">1 Saat</option>
                      <option value="90">1.5 Saat</option>
                      <option value="120">2 Saat</option>
                      <option value="150">2.5 Saat</option>
                      <option value="180">3 Saat</option>
                      <option value="240">4 Saat (Yarım Gün)</option>
                      <option value="480">8 Saat (Tam Gün)</option>
                    </select>
                  </div>
                </div>

                {/* Customer Name & Phone */}
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

                {/* Address & Postcode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Açık Adres / Sokak</label>
                    <input
                      type="text"
                      placeholder="Örn: 14 St Stephen Street, Stockbridge"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Posta Kodu *</label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: EH3 9DJ"
                      value={formData.postcode}
                      onChange={e => setFormData({ ...formData, postcode: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Service & Price Estimate */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Hizmet / Yapılacak İş *</label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: TV Duvar Montajı & Avize Takma"
                      value={formData.service}
                      onChange={e => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Fiyat Teklifi (£)</label>
                    <input
                      type="number"
                      placeholder="Örn: 120"
                      value={formData.priceEstimate}
                      onChange={e => setFormData({ ...formData, priceEstimate: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:border-blue-500 outline-none font-bold"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">İş Notları (Özel gereksinimler, duvar tipi vb.)</label>
                  <textarea
                    rows={2}
                    placeholder="Örn: Taş duvar, Fischer uzun dübel gerekecek. Zile 2 kez basın."
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Randevu Durumu</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:border-blue-500 outline-none cursor-pointer"
                  >
                    <option value="scheduled">🔵 Planlandı (Takvime Eklendi)</option>
                    <option value="in_progress">🟡 Yolda / İş Başlandı</option>
                    <option value="completed">🟢 Tamamlandı</option>
                    <option value="rescheduled">🟣 Ertelendi</option>
                    <option value="cancelled">⚪ İptal</option>
                  </select>
                </div>

                {/* Submit Buttons (Form Akışı İçinde, Mobilde Tek Satırda 2 Eşit Sütun - Yazı Alanlarını Asla Kapatmaz) */}
                <div className="pt-3 pb-2 border-t border-zinc-800 grid grid-cols-2 gap-2.5 sm:flex sm:items-center sm:justify-end sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 cursor-pointer transition-colors text-center"
                  >
                    Vazgeç
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-md shadow-blue-600/25 cursor-pointer disabled:opacity-50 transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    {saving ? 'Kaydediliyor...' : editingId ? 'Değişiklikleri Güncelle' : 'Randevuyu Kaydet'}
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
