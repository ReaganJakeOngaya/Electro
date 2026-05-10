import React from 'react';
import { Link } from 'react-router-dom';
import {
  RiCloseLine, RiMenuLine, RiShoppingCartLine,
  RiHomeLine, RiHomeFill, RiShoppingBagLine, RiShoppingBagFill,
  RiHeartLine, RiHeartFill, RiUserLine, RiUserFill,
  RiLogoutBoxLine, RiCheckLine, RiPercentLine,
} from 'react-icons/ri';
import { CATEGORIES, API } from '../common/constants';
import { getIconComponent } from '../common/utils/iconHelpers';

const MobileNav = ({
  activeNav, onNavChange, cartCount, onCartOpen,
  mobileMenuOpen, setMobileMenuOpen,
  user, onLogout, activeCategory, onCategoryChange,
}) => (
  <>
    {/* ── Top bar ─────────────────────────────────────────────── */}
    <header className="lg:hidden sticky top-0 z-30 bg-black border-b border-zinc-900 px-4 h-[60px] flex items-center justify-between">
      {/* Orange top strip */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-orange-500" />

      <Link to="/" className="flex items-baseline gap-0 select-none">
        <span className="text-white text-lg font-black tracking-tight">Gad</span>
        <span className="text-orange-500 text-xl font-black leading-none">&</span>
        <span className="text-zinc-600 text-lg font-black tracking-tight">gets</span>
      </Link>

      <div className="flex items-center gap-1">
        {/* Cart */}
        <button
          onClick={onCartOpen}
          className="relative w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-orange-500 transition-colors"
        >
          <RiShoppingCartLine size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        {/* Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
        </button>
      </div>
    </header>

    {/* ── Slide-down menu ──────────────────────────────────────── */}
    {mobileMenuOpen && (
      <div
        className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className="absolute top-[60px] left-0 right-0 bg-black border-b border-zinc-900 p-4 space-y-3"
          onClick={e => e.stopPropagation()}
        >
          {/* User card */}
          <div className="flex items-center gap-3 p-3 rounded-sm bg-zinc-900 border border-zinc-800">
            {user?.avatar ? (
              <img
                src={`${API}/uploads/${user.avatar}`}
                alt="Avatar"
                className="w-9 h-9 rounded-sm object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-sm bg-orange-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-black">
                  {user?.first_name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-black text-white truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Nav items */}
          <div className="space-y-0.5">
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-zinc-700 px-3 mb-2">
              Menu
            </p>
            {[
              { id: 'home',     label: 'Home',     icon: RiHomeLine        },
              { id: 'products', label: 'Products', icon: RiShoppingBagLine },
              { id: 'wishlist', label: 'Wishlist', icon: RiHeartLine       },
              { id: 'account',  label: 'Account',  icon: RiUserLine        },
              { id: 'orders',   label: 'Orders',   icon: RiCheckLine       },
              { id: 'deals',    label: 'Deals',    icon: RiPercentLine     },
            ].map(({ id, label, icon: Icon }) => {
              const active = activeNav === id;
              return (
                <button
                  key={id}
                  onClick={() => { onNavChange(id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-black uppercase tracking-[0.08em]
                              transition-all text-left relative
                              ${active
                                ? 'bg-orange-500 text-white'
                                : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'
                              }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-white rounded-r-sm" />
                  )}
                  <Icon size={16} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Categories */}
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-zinc-700 px-3 mb-2">
              Categories
            </p>
            <div className="grid grid-cols-2 gap-1">
              {CATEGORIES.map(({ label, icon: iconName }) => {
                const Icon = getIconComponent(iconName);
                const active = activeCategory === label;
                return (
                  <button
                    key={label}
                    onClick={() => { onCategoryChange(label); onNavChange('products'); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-sm text-[11px] font-bold transition-all text-left
                                ${active
                                  ? 'bg-zinc-900 text-orange-400'
                                  : 'text-zinc-600 hover:bg-zinc-900 hover:text-zinc-300'
                                }`}
                  >
                    <Icon size={13} />
                    <span className="truncate">{label}</span>
                    {active && <span className="ml-auto w-1 h-1 rounded-full bg-orange-500 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sign out */}
          <button
            onClick={() => { onLogout(); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-sm text-xs font-black uppercase tracking-[0.08em]
                       text-zinc-600 hover:bg-zinc-900 hover:text-red-400 transition-all text-left"
          >
            <RiLogoutBoxLine size={15} /> Sign out
          </button>
        </div>
      </div>
    )}

    {/* ── Bottom tab bar ───────────────────────────────────────── */}
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-black border-t border-zinc-900 flex">
      {/* Orange top strip on tab bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-zinc-900" />

      {[
        { id: 'home',     icon: RiHomeLine,        activeIcon: RiHomeFill,        label: 'Home'    },
        { id: 'products', icon: RiShoppingBagLine, activeIcon: RiShoppingBagFill, label: 'Shop'    },
        { id: 'wishlist', icon: RiHeartLine,       activeIcon: RiHeartFill,       label: 'Saved'   },
        { id: 'account',  icon: RiUserLine,        activeIcon: RiUserFill,        label: 'Account' },
        { id: 'orders',   icon: RiCheckLine,       activeIcon: RiCheckLine,       label: 'Orders'  },
        { id: 'deals',    icon: RiPercentLine,     activeIcon: RiPercentLine,     label: 'Deals'   },
      ].map(({ id, icon: Icon, activeIcon: ActiveIcon, label }) => {
        const active = activeNav === id;
        return (
          <button
            key={id}
            onClick={() => onNavChange(id)}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors relative
                        ${active ? 'text-orange-500' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            {/* Active indicator dot */}
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-orange-500 rounded-b-sm" />
            )}
            {active ? <ActiveIcon size={19} /> : <Icon size={19} />}
            <span className={`text-[9px] font-black uppercase tracking-[0.06em] ${active ? 'text-orange-500' : 'text-zinc-600'}`}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  </>
);

export default MobileNav;