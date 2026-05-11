import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../Components/common/constants';
import { getUser, getToken } from '../Components/common/utils/auth';
import Sidebar from '../Components/layouts/Sidebar';
import MobileNav from '../Components/layouts/MobileNav';
import CartDrawer from '../Components/common/CartDrawer';
import ProductModal from '../Components/common/ProductModal';
import HomeView from '../Components/views/HomeView';
import ProductsView from '../Components/views/ProductsView';
import WishlistView from '../Components/views/WishlistView';
import AccountView from '../Components/views/AccountView';
import CheckoutView from '../Components/views/CheckoutView';
import OrderHistoryView from '../Components/views/OrderHistoryView';
import DealsView from '../Components/views/DealsView';

const UserDashboard = () => {
  const navigate = useNavigate();
  const basicUser = getUser();
  const [userState, setUserState] = useState(basicUser);
  const hasFetchedProfile = useRef(false);

  const [allProducts, setAllProducts]       = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeNav, setActiveNav]           = useState('home');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dy_cart')) || []; } catch { return []; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dy_wishlist')) || []; } catch { return []; }
  });
  const [cartOpen, setCartOpen]           = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen]   = useState(false);
  const [checkoutActive, setCheckoutActive]   = useState(false);

  // persist cart / wishlist
  useEffect(() => { localStorage.setItem('dy_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('dy_wishlist', JSON.stringify(wishlist)); }, [wishlist]);

  // auth guard
  useEffect(() => {
    if (!basicUser || !getToken()) navigate('/auth');
  }, [basicUser, navigate]);

  // fetch all products
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/products?page=1&per_page=100`);
        setAllProducts(res.data.products);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoadingProducts(false);
      }
    })();
  }, []);

  // fetch full user profile once
  useEffect(() => {
    if (hasFetchedProfile.current) return;
    hasFetchedProfile.current = true;
    const token  = getToken();
    const userId = basicUser?.id;
    if (!token || !userId) return;
    axios.get(`${API}/user?user_id=${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { setUserState(res.data); localStorage.setItem('user', JSON.stringify(res.data)); })
      .catch(() => setUserState(basicUser));
  }, [basicUser]);

  const refreshUser = useCallback(async () => {
    const token  = getToken();
    const userId = basicUser?.id;
    if (!token || !userId) return;
    try {
      const res = await axios.get(`${API}/user?user_id=${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      setUserState(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      console.error('Failed to refresh user', err);
    }
  }, [basicUser]);

  // cart handlers
  const handleAddToCart = useCallback((product) => {
    const finalPrice = product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price;
    const cartItem = { ...product, originalPrice: product.price, price: finalPrice, discount: product.discount || 0, qty: 1 };
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, cartItem];
    });
  }, []);

  const handleCheckout    = () => { setCartOpen(false); setCheckoutActive(true); };
  const handleOrderSuccess = () => { setCart([]); setCheckoutActive(false); setActiveNav('home'); };

  const handleUpdateQty = useCallback((id, qty) => {
    if (qty < 1) { handleRemoveFromCart(id); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }, []);

  const handleRemoveFromCart   = useCallback((id) => setCart(prev => prev.filter(i => i.id !== id)), []);
  const handleToggleWishlist   = useCallback((id) => setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]), []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const renderView = () => {
    if (loadingProducts) {
      return (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          {/* Orange spinner */}
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-2 border-zinc-200" />
            <div className="absolute inset-0 rounded-full border-2 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            Loading products…
          </p>
        </div>
      );
    }
    if (checkoutActive) {
      return <CheckoutView cart={cart} onClearCart={handleOrderSuccess} onBack={() => setCheckoutActive(false)} />;
    }
    switch (activeNav) {
      case 'home':
        return <HomeView user={userState} products={allProducts} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlist={wishlist} onNavChange={setActiveNav} onCategoryChange={setActiveCategory} onProductClick={setSelectedProduct} />;
      case 'products':
        return <ProductsView onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlist={wishlist} onProductClick={setSelectedProduct} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />;
      case 'wishlist':
        return <WishlistView products={allProducts} wishlist={wishlist} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} />;
      case 'account':
        return <AccountView user={userState} onLogout={handleLogout} onUserUpdate={refreshUser} />;
      case 'orders':
        return <OrderHistoryView />;
      case 'deals':
        return <DealsView onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlist={wishlist} onProductClick={setSelectedProduct} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <div className="flex">
        <Sidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          activeNav={activeNav}
          onNavChange={setActiveNav}
          user={userState}
          cartCount={cartCount}
          onCartOpen={() => setCartOpen(true)}
          onLogout={handleLogout}
        />

        <div className="flex-1 min-w-0">
          <MobileNav
            activeNav={activeNav}
            onNavChange={setActiveNav}
            cartCount={cartCount}
            onCartOpen={() => setCartOpen(true)}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            user={userState}
            onLogout={handleLogout}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <main className="px-4 lg:px-8 py-6 pb-24 lg:pb-8">
            {renderView()}
          </main>
        </div>
      </div>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
        allProducts={allProducts}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
      />
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
      />
    </div>
  );
};

export default UserDashboard;