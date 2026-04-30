// src/components/admin/AdminUsers.jsx
import React, { useState } from 'react';
import axios from 'axios';
import {API} from '../common/constants/index';
import { getToken } from '../common/utils/auth';
import { RiAdminLine, RiUserLine, RiDeleteBinLine } from 'react-icons/ri';

const AdminUsers = ({ users, currentUserId, onRefresh }) => {
  const [updating, setUpdating] = useState(null);

  const toggleAdmin = async (userId, currentAdminStatus) => {
    setUpdating(userId);
    try {
      await axios.put(`${API}/admin/users/${userId}/role`, { is_admin: !currentAdminStatus }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      onRefresh();
    } catch (err) {
      alert('Failed to update user role');
    } finally {
      setUpdating(null);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await axios.delete(`${API}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      onRefresh();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tighter text-black">Users</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage registered customers</p>
      </div>
      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 border-b border-zinc-100">
            <tr>
              <th className="px-6 py-3 text-xs font-black uppercase text-zinc-400">User</th>
              <th className="px-6 py-3 text-xs font-black uppercase text-zinc-400">Email</th>
              <th className="px-6 py-3 text-xs font-black uppercase text-zinc-400">Role</th>
              <th className="px-6 py-3 text-xs font-black uppercase text-zinc-400">Joined</th>
              <th className="px-6 py-3 text-xs font-black uppercase text-zinc-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </div>
                    <span>{user.first_name} {user.last_name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  {user.is_admin ? (
                    <span className="text-xs font-bold bg-black text-white px-2 py-1 rounded-full">Admin</span>
                  ) : (
                    <span className="text-xs font-bold bg-zinc-100 text-zinc-700 px-2 py-1 rounded-full">Customer</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {user.id !== currentUserId && (
                      <>
                        <button
                          onClick={() => toggleAdmin(user.id, user.is_admin)}
                          disabled={updating === user.id}
                          className="p-1 text-zinc-400 hover:text-black"
                          title={user.is_admin ? 'Remove admin' : 'Make admin'}
                        >
                          <RiAdminLine size={18} />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-1 text-zinc-400 hover:text-red-600"
                        >
                          <RiDeleteBinLine size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;