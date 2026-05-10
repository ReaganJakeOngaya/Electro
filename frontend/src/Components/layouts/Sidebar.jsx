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
  RiPercentLine,
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
    { id: 'home',     label: 'Home',     icon: RiHomeLine,        activeIcon: RiHomeFill        },
    { id: 'products', label: 'Products', icon: RiShoppingBagLine, activeIcon: RiShoppingBagFill },
    { id: 'wishlist', label: 'Wishlist', icon: RiHeartLine,       activeIcon: RiHeartFill       },
    { id: 'orders',   label: 'Orders',   icon: RiCheckLine,       activeIcon: RiCheckLine       },
    { id: 'deals',    label: 'Deals',    icon: RiPercentLine,     activeIcon: RiPercentLine     },
  ];

  const goToAccount = () => onNavChange('account');

  return (
    <aside
      className={`hidden lg:flex flex-col bg-black border-r border-zinc-900 sticky top-0 h-screen transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[72px]' : 'w-60'
      }`}
    >
      {/* Orange top edge */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-orange-500 z-10" />

      {/* Header */}
      <div className={`flex items-center border-b border-zinc-900 h-[68px] px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <Link to="/" className="flex items-baseline gap-0 select-none">
            <span className="text-white text-lg font-black tracking-tight">Gad</span>
            <span className="text-orange-500 text-xl font-black leading-none">&</span>
            <span className="text-zinc-600 text-lg font-black tracking-tight">gets</span>
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-sm text-zinc-600 hover:text-orange-500 hover:bg-zinc-900 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <RiMenuUnfoldLine size={18} /> : <RiMenuFoldLine size={18} />}
        </button>
      </div>

      {/* Scrollable nav */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-none">

        {/* Main nav */}
        <nav className="px-2 space-y-0.5">
          {!collapsed && (
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-zinc-700 px-3 mb-2 mt-1">
              Navigation
            </p>
          )}
          {NAV.map(({ id, label, icon: Icon, activeIcon: ActiveIcon }) => {
            const active = activeNav === id;
            return (
              <button
                key={id}
                onClick={() => onNavChange(id)}
                title={collapsed ? label : ''}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-black uppercase tracking-[0.08em]
                            transition-all duration-150 text-left relative
                            ${active
                              ? 'bg-orange-500 text-white'
                              : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'
                            }
                            ${collapsed ? 'justify-center' : ''}`}
              >
                {/* Active left accent */}
                {active && !collapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-white rounded-r-sm" />
                )}
                {active ? <ActiveIcon size={18} /> : <Icon size={18} />}
                {!collapsed && label}
              </button>
            );
          })}

          {/* Cart */}
          <button
            onClick={onCartOpen}
            title={collapsed ? 'Cart' : ''}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-black uppercase tracking-[0.08em]
                        text-zinc-500 hover:bg-zinc-900 hover:text-white transition-all duration-150 text-left relative
                        ${collapsed ? 'justify-center' : ''}`}
          >
            <RiShoppingCartLine size={18} />
            {!collapsed && (
              <>
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="ml-auto text-[9px] font-black bg-orange-500 text-white px-1.5 py-0.5 rounded-sm min-w-[18px] text-center">
                    {cartCount}
                  </span>
                )}
              </>
            )}
            {collapsed && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[8px] font-black bg-orange-500 text-white w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </nav>

        {/* Categories */}
        <div className="px-2 pt-6">
          {!collapsed && (
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-zinc-700 px-3 mb-2">
              Categories
            </p>
          )}
          <div className="space-y-0.5">
            {CATEGORIES.map(({ label, icon: iconName }) => {
              const Icon = getIconComponent(iconName);
              const active = activeCategory === label;
              return (
                <button
                  key={label}
                  onClick={() => { onCategoryChange(label); onNavChange('products'); }}
                  title={collapsed ? label : ''}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm text-[11px] font-bold
                              transition-all duration-150 text-left
                              ${active
                                ? 'bg-zinc-900 text-orange-400'
                                : 'text-zinc-600 hover:bg-zinc-900 hover:text-zinc-300'
                              }
                              ${collapsed ? 'justify-center' : ''}`}
                >
                  <Icon size={16} />
                  {!collapsed && <span className="flex-1">{label}</span>}
                  {!collapsed && active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom: account + logout */}
      <div className={`flex-shrink-0 px-2 pb-5 pt-4 border-t border-zinc-900 bg-black ${collapsed ? '' : ''}`}>
        <button
          onClick={goToAccount}
          title={collapsed ? 'Account' : ''}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-sm transition-all duration-150
                      hover:bg-zinc-900 text-left group ${collapsed ? 'justify-center' : ''}`}
        >
          {user?.avatar ? (
            <img
              src={`${API}/uploads/${user.avatar}`}
              alt="Avatar"
              className="w-8 h-8 rounded-sm object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-sm bg-orange-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-black">
                {user?.first_name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-white truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-[10px] text-zinc-600 truncate">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <RiUserLine size={14} className="text-zinc-700 group-hover:text-zinc-400 flex-shrink-0" />
          )}
        </button>

        <button
          onClick={onLogout}
          title={collapsed ? 'Sign out' : ''}
          className={`w-full flex items-center gap-3 px-3 py-2.5 mt-1 rounded-sm text-[11px] font-black uppercase tracking-[0.08em]
                      text-zinc-700 hover:bg-zinc-900 hover:text-red-400 transition-all duration-150 text-left
                      ${collapsed ? 'justify-center' : ''}`}
        >
          <RiLogoutBoxLine size={17} />
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;