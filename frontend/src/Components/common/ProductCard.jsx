import React, { useState } from 'react';
import { RiAddLine, RiHeartLine, RiHeartFill, RiShoppingBagLine, RiZoomInLine, RiStarFill } from 'react-icons/ri';
import { API } from './constants';

/* ─────────────────────────────────────────────────────────────
   ProductCard
   Props:
     compact  — true  → micro tile (name + price + add only, no desc/stars)
     product, onAddToCart, onToggleWishlist, isWishlisted, onPreview
   ───────────────────────────────────────────────────────────── */
const ProductCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onPreview, compact = false }) => {
  const [imgIdx, setImgIdx]     = useState(0);
  const [hovered, setHovered]   = useState(false);
  const [imgError, setImgError] = useState(false);
  const images    = product.images || [];

  const addToRecentlyViewed = id => {
    let r = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    r = [id, ...r.filter(i => i !== id)].slice(0, 10);
    localStorage.setItem('recentlyViewed', JSON.stringify(r));
  };

  const handleCardClick  = () => { addToRecentlyViewed(product.id); if (onPreview) onPreview(product); };
  const handleQuickView  = e  => { e.stopPropagation(); addToRecentlyViewed(product.id); if (onPreview) onPreview(product); };

  const hasDiscount  = product.discount > 0;
  const finalPrice   = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;
  const avgRating    = product.avg_rating || 0;
  const reviewCount  = product.reviews_count || 0;
  const imageUrl     = images[imgIdx] ? `${API}/uploads/${images[imgIdx]}` : null;
  const isLowStock   = product.stock > 0 && product.stock <= (product.low_stock_threshold || 5);
  const outOfStock   = product.stock === 0;

  /* ── COMPACT / MICRO TILE ───────────────────────────────── */
  if (compact) {
    return (
      <div
        className="group relative bg-white border border-zinc-100 overflow-hidden rounded-sm
                   cursor-pointer transition-all duration-150"
        style={{
          boxShadow: hovered ? '0 6px 20px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
          transform:  hovered ? 'translateY(-1px)' : 'translateY(0)',
          borderColor: hovered ? '#d4d4d8' : '#f4f4f5',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleCardClick}
      >
        {/* Image — square, taller ratio for compact */}
        <div className="relative aspect-square bg-zinc-50 overflow-hidden">
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-110"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <RiShoppingBagLine className="text-zinc-200" size={18} />
            </div>
          )}

          {/* Discount badge */}
          {hasDiscount && (
            <span className="absolute top-1 right-1 bg-orange-500 text-white text-[8px]
                             font-black px-1 py-0.5 rounded-sm leading-none">
              -{product.discount}%
            </span>
          )}

          {/* Out of stock dim */}
          {outOfStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-[8px] font-black uppercase tracking-wider text-zinc-500
                               bg-white border border-zinc-200 px-1.5 py-0.5 rounded-sm">
                Sold out
              </span>
            </div>
          )}

          {/* Quick-view on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                          flex items-center justify-center transition-opacity duration-150"
               onClick={handleQuickView}>
            <RiZoomInLine className="text-white" size={16} />
          </div>

          {/* Wishlist — top-left, only visible on hover */}
          <button
            onClick={e => { e.stopPropagation(); onToggleWishlist(product.id); }}
            className={`absolute top-1 left-1 w-5 h-5 rounded-sm flex items-center justify-center
                        transition-all ${
                          isWishlisted
                            ? 'bg-black text-white opacity-100'
                            : 'bg-white/90 text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-orange-500'
                        }`}
          >
            {isWishlisted ? <RiHeartFill size={9} /> : <RiHeartLine size={9} />}
          </button>
        </div>

        {/* Info strip */}
        <div className="px-1.5 py-1.5">
          <p className="text-[10px] font-black text-black truncate leading-tight mb-0.5">
            {product.name}
          </p>
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-black text-black leading-none">
              KSh {Math.round(finalPrice).toLocaleString()}
            </span>
            <button
              onClick={e => { e.stopPropagation(); if (!outOfStock) onAddToCart(product); }}
              disabled={outOfStock}
              className={`w-5 h-5 rounded-sm flex items-center justify-center flex-shrink-0
                         transition-all active:scale-90 ${
                outOfStock
                  ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              <RiAddLine size={11} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── STANDARD CARD ──────────────────────────────────────── */
  return (
    <div
      className="group relative bg-white border overflow-hidden transition-all duration-200 cursor-pointer rounded-sm"
      style={{
        borderColor: hovered ? '#d4d4d8' : '#f4f4f5',
        boxShadow: hovered
          ? '0 16px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)'
          : '0 1px 4px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCardClick}
    >
      {/* ── Image ─────────────────────────────────────────── */}
      <div className="relative aspect-[4/3] bg-gradient-to-b from-zinc-50 to-white overflow-hidden flex items-center justify-center">

        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.07]"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <RiShoppingBagLine className="text-zinc-200" size={36} />
          </div>
        )}

        {/* Top-right: discount badge */}
        {hasDiscount && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-sm
                             uppercase tracking-wide shadow-md leading-none">
              -{product.discount}%
            </span>
          </div>
        )}

        {/* Top-left: category */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="text-[8px] font-black uppercase tracking-[0.16em]
                           bg-white/95 backdrop-blur-sm border border-zinc-100 text-zinc-500
                           px-2 py-0.5 rounded-sm shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Bottom-left: stock status */}
        {outOfStock && (
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className="bg-black/80 backdrop-blur-sm text-white text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider">
              Out of stock
            </span>
          </div>
        )}
        {isLowStock && !outOfStock && (
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className="bg-orange-500/90 backdrop-blur-sm text-white text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider">
              Only {product.stock} left
            </span>
          </div>
        )}

        {/* Image carousel dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setImgIdx(i); setImgError(false); }}
                className={`h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-orange-500 w-4' : 'bg-black/20 w-1.5'}`}
              />
            ))}
          </div>
        )}

        {/* Quick-view overlay */}
        <div
          onClick={handleQuickView}
          className="absolute inset-0 bg-black/50 flex items-center justify-center
                     opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <span className="bg-white text-black text-[9px] font-black uppercase tracking-[0.14em]
                           px-4 py-2.5 rounded-sm flex items-center gap-2
                           hover:bg-orange-500 hover:text-white transition-colors duration-150 shadow-lg">
            <RiZoomInLine size={13} /> Quick View
          </span>
        </div>

        {/* Wishlist — floats top-right, below discount */}
        <button
          onClick={e => { e.stopPropagation(); onToggleWishlist(product.id); }}
          className={`absolute z-20 transition-all duration-150 ${
            hasDiscount ? 'top-10 right-2.5' : 'top-2.5 right-2.5'
          } w-7 h-7 rounded-sm border flex items-center justify-center shadow-sm ${
            isWishlisted
              ? 'bg-black border-black text-white'
              : 'bg-white/95 border-zinc-200 text-zinc-400 opacity-0 group-hover:opacity-100 hover:border-orange-500 hover:text-orange-500'
          }`}
        >
          {isWishlisted ? <RiHeartFill size={12} /> : <RiHeartLine size={12} />}
        </button>
      </div>

      {/* ── Info ──────────────────────────────────────────── */}
      <div className="p-3.5">
        {/* Name */}
        <h3 className="text-sm font-black text-black truncate tracking-tight leading-snug mb-0.5">
          {product.name}
        </h3>

        {/* Brand */}
        {product.brand && (
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-zinc-400 mb-1.5">
            {product.brand}
          </p>
        )}

        {/* Stars */}
        {avgRating > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <RiStarFill key={i} size={10}
                  className={i <= Math.round(avgRating) ? 'text-orange-500' : 'text-zinc-200'} />
              ))}
            </div>
            {reviewCount > 0 && (
              <span className="text-[9px] font-black text-zinc-400">({reviewCount})</span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mb-3">
          {product.description}
        </p>

        {/* Divider */}
        <div className="h-px bg-zinc-50 mb-3" />

        {/* Price + actions */}
        <div className="flex items-center justify-between gap-2">
          <div>
            {hasDiscount ? (
              <div className="flex flex-col">
                <span className="text-base font-black text-black tracking-tight leading-tight">
                  KSh {Math.round(finalPrice).toLocaleString()}
                </span>
                <span className="text-[10px] text-zinc-400 line-through leading-tight">
                  KSh {product.price.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-base font-black text-black tracking-tight">
                KSh {product.price.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={e => { e.stopPropagation(); onAddToCart(product); }}
            disabled={outOfStock}
            className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em]
                       px-3 py-2 rounded-sm transition-all active:scale-95 flex-shrink-0 ${
              outOfStock
                ? 'bg-zinc-100 text-zinc-900 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm hover:shadow-md'
            }`}
            style={!outOfStock ? { boxShadow: '0 2px 8px rgba(240,90,26,0.25)' } : {}}
          >
            <RiAddLine size={12} /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;