// src/components/common/ProductModal.jsx
import React, { useState, useEffect } from 'react';
import { RiCloseLine, RiHeartLine, RiHeartFill, RiShoppingBagLine, RiStarFill } from 'react-icons/ri';
import { API } from './constants';

const ProductModal = ({ product, onClose, onAddToCart, onToggleWishlist, isWishlisted }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const images = product?.images || [];

  useEffect(() => {
    if (product) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  if (!product) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto pointer-events-auto"
          style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.06)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col md:flex-row">
            {/* Image section - fixed height and containment */}
            <div className="md:w-1/2 bg-zinc-50 rounded-tl-3xl rounded-tr-3xl md:rounded-tr-none md:rounded-bl-3xl relative overflow-hidden flex items-center justify-center p-4 min-h-[300px]">
              {images.length > 0 ? (
                <img
                  src={`${API}/uploads/${images[imgIdx]}`}
                  alt={product.name}
                  className="w-full h-auto max-h-[400px] object-contain"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center min-h-[240px]">
                  <RiShoppingBagLine className="text-6xl text-zinc-200" />
                </div>
              )}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? 'bg-black w-4' : 'bg-black/30'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Details section */}
            <div className="md:w-1/2 p-7 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 border border-zinc-200 px-2.5 py-1 rounded-full">
                  {product.category}
                </span>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl border border-zinc-200 flex items-center justify-center
                             text-zinc-400 hover:text-black hover:border-zinc-400 transition-all"
                >
                  <RiCloseLine size={15} />
                </button>
              </div>

              <h2 className="text-2xl font-black tracking-tighter text-black mb-2">{product.name}</h2>
              {product.brand && (
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">{product.brand}</p>
              )}

              {product.color && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-zinc-400 font-medium">Color:</span>
                  <span className="text-xs font-bold text-black capitalize">{product.color}</span>
                </div>
              )}

              <p className="text-sm text-zinc-500 leading-relaxed mb-5 flex-1">{product.description}</p>

              {product.manufacture_date && (
                <p className="text-xs text-zinc-300 mb-5 font-medium">
                  Manufactured: {product.manufacture_date}
                </p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-1.5 mb-5">
                {[1,2,3,4,5].map(i => (
                  <RiStarFill key={i} className={i <= 4 ? 'text-black text-xs' : 'text-zinc-200 text-xs'} />
                ))}
                <span className="text-xs text-zinc-400 font-medium ml-1">4.0 · 24 reviews</span>
              </div>

              {/* Price and wishlist */}
              <div className="flex items-center justify-between mb-6">
                {product.discount && product.discount > 0 ? (
                  <div>
                    <span className="text-3xl font-black text-black tracking-tighter">
                      KSh {Math.round(product.price * (1 - product.discount / 100)).toLocaleString()}
                    </span>
                    <span className="text-sm text-zinc-400 line-through ml-2">
                      KSh {product.price.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-red-600 ml-2">-{product.discount}%</span>
                  </div>
                ) : (
                  <span className="text-3xl font-black text-black tracking-tighter">
                    KSh {product.price.toLocaleString()}
                  </span>
                )}
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all
                              ${isWishlisted ? 'bg-black border-black text-white' : 'border-zinc-200 text-zinc-400 hover:border-black hover:text-black'}`}
                >
                  {isWishlisted ? <RiHeartFill size={15} /> : <RiHeartLine size={15} />}
                </button>
              </div>

              <button
                onClick={() => { onAddToCart(product); onClose(); }}
                className="w-full bg-black text-white font-bold py-3.5 rounded-xl text-sm
                           hover:bg-zinc-800 transition-colors active:scale-[0.99]"
                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}
              >
                Add to Cart →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;