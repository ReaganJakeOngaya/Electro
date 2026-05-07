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
  const basicUser = getUser();              // minimal user from localStorage after login
  const [userState, setUserState] = useState(basicUser);
  const hasFetchedProfile = useRef(false);   // prevent multiple initial fetches

  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [activeNav, setActiveNav]         = useState('home');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart]                   = useState(() => {
    try { return JSON.parse(localStorage.getItem('dy_cart')) || []; } catch { return []; }
  });
  const [wishlist, setWishlist]           = useState(() => {
    try { return JSON.parse(localStorage.getItem('dy_wishlist')) || []; } catch { return []; }
  });
  const [cartOpen, setCartOpen]           = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen]   = useState(false);
  const [checkoutActive, setCheckoutActive] = useState(false);

  /* Persist cart/wishlist */
  useEffect(() => { localStorage.setItem('dy_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('dy_wishlist', JSON.stringify(wishlist)); }, [wishlist]);

  /* Auth guard */
  useEffect(() => {
    if (!basicUser || !getToken()) navigate('/auth');
  }, [basicUser, navigate]);

  /* Fetch all products */
  useEffect(() => {
    axios.get(`${API}/products`)
      .then((r) => setProducts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* 🟢 Fetch full user profile exactly once on mount */
  useEffect(() => {
    if (hasFetchedProfile.current) return;
    hasFetchedProfile.current = true;

    const token = getToken();
    const userId = basicUser?.id;
    if (!token || !userId) return;

    axios.get(`${API}/user?user_id=${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const fullUser = res.data;
        setUserState(fullUser);
        localStorage.setItem('user', JSON.stringify(fullUser));
      })
      .catch(err => {
        console.error('Failed to fetch full user profile', err);
        setUserState(basicUser);
      });
  }, [basicUser]); // runs once because basicUser is stable

  /* 🟢 Manual refresh – call this after profile updates (avatar, address, etc.) */
  const refreshUser = useCallback(async () => {
    const token = getToken();
    const userId = basicUser?.id;
    if (!token || !userId) return;

    try {
      const res = await axios.get(`${API}/user?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const fullUser = res.data;
      setUserState(fullUser);
      localStorage.setItem('user', JSON.stringify(fullUser));
    } catch (err) {
      console.error('Failed to refresh user profile', err);
    }
  }, [basicUser]);

  /* Cart & discount logic */
  const handleAddToCart = useCallback((product) => {
    let finalPrice = product.price;
    if (product.discount && product.discount > 0) {
      finalPrice = product.price * (1 - product.discount / 100);
    }
    const cartItem = {
      ...product,
      originalPrice: product.price,
      price: finalPrice,
      discount: product.discount || 0,
      qty: 1,
    };
    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, cartItem];
    });
  }, []);

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutActive(true);
  };

  const handleOrderSuccess = () => {
    setCart([]);
    setCheckoutActive(false);
    setActiveNav('home');
  };

  const handleUpdateQty = useCallback((id, qty) => {
    if (qty < 1) { handleRemoveFromCart(id); return; }
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
  }, []);

  const handleRemoveFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const handleToggleWishlist = useCallback((id) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  /* Views */
  const renderView = () => {
    if (loading) return (
      <div className="flex items-center justify-center py-40">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.15em]">Loading products</p>
        </div>
      </div>
    );

    if (checkoutActive) {
      return (
        <CheckoutView
          cart={cart}
          onClearCart={handleOrderSuccess}
          onBack={() => setCheckoutActive(false)}
        />
      );
    }

    switch (activeNav) {
      case 'home':
        return <HomeView user={userState} products={products} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlist={wishlist} onNavChange={setActiveNav} onCategoryChange={setActiveCategory} />;
      case 'products':
        return <ProductsView products={products} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlist={wishlist} onProductClick={setSelectedProduct} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />;
      case 'wishlist':
        return <WishlistView products={products} wishlist={wishlist} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} />;
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
        {/* Desktop sidebar */}
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

        {/* Main content */}
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