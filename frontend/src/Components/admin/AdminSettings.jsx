// src/components/admin/AdminSettings.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../common/constants';
import { getToken } from '../common/utils/auth';
import { RiSaveLine, RiStoreLine, RiBankCardLine, RiPaletteLine } from 'react-icons/ri';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    store_name: '',
    store_email: '',
    store_phone: '',
    store_address: '',
    enable_mpesa: 'true',
    mpesa_shortcode: '',
    mpesa_passkey: '',
    enable_cash_on_delivery: 'true',
    enable_card: 'false',
    theme: 'light'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API}/admin/settings`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setSettings(prev => ({ ...prev, ...res.data }));
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'true' : 'false') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API}/admin/settings`, settings, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      alert('Settings saved successfully');
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tighter text-black">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">Configure your store</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-zinc-100">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all ${
              activeTab === 'general'
                ? 'border-b-2 border-black text-black'
                : 'text-zinc-500 hover:text-black'
            }`}
          >
            <RiStoreLine size={16} /> General
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all ${
              activeTab === 'payment'
                ? 'border-b-2 border-black text-black'
                : 'text-zinc-500 hover:text-black'
            }`}
          >
            <RiBankCardLine size={16} /> Payment
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all ${
              activeTab === 'appearance'
                ? 'border-b-2 border-black text-black'
                : 'text-zinc-500 hover:text-black'
            }`}
          >
            <RiPaletteLine size={16} /> Appearance
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              <div>
                <label className="form-label">Store Name</label>
                <input
                  type="text"
                  name="store_name"
                  value={settings.store_name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">Store Email</label>
                <input
                  type="email"
                  name="store_email"
                  value={settings.store_email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">Store Phone</label>
                <input
                  type="text"
                  name="store_phone"
                  value={settings.store_phone}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Store Address</label>
                <textarea
                  name="store_address"
                  rows="2"
                  value={settings.store_address}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          )}

          {/* Payment Tab */}
          {activeTab === 'payment' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <label className="form-label mb-0">Enable M-Pesa</label>
                <input
                  type="checkbox"
                  name="enable_mpesa"
                  checked={settings.enable_mpesa === 'true'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
              </div>
              {settings.enable_mpesa === 'true' && (
                <>
                  <div>
                    <label className="form-label">M-Pesa Shortcode</label>
                    <input
                      type="text"
                      name="mpesa_shortcode"
                      value={settings.mpesa_shortcode}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g., 174379"
                    />
                  </div>
                  <div>
                    <label className="form-label">M-Pesa Passkey</label>
                    <input
                      type="text"
                      name="mpesa_passkey"
                      value={settings.mpesa_passkey}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Consumer key or passkey"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-between pt-3">
                <label className="form-label mb-0">Enable Cash on Delivery</label>
                <input
                  type="checkbox"
                  name="enable_cash_on_delivery"
                  checked={settings.enable_cash_on_delivery === 'true'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="form-label mb-0">Enable Credit/Debit Card</label>
                <input
                  type="checkbox"
                  name="enable_card"
                  checked={settings.enable_card === 'true'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-5">
              <div>
                <label className="form-label">Theme</label>
                <select
                  name="theme"
                  value={settings.theme}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark (coming soon)</option>
                </select>
                <p className="text-xs text-zinc-400 mt-1">Theme support will be extended to all pages in future updates.</p>
              </div>
              {/* Logo upload could be added here with file input and separate upload endpoint */}
            </div>
          )}

          <div className="flex justify-end pt-6 border-t border-zinc-100 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-black text-white font-bold px-6 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors"
            >
              <RiSaveLine size={16} />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;