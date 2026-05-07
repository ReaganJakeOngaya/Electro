import React, { useEffect,  useState } from 'react';
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

const NAV_LINKS = ['AboutUs', 'Support'];

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
  { label: 'Wearables',   icon: RiSmartphoneLine  }, 
  { label: 'Cameras',     icon: RiCameraLine     },
  { label: 'Accessories', icon: RiPlugLine       },
];

const MARQUEE_BRANDS = [
  'Samsung','Apple','Sony','Dell','LG','Xiaomi',
  'HP','Bose','Canon','Huawei','OnePlus','Asus','Lenovo','JBL','Microsoft',
];

const STATS = [
  { value: '50K+',   label: 'Customers'   },
  { value: '2,000+', label: 'Products'    },
  { value: '4.9★',   label: 'Rating'      },
  { value: '7 yrs',  label: 'In Business' },
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

const FeatureCard = ({ icon: Icon, title, desc, index }) => (
  <div
    className="reveal group relative p-6 bg-white border border-zinc-100 rounded-3xl
               hover:border-zinc-200 hover:shadow-lg transition-all duration-300 cursor-default"
    style={{ transitionDelay: `${index * 60}ms` }}
  >
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center flex-shrink-0
                      group-hover:scale-105 transition-transform duration-200">
        <Icon className="text-white" size={15} />
      </div>
      <div>
        <h3 className="text-sm font-bold text-black mb-1.5 tracking-tight">{title}</h3>
        <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  </div>
);

const CategoryTile = ({ label, icon: Icon, index }) => (
  <a
    href={`/products/${label.toLowerCase()}`}
    className="reveal group flex flex-col items-center gap-3 py-6 px-4 rounded-3xl border border-zinc-100
               bg-white hover:bg-black hover:border-black transition-all duration-200"
    style={{ transitionDelay: `${index * 50}ms` }}
  >
    <div className="w-11 h-11 rounded-2xl bg-zinc-50 group-hover:bg-white/15
                    flex items-center justify-center transition-colors duration-200">
      <Icon className="text-xl text-black group-hover:text-white transition-colors duration-200" />
    </div>
    <span className="text-[11px] font-bold text-zinc-600 group-hover:text-white/90
                     transition-colors duration-200 tracking-wide">{label}</span>
  </a>
);

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useScrollReveal();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans antialiased">

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-zinc-100' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16">

          <a href="/" className="text-xl font-black tracking-tighter select-none">
            <span className={scrolled ? 'text-black' : 'text-white'}>Gad</span>
            <span className={scrolled ? 'text-orange-600' : 'text-orange-600/60'}>&</span>
            <span className={scrolled ? 'text-zinc-400' : 'text-white/40'}>gets</span>
          </a>

          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <li key={l}>
                <a href={`/${l.toLowerCase()}`}
                   className={`text-sm font-medium transition-colors duration-150
                               ${scrolled ? 'text-zinc-500 hover:text-black' : 'text-white/60 hover:text-white'}`}>
                  {l}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-2">
            <a href="/login"
               className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-2
                           ${scrolled ? 'text-zinc-900 hover:text-black' : 'text-gray-700/60 hover:text-black'}`}>
              <RiUserLine size={15} /> Sign in
            </a>
            <a href="/login"
               className={`text-sm font-bold px-5 py-2.5 rounded-2xl transition-all duration-150
                           ${scrolled
                             ? 'bg-black text-white hover:bg-zinc-800'
                             : 'bg-white text-black hover:bg-zinc-100'
                           }`}>
              Get Started
            </a>
          </div>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen
              ? <RiCloseLine className={`text-2xl ${scrolled ? 'text-black' : 'text-white'}`} />
              : <RiMenuLine  className={`text-2xl ${scrolled ? 'text-black' : 'text-white'}`} />
            }
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-zinc-100 px-6 py-5 flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <a key={l} href={`/${l.toLowerCase()}`} className="text-sm font-semibold text-zinc-700">{l}</a>
            ))}
            <div className="flex flex-col gap-2 pt-3 border-t border-zinc-100">
              <a href="/login" className="text-sm font-medium text-zinc-900 py-1.5">Sign in</a>
              <a href="/login" className="text-sm font-bold bg-black text-white px-4 py-3 rounded-2xl text-center">
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <header className="relative min-h-screen flex items-center overflow-hidden">

        {/* Background image */}
        <img
          src={heroBanner}
          alt="hero-banner"
          aria-hidden="true"
          className="absolute inset-0 w-full min-h-screen object-cover object-right pointer-events-none"
          style={{ opacity: 0.8 }}
        />

        {/* Left-to-right fade — text area is fully black, right side reveals image */}
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'linear-gradient(90deg, #000 0%, #000 26%, rgba(0,0,0,0.64) 54%, rgba(0,0,0,0.48) 64%, rgba(0,0,0,0.04) 72%, transparent 100%)' }} />

        {/* Bottom bleed into page */}
        <div className="absolute bottom-0 left-0 right-0 h-4 pointer-events-none"
             style={{ background: 'linear-gradient(to top, #fff, transparent)' }} />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 w-full pt-36 pb-32">
          <div className="max-w-xl space-y-8">

            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-2.5 text-[10px] font-bold tracking-[0.22em]
                            text-white/35 uppercase border border-white/8 px-4 py-2 rounded-full select-none">
              🇰🇪 Kenya's #1 Electronics Store
            </div>

            {/* Headline */}
            <h1 className="font-black tracking-tighter leading-[0.9] text-white"
                style={{ fontSize: 'clamp(3rem, 8vw, 5.25rem)' }}>
              Next-Level<br />
              <span style={{
                background: 'linear-gradient(135deg, #fff 20%, #888 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Tech.
              </span>
              {' '}
              <span style={{ color: 'rgba(255,255,255,0.18)' }}>Delivered.</span>
            </h1>

            <p className="text-zinc-500 leading-relaxed max-w-xs text-sm">
              Authentic gadgets at unbeatable prices — shipped across Kenya.
              Smartphones, laptops, audio and more.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-1">
              <a href="/user-dashboard"
                 className="inline-flex items-center gap-2 bg-white text-black font-bold
                            px-7 py-3.5 rounded-2xl hover:bg-zinc-100 hover:-translate-y-0.5
                            hover:shadow-xl transition-all text-sm"
                 style={{ boxShadow: '0 8px 28px rgba(255,255,255,0.1)' }}>
                Shop Now <RiArrowRightLine size={14} />
              </a>
              <a href="/login"
                 className="inline-flex items-center gap-2 border border-white/12 text-white/50 font-medium
                            px-7 py-3.5 rounded-2xl hover:border-white/25 hover:text-white/80
                            transition-all text-sm">
                Sign in
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-5 border-t border-white/8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-black text-white leading-none">{s.value}</div>
                  <div className="text-[9px] text-zinc-600 font-bold tracking-[0.18em] uppercase mt-1.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── Brand marquee ── */}
      <div className="overflow-hidden border-b border-zinc-100 py-5 bg-white">
        <div className="marquee-track flex gap-16 w-max">
          {[...MARQUEE_BRANDS, ...MARQUEE_BRANDS].map((brand, i) => (
            <span key={i} className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase whitespace-nowrap select-none">
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* ── Categories ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="flex items-end justify-between mb-12 reveal">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-2">Browse</p>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-black">Shop by<br />Category</h2>
          </div>
          <a href="/user-dashboard"
             className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-black transition-colors">
            View all <RiArrowRightUpLine size={13} />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((c, i) => <CategoryTile key={c.label} {...c} index={i} />)}
        </div>
      </section>

      {/* ── Promo split band ── */}
      <section className="bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center reveal">
            <div className="space-y-5">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">Exclusive Offer</p>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-white leading-[0.95]">
                KSh 500 off<br />
                <span className="text-zinc-700">your first order.</span>
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                Create a free account and unlock your welcome discount — plus early access
                to deals and loyalty rewards.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 lg:justify-end">
              <a href="/login"
                 className="inline-flex items-center justify-center gap-2 bg-white text-black font-bold
                            px-8 py-4 rounded-2xl hover:bg-zinc-100 hover:-translate-y-0.5
                            hover:shadow-xl transition-all text-sm"
                 style={{ boxShadow: '0 8px 24px rgba(255,255,255,0.07)' }}>
                Create Account <RiArrowRightLine size={14} />
              </a>
              <a href="/login"
                 className="inline-flex items-center justify-center gap-2 border border-zinc-800 text-zinc-500
                            font-medium px-8 py-4 rounded-2xl hover:border-zinc-700 hover:text-zinc-300
                            transition-all text-sm">
                Sign in
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="text-center mb-14 reveal">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-2">Our Promise</p>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-black">Why Gad&gets?</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => <FeatureCard key={f.title} {...f} index={i} />)}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid md:grid-cols-4 gap-12">
          <div className="md:col-span-1 space-y-4">
            <a href="/" className="text-xl font-black tracking-tighter">
              <span className="text-black">Gad</span>
              <span className="text-orange-600">&</span>
              <span className="text-zinc-500">gets</span>
            </a>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-[180px]">
              Where simplicity meets the finest tech in Kenya.
            </p>
          </div>

          {[
            { heading: 'Shop',    links: [['All Products', '/user-dashboard'], ['Deals', '/deals'], ['New Arrivals', '/new']] },
            { heading: 'Company', links: [['About Us', '/aboutus'], ['Contact', '/contact'], ['Careers', '/careers']] },
            { heading: 'Support', links: [['FAQ', '/faq'], ['Returns', '/returns'], ['Warranty', '/warranty']] },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-500 mb-5">{heading}</h4>
              <ul className="space-y-3">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-sm text-zinc-500 hover:text-black transition-colors">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-50 px-6 lg:px-10 py-5 max-w-7xl mx-auto
                        flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-xs text-zinc-300">© {new Date().getFullYear()} Gad&gets. All rights reserved.</span>
          <span className="text-xs text-zinc-300">Made with ❤️ in Nairobi, Kenya</span>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;