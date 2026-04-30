// src/components/AccountView.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { getUser, getToken, updateLocalUser, logout } from '../common/utils/auth';
import { API } from '../common/constants';
import { RiLogoutBoxLine, RiDeleteBinLine, RiEditLine, RiSaveLine, RiUserLine, RiUploadLine } from 'react-icons/ri';

const AccountView = ({ user, onLogout }) => {
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
  const fileInputRef = useRef(null);

  // Refresh user data when component mounts
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
      // Update localStorage user info
      const storedUser = getUser();
      storedUser.first_name = userData.first_name;
      storedUser.last_name = userData.last_name;
      updateLocalUser({ first_name: userData.first_name, last_name: userData.last_name });
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
      setAvatar(URL.createObjectURL(file)); // preview
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
      // Upload avatar if changed
      let newAvatar = avatar;
      if (avatarFile) {
        newAvatar = await uploadAvatar();
      }
      // Update profile
      await axios.put(`${API}/user/profile`, { ...formData, avatar: newAvatar }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      // Refresh local user data
      await fetchUserData();
      setIsEditing(false);
      alert('Profile updated successfully');
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
    <div className="space-y-6 max-w-lg mx-auto">
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Manage</p>
        <h2 className="text-2xl font-black tracking-tighter text-black">Account</h2>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            {avatar ? (
              <img
                src={avatar.startsWith('http') ? avatar : `${API}/uploads/${avatar}`}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-black"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=User'; }}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center">
                <RiUserLine className="text-white text-3xl" />
              </div>
            )}
            {isEditing && (
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-black rounded-full p-1.5 border-2 border-white"
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
        </div>

        {!isEditing ? (
          // View mode
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-black text-black text-lg tracking-tight">{formData.first_name} {formData.last_name}</p>
                <p className="text-sm text-zinc-400">{user?.email}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-xs font-bold text-zinc-600 hover:text-black"
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
                <div key={label} className="flex justify-between py-2 border-b border-zinc-50 last:border-0">
                  <span className="text-xs font-bold uppercase text-zinc-400">{label}</span>
                  <span className="text-sm text-black">{value}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Edit mode
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-600">First name</label>
                <input name="first_name" value={formData.first_name} onChange={handleChange} className="form-input text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-600">Last name</label>
                <input name="last_name" value={formData.last_name} onChange={handleChange} className="form-input text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-600">Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} className="form-input text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-600">Address</label>
              <input name="address" value={formData.address} onChange={handleChange} className="form-input text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-600">City</label>
                <input name="city" value={formData.city} onChange={handleChange} className="form-input text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-600">Postal Code</label>
                <input name="postal_code" value={formData.postal_code} onChange={handleChange} className="form-input text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-600">Country</label>
              <input name="country" value={formData.country} onChange={handleChange} className="form-input text-sm" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary text-sm flex-1">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary text-sm flex-1 flex items-center justify-center gap-1">
                <RiSaveLine size={14} /> {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-zinc-100 bg-white text-sm font-bold text-zinc-600 hover:text-black hover:border-zinc-300 transition-all">
          <RiLogoutBoxLine size={16} /> Sign out
        </button>
        <button onClick={() => setShowDeleteConfirm(true)} className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-zinc-100 bg-white text-sm font-bold text-zinc-400 hover:text-zinc-700 hover:border-zinc-300 transition-all">
          <RiDeleteBinLine size={16} /> Delete account
        </button>
      </div>

      {/* Delete confirm modal */}
      {showDeleteConfirm && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={() => setShowDeleteConfirm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-3xl p-7 w-full max-w-sm pointer-events-auto shadow-xl">
              <h3 className="text-lg font-black mb-2">Delete account?</h3>
              <p className="text-sm text-zinc-500 mb-6">
                Your account will be deactivated. You have <span className="font-bold text-black">7 days</span> to recover it before permanent deletion.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-500 hover:text-black">Cancel</button>
                <button onClick={handleDeleteAccount} className="flex-1 py-2.5 rounded-xl bg-black text-white text-sm font-bold hover:bg-zinc-800">Delete</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountView;