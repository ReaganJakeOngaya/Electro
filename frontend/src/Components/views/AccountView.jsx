import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getUser, getToken, updateLocalUser, logout } from '../common/utils/auth';
import { API } from '../common/constants';
import {
  RiLogoutBoxLine, RiDeleteBinLine, RiEditLine, RiSaveLine,
  RiUserLine, RiUploadLine, RiCheckLine, RiCloseLine, RiAlertLine,
  RiShieldLine, RiMapPinLine, RiPhoneLine,
} from 'react-icons/ri';

/* ── Shared input class ──────────────────────────────────────── */
const inputCls = `w-full px-3.5 py-3 text-sm font-bold text-black
  border border-zinc-200 rounded-sm transition-all outline-none
  focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15
  placeholder:text-zinc-300 placeholder:font-normal`;

/* ── Section card ─────────────────────────────────────────────── */
const Card = ({ children, className = '' }) => (
  <div className={`bg-white border border-zinc-100 rounded-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2.5 px-5 py-4 border-b border-zinc-100">
    {Icon && <Icon className="text-orange-500" size={14} />}
    <h2 className="text-[10px] font-black uppercase tracking-[0.18em] text-black">{title}</h2>
  </div>
);

/* ── Read-only field row ──────────────────────────────────────── */
const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3
                  border-b border-zinc-50 last:border-0 gap-1">
    <span className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-400">{label}</span>
    <span className="text-sm font-bold text-black">{value || '—'}</span>
  </div>
);

/* ── Edit field ───────────────────────────────────────────────── */
const Field = ({ label, children }) => (
  <div>
    <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500 mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

/* ── Main ─────────────────────────────────────────────────────── */
const AccountView = ({ user, onLogout, onUserUpdate }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '', last_name: user?.last_name || '',
    phone: user?.phone || '', address: user?.address || '',
    city: user?.city || '', postal_code: user?.postal_code || '',
    country: user?.country || 'Kenya',
  });
  const [avatar, setAvatar]               = useState(user?.avatar || '');
  const [avatarFile, setAvatarFile]       = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar ? `${API}/uploads/${user.avatar}` : ''
  );

  useEffect(() => { fetchUserData(); }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${API}/user?user_id=${user.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const d = res.data;
      setFormData({
        first_name: d.first_name || '', last_name: d.last_name || '',
        phone: d.phone || '', address: d.address || '',
        city: d.city || '', postal_code: d.postal_code || '',
        country: d.country || 'Kenya',
      });
      setAvatar(d.avatar || '');
      setAvatarPreview(d.avatar ? `${API}/uploads/${d.avatar}` : '');
      updateLocalUser({ first_name: d.first_name, last_name: d.last_name, avatar: d.avatar });
      if (onUserUpdate) onUserUpdate();
    } catch (err) {
      console.error('Failed to fetch user data', err);
    }
  };

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) { setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return null;
    const fd = new FormData();
    fd.append('avatar', avatarFile);
    const res = await axios.post(`${API}/user/avatar`, fd, {
      headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'multipart/form-data' },
    });
    return res.data.avatar;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let newAvatar = avatar;
      if (avatarFile) newAvatar = await uploadAvatar();
      await axios.put(`${API}/user/profile`, { ...formData, avatar: newAvatar }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      await fetchUserData();
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.post(`${API}/delete_account`, { user_id: user?.id });
      toast('Account deletion requested. You have 7 days to recover.');
      logout();
    } catch {
      toast.error('Failed to request account deletion.');
    }
  };

  const initials = `${formData.first_name?.[0] || ''}${formData.last_name?.[0] || ''}`.toUpperCase() || 'U';

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-8">

      {/* ── Page header ───────────────────────────────────────── */}
      <div className="pb-6 border-b border-zinc-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-5 h-[2px] bg-orange-500" />
          <p className="font-black uppercase text-orange-500"
             style={{ fontSize: '0.58rem', letterSpacing: '0.22em' }}>
            Manage
          </p>
        </div>
        <h1 className="font-black text-black leading-tight"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 2.3rem)', letterSpacing: '-0.025em' }}>
          Account
        </h1>
      </div>

      {/* ── Profile card ──────────────────────────────────────── */}
      <Card>
        {/* Avatar banner */}
        <div className="relative bg-zinc-950 px-6 pt-10 pb-8 overflow-hidden">
          {/* Orange left edge */}
          <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-orange-500" />
          {/* Subtle grid texture */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
               style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="relative flex flex-col items-center gap-3">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-sm overflow-hidden border-2 border-zinc-800 bg-zinc-900">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full bg-orange-500 flex items-center justify-center">
                    <span className="text-white text-2xl font-black">{initials}</span>
                  </div>
                )}
              </div>
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute -bottom-1 -right-1 bg-orange-500 rounded-sm p-1.5
                             border-2 border-zinc-950 hover:bg-orange-600 transition-colors"
                  title="Upload photo"
                >
                  <RiUploadLine size={12} className="text-white" />
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-black text-white tracking-tight">
                {formData.first_name} {formData.last_name}
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Details / edit form */}
        <div className="p-5">
          {!isEditing ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <RiMapPinLine className="text-orange-500" size={13} />
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">
                    Profile details
                  </p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em]
                             text-zinc-500 hover:text-black transition-colors px-3 py-1.5 rounded-sm
                             hover:bg-zinc-50 border border-transparent hover:border-zinc-200"
                >
                  <RiEditLine size={13} /> Edit
                </button>
              </div>
              <div>
                <InfoRow label="Phone"       value={formData.phone} />
                <InfoRow label="Address"     value={formData.address} />
                <InfoRow label="City"        value={formData.city} />
                <InfoRow label="Postal Code" value={formData.postal_code} />
                <InfoRow label="Country"     value={formData.country} />
              </div>
            </>
          ) : (
            <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <RiEditLine className="text-orange-500" size={13} />
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">
                  Editing profile
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="First name">
                  <input name="first_name" value={formData.first_name} onChange={handleChange}
                         className={inputCls} placeholder="Jane" />
                </Field>
                <Field label="Last name">
                  <input name="last_name" value={formData.last_name} onChange={handleChange}
                         className={inputCls} placeholder="Doe" />
                </Field>
              </div>

              <Field label="Phone">
                <input name="phone" value={formData.phone} onChange={handleChange}
                       placeholder="+254 700 000 000" className={inputCls} />
              </Field>
              <Field label="Address">
                <input name="address" value={formData.address} onChange={handleChange}
                       placeholder="Street, building, apartment" className={inputCls} />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="City">
                  <input name="city" value={formData.city} onChange={handleChange} className={inputCls} />
                </Field>
                <Field label="Postal Code">
                  <input name="postal_code" value={formData.postal_code} onChange={handleChange}
                         className={inputCls} placeholder="00100" />
                </Field>
              </div>

              <Field label="Country">
                <input name="country" value={formData.country} onChange={handleChange} className={inputCls} />
              </Field>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-sm
                             border border-zinc-200 text-[10px] font-black uppercase tracking-[0.1em]
                             text-zinc-500 hover:text-black hover:border-zinc-400 transition-all"
                >
                  <RiCloseLine size={15} /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white
                             text-[10px] font-black uppercase tracking-[0.1em] px-4 py-3 rounded-sm
                             hover:bg-orange-600 transition-all disabled:opacity-50"
                  style={{ boxShadow: loading ? 'none' : '0 4px 14px rgba(240,90,26,0.25)' }}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><RiSaveLine size={14} /> Save changes</>
                  )}
                </button>
              </div>

              {saveSuccess && (
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-950 border border-zinc-800
                                text-[10px] font-black uppercase tracking-[0.1em] text-white rounded-sm">
                  <RiCheckLine size={13} className="text-orange-500" /> Profile updated successfully
                </div>
              )}
            </form>
          )}
        </div>
      </Card>

      {/* ── Account actions ───────────────────────────────────── */}
      <Card>
        <CardHeader icon={RiShieldLine} title="Account actions" />
        <div className="p-4 space-y-2">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-sm border border-zinc-100
                       bg-white text-[10px] font-black uppercase tracking-[0.1em] text-zinc-600
                       hover:text-black hover:border-zinc-300 transition-all text-left"
          >
            <RiLogoutBoxLine size={16} className="text-zinc-400" /> Sign out
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-sm border border-zinc-100
                       bg-white text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400
                       hover:text-red-500 hover:border-red-200 transition-all text-left"
          >
            <RiDeleteBinLine size={16} /> Delete account
          </button>
        </div>
      </Card>

      {/* ── Delete confirmation modal ─────────────────────────── */}
      {showDeleteConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-sm w-full max-w-sm pointer-events-auto
                            border border-zinc-100 overflow-hidden"
                 style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
              {/* Red top strip */}
              <div className="h-[3px] bg-red-500" />
              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-9 h-9 rounded-sm bg-red-50 border border-red-100
                                  flex items-center justify-center flex-shrink-0">
                    <RiAlertLine className="text-red-500" size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-black tracking-tight mb-1">
                      Delete account?
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Your account will be deactivated. You have{' '}
                      <span className="font-black text-black">7 days</span> to recover it
                      before permanent deletion.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-3 rounded-sm border border-zinc-200 text-[10px] font-black
                               uppercase tracking-[0.1em] text-zinc-500 hover:text-black
                               hover:border-zinc-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 py-3 rounded-sm bg-black text-white text-[10px] font-black
                               uppercase tracking-[0.1em] hover:bg-zinc-800 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountView;