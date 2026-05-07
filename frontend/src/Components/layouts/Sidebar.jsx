import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  RiHomeLine, RiHomeFill,
  RiShoppingBagLine, RiShoppingBagFill,
  RiHeartLine, RiHeartFill,
  RiShoppingCartLine,
  RiLogoutBoxLine,
  RiCheckLine,
  RiUserLine,
  RiMenuFoldLine, RiMenuUnfoldLine,
} from 'react-icons/ri';
import { CATEGORIES, API } from '../common/constants';
import { getIconComponent } from '../common/utils/iconHelpers';

const Sidebar = ({ activeCategory, onCategoryChange, activeNav, onNavChange, user, cartCount, onCartOpen, onLogout }) => {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', collapsed);
  }, [collapsed]);

  const toggleSidebar = () => setCollapsed(prev => !prev);

  const NAV = [
    { id: 'home',     label: 'Home',     icon: RiHomeLine,         activeIcon: RiHomeFill },
    { id: 'products', label: 'Products', icon: RiShoppingBagLine,  activeIcon: RiShoppingBagFill },
    { id: 'wishlist', label: 'Wishlist', icon: RiHeartLine,        activeIcon: RiHeartFill },
    { id: 'orders',   label: 'Orders',   icon: RiCheckLine,        activeIcon: RiCheckLine },
    { id: 'deals',    label: 'Deals',    icon: RiShoppingBagLine,  activeIcon: RiShoppingBagFill },
  ];

  const goToAccount = () => onNavChange('account');

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white border-r border-zinc-100 sticky top-0 h-screen transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header with logo and toggle button */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-zinc-100">
        {!collapsed && (
          <Link to="/" className="text-xl font-black tracking-tighter">
            <span className="text-black">Gad</span>
            <span className="text-orange-600">&</span>
            <span className="text-zinc-500">gets</span>
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

      {/* Scrollable navigation area */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {NAV.map(({ id, label, icon: Icon, activeIcon: ActiveIcon }) => {
            const active = activeNav === id;
            return (
              <button
                key={id}
                onClick={() => onNavChange(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                            transition-all duration-150 text-left
                            ${active ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'}
                            ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? label : ''}
              >
                {active ? <ActiveIcon size={20} /> : <Icon size={20} />}
                {!collapsed && label}
              </button>
            );
          })}

          {/* Cart button */}
          <button
            onClick={onCartOpen}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                        text-zinc-500 hover:bg-zinc-50 hover:text-black transition-all duration-150 text-left
                        ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Cart' : ''}
          >
            <RiShoppingCartLine size={20} />
            {!collapsed && (
              <>
                Cart
                {cartCount > 0 && (
                  <span className="ml-auto text-[10px] font-black bg-black text-white px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </>
            )}
            {collapsed && cartCount > 0 && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-black bg-black text-white w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </nav>

        {/* Categories section */}
        <div className="px-2 pt-6">
          {!collapsed && (
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300 px-3 mb-3">Categories</p>
          )}
          <div className="space-y-0.5">
            {CATEGORIES.map(({ label, icon: iconName }) => {
              const Icon = getIconComponent(iconName);
              const active = activeCategory === label;
              return (
                <button
                  key={label}
                  onClick={() => { onCategoryChange(label); onNavChange('products'); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold
                              transition-all duration-150 text-left
                              ${active ? 'bg-zinc-100 text-black' : 'text-zinc-400 hover:bg-zinc-50 hover:text-black'}
                              ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? label : ''}
                >
                  <Icon size={18} />
                  {!collapsed && label}
                  {!collapsed && active && <RiCheckLine size={12} className="ml-auto text-black" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom account & logout */}
      <div className="flex-shrink-0 px-2 pb-6 pt-4 border-t border-zinc-100 bg-white">
        <button
          onClick={goToAccount}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150
                      hover:bg-zinc-50 text-left ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Account' : ''}
        >
          {user?.avatar ? (
            <img src={`${API}/uploads/${user.avatar}`} alt="Avatar" className="w-8 h-8 rounded-xl object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-black">{user?.first_name?.[0]?.toUpperCase() || 'U'}</span>
            </div>
          )}
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-black truncate">{user?.first_name} {user?.last_name}</p>
              <p className="text-[10px] text-zinc-400 truncate">{user?.email}</p>
            </div>
          )}
          {!collapsed && <RiUserLine size={14} className="text-zinc-400" />}
        </button>

        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 mt-2 rounded-xl text-sm font-semibold
                      text-zinc-400 hover:bg-zinc-50 hover:text-black transition-all duration-150 text-left
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

export default Sidebar;