// src/Components/views/WishlistView.jsx
import React from 'react';
import { RiHeartLine } from 'react-icons/ri';
import ProductCard from '../common/ProductCard';

const WishlistView = ({ products, wishlist, onAddToCart, onToggleWishlist, onProductClick }) => {
  const wishlisted = products.filter((p) => wishlist.includes(p.id));
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Saved items</p>
        <h2 className="text-2xl font-black tracking-tight text-black">Wishlist</h2>
      </div>
      {wishlisted.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {wishlisted.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={true}
              onPreview={onProductClick}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 bg-gray-50 border border-gray-100 flex items-center justify-center rounded-sm">
            <RiHeartLine className="text-2xl text-gray-300" />
          </div>
          <div>
            <p className="text-sm font-black text-black">Nothing saved yet</p>
            <p className="text-xs text-gray-400 mt-1">Tap the heart on any product to save it here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistView;