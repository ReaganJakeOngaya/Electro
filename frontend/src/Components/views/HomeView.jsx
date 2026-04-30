import React from 'react';
import { RiArrowRightLine, RiArrowRightSLine } from 'react-icons/ri';
import ProductCard from '../common/ProductCard';
import { CATEGORIES } from '../common/constants';
import { getIconComponent } from '../common/utils/iconHelpers';

const HomeView = ({ user, products, onAddToCart, onToggleWishlist, wishlist, onNavChange, onCategoryChange }) => {
  const featured  = products.slice(0, 4);
  const newArrivals = products.slice(0, 6); // not directly used but kept for potential future

  const categoriesList = CATEGORIES.filter(c => c.label !== 'All');

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          minHeight: '260px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
        }}
      >
        {/* Background image */}
        <img
          src="../../src/assets/shopcart.jpg"
          alt="DeviceYangu hero banner"
          className="absolute inset-0 w-full h-full object-cover object-center"
          draggable={false}
        />

        {/* Left-side dark gradient so text stays legible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.48) 42%, rgba(0,0,0,0.1) 70%, transparent 100%)',
          }}
        />

        {/* Content */}
        <div
          className="relative z-10 p-8 lg:p-12 flex flex-col justify-center"
          style={{ minHeight: '340px' }}
        >
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/50 mb-4 block">
            🇰🇪 Welcome back
          </span>

          <h1
            className="text-3xl lg:text-5xl font-black tracking-tighter text-white leading-[0.95] mb-3"
            style={{ textShadow: '0 2px 24px rgba(0,0,0,0.5)' }}
          >
            Hey, {user?.first_name}.<br />
            <span
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #8a8a8a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              What are you<br />shopping for?
            </span>
          </h1>

          <p className="text-white/50 text-sm mb-6 max-w-xs leading-relaxed">
            Explore {products.length} authentic gadgets delivered straight to your door.
          </p>

          <button
            onClick={() => onNavChange('products')}
            className="inline-flex items-center gap-2 bg-white text-black font-bold text-sm
                       px-5 py-2.5 rounded-xl hover:bg-zinc-100 transition-colors w-fit"
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}
          >
            Shop All Products <RiArrowRightLine size={14} />
          </button>
        </div>
      </div>

      {/* Category quick-links */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black tracking-tight text-black">Categories</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {categoriesList.map(({ label, icon: iconName }) => {
            const Icon = getIconComponent(iconName);
            return (
              <button
                key={label}
                onClick={() => { onCategoryChange(label); onNavChange('products'); }}
                className="group flex flex-col items-center gap-1 p-2 rounded-2xl border border-zinc-100
                           bg-white hover:bg-black hover:border-black transition-all duration-150"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <div className="w-8 h-6 rounded-xl bg-zinc-50 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                  <Icon className="text-xl text-black group-hover:text-white transition-colors" />
                </div>
                <span className="text-[10px] font-bold text-zinc-600 group-hover:text-white transition-colors">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-0.5">Handpicked</p>
              <h2 className="text-lg font-black tracking-tight text-black">Featured Products</h2>
            </div>
            <button onClick={() => onNavChange('products')} className="text-xs font-bold text-zinc-400 hover:text-black flex items-center gap-1 transition-colors">
              View all <RiArrowRightSLine size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard
                key={p.id} product={p}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlist.includes(p.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeView;