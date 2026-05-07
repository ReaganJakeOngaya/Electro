import React, { useState } from 'react';
import { RiAddLine, RiHeartLine, RiHeartFill, RiShoppingBagLine, RiZoomInLine } from 'react-icons/ri';
import { API } from './constants/index';

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onPreview }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const images = product.images || [];

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    if (onPreview) onPreview(product);
  };

  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div
      className="group relative bg-white rounded-xl border border-zinc-100 overflow-hidden transition-all duration-200 cursor-pointer"
      style={{
        boxShadow: hovered
          ? '0 12px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)'
          : '0 1px 0 rgba(255,255,255,0.9) inset, 0 2px 10px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCardClick}
    >
      {/* Image area - fixed aspect ratio with overflow hidden */}
      <div className="relative aspect-[4/3] bg-zinc-50 overflow-hidden flex items-center justify-center">
        {images.length > 0 ? (
          <img
            src={`${API}/uploads/${images[imgIdx]}`}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <RiShoppingBagLine className="text-3xl text-zinc-200" />
          </div>
        )}

        {/* Category badge - top left */}
        <div className="absolute top-2 left-2 z-10">
          <span className="text-[8px] font-black uppercase tracking-[0.1em] bg-white/90 backdrop-blur-sm border border-zinc-200 text-zinc-500 px-1.5 py-0.5 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Discount badge - top right, improved visibility */}
        {hasDiscount && (
          <div className="absolute top-2 right-2 z-10">
            <span className="bg-red-600 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-md">
              -{product.discount}%
            </span>
          </div>
        )}

        {/* Image dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                className={`w-1 h-1 rounded-full transition-all ${i === imgIdx ? 'bg-black w-2' : 'bg-black/30'}`}
              />
            ))}
          </div>
        )}

        {/* Quick View overlay */}
        {hovered && (
          <button
            onClick={(e) => { e.stopPropagation(); if (onPreview) onPreview(product); }}
            className="absolute inset-0 w-full h-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out backdrop-blur-[1px]"
          >
            <span className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95">
              <RiZoomInLine size={14} /> Quick View
            </span>
          </button>
        )}
      </div>

      {/* Info section */}
      <div className="p-2.5">
        <h3 className="text-xs font-bold text-black truncate tracking-tight mb-0.5">{product.name}</h3>
        {product.brand && (
          <p className="text-[9px] font-medium text-zinc-400 uppercase tracking-wider mb-1">{product.brand}</p>
        )}
        <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed mb-2">{product.description}</p>

        <div className="flex items-center justify-between">
          {/* Price */}
          <div>
            {hasDiscount ? (
              <div className="flex flex-col items-start">
                <span className="text-sm font-black text-black tracking-tight">
                  KSh {Math.round(discountedPrice).toLocaleString()}
                </span>
                <span className="text-[9px] text-zinc-400 line-through">
                  KSh {product.price.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-sm font-black text-black tracking-tight">
                KSh {product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Action buttons - wishlist next to add */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className="flex items-center gap-1 bg-black text-white text-[10px] font-bold px-2 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors active:scale-95"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
            >
              <RiAddLine size={11} /> Add
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all
                          ${isWishlisted
                            ? 'bg-black border-black text-white'
                            : 'border-zinc-200 text-zinc-400 hover:border-zinc-400 hover:text-black'
                          }`}
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isWishlisted ? <RiHeartFill size={11} /> : <RiHeartLine size={11} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;