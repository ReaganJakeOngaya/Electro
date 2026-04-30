import React from 'react';
import { Link } from 'react-router-dom';
import {
  RiHomeLine, RiHomeFill,
  RiShoppingBagLine, RiShoppingBagFill,
  RiHeartLine, RiHeartFill,
  RiUserLine, RiUserFill,
  RiShoppingCartLine,
  RiLogoutBoxLine,
  RiCheckLine,
} from 'react-icons/ri';
import { CATEGORIES, API } from '../common/constants';
import { getIconComponent } from '../common/utils/iconHelpers'; 

const Sidebar = ({ activeCategory, onCategoryChange, activeNav, onNavChange, user, cartCount, onCartOpen, onLogout }) => {
  const NAV = [
    { id: 'home',     label: 'Home',     icon: RiHomeLine,         activeIcon: RiHomeFill },
    { id: 'products', label: 'Products', icon: RiShoppingBagLine,  activeIcon: RiShoppingBagFill },
    { id: 'wishlist', label: 'Wishlist', icon: RiHeartLine,        activeIcon: RiHeartFill },
    { id: 'account',  label: 'Account',  icon: RiUserLine,         activeIcon: RiUserFill },
    { id: 'orders',   label: 'Orders',   icon: RiCheckLine,        activeIcon: RiCheckLine },
    { id: 'deals',    label: 'Deals',    icon: RiShoppingBagLine,  activeIcon: RiShoppingBagFill },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-zinc-100 sticky top-0 h-screen overflow-y-auto">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-zinc-100">
        <Link to="/" className="text-xl font-black tracking-tighter">
          <span className="text-black">Device</span>
          <span className="text-zinc-400">Yangu</span>
        </Link>
      </div>

      {/* User chip */}
      <div className="px-4 py-4 border-b border-zinc-100">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-zinc-50 border border-zinc-100">
          {user?.avatar ? (
            <img src={`${API}/uploads/${user.avatar}`} alt="Avatar" className="w-8 h-8 rounded-xl object-cover" />
             ) : (
            <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-black">{user?.first_name?.[0]?.toUpperCase() || 'U'}</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-bold text-black truncate">{user?.first_name} {user?.last_name}</p>
            <p className="text-[10px] text-zinc-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 py-4 space-y-1 border-b border-zinc-100">
        {NAV.map(({ id, label, icon: Icon, activeIcon: ActiveIcon }) => {
          const active = activeNav === id;
          return (
            <button
              key={id}
              onClick={() => onNavChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                          transition-all duration-150 text-left
                          ${active ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'}`}
            >
              {active ? <ActiveIcon size={16} /> : <Icon size={16} />}
              {label}
            </button>
          );
        })}

        {/* Cart */}
        <button
          onClick={onCartOpen}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                     text-zinc-500 hover:bg-zinc-50 hover:text-black transition-all duration-150 text-left"
        >
          <RiShoppingCartLine size={16} />
          Cart
          {cartCount > 0 && (
            <span className="ml-auto text-[10px] font-black bg-black text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {cartCount}
            </span>
          )}
        </button>
      </nav>

      {/* Categories */}
      <div className="px-3 py-4 flex-1">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300 px-3 mb-3">Categories</p>
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
                            ${active ? 'bg-zinc-100 text-black' : 'text-zinc-400 hover:bg-zinc-50 hover:text-black'}`}
              >
                <Icon size={14} />
                {label}
                {active && <RiCheckLine size={12} className="ml-auto text-black" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                     text-zinc-400 hover:bg-zinc-50 hover:text-black transition-all duration-150 text-left"
        >
          <RiLogoutBoxLine size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;