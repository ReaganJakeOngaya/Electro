import React from 'react';
import { RiArrowRightLine, RiArrowRightSLine } from 'react-icons/ri';
import ProductCard from '../common/ProductCard';
import { CATEGORIES } from '../common/constants';
import { getIconComponent } from '../common/utils/iconHelpers';
// Import hero image – adjust path if needed
import heroImage from '../../assets/shopcart.jpg';

const HomeView = ({ user, products, onAddToCart, onToggleWishlist, wishlist, onNavChange, onCategoryChange }) => {
  const featured = products.slice(0, 4);
  const categoriesList = CATEGORIES.filter(c => c.label !== 'All');

  return (
    <div className="space-y-10 pb-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg">
        {/* Background image – improved with import */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />

        {/* Gradient overlay – smoother and darker on left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />

        {/* Content */}
        <div className="relative z-10 px-6 py-12 md:px-10 md:py-16 lg:px-12 lg:py-20 flex flex-col justify-center min-h-[320px] md:min-h-[380px]">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/60 mb-3">
            🇰🇪 Welcome back
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-white leading-[1.1] mb-4 max-w-2xl">
            Hey, {user?.first_name}.<br />
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              What are you shopping for?
            </span>
          </h1>
          <p className="text-white/60 text-sm mb-6 max-w-md leading-relaxed">
            Explore {products.length} authentic gadgets delivered straight to your door.
          </p>
          <button
            onClick={() => onNavChange('products')}
            className="inline-flex items-center gap-2 bg-white text-black font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-zinc-100 transition-all shadow-md w-fit"
          >
            Shop All Products <RiArrowRightLine size={14} />
          </button>
        </div>
      </div>

      {/* Categories Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black tracking-tight text-black">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categoriesList.map(({ label, icon: iconName }) => {
            const Icon = getIconComponent(iconName);
            return (
              <button
                key={label}
                onClick={() => { onCategoryChange(label); onNavChange('products'); }}
                className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-zinc-100
                           bg-white hover:bg-black hover:border-black transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-50 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                  <Icon className="text-xl text-black group-hover:text-white transition-colors" />
                </div>
                <span className="text-[11px] font-bold text-zinc-600 group-hover:text-white transition-colors">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Products */}
      {featured.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-0.5">Handpicked</p>
              <h2 className="text-lg font-black tracking-tight text-black">Featured Products</h2>
            </div>
            <button
              onClick={() => onNavChange('products')}
              className="text-xs font-bold text-zinc-400 hover:text-black flex items-center gap-1 transition-colors"
            >
              View all <RiArrowRightSLine size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlist.includes(product.id)}
                onPreview={() => {}} // optional preview handler
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeView;