// src/Components/common/ProductModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiCloseLine, RiHeartLine, RiHeartFill, RiShoppingBagLine, RiStarFill, RiStarLine } from 'react-icons/ri';
import { API } from './constants';
import { getToken } from './utils/auth';

const ProductModal = ({ product, onClose, onAddToCart, onToggleWishlist, isWishlisted }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(null);
  const images = product?.images || [];

  useEffect(() => {
    if (product) {
      setImgError(false);
      setImgIdx(0);
      fetchReviews();
    }
  }, [product]);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await axios.get(`${API}/products/${product.id}/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      alert('Please login to leave a review');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/products/${product.id}/reviews`, reviewForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviewSuccess('Review added successfully!');
      setReviewForm({ rating: 5, title: '', comment: '' });
      fetchReviews();
      setTimeout(() => setReviewSuccess(null), 3000);
    } catch (err) {
      alert('Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (product) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  if (!product) return null;

  const avgRating = product.avg_rating || 0;
  const reviewCount = product.reviews_count || 0;
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;
  const currentImage = images[imgIdx];
  const imageUrl = currentImage ? `${API}/uploads/${currentImage}` : null;
  const isLowStock = product.stock > 0 && product.stock <= (product.low_stock_threshold || 5);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl rounded-sm">
          {/* Header - editorial sharp */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-black tracking-tight text-black">{product.name}</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-sm border border-gray-200 flex items-center justify-center hover:border-black transition-colors">
              <RiCloseLine size={16} />
            </button>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="md:w-1/2 bg-gray-50 overflow-hidden flex items-center justify-center min-h-[300px] p-4">
                {imageUrl && !imgError ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-auto max-h-[400px] object-contain"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full min-h-[250px] flex items-center justify-center">
                    <RiShoppingBagLine className="text-6xl text-gray-200" />
                  </div>
                )}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { setImgIdx(i); setImgError(false); }}
                        className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? 'bg-black w-4' : 'bg-black/30'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="md:w-1/2 space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.12em] text-gray-400">{product.category}</span>
                  {product.brand && <span className="ml-2 text-[10px] text-gray-400">| {product.brand}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <RiStarFill key={i} size={14} className={i <= avgRating ? 'text-orange-500' : 'text-gray-200'} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({reviewCount} review{reviewCount !== 1 ? 's' : ''})</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                <div className="pt-4 border-t border-gray-100">
                  {hasDiscount ? (
                    <div>
                      <span className="text-3xl font-black text-black">KSh {Math.round(discountedPrice).toLocaleString()}</span>
                      <span className="text-sm text-gray-400 line-through ml-2">KSh {product.price.toLocaleString()}</span>
                      <span className="ml-2 text-orange-500 font-black text-sm">-{product.discount}%</span>
                    </div>
                  ) : (
                    <span className="text-3xl font-black text-black">KSh {product.price.toLocaleString()}</span>
                  )}
                </div>
                <div className="mt-2">
                  {product.stock === 0 ? (
                    <span className="text-red-600 font-black text-xs uppercase tracking-wide">Out of stock</span>
                  ) : isLowStock ? (
                    <span className="text-orange-500 font-black text-xs uppercase tracking-wide">Low stock – only {product.stock} left</span>
                  ) : (
                    <span className="text-green-600 font-black text-xs uppercase tracking-wide">In stock ({product.stock})</span>
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { onAddToCart(product); onClose(); }}
                    disabled={product.stock === 0}
                    className={`flex-1 py-3 rounded-sm font-black text-xs uppercase tracking-[0.1em] transition-colors ${
                      product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {product.stock === 0 ? 'Out of stock' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => onToggleWishlist(product.id)}
                    className="w-12 h-12 rounded-sm border border-gray-200 flex items-center justify-center hover:border-black transition-colors"
                  >
                    {isWishlisted ? <RiHeartFill size={18} className="text-black" /> : <RiHeartLine size={18} className="text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Reviews section */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-base font-black tracking-tight text-black mb-4">Customer Reviews</h3>
              <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-4 border border-gray-100 rounded-sm mb-6">
                <div className="mb-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-gray-500 mb-1">Your rating</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(star => (
                      <button type="button" key={star} onClick={() => setReviewForm({...reviewForm, rating: star})}>
                        {star <= reviewForm.rating ? <RiStarFill size={16} className="text-orange-500" /> : <RiStarLine size={16} className="text-gray-300" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-gray-500 mb-1">Title (optional)</label>
                  <input
                    type="text"
                    value={reviewForm.title}
                    onChange={e => setReviewForm({...reviewForm, title: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-gray-500 mb-1">Comment</label>
                  <textarea
                    rows="3"
                    value={reviewForm.comment}
                    onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-black"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-black text-white text-[10px] font-black uppercase tracking-[0.1em] px-4 py-2 rounded-sm hover:bg-gray-800 transition"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                {reviewSuccess && <p className="text-green-600 text-xs font-bold mt-2">{reviewSuccess}</p>}
              </form>

              {loadingReviews ? (
                <div className="flex justify-center py-4"><div className="w-4 h-4 border border-black border-t-transparent rounded-full animate-spin" /></div>
              ) : (
                <div className="space-y-4">
                  {reviews.length === 0 && <p className="text-center text-gray-400 text-xs">No reviews yet. Be the first to review!</p>}
                  {reviews.map(rev => (
                    <div key={rev.id} className="border-b border-gray-100 pb-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-black">{rev.user_name}</span>
                        <span className="text-[9px] text-gray-400">{new Date(rev.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-0.5 my-1">
                        {[...Array(5)].map((_,i) => <RiStarFill key={i} size={10} className={i < rev.rating ? 'text-orange-500' : 'text-gray-200'} />)}
                      </div>
                      {rev.title && <p className="text-xs font-bold text-black mt-1">{rev.title}</p>}
                      <p className="text-xs text-gray-600 mt-0.5">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;