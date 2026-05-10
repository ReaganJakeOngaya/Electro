// src/Components/views/CheckoutView.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API } from '../common/constants';
import { getUser, getToken } from '../common/utils/auth';
import { RiRefreshLine } from 'react-icons/ri';

const CheckoutView = ({ cart, onClearCart, onBack }) => {
  const navigate = useNavigate();
  const user = getUser();
  const subtotal = cart.reduce((sum, item) => sum + (item.originalPrice || item.price) * item.qty, 0);
  const discountTotal = cart.reduce((sum, item) => sum + ((item.originalPrice || item.price) - item.price) * item.qty, 0);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const shippingCost = subtotal - discountTotal > 5000 ? 0 : 250;
  const finalTotal = subtotal - discountTotal - couponDiscount + shippingCost;

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', postalCode: '', country: 'Kenya', paymentMethod: 'mpesa',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    if (!user?.id) {
      setFormData(prev => ({ ...prev, firstName: user?.first_name || '', lastName: user?.last_name || '', email: user?.email || '' }));
      setLoadingProfile(false);
      return;
    }
    try {
      const res = await axios.get(`${API}/user?user_id=${user.id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const profile = res.data;
      setFormData({
        firstName: profile.first_name || '', lastName: profile.last_name || '', email: profile.email || '',
        phone: profile.phone || '', address: profile.address || '', city: profile.city || '',
        postalCode: profile.postal_code || '', country: profile.country || 'Kenya', paymentMethod: 'mpesa',
      });
    } catch (err) {
      console.error(err);
      setFormData({ firstName: user?.first_name || '', lastName: user?.last_name || '', email: user?.email || '', phone: '', address: '', city: '', postalCode: '', country: 'Kenya', paymentMethod: 'mpesa' });
    } finally { setLoadingProfile(false); }
  }, [user]);

  useEffect(() => { fetchUserProfile(); }, [fetchUserProfile]);

  const applyCoupon = async () => {
    try {
      const res = await axios.post(`${API}/validate-coupon`, { code: couponCode, subtotal: subtotal - discountTotal });
      if (res.data.valid) {
        setCouponDiscount(res.data.discount);
        setAppliedCoupon(res.data.code);
        setCouponMessage(`Coupon applied! You saved KSh ${res.data.discount.toLocaleString()}`);
      }
    } catch (err) {
      setCouponMessage(err.response?.data?.message || 'Invalid coupon');
      setCouponDiscount(0);
      setAppliedCoupon(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const orderData = {
      user_id: user?.id || null,
      customer: {
        firstName: formData.firstName, lastName: formData.lastName, email: formData.email, phone: formData.phone,
      },
      shipping: {
        address: formData.address, city: formData.city, postalCode: formData.postalCode, country: formData.country,
      },
      paymentMethod: formData.paymentMethod,
      items: cart.map(item => ({
        product_id: item.id, name: item.name, price: item.price, originalPrice: item.originalPrice || item.price,
        discount: item.discount || 0, quantity: item.qty, image: item.images?.[0] || null,
      })),
      subtotal: subtotal - discountTotal,
      discountTotal: discountTotal,
      coupon_code: appliedCoupon,
      coupon_discount: couponDiscount,
      shippingCost: shippingCost,
      total: finalTotal,
    };
    try {
      await axios.post(`${API}/orders`, orderData, { headers: { Authorization: user?.id ? `Bearer ${getToken()}` : {} } });
      onClearCart();
      alert('Order placed! Confirmation sent to your email.');
      navigate('/user-dashboard');
    } catch (err) { setError(err.response?.data?.message || 'Failed to place order'); }
    finally { setLoading(false); }
  };

  const handleRefreshProfile = () => { setLoadingProfile(true); fetchUserProfile(); };
  if (cart.length === 0) return <div className="text-center py-20"><p className="text-black font-black">Your cart is empty.</p><button onClick={onBack} className="mt-4 text-xs font-black uppercase tracking-[0.08em] text-black underline">← Back to shopping</button></div>;
  if (loadingProfile) return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header with editorial style */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-[10px] font-black uppercase tracking-[0.08em] text-gray-500 hover:text-black flex items-center gap-1"
          >
            ← Back to cart
          </button>
          <h1 className="text-2xl font-black tracking-tight text-black">Checkout</h1>
        </div>
        <button
          onClick={handleRefreshProfile}
          className="text-[10px] font-black uppercase tracking-[0.08em] text-gray-500 hover:text-black flex items-center gap-1"
        >
          <RiRefreshLine size={14} /> Refresh
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Order Summary – side panel */}
        <div className="lg:w-2/5 order-2 lg:order-1">
          <div className="bg-gray-50 border border-gray-100 p-6 rounded-sm sticky top-24">
            <h2 className="text-sm font-black uppercase tracking-[0.12em] text-black mb-5">Order summary</h2>
            <div className="space-y-4 mb-5">
              {cart.map(item => {
                const hasDiscount = item.discount > 0;
                const itemTotal = item.price * item.qty;
                const origTotal = (item.originalPrice || item.price) * item.qty;
                return (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="w-12 h-12 rounded-sm bg-white border border-gray-100 overflow-hidden flex-shrink-0">
                      {item.images?.[0] && <img src={`${API}/uploads/${item.images[0]}`} className="w-full h-full object-cover" alt="" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black text-black">{item.name}</p>
                      <p className="text-[9px] font-black uppercase tracking-[0.08em] text-gray-400">Qty: {item.qty}</p>
                      {hasDiscount && <p className="text-[9px] font-black text-orange-500">-{item.discount}%</p>}
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-black">KSh {itemTotal.toLocaleString()}</span>
                      {hasDiscount && <p className="text-[9px] text-gray-400 line-through">KSh {origTotal.toLocaleString()}</p>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-black">KSh {(subtotal - discountTotal).toLocaleString()}</span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-xs text-orange-500">
                  <span>Product discount</span>
                  <span>- KSh {discountTotal.toLocaleString()}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-xs text-orange-500">
                  <span>Coupon discount</span>
                  <span>- KSh {couponDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium text-black">{shippingCost === 0 ? 'Free' : `KSh ${shippingCost.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between font-black text-base pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>KSh {finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="lg:w-3/5 order-1 lg:order-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact information */}
            <div className="bg-white border border-gray-100 p-6 rounded-sm">
              <h2 className="text-xs font-black uppercase tracking-[0.12em] text-black mb-5">Contact information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 mb-1">First name</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 mb-1">Last name</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 mb-1">Phone number</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    required
                    placeholder="0712 345 678"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-white border border-gray-100 p-6 rounded-sm">
              <h2 className="text-xs font-black uppercase tracking-[0.12em] text-black mb-5">Shipping address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 mb-1">Street address</label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 mb-1">City</label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 mb-1">Postal code</label>
                    <input
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={e => setFormData({...formData, postalCode: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 mb-1">Country</label>
                  <input
                    name="country"
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-white border border-gray-100 p-6 rounded-sm">
              <h2 className="text-xs font-black uppercase tracking-[0.12em] text-black mb-4">Coupon code</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="bg-black text-white text-[10px] font-black uppercase tracking-[0.08em] px-4 py-2 rounded-sm hover:bg-gray-800 transition"
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <p className={`text-xs font-bold mt-2 ${couponMessage.includes('Invalid') ? 'text-red-500' : 'text-orange-500'}`}>
                  {couponMessage}
                </p>
              )}
            </div>

            {/* Payment method */}
            <div className="bg-white border border-gray-100 p-6 rounded-sm">
              <h2 className="text-xs font-black uppercase tracking-[0.12em] text-black mb-4">Payment method</h2>
              <div className="space-y-2">
                {[
                  { value: 'mpesa', label: 'M-Pesa' },
                  { value: 'cash_on_delivery', label: 'Cash on delivery' },
                  { value: 'card', label: 'Credit / Debit card' },
                ].map(option => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-3 border rounded-sm cursor-pointer transition-all ${
                      formData.paymentMethod === option.value
                        ? 'border-black bg-gray-50'
                        : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={formData.paymentMethod === option.value}
                      onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                      className="accent-black"
                    />
                    <span className="text-xs font-black uppercase tracking-[0.08em] text-black">{option.label}</span>
                  </label>
                ))}
              </div>
              {formData.paymentMethod === 'mpesa' && (
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-500 mt-3">
                  You will receive an STK push to complete payment.
                </p>
              )}
            </div>

            {error && (
              <div className="text-red-500 text-xs font-black uppercase tracking-[0.08em] text-center">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="px-5 py-2.5 rounded-sm border border-gray-200 text-[10px] font-black uppercase tracking-[0.08em] text-gray-500 hover:text-black hover:border-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-black text-white text-[10px] font-black uppercase tracking-[0.08em] rounded-sm hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Place order • KSh ${finalTotal.toLocaleString()}`}
              </button>
            </div>

            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-gray-400 text-center mt-6">
              * If address/phone missing,{' '}
              <button type="button" onClick={handleRefreshProfile} className="underline text-black">
                refresh
              </button>{' '}
              or update your account profile.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;