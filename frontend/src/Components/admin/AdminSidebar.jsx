// src/components/admin/AdminSidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  RiDashboardLine, RiDashboardFill,
  RiShoppingBagLine, RiShoppingBagFill,
  RiShoppingCartLine, RiShoppingCartFill,
  RiUserLine, RiUserFill,
  RiSettingsLine, RiSettingsFill,
  RiLogoutBoxLine,
  RiMenuFoldLine, RiMenuUnfoldLine,
} from 'react-icons/ri';
import { getUser } from '../common/utils/auth';

const AdminSidebar = ({ activeTab, onTabChange }) => {
  const user = getUser();
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('adminSidebarCollapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('adminSidebarCollapsed', collapsed);
  }, [collapsed]);

  const toggleSidebar = () => setCollapsed(prev => !prev);

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
    <aside
      className={`hidden lg:flex flex-col bg-white border-r border-zinc-100 sticky top-0 h-screen transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-5 border-b border-zinc-100">
        {!collapsed && (
          <Link to="/admin" className="text-xl font-black tracking-tighter">
            <span className="text-black">Device</span>
            <span className="text-zinc-400">Admin</span>
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-black transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <RiMenuUnfoldLine size={20} /> : <RiMenuFoldLine size={20} />}
        </button>
      </div>

      <div className="px-4 py-4 border-b border-zinc-100">
        <div
          className={`flex items-center gap-3 px-3 py-3 rounded-2xl bg-zinc-50 border border-zinc-100 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-black">A</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-bold text-black truncate">{user?.first_name} {user?.last_name}</p>
              <p className="text-[10px] text-zinc-400">Administrator</p>
            </div>
          )}
        </div>
      </div>

      <nav className="px-3 py-4 flex-1 space-y-1 overflow-y-auto">
        {tabs.map(({ id, label, icon: Icon, activeIcon: ActiveIcon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
                          ${active ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'}
                          ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? label : ''}
            >
              {active ? <ActiveIcon size={20} /> : <Icon size={20} />}
              {!collapsed && label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-6 pt-4 border-t border-zinc-100">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                     text-zinc-400 hover:bg-zinc-50 hover:text-black transition-all
                     ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Sign out' : ''}
        >
          <RiLogoutBoxLine size={20} />
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;