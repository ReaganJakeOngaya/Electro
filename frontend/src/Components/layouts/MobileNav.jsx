import React from 'react';
import { Link } from 'react-router-dom';
import {
  RiCloseLine, RiMenuLine, RiShoppingCartLine,
  RiHomeLine, RiHomeFill, RiShoppingBagLine, RiShoppingBagFill,
  RiHeartLine, RiHeartFill, RiUserLine, RiUserFill,
  RiLogoutBoxLine, RiCheckLine
} from 'react-icons/ri';
import { CATEGORIES, API } from '../common/constants';
import { getIconComponent } from '../common/utils/iconHelpers';

const MobileNav = ({ activeNav, onNavChange, cartCount, onCartOpen, mobileMenuOpen, setMobileMenuOpen, user, onLogout, activeCategory, onCategoryChange, onCheckout }) => (
  <>
    {/* Top bar */}
    <header className="lg:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-zinc-100 px-4 h-14 flex items-center justify-between">
      <Link to="/" className="text-lg font-black tracking-tighter">
        <span className="text-black">Gad</span>
        <span className="text-orange-600">&</span>
        <span className="text-zinc-500">gets</span>
      </Link>
      <div className="flex items-center gap-2">
        <button
          onClick={onCartOpen}
          className="relative w-9 h-9 flex items-center justify-center text-zinc-600 hover:text-black"
        >
          <RiShoppingCartLine size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-black text-white text-[9px] font-black rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-9 h-9 flex items-center justify-center text-zinc-600 hover:text-black"
        >
          {mobileMenuOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
        </button>
      </div>
    </header>

    {/* Mobile slide menu */}
    {mobileMenuOpen && (
      <div className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
        <div
          className="absolute top-14 left-0 right-0 bg-white border-b border-zinc-100 p-4 space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* User */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
            {user?.avatar ? (
              <img src={`${API}/uploads/${user.avatar}`} alt="Avatar" className="w-8 h-8 rounded-xl object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center">
                <span className="text-white text-xs font-black">{user?.first_name?.[0]?.toUpperCase() || 'U'}</span>
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-black">{user?.first_name} {user?.last_name}</p>
              <p className="text-[10px] text-zinc-400">{user?.email}</p>
            </div>
          </div>

          {/* Nav items */}
          {[
            { id: 'home', label: 'Home', icon: RiHomeLine },
            { id: 'products', label: 'Products', icon: RiShoppingBagLine },
            { id: 'wishlist', label: 'Wishlist', icon: RiHeartLine },
            { id: 'account', label: 'Account', icon: RiUserLine },
            { id: 'orders', label: 'Orders', icon: RiCheckLine },
            { id: 'deals', label: 'Deals', icon: RiShoppingBagLine },

          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { onNavChange(id); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left
                          ${activeNav === id ? 'bg-black text-white' : 'text-zinc-600 hover:bg-zinc-50'}`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}

          {/* Categories */}
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300 px-3 mb-2">Categories</p>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIES.map(({ label, icon: iconName }) => {
                const Icon = getIconComponent(iconName);
                return (
                  <button
                    key={label}
                    onClick={() => { onCategoryChange(label); onNavChange('products'); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left
                                ${activeCategory === label ? 'bg-zinc-100 text-black' : 'text-zinc-500 hover:bg-zinc-50'}`}
                  >
                    <Icon size={13} /> {label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => { onLogout(); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-black hover:bg-zinc-50 transition-all text-left"
          >
            <RiLogoutBoxLine size={16} /> Sign out
          </button>
        </div>
      </div>
    )}

    {/* Bottom tab bar */}
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-xl border-t border-zinc-100 flex">
      {[
        { id: 'home',     icon: RiHomeLine,        activeIcon: RiHomeFill,        label: 'Home' },
        { id: 'products', icon: RiShoppingBagLine, activeIcon: RiShoppingBagFill, label: 'Shop' },
        { id: 'wishlist', icon: RiHeartLine,       activeIcon: RiHeartFill,       label: 'Saved' },
        { id: 'account',  icon: RiUserLine,        activeIcon: RiUserFill,        label: 'Account' },
        { id: 'orders',   icon: RiCheckLine,       activeIcon: RiCheckLine,       label: 'Orders' },
        { id: 'deals',    icon: RiShoppingBagLine, activeIcon: RiShoppingBagFill, label: 'Deals' },
      ].map(({ id, icon: Icon, activeIcon: ActiveIcon, label }) => {
        const active = activeNav === id;
        return (
          <button
            key={id}
            onClick={() => onNavChange(id)}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-[10px] font-bold transition-colors
                        ${active ? 'text-black' : 'text-zinc-400'}`}
          >
            {active ? <ActiveIcon size={20} /> : <Icon size={20} />}
            {label}
          </button>
        );
      })}
    </nav>
  </>
);

export default MobileNav;