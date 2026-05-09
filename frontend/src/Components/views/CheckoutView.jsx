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
  const shipping = subtotal - discountTotal > 5000 ? 0 : 250;
  const finalTotal = subtotal - discountTotal - couponDiscount + shipping;

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
      shipping,
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
  if (cart.length === 0) return <div className="text-center py-20"><p className="text-black font-bold">Your cart is empty.</p><button onClick={onBack} className="mt-4 text-sm underline">← Back to shopping</button></div>;
  if (loadingProfile) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4"><button onClick={onBack} className="text-black text-sm font-bold flex items-center gap-1">← Back to cart</button><h1 className="text-2xl font-black tracking-tighter">Checkout</h1></div>
        <button onClick={handleRefreshProfile} className="text-xs text-zinc-500 hover:text-black flex items-center gap-1"><RiRefreshLine size={14} /> Refresh</button>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Order Summary */}
        <div className="lg:w-1/3 order-2 lg:order-1">
          <div className="bg-zinc-50 rounded-2xl p-5 sticky top-24">
            <h2 className="font-black mb-4">Order summary</h2>
            {cart.map(item => {
              const hasDiscount = item.discount > 0;
              const itemTotal = item.price * item.qty;
              const origTotal = (item.originalPrice || item.price) * item.qty;
              return (
                <div key={item.id} className="flex gap-3 text-sm mb-3">
                  <div className="w-12 h-12 bg-zinc-200 rounded-lg overflow-hidden flex-shrink-0">{item.images?.[0] && <img src={`${API}/uploads/${item.images[0]}`} className="w-full h-full object-cover" />}</div>
                  <div className="flex-1"><p className="font-bold">{item.name}</p><p className="text-zinc-500 text-xs">Qty: {item.qty}</p>{hasDiscount && <p className="text-[10px] text-zinc-400">Was KSh {origTotal.toLocaleString()}</p>}</div>
                  <div className="text-right"><span className="font-black">KSh {itemTotal.toLocaleString()}</span>{hasDiscount && <p className="text-[10px] text-zinc-400 line-through">KSh {origTotal.toLocaleString()}</p>}</div>
                </div>
              );
            })}
            <div className="border-t pt-3 space-y-1">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>KSh {(subtotal - discountTotal).toLocaleString()}</span></div>
              {discountTotal > 0 && <div className="flex justify-between text-sm text-green-600"><span>Product discount</span><span>- KSh {discountTotal.toLocaleString()}</span></div>}
              {couponDiscount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Coupon discount</span><span>- KSh {couponDiscount.toLocaleString()}</span></div>}
              <div className="flex justify-between text-sm"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `KSh ${shipping.toLocaleString()}`}</span></div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total</span><span>KSh {finalTotal.toLocaleString()}</span></div>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="lg:w-2/3 order-1 lg:order-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border">
              <h2 className="font-black mb-4">Contact information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="form-label">First name</label><input name="firstName" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required className="form-input" /></div>
                <div><label className="form-label">Last name</label><input name="lastName" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required className="form-input" /></div>
                <div className="sm:col-span-2"><label className="form-label">Email</label><input type="email" name="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="form-input" /></div>
                <div className="sm:col-span-2"><label className="form-label">Phone number</label><input name="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required placeholder="0712 345 678" className="form-input" /></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border">
              <h2 className="font-black mb-4">Shipping address</h2>
              <div className="space-y-4">
                <div><label className="form-label">Street address</label><input name="address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required className="form-input" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label>City</label><input name="city" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required className="form-input" /></div><div><label>Postal code</label><input name="postalCode" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} className="form-input" /></div></div>
                <div><label>Country</label><input name="country" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} required className="form-input" /></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border">
              <h2 className="font-black mb-4">Coupon code</h2>
              <div className="flex gap-2"><input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Enter coupon code" className="form-input flex-1" /><button type="button" onClick={applyCoupon} className="bg-black text-white px-4 rounded-xl">Apply</button></div>
              {couponMessage && <p className="text-sm mt-2 text-green-600">{couponMessage}</p>}
            </div>

            <div className="bg-white rounded-2xl p-6 border">
              <h2 className="font-black mb-4">Payment method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-zinc-50"><input type="radio" name="paymentMethod" value="mpesa" checked={formData.paymentMethod === 'mpesa'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} /><span className="font-semibold">M-Pesa</span></label>
                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-zinc-50"><input type="radio" name="paymentMethod" value="cash_on_delivery" checked={formData.paymentMethod === 'cash_on_delivery'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} /><span className="font-semibold">Cash on delivery</span></label>
                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-zinc-50"><input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} /><span className="font-semibold">Credit / Debit card</span></label>
              </div>
              {formData.paymentMethod === 'mpesa' && <p className="text-xs text-zinc-500 mt-3">You will receive an STK push to complete payment.</p>}
            </div>

            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onBack} className="btn-secondary">Cancel</button><button type="submit" disabled={loading} className="btn-primary">{loading ? 'Processing...' : `Place order • KSh ${finalTotal.toLocaleString()}`}</button></div>
            <p className="text-xs text-zinc-400 text-center mt-6">* If address/phone missing, <button type="button" onClick={handleRefreshProfile} className="underline">refresh</button> or update your account profile.</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;