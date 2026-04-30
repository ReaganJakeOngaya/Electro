import React, { useState, useEffect, useCallback } from 'react';
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
  const user     = getUser();

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
    if (!user || !getToken()) navigate('/auth');
  }, [user, navigate]);

  /* Fetch products */
  useEffect(() => {
    axios.get(`${API}/products`)
      .then((r) => setProducts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

const handleAddToCart = useCallback((product) => {
  // Calculate discounted price if product has discount
  let finalPrice = product.price;
  if (product.discount && product.discount > 0) {
    finalPrice = product.price * (1 - product.discount / 100);
  }
  // Create cart item with original price and discount for display
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
    setCart([]);          // clear cart
    setCheckoutActive(false);
    setActiveNav('home'); // go to home view
  };

  const handleUpdateQty = useCallback((id, qty) => {
    if (qty < 1) { handleRemoveFromCart(id); return; }
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
  }, []);

  const handleRemoveFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  /* Wishlist */
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
        return <HomeView user={user} products={products} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlist={wishlist} onNavChange={setActiveNav} onCategoryChange={setActiveCategory} />;
      case 'products':
        return <ProductsView products={products} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlist={wishlist} onProductClick={setSelectedProduct} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />;
      case 'wishlist':
        return <WishlistView products={products} wishlist={wishlist} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} />;
      case 'account':
        return <AccountView user={user} onLogout={handleLogout} />;
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
          user={user}
          cartCount={cartCount}
          onCartOpen={() => setCartOpen(true)}
          onLogout={handleLogout}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Mobile nav */}
          <MobileNav
            activeNav={activeNav}
            onNavChange={setActiveNav}
            cartCount={cartCount}
            onCartOpen={() => setCartOpen(true)}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            user={user}
            onLogout={handleLogout}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Page content */}
          <main className="px-4 lg:px-8 py-6 pb-24 lg:pb-8">
            {renderView()}
          </main>
        </div>
      </div>

      {/* Cart drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {/* Product modal */}
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