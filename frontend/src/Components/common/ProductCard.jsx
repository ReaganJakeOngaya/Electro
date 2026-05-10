// src/Components/common/ProductCard.jsx
import React, { useState } from 'react';
import { RiAddLine, RiHeartLine, RiHeartFill, RiShoppingBagLine, RiZoomInLine, RiStarFill } from 'react-icons/ri';
import { API } from './constants';

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onPreview }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const images = product.images || [];

  const addToRecentlyViewed = (productId) => {
    let recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    recent = [productId, ...recent.filter(id => id !== productId)].slice(0, 10);
    localStorage.setItem('recentlyViewed', JSON.stringify(recent));
  };

  const handleCardClick = () => {
    addToRecentlyViewed(product.id);
    if (onPreview) onPreview(product);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    addToRecentlyViewed(product.id);
    if (onPreview) onPreview(product);
  };

  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;
  const avgRating = product.avg_rating || 0;
  const reviewCount = product.reviews_count || 0;
  const currentImage = images[imgIdx];
  const imageUrl = currentImage ? `${API}/uploads/${currentImage}` : null;
  const isLowStock = product.stock > 0 && product.stock <= (product.low_stock_threshold || 5);

  return (
    <div
      className="group relative bg-white border border-gray-100 overflow-hidden transition-all duration-200 cursor-pointer rounded-sm"
      style={{
        boxShadow: hovered
          ? '0 1px 0 rgba(255,255,255,0.9) inset, 0 16px 40px rgba(0,0,0,0.10), 0 4px 10px rgba(0,0,0,0.06)'
          : '0 1px 0 rgba(255,255,255,0.9) inset, 0 4px 16px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden flex items-center justify-center">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <RiShoppingBagLine className="text-3xl text-gray-200" />
          </div>
        )}

        {hasDiscount && (
          <div className="absolute top-2 right-2 z-10">
            <span className="bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-sm shadow-md uppercase tracking-wide">
              -{product.discount}%
            </span>
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute bottom-2 left-2 z-10">
            <span className="bg-black text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Out of stock</span>
          </div>
        )}
        {isLowStock && product.stock > 0 && (
          <div className="absolute bottom-2 left-2 z-10">
            <span className="bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Low stock</span>
          </div>
        )}

        <div className="absolute top-2 left-2 z-10">
          <span className="text-[8px] font-black uppercase tracking-[0.16em] bg-white/90 backdrop-blur-sm border border-gray-100 text-gray-500 px-1.5 py-0.5 rounded-sm">
            {product.category}
          </span>
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setImgIdx(i); setImgError(false); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-black w-3' : 'bg-black/30'}`}
              />
            ))}
          </div>
        )}

        {hovered && (
          <button
            onClick={handleQuickView}
            className="absolute inset-0 w-full h-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <span className="bg-white text-black text-[10px] font-black uppercase tracking-[0.1em] px-4 py-2 rounded-sm flex items-center gap-2 shadow-lg transform transition-transform duration-200 hover:scale-105">
              <RiZoomInLine size={12} /> Quick View
            </span>
          </button>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-xs font-black text-black truncate tracking-tight mb-0.5">{product.name}</h3>
        {product.brand && (
          <p className="text-[8px] font-black uppercase tracking-[0.12em] text-gray-400 mb-1">{product.brand}</p>
        )}

        <div className="flex items-center gap-1 mb-1.5">
          <div className="flex">
            {[1,2,3,4,5].map(i => (
              <RiStarFill key={i} size={9} className={i <= avgRating ? 'text-orange-500' : 'text-gray-200'} />
            ))}
          </div>
          {reviewCount > 0 && <span className="text-[8px] font-black text-gray-400">({reviewCount})</span>}
        </div>

        <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed mb-2">{product.description}</p>

        <div className="flex items-center justify-between mt-1">
          <div>
            {hasDiscount ? (
              <div className="flex flex-col items-start">
                <span className="text-base font-black text-black tracking-tight">
                  KSh {Math.round(discountedPrice).toLocaleString()}
                </span>
                <span className="text-[9px] text-gray-400 line-through">
                  KSh {product.price.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-base font-black text-black tracking-tight">
                KSh {product.price.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              disabled={product.stock === 0}
              className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.08em] px-2 py-1.5 rounded-sm transition-colors active:scale-95 ${
                product.stock === 0
                  ? 'bg-gray-300 text-white cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              <RiAddLine size={10} /> Add
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
              className={`w-7 h-7 rounded-sm border flex items-center justify-center transition-all
                          ${isWishlisted ? 'bg-black border-black text-white' : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'}`}
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