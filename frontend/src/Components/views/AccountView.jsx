// src/Components/views/AccountView.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { getUser, getToken, updateLocalUser, logout } from '../common/utils/auth';
import { API } from '../common/constants';
import {
  RiLogoutBoxLine, RiDeleteBinLine, RiEditLine, RiSaveLine,
  RiUserLine, RiUploadLine, RiCheckLine, RiCloseLine
} from 'react-icons/ri';

const AccountView = ({ user, onLogout, onUserUpdate }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    postal_code: user?.postal_code || '',
    country: user?.country || 'Kenya'
  });
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar ? `${API}/uploads/${user.avatar}` : '');
  const fileInputRef = useRef(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${API}/user?user_id=${user.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const userData = res.data;
      setFormData({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        postal_code: userData.postal_code || '',
        country: userData.country || 'Kenya'
      });
      setAvatar(userData.avatar || '');
      setAvatarPreview(userData.avatar ? `${API}/uploads/${userData.avatar}` : '');
      updateLocalUser({
        first_name: userData.first_name,
        last_name: userData.last_name,
        avatar: userData.avatar
      });
      if (onUserUpdate) onUserUpdate();
    } catch (err) {
      console.error('Failed to fetch user data', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return null;
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    const res = await axios.post(`${API}/user/avatar`, formData, {
      headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'multipart/form-data' }
    });
    return res.data.avatar;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let newAvatar = avatar;
      if (avatarFile) {
        newAvatar = await uploadAvatar();
      }
      await axios.put(`${API}/user/profile`, { ...formData, avatar: newAvatar }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      await fetchUserData();
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.post(`${API}/delete_account`, { user_id: user?.id });
      alert('Account deletion requested. You have 7 days to recover.');
      logout();
    } catch {
      alert('Failed to request account deletion.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-2">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Manage</p>
        <h2 className="text-3xl font-black tracking-tight text-black">Account</h2>
      </div>

      {/* Profile card */}
      <div className="bg-white border border-gray-100 overflow-hidden shadow-sm rounded-sm">
        {/* Avatar section */}
        <div className="relative bg-gray-50 px-6 pt-8 pb-6 border-b border-gray-100">
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/112?text=User'; }}
                  />
                ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <RiUserLine className="text-white text-4xl" />
                  </div>
                )}
              </div>
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-1 right-1 bg-black rounded-full p-1.5 border-2 border-white shadow-sm hover:bg-gray-800 transition-colors"
                  title="Upload new avatar"
                >
                  <RiUploadLine size={14} className="text-white" />
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
            <h3 className="text-xl font-black tracking-tight text-black">
              {formData.first_name} {formData.last_name}
            </h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Details */}
        <div className="p-6">
          {!isEditing ? (
            <>
              <div className="flex items-center justify-between mb-5">
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-gray-400">Profile details</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-gray-500 hover:text-black transition-colors px-3 py-1.5 rounded-sm hover:bg-gray-50"
                >
                  <RiEditLine size={14} /> Edit
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Phone', value: formData.phone || '—' },
                  { label: 'Address', value: formData.address || '—' },
                  { label: 'City', value: formData.city || '—' },
                  { label: 'Postal Code', value: formData.postal_code || '—' },
                  { label: 'Country', value: formData.country || 'Kenya' }
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-[10px] font-black uppercase tracking-[0.12em] text-gray-400 mb-1 sm:mb-0">{label}</span>
                    <span className="text-sm text-black font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-gray-500 mb-1">First name</label>
                  <input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-gray-500 mb-1">Last name</label>
                  <input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-gray-500 mb-1">Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254 700 000 000"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-gray-500 mb-1">Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street, building, apartment"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-gray-500 mb-1">City</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-gray-500 mb-1">Postal Code</label>
                  <input
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-gray-500 mb-1">Country</label>
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm border border-gray-200 text-xs font-black uppercase tracking-[0.08em] text-gray-600 hover:text-black hover:border-gray-400 transition-all"
                >
                  <RiCloseLine size={16} /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-black text-white text-xs font-black uppercase tracking-[0.08em] px-4 py-2.5 rounded-sm hover:bg-gray-800 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <RiSaveLine size={16} /> Save changes
                    </>
                  )}
                </button>
              </div>
              {saveSuccess && (
                <div className="mt-3 p-2 bg-green-50 text-green-700 text-xs font-black uppercase tracking-[0.08em] rounded-sm flex items-center justify-center gap-2">
                  <RiCheckLine size={14} /> Profile updated successfully
                </div>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white border border-gray-100 p-6 rounded-sm shadow-sm">
        <h3 className="text-[10px] font-black uppercase tracking-[0.12em] text-gray-400 mb-4">Account actions</h3>
        <div className="space-y-3">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-sm border border-gray-200 bg-white text-xs font-black uppercase tracking-[0.08em] text-gray-600 hover:text-black hover:border-gray-400 transition-all"
          >
            <RiLogoutBoxLine size={18} /> Sign out
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-sm border border-gray-200 bg-white text-xs font-black uppercase tracking-[0.08em] text-gray-400 hover:text-red-600 hover:border-red-200 transition-all"
          >
            <RiDeleteBinLine size={18} /> Delete account
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={() => setShowDeleteConfirm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-sm p-6 w-full max-w-sm pointer-events-auto shadow-xl border border-gray-100">
              <h3 className="text-lg font-black tracking-tight text-black mb-2">Delete account?</h3>
              <p className="text-sm text-gray-500 mb-5">
                Your account will be deactivated. You have <span className="font-black text-black">7 days</span> to recover it before permanent deletion.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 rounded-sm border border-gray-200 text-xs font-black uppercase tracking-[0.08em] text-gray-500 hover:text-black transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-2.5 rounded-sm bg-black text-white text-xs font-black uppercase tracking-[0.08em] hover:bg-gray-800 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountView;