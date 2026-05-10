import React, { useEffect } from 'react';
import {
  RiArrowRightLine,
  RiArrowRightSLine,
  RiShieldCheckLine,
  RiFlashlightLine,
  RiVerifiedBadgeLine,
  RiRefreshLine,
  RiPercentLine,
} from 'react-icons/ri';
import ProductCard from '../common/ProductCard';
import { CATEGORIES } from '../common/constants';
import { getIconComponent } from '../common/utils/iconHelpers';
import heroImage from '../../assets/shopcart.jpg';
import RecentlyViewed from '../common/RecentlyViewed';

// ── Scroll reveal ──────────────────────────────────────────────
const useScrollReveal = () => {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
      }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
};

// ── Section heading ────────────────────────────────────────────
const SectionHeading = ({ eyebrow, title, onAction, actionLabel }) => (
  <div className="flex items-end justify-between mb-8 reveal">
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-5 h-[2px] bg-orange-500" />
        <p className="font-black uppercase text-orange-500"
           style={{ fontSize: '0.58rem', letterSpacing: '0.22em' }}>
          {eyebrow}
        </p>
      </div>
      <h2 className="text-black leading-[1.05]"
          style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)', fontWeight: 900, letterSpacing: '-0.025em' }}>
        {title}
      </h2>
    </div>
    {onAction && (
      <button
        onClick={onAction}
        className="flex items-center gap-1.5 text-zinc-400 hover:text-orange-500 transition-colors group"
        style={{ fontSize: '0.62rem', letterSpacing: '0.1em' }}
      >
        <span className="font-black uppercase">{actionLabel || 'View all'}</span>
        <RiArrowRightSLine size={13} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    )}
  </div>
);

// ── Category tile ──────────────────────────────────────────────
const CategoryTile = ({ label, icon: Icon, index, onClick }) => (
  <button
    onClick={onClick}
    className="reveal group flex flex-col items-center gap-3 py-7 px-4 rounded-sm border border-zinc-100
               bg-white hover:bg-black hover:border-black transition-all duration-200 relative overflow-hidden text-left"
    style={{ transitionDelay: `${index * 50}ms` }}
  >
    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-orange-500
                    scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    <div className="w-12 h-12 rounded-sm bg-zinc-50 group-hover:bg-white/10
                    flex items-center justify-center transition-colors duration-200">
      <Icon className="text-xl text-black group-hover:text-orange-400 transition-colors duration-200" />
    </div>
    <span className="font-black text-zinc-500 group-hover:text-white/90 transition-colors duration-200 uppercase text-center"
          style={{ fontSize: '0.58rem', letterSpacing: '0.1em' }}>
      {label}
    </span>
  </button>
);

// ── Feature card ───────────────────────────────────────────────
const FeatureCard = ({ icon: Icon, title, desc, index }) => (
  <div
    className="reveal group relative p-7 bg-white border border-zinc-100 rounded-sm
               hover:border-orange-500 transition-all duration-300 cursor-default overflow-hidden"
    style={{ transitionDelay: `${index * 70}ms` }}
  >
    <div className="absolute top-0 right-0 w-0 h-0
                    border-t-[28px] border-t-orange-500
                    border-l-[28px] border-l-transparent
                    group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
    <div className="w-11 h-11 rounded-sm bg-black flex items-center justify-center mb-5
                    group-hover:bg-orange-500 transition-colors duration-300">
      <Icon className="text-white" size={17} />
    </div>
    <h3 className="font-black text-black mb-2 leading-tight"
        style={{ fontSize: '0.72rem', letterSpacing: '0.01em' }}>
      {title}
    </h3>
    <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
  </div>
);

// ── Stat pill ──────────────────────────────────────────────────
const StatPill = ({ value, label }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xl font-black text-white leading-none"
          style={{ letterSpacing: '-0.02em' }}>
      {value}
    </span>
    <span className="font-black uppercase text-zinc-600"
          style={{ fontSize: '0.58rem', letterSpacing: '0.18em' }}>
      {label}
    </span>
  </div>
);

const FEATURES = [
  { icon: RiFlashlightLine,    title: 'Lightning Fast Delivery',  desc: 'Same-day delivery in Nairobi. Express shipping to all major towns within 48 hours.' },
  { icon: RiShieldCheckLine,   title: '2-Year Warranty',          desc: 'Every device comes with our extended warranty and dedicated after-sales support.' },
  { icon: RiVerifiedBadgeLine, title: '100% Genuine Products',    desc: 'All electronics sourced directly from authorized distributors. No fakes, ever.' },
  { icon: RiRefreshLine,       title: '30-Day Returns',           desc: 'Not satisfied? Return any product within 30 days, no questions asked.' },
];

// ── Main ───────────────────────────────────────────────────────
const HomeView = ({ user, products, onAddToCart, onToggleWishlist, wishlist, onNavChange, onCategoryChange, onProductClick }) => {
  useScrollReveal();

  const productArray   = Array.isArray(products) ? products : [];
  const featured       = productArray.slice(0, 4);
  const dealsProducts  = productArray.filter(p => p.discount > 0).slice(0, 4);
  const categoriesList = CATEGORIES.filter(c => c.label !== 'All');

  return (
    <div className="space-y-16 pb-12">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-sm">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0"
               style={{ background: 'linear-gradient(105deg, rgba(8,8,8,0.94) 0%, rgba(8,8,8,0.72) 52%, rgba(8,8,8,0.25) 100%)' }} />
          <div className="absolute bottom-0 left-0 w-[480px] h-[280px] pointer-events-none"
               style={{ background: 'radial-gradient(ellipse at bottom left, rgba(240,90,26,0.18) 0%, transparent 70%)' }} />
          {/* Orange left edge */}
          <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-orange-500" />
        </div>

        <div className="relative z-10 px-8 md:px-12 py-16 md:py-20 flex flex-col justify-center min-h-[400px]">
          {/* Eyebrow */}
          <div className="hero-copy inline-flex items-center gap-3 select-none mb-5">
            <div className="w-5 h-[2px] bg-orange-500" />
            <span className="text-orange-400 font-black uppercase"
                  style={{ fontSize: '0.6rem', letterSpacing: '0.22em' }}>
              Welcome back
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-copy delay-100 text-white max-w-xl"
              style={{ fontSize: 'clamp(2rem, 6vw, 3.8rem)', fontWeight: 900,
                       letterSpacing: '-0.025em', lineHeight: 1.02 }}>
            Hey, <span className="text-orange-500">{user?.first_name}.</span><br />
            <span className="text-white/30">Next-level tech.</span>
          </h1>

          <p className="hero-copy delay-200 text-zinc-400 text-sm leading-relaxed max-w-sm mt-4 mb-7 font-medium">
            Explore {productArray.length} authentic gadgets — delivered across Kenya.
          </p>

          {/* CTAs */}
          <div className="hero-copy delay-300 flex flex-wrap gap-3">
            <button
              onClick={() => onNavChange('products')}
              className="inline-flex items-center gap-2.5 bg-orange-500 text-white font-black
                         px-7 py-3.5 rounded-sm hover:bg-orange-600 hover:-translate-y-0.5
                         transition-all text-xs uppercase tracking-widest"
              style={{ boxShadow: '0 8px 28px rgba(240,90,26,0.35)' }}
            >
              Shop Now <RiArrowRightLine size={13} />
            </button>
            <button
              onClick={() => onNavChange('deals')}
              className="inline-flex items-center gap-2.5 border border-white/10 text-white/40 font-black
                         px-7 py-3.5 rounded-sm hover:border-orange-500/40 hover:text-orange-400
                         transition-all text-xs uppercase tracking-widest"
            >
              <RiPercentLine size={13} /> View Deals
            </button>
          </div>

          {/* Stats row */}
          <div className="hero-copy delay-500 flex gap-8 mt-10 pt-6 border-t border-white/8">
            <StatPill value="50K+" label="Customers" />
            <StatPill value="2K+"  label="Products"  />
            <StatPill value="4.9★" label="Rating"    />
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────── */}
      <section className="px-1">
        <SectionHeading
          eyebrow="Browse"
          title={<>Shop by<br />Category</>}
          onAction={() => onNavChange('products')}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categoriesList.map((c, i) => (
            <CategoryTile
              key={c.label}
              label={c.label}
              icon={getIconComponent(c.icon)}
              index={i}
              onClick={() => { onCategoryChange(c.label); onNavChange('products'); }}
            />
          ))}
        </div>
      </section>

      {/* ── Featured Products ──────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="px-1">
          <SectionHeading
            eyebrow="Handpicked"
            title={<>Featured<br />Products</>}
            onAction={() => onNavChange('products')}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map(product => (
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
        </section>
      )}

      {/* ── Deals strip ───────────────────────────────────────── */}
      {dealsProducts.length > 0 && (
        <section className="relative overflow-hidden rounded-sm bg-black px-8 md:px-12 py-12">
          {/* Orange left edge */}
          <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-orange-500" />
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
               style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                        backgroundSize: '60px 60px' }} />

          <div className="relative">
            <SectionHeading
              eyebrow="On Sale"
              title={<><span className="text-white">Today's</span><br /><span className="text-orange-500">Best Deals</span></>}
              onAction={() => onNavChange('deals')}
              actionLabel="All Deals"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dealsProducts.map(product => (
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
        </section>
      )}

      {/* ── Trust signals ──────────────────────────────────────── */}
      <section className="px-1">
        <div className="text-center mb-12 reveal">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-5 h-[2px] bg-orange-500" />
            <p className="font-black uppercase text-orange-500"
               style={{ fontSize: '0.58rem', letterSpacing: '0.22em' }}>Our Promise</p>
            <div className="w-5 h-[2px] bg-orange-500" />
          </div>
          <h2 className="text-black"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)', fontWeight: 900, letterSpacing: '-0.025em' }}>
            Why Gad<span className="text-orange-500">&</span>gets?
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => <FeatureCard key={f.title} {...f} index={i} />)}
        </div>
      </section>

      {/* ── Recently Viewed ────────────────────────────────────── */}
      <section className="px-1">
        <RecentlyViewed
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          wishlist={wishlist}
          onProductClick={onProductClick}
        />
      </section>

      <style>{`
        @keyframes heroCopyIn {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-copy { animation: heroCopyIn 0.85s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-500 { animation-delay: 500ms; }
        .reveal {
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s cubic-bezier(0.22,0.61,0.36,1), transform 0.6s cubic-bezier(0.22,0.61,0.36,1);
        }
        .reveal.revealed { opacity: 1; transform: translateY(0); }
      `}</style>
    </div>
  );
};

export default HomeView;