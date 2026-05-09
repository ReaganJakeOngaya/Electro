// src/Components/common/RecentlyViewed.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from './constants';
import ProductCard from './ProductCard';

const RecentlyViewed = ({ onAddToCart, onToggleWishlist, wishlist, onProductClick }) => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      const recentIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      if (recentIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const productPromises = recentIds.map(id => axios.get(`${API}/products/${id}`));
        const responses = await Promise.all(productPromises);
        const products = responses.map(res => res.data);
        setRecentProducts(products);
      } catch (err) {
        console.error('Failed to fetch recently viewed products', err);
        // On error, clear invalid IDs from localStorage to prevent repeated failures
        localStorage.removeItem('recentlyViewed');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyViewed();
  }, []);

  if (loading) return null; // or a small spinner if you prefer
  if (recentProducts.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-lg font-black tracking-tight mb-4">Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recentProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            isWishlisted={wishlist.includes(product.id)}
            onPreview={onProductClick}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;