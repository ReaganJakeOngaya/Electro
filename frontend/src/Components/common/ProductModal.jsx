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

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl">
          <div className="sticky top-0 bg-white border-b border-zinc-100 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-black tracking-tight">{product.name}</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center">
              <RiCloseLine size={16} />
            </button>
          </div>

          <div className="p-6">
            {/* Product images & details */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="md:w-1/2 bg-zinc-50 rounded-xl overflow-hidden flex items-center justify-center min-h-[300px]">
                {imageUrl && !imgError ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-auto max-h-[400px] object-contain"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full min-h-[250px] flex items-center justify-center">
                    <RiShoppingBagLine className="text-6xl text-zinc-200" />
                  </div>
                )}
                {images.length > 1 && (
                  <div className="flex gap-2 p-2 justify-center">
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
                  <span className="text-xs font-bold uppercase text-zinc-400">{product.category}</span>
                  {product.brand && <span className="ml-2 text-xs text-zinc-400">| {product.brand}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <RiStarFill key={i} size={16} className={i <= avgRating ? 'text-yellow-500' : 'text-zinc-200'} />
                    ))}
                  </div>
                  <span className="text-sm text-zinc-500">({reviewCount} review{reviewCount !== 1 ? 's' : ''})</span>
                </div>
                <p className="text-zinc-600">{product.description}</p>
                <div className="pt-4 border-t">
                  {hasDiscount ? (
                    <div>
                      <span className="text-3xl font-black">KSh {Math.round(discountedPrice).toLocaleString()}</span>
                      <span className="text-sm text-zinc-400 line-through ml-2">KSh {product.price.toLocaleString()}</span>
                      <span className="ml-2 text-red-600 font-bold">-{product.discount}%</span>
                    </div>
                  ) : (
                    <span className="text-3xl font-black">KSh {product.price.toLocaleString()}</span>
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { onAddToCart(product); onClose(); }} className="flex-1 bg-black text-white py-3 rounded-xl font-bold hover:bg-zinc-800">
                    Add to Cart
                  </button>
                  <button onClick={() => onToggleWishlist(product.id)} className="w-12 h-12 rounded-xl border flex items-center justify-center hover:border-black">
                    {isWishlisted ? <RiHeartFill size={20} className="text-black" /> : <RiHeartLine size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Reviews section (unchanged – same as earlier) */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-black mb-4">Customer Reviews</h3>
              <form onSubmit={handleReviewSubmit} className="bg-zinc-50 p-4 rounded-xl mb-6">
                <div className="mb-3">
                  <label className="block text-sm font-bold mb-1">Your rating</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(star => (
                      <button type="button" key={star} onClick={() => setReviewForm({...reviewForm, rating: star})}>
                        {star <= reviewForm.rating ? <RiStarFill size={20} className="text-yellow-500" /> : <RiStarLine size={20} className="text-zinc-300" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-bold mb-1">Title (optional)</label>
                  <input type="text" value={reviewForm.title} onChange={e => setReviewForm({...reviewForm, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-bold mb-1">Comment</label>
                  <textarea rows="3" value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <button type="submit" disabled={submitting} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                {reviewSuccess && <p className="text-green-600 text-sm mt-2">{reviewSuccess}</p>}
              </form>

              {loadingReviews ? <p>Loading reviews...</p> : (
                <div className="space-y-4">
                  {reviews.length === 0 && <p className="text-center text-zinc-400">No reviews yet. Be the first to review!</p>}
                  {reviews.map(rev => (
                    <div key={rev.id} className="border-b pb-3">
                      <div className="flex justify-between"><span className="font-bold">{rev.user_name}</span><span className="text-xs text-zinc-400">{new Date(rev.created_at).toLocaleDateString()}</span></div>
                      <div className="flex gap-0.5 my-1">{[...Array(5)].map((_,i) => <RiStarFill key={i} size={12} className={i < rev.rating ? 'text-yellow-500' : 'text-zinc-200'} />)}</div>
                      {rev.title && <p className="font-semibold text-sm">{rev.title}</p>}
                      <p className="text-sm text-zinc-600">{rev.comment}</p>
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