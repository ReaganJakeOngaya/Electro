import React, { useEffect, useRef, useState } from 'react';
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

const NAV_LINKS = ['AboutUs', 'Support'];

const FEATURES = [
  {
    icon: RiFlashlightLine,
    title: 'Lightning Fast Delivery',
    desc: 'Same-day delivery in Nairobi. Express shipping to all major towns within 48 hours.',
  },
  {
    icon: RiShieldCheckLine,
    title: '2-Year Warranty',
    desc: 'Every device comes with our extended warranty and dedicated after-sales support.',
  },
  {
    icon: RiVerifiedBadgeLine,
    title: '100% Genuine Products',
    desc: 'All electronics sourced directly from authorized distributors. No fakes, ever.',
  },
  {
    icon: RiRefreshLine,
    title: '30-Day Returns',
    desc: 'Not satisfied? Return any product within 30 days, no questions asked.',
  },
];

const CATEGORIES = [
  { label: 'Smartphones', icon: RiSmartphoneLine },
  { label: 'Laptops', icon: RiMacbookLine },
  { label: 'Audio', icon: RiHeadphoneLine },
  { label: 'Wearables', icon: RiSmartphoneLine },
  { label: 'Cameras', icon: RiCameraLine },
  { label: 'Accessories', icon: RiPlugLine },
];

const MARQUEE_BRANDS = [
  'Samsung','Apple','Sony','Dell','LG','Xiaomi',
  'HP','Bose','Canon','Huawei','OnePlus','Asus','Lenovo','JBL','Microsoft',
];

const STATS = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '2,000+', label: 'Products' },
  { value: '4.9★', label: 'Avg. Rating' },
  { value: '7 yrs', label: 'In Business' },
];

/* ── 3-D tilt card hook ─────────────────────────────────────── */
function useTilt(strength = 12) {
  const ref = useRef(null);
  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = ((e.clientX - left) / width  - 0.5) * strength;
    const y = ((e.clientY - top)  / height - 0.5) * -strength;
    el.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.02,1.02,1.02)`;
  };
  const handleLeave = () => {
    if (ref.current)
      ref.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
  };
  return { ref, onMouseMove: handleMove, onMouseLeave: handleLeave };
}

/* ── Scroll-reveal hook ─────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ── Feature Card ───────────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, desc }) => {
  const tilt = useTilt(8);
  return (
    <div
      {...tilt}
      className="feature-card group relative p-7 rounded-2xl border border-zinc-200 bg-white overflow-hidden cursor-default select-none"
      style={{ transition: 'transform 0.18s ease, box-shadow 0.18s ease' }}
    >
      {/* 3-D depth shadow pseudo-element via inline style */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none"
           style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 32px rgba(0,0,0,0.08)' }} />

      <div className="relative z-10">
        <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center mb-5
                        group-hover:scale-110 transition-transform duration-200">
          <Icon className="text-white text-lg" />
        </div>
        <h3 className="text-sm font-bold text-black mb-2 tracking-tight">{title}</h3>
        <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

/* ── Category Tile ──────────────────────────────────────────── */
const CategoryTile = ({ label, icon: Icon }) => {
  const tilt = useTilt(10);
  return (
    <a
      href={`/products/${label.toLowerCase()}`}
      {...tilt}
      className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-zinc-200
                 bg-white hover:bg-black hover:border-black transition-colors duration-200 cursor-pointer"
      style={{ transition: 'transform 0.18s ease, background 0.2s ease, border-color 0.2s ease' }}
    >
      <div className="w-12 h-12 rounded-xl bg-zinc-100 group-hover:bg-white/20 flex items-center justify-center transition-colors duration-200">
        <Icon className="text-2xl text-black group-hover:text-white transition-colors duration-200" />
      </div>
      <span className="text-xs font-semibold text-zinc-700 group-hover:text-white transition-colors duration-200 text-center">{label}</span>
    </a>
  );
};

/* ── Main Component ─────────────────────────────────────────── */
const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroTilt = useTilt(6);
  useScrollReveal();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navbar ──────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-zinc-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="text-xl font-black tracking-tighter">
            <span className="text-black">Device</span>
            <span className="text-zinc-400">Yangu</span>
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <li key={l}>
                <a
                  href={`/${l.toLowerCase()}`}
                  className="text-sm font-medium text-zinc-500 hover:text-black transition-colors duration-150"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href="/login"
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-black transition-colors px-3 py-2"
            >
              <RiUserLine />
              Sign in
            </a>
            <a
              href="/login"
              className="text-sm font-semibold bg-black text-white px-5 py-2.5 rounded-xl
                         hover:bg-zinc-800 transition-colors shadow-lg shadow-black/20"
            >
              Get Started
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-zinc-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <RiCloseLine className="text-2xl" /> : <RiMenuLine className="text-2xl" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-zinc-100 px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <a key={l} href={`/${l.toLowerCase()}`} className="text-sm font-medium text-zinc-700">
                {l}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100">
              <a href="/login" className="text-sm font-medium text-zinc-500 py-2">Sign in</a>
              <a href="/login" className="text-sm font-semibold bg-black text-white px-4 py-2.5 rounded-xl text-center">
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <header className="relative min-h-screen flex items-center overflow-hidden bg-black">

        {/* Layered depth planes */}
        <div className="absolute inset-0"
             style={{ background: 'radial-gradient(ellipse 70% 70% at 65% 50%, #1a1a1a 0%, #000 100%)' }} />

        {/* Fine grid */}
        <div className="absolute inset-0 opacity-[0.06]"
             style={{
               backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
               backgroundSize: '40px 40px',
             }} />

        {/* Vignette */}
        <div className="absolute inset-0"
             style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)' }} />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full pt-28 pb-20 grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: copy */}
          <div className="space-y-8 hero-copy">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase
                             border border-zinc-700 bg-zinc-900/60 px-4 py-1.5 rounded-full backdrop-blur-sm">
              🇰🇪 Kenya's #1 Electronics Store
            </span>

            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.95] text-white"
                style={{ textShadow: '0 2px 40px rgba(255,255,255,0.08)' }}>
              Next-Level<br />
              <span style={{
                backgroundImage: 'linear-gradient(135deg, #fff 0%, #999 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Tech. Delivered.
              </span>
            </h1>

            <p className="text-base text-zinc-400 leading-relaxed max-w-md">
              Authentic gadgets at unbeatable prices — shipped to your door across Kenya.
              From smartphones to studio gear.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="/user-dashboard"
                className="inline-flex items-center gap-2 bg-white text-black font-bold px-7 py-3.5 rounded-xl
                           hover:bg-zinc-100 transition-colors shadow-2xl shadow-white/10 text-sm"
              >
                Shop Now <RiArrowRightLine />
              </a>
              <a
                href="/deals"
                className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-400 font-medium
                           px-7 py-3.5 rounded-xl hover:border-zinc-500 hover:text-white transition-colors text-sm"
              >
                View Deals
              </a>
            </div>

            {/* Mini stats strip */}
            <div className="flex gap-6 pt-4 border-t border-zinc-800">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-black text-white">{s.value}</div>
                  <div className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3-D floating device card */}
          <div className="flex justify-center lg:justify-end">
            <div
              {...heroTilt}
              className="relative w-72 h-96 rounded-3xl select-none"
              style={{
                transition: 'transform 0.2s ease',
                background: 'linear-gradient(145deg, #222 0%, #111 50%, #0a0a0a 100%)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              {/* Gloss highlight */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none"
                   style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)' }} />

              {/* Screen content */}
              <div className="absolute inset-4 rounded-2xl overflow-hidden"
                   style={{ background: 'linear-gradient(160deg, #1c1c1e 0%, #0d0d0f 100%)' }}>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Featured</span>
                    <span className="text-[10px] text-zinc-600">New Arrivals</span>
                  </div>
                  {/* Device preview bars */}
                  <div className="space-y-2 pt-2">
                    {['iPhone 16 Pro', 'Samsung S25', 'Sony WH-1000XM6'].map((item, i) => (
                      <div key={item} className="flex items-center gap-3 p-2.5 rounded-xl"
                           style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <div className="w-8 h-8 rounded-lg bg-zinc-700 flex-shrink-0"
                             style={{ background: `hsl(${i * 40},0%,${25 + i * 10}%)` }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-semibold text-zinc-300 truncate">{item}</div>
                          <div className="text-[9px] text-zinc-600">In stock</div>
                        </div>
                        <RiArrowRightLine className="text-zinc-600 text-xs flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                  {/* "Buy" pill */}
                  <div className="mt-auto pt-4">
                    <div className="w-full py-2.5 rounded-xl bg-white text-black text-[11px] font-bold text-center">
                      Browse All →
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom edge depth */}
              <div className="absolute -bottom-px left-6 right-6 h-px"
                   style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
            </div>
          </div>
        </div>

        {/* Bottom gradient to white */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </header>

      {/* ── Brand marquee ───────────────────────────────────────── */}
      <div className="border-y border-zinc-100 bg-zinc-50 overflow-hidden py-4">
        <div className="marquee-track flex gap-14 w-max">
          {[...MARQUEE_BRANDS, ...MARQUEE_BRANDS].map((brand, i) => (
            <span key={i} className="text-[11px] font-black text-zinc-300 tracking-[0.25em] uppercase whitespace-nowrap">
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* ── Categories ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10 reveal">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1.5">Browse</p>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter text-black">Shop by Category</h2>
          </div>
          <a href="/products"
             className="text-sm font-bold text-black hover:text-zinc-500 flex items-center gap-1 transition-colors">
            View all <RiArrowRightUpLine />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 reveal"
             style={{ transitionDelay: '80ms' }}>
          {CATEGORIES.map((c) => <CategoryTile key={c.label} {...c} />)}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section className="bg-zinc-50 border-y border-zinc-100 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Our Promise</p>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter text-black">Why DeviceYangu?</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 reveal" style={{ transitionDelay: '100ms' }}>
            {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div
          className="relative overflow-hidden rounded-3xl bg-black p-14 lg:p-20 reveal"
          style={{
            boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.06)',
          }}
        >
          {/* Fine grid on CTA */}
          <div className="absolute inset-0 opacity-[0.04]"
               style={{
                 backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
                 backgroundSize: '40px 40px',
               }} />

          {/* Radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96
                          rounded-full pointer-events-none"
               style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 70%)' }} />

          <div className="relative text-center max-w-xl mx-auto space-y-6">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-white leading-tight">
              Ready to upgrade<br />your tech?
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed">
              Join over 50,000 satisfied customers. Sign up and get{' '}
              <span className="text-white font-bold">KSh 500 off</span> your first order.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <a href="/register"
                 className="inline-flex items-center gap-2 bg-white text-black font-bold
                            px-7 py-3.5 rounded-xl hover:bg-zinc-100 transition-colors text-sm
                            shadow-2xl shadow-white/10">
                Create Account
              </a>
              <a href="/login"
                 className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-400
                            font-medium px-7 py-3.5 rounded-xl hover:border-zinc-500 hover:text-white
                            transition-colors text-sm">
                Sign In
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1 space-y-3">
            <a href="/" className="text-xl font-black tracking-tighter">
              <span className="text-black">Device</span>
              <span className="text-zinc-400">Yangu</span>
            </a>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Where use meets simplicity and luxury.
            </p>
          </div>

          {[
            { heading: 'Shop',    links: [['All Products', '/user-dashboard'], ['Deals', '/deals'], ['New Arrivals', '/new']] },
            { heading: 'Company', links: [['About Us', '/aboutus'], ['Contact', '/contact'], ['Careers', '/careers']] },
            { heading: 'Support', links: [['FAQ', '/faq'], ['Returns', '/returns'], ['Warranty', '/warranty']] },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-5">{heading}</h4>
              <ul className="space-y-3">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-sm text-zinc-500 hover:text-black transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-100 px-6 lg:px-8 py-5 max-w-7xl mx-auto
                        flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-xs text-zinc-400">
            © {new Date().getFullYear()} DeviceYangu. All rights reserved.
          </span>
          <span className="text-xs text-zinc-400">Made with ❤️ in Nairobi, Kenya</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;