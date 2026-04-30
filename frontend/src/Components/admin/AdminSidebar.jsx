// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  RiDashboardLine, RiDashboardFill,
  RiShoppingBagLine, RiShoppingBagFill,
  RiShoppingCartLine, RiShoppingCartFill,
  RiUserLine, RiUserFill,
  RiSettingsLine, RiSettingsFill,
  RiLogoutBoxLine,
} from 'react-icons/ri';

import { getUser } from '../common/utils/auth';
import { getToken } from '../common/utils/auth';

const AdminSidebar = ({ activeTab, onTabChange }) => {
  const user = getUser();
  const tabs = [
    { id: 'stats', label: 'Dashboard', icon: RiDashboardLine, activeIcon: RiDashboardFill },
    { id: 'products', label: 'Products', icon: RiShoppingBagLine, activeIcon: RiShoppingBagFill },
    { id: 'orders', label: 'Orders', icon: RiShoppingCartLine, activeIcon: RiShoppingCartFill },
    { id: 'users', label: 'Users', icon: RiUserLine, activeIcon: RiUserFill },
    { id: 'settings', label: 'Settings', icon: RiSettingsLine, activeIcon: RiSettingsFill },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-zinc-100 sticky top-0 h-screen">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-zinc-100">
        <Link to="/admin" className="text-xl font-black tracking-tighter">
          <span className="text-black">Device</span>
          <span className="text-zinc-400">Admin</span>
        </Link>
      </div>

      {/* Admin chip */}
      <div className="px-4 py-4 border-b border-zinc-100">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-zinc-50 border border-zinc-100">
          <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center">
            <span className="text-white text-xs font-black">A</span>
          </div>
          <div>
            <p className="text-xs font-bold text-black">{user?.first_name} {user?.last_name}</p>
            <p className="text-[10px] text-zinc-400">Administrator</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 flex-1 space-y-1">
        {tabs.map(({ id, label, icon: Icon, activeIcon: ActiveIcon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left
                          ${active ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'}`}
            >
              {active ? <ActiveIcon size={16} /> : <Icon size={16} />}
              {label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                     text-zinc-400 hover:bg-zinc-50 hover:text-black transition-all text-left"
        >
          <RiLogoutBoxLine size={16} /> Sign out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;