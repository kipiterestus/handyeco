import React, { useState } from 'react';
import { Save, CheckCircle, Phone, MessageSquare, Mail, Clock, PoundSterling, MapPin, ExternalLink } from 'lucide-react';

export default function BusinessEditor({ data, onSave, token }) {
  const [form, setForm] = useState(data || {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave('siteConfig', form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Business Information & Call-Out Rates</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage contact details, Edinburgh call-out fee, response time, and verification URLs.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
        >
          {saved ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : saved ? 'Saved Successfully!' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Contact info card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-400" />
            <span>Contact & Communication</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Business Name</label>
              <input
                type="text"
                value={form.businessName || ''}
                onChange={e => handleChange('businessName', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Craftsman Name</label>
              <input
                type="text"
                value={form.craftsmanName || ''}
                onChange={e => handleChange('craftsmanName', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Phone (Direct / Dial)</label>
                <input
                  type="text"
                  value={form.phone || ''}
                  onChange={e => handleChange('phone', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Display Phone</label>
                <input
                  type="text"
                  value={form.displayPhone || ''}
                  onChange={e => handleChange('displayPhone', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">WhatsApp Number (e.g. 447760696723)</label>
                <input
                  type="text"
                  value={form.whatsappNumber || ''}
                  onChange={e => {
                    const num = e.target.value.replace(/[^0-9]/g, '');
                    handleChange('whatsappNumber', num);
                    handleChange('whatsappUrl', `https://wa.me/${num}?text=Hello%20Handyeco%2C%20I%20would%20like%20a%20free%20quote%20for%20handyman%20services%20in%20Edinburgh.`);
                  }}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={form.email || ''}
                  onChange={e => handleChange('email', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Operations Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <PoundSterling className="w-4 h-4 text-emerald-400" />
            <span>Call-Out Fee & Response Times</span>
          </h3>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Minimum Call-Out (£)</label>
                <input
                  type="number"
                  value={form.callOutFee || 65}
                  onChange={e => {
                    const fee = Number(e.target.value);
                    handleChange('callOutFee', fee);
                    handleChange('callOutText', `Minimum call-out fee £${fee} (Edinburgh Area)`);
                  }}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Avg Response (Navbar)</label>
                <input
                  type="text"
                  value={form.responseTime || '15–30 mins'}
                  onChange={e => handleChange('responseTime', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Call-Out Full Display Text</label>
              <input
                type="text"
                value={form.callOutText || ''}
                onChange={e => handleChange('callOutText', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Working Hours</label>
              <input
                type="text"
                value={form.workingHours || 'Mon - Sat: 8:00 AM - 6:00 PM'}
                onChange={e => handleChange('workingHours', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Coverage Area Display</label>
              <input
                type="text"
                value={form.areaCoverage || 'Edinburgh & Lothians'}
                onChange={e => handleChange('areaCoverage', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Verification Profile Links Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 md:col-span-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-blue-400" />
            <span>Profile & Reviews Verification Links</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Google Maps Profile URL</label>
              <input
                type="url"
                value={form.googleProfileUrl || ''}
                onChange={e => handleChange('googleProfileUrl', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">MyBuilder Profile URL</label>
              <input
                type="url"
                value={form.myBuilderUrl || ''}
                onChange={e => handleChange('myBuilderUrl', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

      </div>
    </form>
  );
}
