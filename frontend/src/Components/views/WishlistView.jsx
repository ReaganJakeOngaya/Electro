import React from 'react';
import { RiHeartLine, RiShoppingBagLine, RiArrowRightLine } from 'react-icons/ri';
import ProductCard from '../common/ProductCard';

const WishlistView = ({ products, wishlist, onAddToCart, onToggleWishlist, onProductClick, onNavChange }) => {
  const wishlisted = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="space-y-8 pb-8">

      {/* ── Page header ───────────────────────────────────────── */}
      <div className="pb-6 border-b border-zinc-100">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-5 h-[2px] bg-orange-500" />
              <p className="font-black uppercase text-orange-500"
                 style={{ fontSize: '0.58rem', letterSpacing: '0.22em' }}>
                Saved items
              </p>
            </div>
            <h1 className="font-black text-black leading-tight"
                style={{ fontSize: 'clamp(1.6rem, 4vw, 2.3rem)', letterSpacing: '-0.025em' }}>
              Wishlist
            </h1>
          </div>

          {wishlisted.length > 0 && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-400">
                {wishlisted.length} item{wishlisted.length !== 1 ? 's' : ''}
              </span>
              <span className="w-1 h-1 rounded-full bg-orange-500" />
            </div>
          )}
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      {wishlisted.length > 0 ? (
        <>
          {/* Bulk add all CTA */}
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-400">
              <span className="text-black">{wishlisted.length}</span> saved product{wishlisted.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={() => wishlisted.forEach(p => onAddToCart(p))}
              className="flex items-center gap-2 bg-orange-500 text-white text-[9px] font-black
                         uppercase tracking-[0.12em] px-4 py-2 rounded-sm hover:bg-orange-600
                         transition-all active:scale-95"
              style={{ boxShadow: '0 4px 14px rgba(240,90,26,0.25)' }}
            >
              <RiShoppingBagLine size={12} /> Add all to cart
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {wishlisted.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted
                onPreview={onProductClick}
              />
            ))}
          </div>
        </>
      ) : (
        /* ── Empty state ──────────────────────────────────────── */
        <div className="flex flex-col items-center justify-center py-28 gap-6 text-center">
          <div className="relative">
            <div className="w-20 h-20 bg-zinc-50 border border-zinc-100 flex items-center justify-center rounded-sm">
              <RiHeartLine className="text-3xl text-zinc-300" />
            </div>
            {/* Orange corner accent */}
            <div className="absolute top-0 right-0 w-0 h-0
                            border-t-[18px] border-t-orange-500
                            border-l-[18px] border-l-transparent" />
          </div>

          <div>
            <h2 className="text-base font-black text-black tracking-tight">Nothing saved yet</h2>
            <p className="text-xs text-zinc-400 mt-1.5 max-w-xs">
              Tap the <RiHeartLine className="inline text-orange-500" size={11} /> on any product
              to save it here for later.
            </p>
          </div>

          {onNavChange && (
            <button
              onClick={() => onNavChange('products')}
              className="flex items-center gap-2 bg-orange-500 text-white text-[10px] font-black
                         uppercase tracking-[0.14em] px-6 py-3 rounded-sm hover:bg-orange-600
                         transition-all"
              style={{ boxShadow: '0 4px 14px rgba(240,90,26,0.25)' }}
            >
              Browse products <RiArrowRightLine size={13} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default WishlistView;