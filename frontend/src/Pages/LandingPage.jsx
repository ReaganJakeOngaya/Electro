import React, { useEffect, useState } from 'react';
import {
  RiFlashlightLine,
  RiShieldCheckLine,
  RiVerifiedBadgeLine,
  RiRefreshLine,
  RiSmartphoneLine,
  RiMacbookLine,
  RiHeadphoneLine,
  RiCameraLine,
  RiPlugLine,
  RiMenuLine,
  RiCloseLine,
  RiArrowRightLine,
  RiArrowRightUpLine,
  RiUserLine,
} from 'react-icons/ri';
import heroBanner from '../assets/electronics-banner.jpg';

const NAV_LINKS = ['About Us', 'Support'];

const FEATURES = [
  { icon: RiFlashlightLine,    title: 'Lightning Fast Delivery',  desc: 'Same-day delivery in Nairobi. Express shipping to all major towns within 48 hours.' },
  { icon: RiShieldCheckLine,   title: '2-Year Warranty',          desc: 'Every device comes with our extended warranty and dedicated after-sales support.' },
  { icon: RiVerifiedBadgeLine, title: '100% Genuine Products',    desc: 'All electronics sourced directly from authorized distributors. No fakes, ever.' },
  { icon: RiRefreshLine,       title: '30-Day Returns',           desc: 'Not satisfied? Return any product within 30 days, no questions asked.' },
];

const CATEGORIES = [
  { label: 'Smartphones', icon: RiSmartphoneLine },
  { label: 'Laptops',     icon: RiMacbookLine    },
  { label: 'Audio',       icon: RiHeadphoneLine  },
  { label: 'Wearables',   icon: RiSmartphoneLine },
  { label: 'Cameras',     icon: RiCameraLine     },
  { label: 'Accessories', icon: RiPlugLine       },
];

const MARQUEE_BRANDS = [
  'Samsung', 'Apple', 'Sony', 'Dell', 'LG', 'Xiaomi',
  'HP', 'Bose', 'Canon', 'Huawei', 'OnePlus', 'Asus', 'Lenovo', 'JBL', 'Microsoft',
];

const STATS = [
  { value: '50K+',   label: 'Happy Customers' },
  { value: '2,000+', label: 'Products'         },
  { value: '4.9★',   label: 'Avg Rating'       },
  { value: '7 yrs',  label: 'In Business'      },
];

function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Feature Card ─────────────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, desc, index }) => (
  <div
    className="reveal group relative p-7 bg-white border border-zinc-100 rounded-sm
               hover:border-orange-500 transition-all duration-300 cursor-default overflow-hidden"
    style={{ transitionDelay: `${index * 70}ms` }}
  >
    {/* Orange corner accent */}
    <div className="absolute top-0 right-0 w-0 h-0
                    border-t-[28px] border-t-orange-500
                    border-l-[28px] border-l-transparent
                    group-hover:opacity-100 opacity-0 transition-opacity duration-300" />

    <div
      className="w-11 h-11 rounded-sm bg-black flex items-center justify-center mb-5
                 group-hover:bg-orange-500 transition-colors duration-300"
    >
      <Icon className="text-white" size={17} />
    </div>
    <h3 className="text-sm font-black text-black mb-2 leading-tight" style={{ fontSize: '0.72rem', letterSpacing: '0.01em' }}>
      {title}
    </h3>
    <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
  </div>
);

/* ── Category Tile ────────────────────────────────────────────── */
const CategoryTile = ({ label, icon: Icon, index }) => (
  <a
    href={`/products/${label.toLowerCase()}`}
    className="reveal group flex flex-col items-center gap-3 py-7 px-4 rounded-sm border border-zinc-100
               bg-white hover:bg-black hover:border-black transition-all duration-250 relative overflow-hidden"
    style={{ transitionDelay: `${index * 55}ms` }}
  >
    {/* Orange bottom bar on hover */}
    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-orange-500
                    scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

    <div className="w-12 h-12 rounded-sm bg-zinc-50 group-hover:bg-white/10
                    flex items-center justify-center transition-colors duration-250">
      <Icon className="text-xl text-black group-hover:text-orange-400 transition-colors duration-250" />
    </div>
    <span style={{ fontSize: '0.58rem', letterSpacing: '0.1em' }}
          className="font-black text-zinc-600 group-hover:text-white/90 transition-colors duration-250 uppercase text-center">
      {label}
    </span>
  </a>
);

/* ── Main Component ───────────────────────────────────────────── */
const LandingPage = () => {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  useScrollReveal();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 56);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="min-h-screen bg-white antialiased" >

      {/* ── Navbar ────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-350 ${
        scrolled
          ? 'bg-white/96 backdrop-blur-xl border-b border-zinc-100 shadow-sm'
          : 'bg-transparent'
      }`}>
        {/* Orange top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-orange-500" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-[68px]">

          {/* Logo */}
          <a href="/" className="select-none flex items-baseline gap-0.5" >
            <span className={`text-lg font-black tracking-tight ${scrolled ? 'text-black' : 'text-white'}`}>
              Gad
            </span>
            <span className="text-orange-500 text-xl font-black leading-none">&</span>
            <span className={`text-lg font-black tracking-tight ${scrolled ? 'text-zinc-400' : 'text-white/35'}`}>
              gets
            </span>
          </a>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((l) => (
              <li key={l}>
                <a href={`/${l.toLowerCase().replace(' ', '')}`}
                   style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}
                   className={`font-black uppercase transition-colors duration-150
                               ${scrolled ? 'text-zinc-500 hover:text-black' : 'text-white/50 hover:text-white'}`}>
                  {l}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <a href="/login"
               className={`flex items-center gap-1.5 text-xs font-black transition-colors px-3 py-2 rounded-sm
                           ${scrolled ? 'text-zinc-600 hover:text-black' : 'text-white/45 hover:text-white'}`}
               style={{ letterSpacing: '0.06em' }}>
              <RiUserLine size={14} /> Sign in
            </a>
            <a href="/user-dashboard"
               className="text-xs font-black px-5 py-3 rounded-sm uppercase tracking-wider
                          bg-orange-500 text-white hover:bg-orange-600 transition-all duration-150"
               style={{ letterSpacing: '0.08em',
                        boxShadow: '0 4px 16px rgba(240,90,26,0.30)' }}>
              Shop Now
            </a>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen
              ? <RiCloseLine  className={`text-2xl ${scrolled ? 'text-black' : 'text-white'}`} />
              : <RiMenuLine   className={`text-2xl ${scrolled ? 'text-black' : 'text-white'}`} />
            }
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-zinc-100 px-6 py-6 flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <a key={l} href={`/${l.toLowerCase().replace(' ', '')}`}
                 style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}
                 className="font-black text-zinc-700 uppercase">{l}</a>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-zinc-100">
              <a href="/login" className="text-xs font-black text-zinc-900 py-1.5 uppercase tracking-widest"
                 >Sign in</a>
              <a href="/user-dashboard"
                 className="text-xs font-black bg-orange-500 text-white px-4 py-3.5 rounded-sm text-center uppercase tracking-widest"
                 >Shop Now</a>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <header className="relative min-h-screen flex items-center overflow-hidden">

        {/* Background image */}
        <div className="absolute inset-0">
          <img src={heroBanner} alt="" className="w-full h-full object-cover object-center" />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0"
               style={{ background: 'linear-gradient(105deg, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.70) 50%, rgba(8,8,8,0.30) 100%)' }} />
          {/* Orange flare bottom-left */}
          <div className="absolute bottom-0 left-0 w-[500px] h-[300px] pointer-events-none"
               style={{ background: 'radial-gradient(ellipse at bottom left, rgba(240,90,26,0.18) 0%, transparent 70%)' }} />
        </div>

        {/* Vertical text indicator */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3">
          <div className="w-[1px] h-16 bg-white/10" />
          <span className="text-white/20 text-[9px] font-black tracking-[0.25em] uppercase"
                style={{ writingMode: 'vertical-rl' }}>
            Scroll
          </span>
          <div className="w-[1px] h-16 bg-orange-500/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-32">
          <div className="max-w-2xl space-y-8">

            {/* Eyebrow */}
            <div className="hero-copy inline-flex items-center gap-3 select-none">
              <div className="w-6 h-[2px] bg-orange-500" />
              <span style={{ fontSize: '0.6rem', letterSpacing: '0.22em' }}
                    className="text-orange-400 font-black uppercase">
                Kenya's #1 Electronics Store
              </span>
            </div>

            {/* Headline */}
            <h1 className="hero-copy delay-100 text-white leading-[1.02]"
                style={{ fontSize: 'clamp(2.4rem, 7vw, 4.75rem)',
                         fontWeight: 900, letterSpacing: '-0.02em' }}>
              Next-Level<br />
              <span style={{ color: '#f05a1a' }}>Tech.</span>
              {' '}
              <span style={{ color: 'rgba(255,255,255,0.16)' }}>Delivered.</span>
            </h1>

            <p className="hero-copy delay-200 text-zinc-400 leading-relaxed max-w-sm text-sm">
              Authentic gadgets at unbeatable prices — shipped across Kenya.
              Smartphones, laptops, audio and more.
            </p>

            {/* CTAs */}
            <div className="hero-copy delay-300 flex flex-wrap gap-3 pt-2">
              <a href="/user-dashboard"
                 className="inline-flex items-center gap-2.5 bg-orange-500 text-white font-black
                            px-8 py-4 rounded-sm hover:bg-orange-600 hover:-translate-y-0.5
                            transition-all text-xs uppercase tracking-widest"
                 style={{ boxShadow: '0 8px 32px rgba(240,90,26,0.35)' }}>
                Shop Now <RiArrowRightLine size={14} />
              </a>
              <a href="/login"
                 className="inline-flex items-center gap-2.5 border border-white/12 text-white/45 font-black
                            px-8 py-4 rounded-sm hover:border-white/25 hover:text-white/75
                            transition-all text-xs uppercase tracking-widest"
                 >
                Sign in
              </a>
            </div>

            {/* Stats */}
            <div className="hero-copy delay-500 flex gap-10 pt-6 border-t border-white/8">
              {STATS.map((s, i) => (
                <div key={s.label} className="flex flex-col gap-1">
                  <div className="text-xl font-black text-white leading-none"
                       >
                    {s.value}
                  </div>
                  <div className="text-[8px] text-zinc-600 font-black tracking-[0.18em] uppercase"
                       >
                    {s.label}
                  </div>
                  {i === 0 && <div className="w-4 h-[2px] bg-orange-500 mt-1" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── Brand marquee ────────────────────────────────────── */}
      <div className="overflow-hidden border-y border-zinc-100 py-5 bg-white">
        <div className="flex items-center gap-2 mb-0">
          {/* Static label */}
        </div>
        <div className="marquee-track flex gap-14 w-max">
          {[...MARQUEE_BRANDS, ...MARQUEE_BRANDS].map((brand, i) => (
            <span key={i} className="flex items-center gap-14 whitespace-nowrap select-none">
              <span style={{ fontSize: '0.6rem', letterSpacing: '0.28em' }}
                    className="font-black text-zinc-300 uppercase">
                {brand}
              </span>
              {i % 3 === 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block -ml-10" />
              )}
            </span>
          ))}
        </div>
      </div>

      {/* ── Categories ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-28">
        <div className="flex items-end justify-between mb-14 reveal">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-[2px] bg-orange-500" />
              <p style={{ fontSize: '0.58rem', letterSpacing: '0.22em' }}
                 className="font-black uppercase text-orange-500">Browse</p>
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.3rem)',
                         fontWeight: 900, letterSpacing: '-0.02em' }}
                className="text-black leading-[1.05]">
              Shop by<br />Category
            </h2>
          </div>
          <a href="/user-dashboard"
             className="flex items-center gap-1.5 text-zinc-400 hover:text-orange-500 transition-colors group"
             style={{ fontSize: '0.62rem', letterSpacing: '0.1em' }}>
            <span className="font-black uppercase">View all</span>
            <RiArrowRightUpLine size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((c, i) => <CategoryTile key={c.label} {...c} index={i} />)}
        </div>
      </section>

      {/* ── Promo band ───────────────────────────────────────── */}
      <section className="bg-black relative overflow-hidden">
        {/* Orange accent strip left */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-[0.03]"
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                      backgroundSize: '60px 60px' }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-14 items-center reveal">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-5 h-[2px] bg-orange-500" />
                <p style={{ fontSize: '0.58rem', letterSpacing: '0.22em' }}
                   className="font-black uppercase text-orange-500">Exclusive Offer</p>
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)',
                           fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.05 }}
                  className="text-white">
                KSh 500 off<br />
                <span className="text-zinc-600">your first order.</span>
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                Create a free account and unlock your welcome discount — plus early access
                to deals and loyalty rewards.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 lg:justify-end">
              <a href="/login"
                 className="inline-flex items-center justify-center gap-2.5 bg-orange-500 text-white font-black
                            px-8 py-4 rounded-sm hover:bg-orange-600 hover:-translate-y-0.5
                            transition-all text-xs uppercase tracking-widest"
                 style={{ boxShadow: '0 8px 28px rgba(240,90,26,0.30)' }}>
                Create Account <RiArrowRightLine size={13} />
              </a>
              <a href="/login"
                 className="inline-flex items-center justify-center gap-2.5 border border-zinc-800 text-zinc-500
                            font-black px-8 py-4 rounded-sm hover:border-orange-500/50 hover:text-orange-400
                            transition-all text-xs uppercase tracking-widest"
                 >
                Sign in
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features / Why Us ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-28">
        <div className="text-center mb-16 reveal">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-5 h-[2px] bg-orange-500" />
            <p style={{ fontSize: '0.58rem', letterSpacing: '0.22em' }}
               className="font-black uppercase text-orange-500">Our Promise</p>
            <div className="w-5 h-[2px] bg-orange-500" />
          </div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.3rem)',
                       fontWeight: 900, letterSpacing: '-0.02em' }}
              className="text-black">
            Why Gad<span className="text-orange-500">&</span>gets?
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => <FeatureCard key={f.title} {...f} index={i} />)}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="bg-black relative overflow-hidden">
        {/* Orange top edge */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-orange-500" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-12 grid md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <a href="/" className="select-none flex items-baseline gap-0.5"
               >
              <span className="text-lg font-black text-white tracking-tight">Gad</span>
              <span className="text-orange-500 text-xl font-black leading-none">&</span>
              <span className="text-lg font-black text-zinc-500 tracking-tight">gets</span>
            </a>
            <p className="text-xs text-zinc-600 leading-relaxed max-w-[180px]">
              Where simplicity meets the finest tech in Kenya.
            </p>
            <div className="flex gap-2 pt-2">
              <div className="w-6 h-[2px] bg-orange-500 rounded" />
              <div className="w-3 h-[2px] bg-zinc-700 rounded" />
            </div>
          </div>

          {[
            { heading: 'Shop',    links: [['All Products', '/user-dashboard'], ['Deals', '/deals'], ['New Arrivals', '/new']] },
            { heading: 'Company', links: [['About Us', '/aboutus'], ['Contact', '/contact'], ['Careers', '/careers']] },
            { heading: 'Support', links: [['FAQ', '/faq'], ['Returns', '/returns'], ['Warranty', '/warranty']] },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <h4 style={{ fontSize: '0.58rem', letterSpacing: '0.22em' }}
                  className="font-black uppercase text-orange-500 mb-5">{heading}</h4>
              <ul className="space-y-3">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href}
                       className="text-sm text-zinc-600 hover:text-white transition-colors duration-150 flex items-center gap-2 group">
                      <span className="w-0 h-[1px] bg-orange-500 group-hover:w-3 transition-all duration-200" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-900 px-6 lg:px-10 py-5 max-w-7xl mx-auto
                        flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-xs text-zinc-700"
                style={{ fontSize: '0.6rem', letterSpacing: '0.06em' }}>
            © {new Date().getFullYear()} Gad<span className="text-orange-500">&</span>gets. All rights reserved.
          </span>
          <span className="text-xs text-zinc-700"
                style={{ fontSize: '0.6rem', letterSpacing: '0.06em' }}>
            Made with <span className="text-orange-500">♥</span> in Nairobi, Kenya
          </span>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;