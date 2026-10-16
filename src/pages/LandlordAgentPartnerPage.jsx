import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Key, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Phone, 
  Mail, 
  FileText, 
  Lock, 
  Plus, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  LogOut, 
  AlertCircle,
  MapPin,
  User,
  Sparkles,
  Receipt
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';
import { usePageSeo } from '../hooks/usePageSeo';
import { BUSINESS_INFO } from '../data/businessData';
import { useContent } from '../context/ContentContext';

const TRADE_TYPES = [
  { id: 'letting_agent', label: 'Letting & Rental Agency' },
  { id: 'property_investor', label: 'Property Management / Portfolio Landlord' },
  { id: 'main_contractor', label: 'Main Contractor / Builder (Subcontractor)' },
  { id: 'landlord', label: 'Private Landlord (Multiple Properties)' },
  { id: 'other', label: 'Commercial Business / Other' }
];

const STATUS_BADGES = {
  new: { label: 'Received / In Review', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  quote_sent: { label: 'Quote Sent', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  approved: { label: 'Approved', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  scheduled: { label: 'Scheduled', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  in_progress: { label: 'In Progress', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  completed: { label: 'Completed', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  cancelled: { label: 'Cancelled', bg: 'bg-zinc-800 text-zinc-500 border-zinc-700' }
};

export default function LandlordAgentPartnerPage() {
  const { content } = useContent();
  const siteConfig = content.siteConfig || BUSINESS_INFO;

  // Active top view: 'info' | 'register' | 'login'
  const [activeTab, setActiveTab] = useState('register');

  // Registration Form State
  const [regForm, setRegForm] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    tradeType: 'letting_agent',
    jobVolumeEstimate: '5-10 jobs/month',
    password: '',
    notes: ''
  });
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState('');

  // Login & Portal State
  const [partnerToken, setPartnerToken] = useState(() => localStorage.getItem('handyeco_b2b_token') || '');
  const [currentPartner, setCurrentPartner] = useState(null);
  const [partnerJobs, setPartnerJobs] = useState([]);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginPendingNotice, setLoginPendingNotice] = useState(false);

  // New Job Modal for Portal
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobSubmitting, setJobSubmitting] = useState(false);
  const [newJobForm, setNewJobForm] = useState({
    propertyAddress: '',
    tenantName: '',
    tenantPhone: '',
    accessMethod: 'Office key collection or direct tenant appointment',
    jobTitle: '',
    jobDescription: '',
    urgency: 'this-week'
  });

  usePageSeo({
    title: 'Landlords & Letting Agents Trade Partnership Edinburgh | Handyeco',
    description: 'Trusted property maintenance partner for Edinburgh letting agencies and landlords. Rapid turnarounds, key collection, itemised trade invoicing & fully insured service.',
    canonical: 'https://handyeco.co.uk/landlords-agents'
  });

  // Load Partner Profile & Jobs if token exists
  const fetchPartnerProfileAndJobs = async (tokenToUse) => {
    try {
      const [meRes, jobsRes] = await Promise.all([
        fetch('/api/b2b/me', { headers: { Authorization: `Bearer ${tokenToUse}` } }),
        fetch('/api/b2b/portal/jobs', { headers: { Authorization: `Bearer ${tokenToUse}` } })
      ]);

      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.success && meData.partner) {
          setCurrentPartner(meData.partner);
        } else {
          handleLogout();
        }
      } else {
        handleLogout();
      }

      if (jobsRes.ok) {
        const jData = await jobsRes.json();
        if (jData.success) {
          setPartnerJobs(jData.jobs || []);
        }
      }
    } catch (err) {
      console.error('Error fetching partner portal data:', err);
    }
  };

  useEffect(() => {
    if (partnerToken) {
      fetchPartnerProfileAndJobs(partnerToken);
    }
  }, [partnerToken]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError('');
    try {
      const res = await fetch('/api/b2b/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRegSuccess(true);
      } else {
        setRegError(data.error || 'Registration failed. Please check your details.');
      }
    } catch (err) {
      setRegError('Network error: ' + err.message);
    } finally {
      setRegLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    setLoginPendingNotice(false);

    try {
      const res = await fetch('/api/b2b/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();

      if (res.status === 403 && data.pending) {
        setLoginPendingNotice(true);
        setLoginError(data.error);
        return;
      }

      if (res.ok && data.success && data.token) {
        localStorage.setItem('handyeco_b2b_token', data.token);
        setPartnerToken(data.token);
        setCurrentPartner(data.partner);
        fetchPartnerProfileAndJobs(data.token);
      } else {
        setLoginError(data.error || 'Invalid email or password.');
      }
    } catch (err) {
      setLoginError('Network connection error: ' + err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    if (partnerToken) {
      fetch('/api/b2b/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${partnerToken}` }
      }).catch(() => {});
    }
    localStorage.removeItem('handyeco_b2b_token');
    setPartnerToken('');
    setCurrentPartner(null);
    setPartnerJobs([]);
  };

  const handleCreateJobRequest = async (e) => {
    e.preventDefault();
    setJobSubmitting(true);
    try {
      const res = await fetch('/api/b2b/portal/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${partnerToken}`
        },
        body: JSON.stringify(newJobForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsJobModalOpen(false);
        setNewJobForm({
          propertyAddress: '',
          tenantName: '',
          tenantPhone: '',
          accessMethod: 'Office key collection or direct tenant appointment',
          jobTitle: '',
          jobDescription: '',
          urgency: 'this-week'
        });
        fetchPartnerProfileAndJobs(partnerToken);
      } else {
        alert(data.error || 'Failed to submit job request');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setJobSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-4 pt-6 pb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Edinburgh Landlords &amp; Letting Agents Partner Portal</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Reliable Property Maintenance for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">Letting Agencies &amp; Landlords</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Fast tenancy turnarounds, city-centre office key collection, itemised trade invoicing, and fully insured, vetted trade craftsmanship for your rental properties.
            </p>
          </div>

          {/* 4 Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14 text-left">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Office Key Collection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We pick up and return property keys directly from your office in George St, New Town, West End or Leith.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Tenancy Turnaround Speed</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fast response for mouldy silicone sealing, door planing, furniture repairs, and odd jobs between check-outs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Fully Insured &amp; Vetted</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                &pound;2,000,000 public liability insurance. Polite, uniformed, and respectful workmanship in occupied tenement flats.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Clear Trade Invoicing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Itemised invoicing with before &amp; after photo sign-off. Daily completion or Friday weekly settlement.
              </p>
            </div>
          </div>

          {/* If Partner is already logged in, show Dashboard directly */}
          {currentPartner ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 text-left shadow-2xl">
              {/* Portal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-lg">
                      {currentPartner.companyName.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">{currentPartner.companyName}</h2>
                      <p className="text-xs text-slate-400">
                        Contact: <span className="text-slate-200 font-bold">{currentPartner.contactPerson}</span> ({currentPartner.phone})
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider ${
                    currentPartner.paymentTerms === 'daily'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {currentPartner.paymentTerms === 'daily' ? '⚡ Daily Settlement' : '📅 Friday Weekly Settlement'}
                  </span>

                  <button
                    onClick={() => setIsJobModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Request New Job</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Portal Jobs Table / Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-white text-sm">Submitted Maintenance Requests</h3>
                  <span className="text-xs text-slate-400">{partnerJobs.length} total jobs</span>
                </div>

                {partnerJobs.length === 0 ? (
                  <div className="text-center py-12 bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 space-y-3">
                    <Briefcase className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-sm font-bold text-slate-400">No maintenance requests yet</p>
                    <p className="text-xs text-slate-500">Click below to submit your first tenant repair or turnaround job.</p>
                    <button
                      onClick={() => setIsJobModalOpen(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      + Request New Job
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {partnerJobs.map(job => {
                      const badge = STATUS_BADGES[job.status] || STATUS_BADGES.new;
                      return (
                        <div 
                          key={job.id} 
                          className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-bold text-white text-base">{job.jobTitle}</span>
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${badge.bg}`}>
                                {badge.label}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                                job.paymentStatus === 'paid'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}>
                                {job.paymentStatus === 'paid' ? 'Paid ✓' : 'Settlement Pending'}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                            <div className="flex items-center gap-1.5 text-slate-200">
                              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              <span>{job.propertyAddress}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-200">
                              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>Tenant: {job.tenantName} {job.tenantPhone && `(${job.tenantPhone})`}</span>
                            </div>
                            {job.accessMethod && (
                              <div className="col-span-full text-slate-400 text-[11px]">
                                🔑 Key / Access: {job.accessMethod}
                              </div>
                            )}
                            {job.jobDescription && (
                              <div className="col-span-full p-2.5 rounded-xl bg-slate-900 text-slate-300 text-xs">
                                {job.jobDescription}
                              </div>
                            )}
                          </div>

                          <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs text-slate-500">
                            <span>Requested: {new Date(job.createdAt).toLocaleDateString('en-GB')}</span>
                            {job.scheduledDate && (
                              <span className="text-amber-400 font-bold">
                                Scheduled: {job.scheduledDate} {job.scheduledTime && `at ${job.scheduledTime}`}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* If Not Logged In: Dual Tab Container (Registration vs Partner Login) */
            <div className="max-w-2xl mx-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
              {/* Tab Selector */}
              <div className="grid grid-cols-2 p-1.5 bg-slate-950/80 border-b border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setRegError(''); }}
                  className={`py-3 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Apply for Trade Account
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setLoginError(''); setLoginPendingNotice(false); }}
                  className={`py-3 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Partner Portal Login
                </button>
              </div>

              {/* TAB 1: REGISTRATION FORM */}
              {activeTab === 'register' && (
                <div className="p-6 sm:p-8 text-left space-y-6">
                  {regSuccess ? (
                    <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center space-y-4 animate-in zoom-in-95">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-black text-white">Application Received!</h3>
                      <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                        Thank you for applying. To protect our high craftsmanship and safety standards, Ekrem personally reviews and verifies each partner account before activation.
                      </p>
                      <p className="text-xs text-emerald-400 font-semibold">
                        We will contact you via WhatsApp or phone to verify your details and activate your portal access.
                      </p>

                      <div className="pt-2">
                        <a
                          href={siteConfig.whatsappUrl || BUSINESS_INFO.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Chat Directly with Ekrem on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs leading-relaxed">
                        <span className="font-bold text-white">⚠️ Trade Account Verification:</span> All letting agency and landlord trade applications undergo personal telephone or WhatsApp verification by Ekrem before activation to ensure priority turnaround capacity and scheduling.
                      </div>

                      {regError && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                          {regError}
                        </div>
                      )}

                      <div>
                        <label className="font-bold text-slate-300 block mb-1">Company / Trading Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Apex Property Management Ltd"
                          value={regForm.companyName}
                          onChange={(e) => setRegForm({ ...regForm, companyName: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">Primary Contact Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. David Ross"
                            value={regForm.contactPerson}
                            onChange={(e) => setRegForm({ ...regForm, contactPerson: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">Direct Phone / WhatsApp *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. +44 7700 900123"
                            value={regForm.phone}
                            onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">Business Email Address *</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. maintenance@apexproperty.co.uk"
                            value={regForm.email}
                            onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">Create Account Password *</label>
                          <input
                            type="password"
                            required
                            minLength={6}
                            placeholder="At least 6 characters"
                            value={regForm.password}
                            onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">Business Category *</label>
                          <select
                            value={regForm.tradeType}
                            onChange={(e) => setRegForm({ ...regForm, tradeType: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-xs"
                          >
                            {TRADE_TYPES.map(t => (
                              <option key={t.id} value={t.id}>{t.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">Estimated Monthly Jobs</label>
                          <select
                            value={regForm.jobVolumeEstimate}
                            onChange={(e) => setRegForm({ ...regForm, jobVolumeEstimate: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-xs"
                          >
                            <option value="1-5 jobs/month">1 - 5 jobs / month</option>
                            <option value="5-10 jobs/month">5 - 10 jobs / month</option>
                            <option value="10-25 jobs/month">10 - 25 jobs / month</option>
                            <option value="25+ jobs/month">25+ high volume jobs</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-slate-300 block mb-1">Additional Notes / Key Offices</label>
                        <textarea
                          rows={2}
                          placeholder="e.g. We have flats across New Town & Stockbridge. Key box codes or George St office collection."
                          value={regForm.notes}
                          onChange={(e) => setRegForm({ ...regForm, notes: e.target.value })}
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={regLoading}
                          className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-extrabold text-xs shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
                        >
                          {regLoading ? 'Submitting Application...' : 'Submit Partner Trade Application'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: PARTNER LOGIN FORM */}
              {activeTab === 'login' && (
                <div className="p-6 sm:p-8 text-left space-y-5">
                  <div>
                    <h3 className="text-base font-extrabold text-white">Partner Portal Access</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Log in to submit maintenance jobs, check job statuses, and review trade statements.
                    </p>
                  </div>

                  {loginPendingNotice ? (
                    <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs space-y-2">
                      <div className="flex items-center gap-2 font-bold text-amber-400">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Account Pending Verification</span>
                      </div>
                      <p className="leading-relaxed">
                        Your account application is currently under review. To ensure high standards of work, Ekrem speaks with every partner before activating portal credentials.
                      </p>
                      <p className="pt-1">
                        Need urgent turnaround today? Call or WhatsApp Ekrem directly on{' '}
                        <a href={`tel:${siteConfig.phone || BUSINESS_INFO.phone}`} className="font-bold underline text-white">
                          {siteConfig.displayPhone || BUSINESS_INFO.displayPhone}
                        </a>.
                      </p>
                    </div>
                  ) : loginError ? (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                      {loginError}
                    </div>
                  ) : null}

                  <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Account Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. name@agency.co.uk"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loginLoading}
                        className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-extrabold text-xs shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
                      >
                        {loginLoading ? 'Authenticating...' : 'Sign In to Partner Portal'}
                      </button>
                    </div>

                    <div className="text-center pt-2">
                      <span className="text-slate-500 text-[11px]">
                        Don't have an approved trade account yet?{' '}
                        <button
                          type="button"
                          onClick={() => { setActiveTab('register'); setLoginError(''); }}
                          className="text-blue-400 font-bold hover:underline"
                        >
                          Apply here
                        </button>
                      </span>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* MODAL: SUBMIT NEW JOB (FOR LOGGED IN PARTNERS) */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 text-left shadow-2xl animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-base">Request Maintenance / Repair Job</h3>
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJobRequest} className="space-y-3.5">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Property Address &amp; Flat No *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 14 Rose Street, Flat 2F1, Edinburgh EH2 2PR"
                  value={newJobForm.propertyAddress}
                  onChange={(e) => setNewJobForm({ ...newJobForm, propertyAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Tenant Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah MacLeod"
                    value={newJobForm.tenantName}
                    onChange={(e) => setNewJobForm({ ...newJobForm, tenantName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Tenant Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. 07700 900123"
                    value={newJobForm.tenantPhone}
                    onChange={(e) => setNewJobForm({ ...newJobForm, tenantPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Key Collection / Access Method *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pick up keys from George St office, or tenant direct contact"
                  value={newJobForm.accessMethod}
                  onChange={(e) => setNewJobForm({ ...newJobForm, accessMethod: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Job Headline / Work Required *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bathroom silicone reseal & fix 2 kitchen cupboard doors"
                  value={newJobForm.jobTitle}
                  onChange={(e) => setNewJobForm({ ...newJobForm, jobTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Detailed Description / Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Specific instructions, measurements, or materials..."
                  value={newJobForm.jobDescription}
                  onChange={(e) => setNewJobForm({ ...newJobForm, jobDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Urgency</label>
                <select
                  value={newJobForm.urgency}
                  onChange={(e) => setNewJobForm({ ...newJobForm, urgency: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="this-week">This Week</option>
                  <option value="urgent">Urgent (Today / Tomorrow)</option>
                  <option value="flexible">Flexible Timing</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={jobSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/25 cursor-pointer"
                >
                  {jobSubmitting ? 'Submitting...' : 'Dispatch Job Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
      <MobileStickyBar />
    </div>
  );
}
