import React, { useState, useEffect } from 'react';
import { 
  Inbox, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Search, 
  Filter,
  ExternalLink,
  Save,
  AlertCircle
} from 'lucide-react';

export default function LeadsManager({ token }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [savingId, setSavingId] = useState(null);

  const fetchQuotes = async () => {
    try {
      const res = await fetch('/api/quotes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setQuotes(data.quotes || []);
        }
      }
    } catch (err) {
      console.error('Error fetching quotes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
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
      q.details?.toLowerCase().includes(search.toLowerCase());
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

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner & Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div 
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'all' 
              ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <span className="text-xs font-bold uppercase opacity-80 block">All Leads</span>
          <span className="text-2xl sm:text-3xl font-black mt-1 block">{counts.all}</span>
        </div>

        <div 
          onClick={() => setStatusFilter('new')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'new' 
              ? 'bg-amber-600 text-white border-amber-600 shadow-md' 
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <span className="text-xs font-bold uppercase opacity-80 block">New / Pending</span>
          <span className="text-2xl sm:text-3xl font-black mt-1 block">{counts.new}</span>
        </div>

        <div 
          onClick={() => setStatusFilter('contacted')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'contacted' 
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <span className="text-xs font-bold uppercase opacity-80 block">Contacted</span>
          <span className="text-2xl sm:text-3xl font-black mt-1 block">{counts.contacted}</span>
        </div>

        <div 
          onClick={() => setStatusFilter('booked')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'booked' 
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <span className="text-xs font-bold uppercase opacity-80 block">Booked / Done</span>
          <span className="text-2xl sm:text-3xl font-black mt-1 block">{counts.booked}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by name, phone, EH postcode, or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchQuotes}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Leads List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading incoming inquiries...</div>
      ) : filteredQuotes.length === 0 ? (
        <div className="p-12 bg-slate-900/40 rounded-3xl border border-slate-800 text-center space-y-2">
          <Inbox className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No inquiries found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Quotes submitted via the website form or Telegram bot will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuotes.map((quote) => {
            const cleanPhone = getCleanPhone(quote.phone);
            const whatsappText = encodeURIComponent(`Hi ${quote.name || 'there'}, this is Ekrem from Handyeco Edinburgh. Thanks for requesting a quote for ${quote.service || 'handyman services'}!`);
            const whatsappLink = `https://wa.me/${cleanPhone}?text=${whatsappText}`;

            return (
              <div 
                key={quote.id}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md hover:border-slate-700 transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-lg font-bold text-white">{quote.name || 'Anonymous Client'}</h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-900/50 text-blue-300 border border-blue-700">
                        {quote.service || 'General Handyman'}
                      </span>
                      {quote.urgency && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-950 text-amber-300 border border-amber-800">
                          {quote.urgency}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        <span className="font-semibold text-slate-300">{quote.postcode || 'Edinburgh Area'}</span>
                      </span>
                      {quote.email && (
                        <>
                          <span>&bull;</span>
                          <a href={`mailto:${quote.email}`} className="text-blue-400 hover:underline">
                            {quote.email}
                          </a>
                        </>
                      )}
                      <span>&bull;</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{quote.createdAt ? new Date(quote.createdAt).toLocaleString('en-GB') : 'Recently'}</span>
                      </span>
                    </p>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-400">Status:</label>
                    <select
                      value={quote.status || 'new'}
                      onChange={(e) => updateStatus(quote.id, e.target.value)}
                      disabled={savingId === quote.id}
                      className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="new">🟡 New / Pending</option>
                      <option value="contacted">🔵 Contacted</option>
                      <option value="booked">🟢 Booked / Done</option>
                      <option value="archived">⚪ Archived</option>
                    </select>
                  </div>
                </div>

                {/* Job details */}
                <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 space-y-2 text-xs sm:text-sm text-slate-300">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Job Details / Description:</span>
                  <p className="whitespace-pre-line leading-relaxed text-slate-200">
                    {quote.details || 'No additional details provided.'}
                  </p>
                </div>

                {/* Notes & Actions row */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Add private note (e.g. Quoted £120, booked for Thursday 10am)..."
                      defaultValue={quote.notes || ''}
                      onBlur={(e) => updateNotes(quote.id, e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-slate-600"
                    />
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`tel:${quote.phone}`}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                      <span>Call {quote.phone}</span>
                    </a>

                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Reply</span>
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
