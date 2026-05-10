import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  RiSearchLine, RiCloseLine, RiFilterLine, RiCheckLine,
  RiLayoutGridLine, RiLayoutMasonryLine, RiLayoutRowLine, RiListCheck2,
  RiHeartLine, RiHeartFill, RiAddLine, RiShoppingBagLine,
  RiPercentLine, RiArrowDownSLine,
} from 'react-icons/ri';
import { API, CATEGORIES } from '../common/constants';
import ProductCard from '../common/ProductCard';

const LAYOUTS = [
  { id: 'grid4', label: 'Grid',        icon: RiLayoutGridLine,    gridClass: 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4', cardMode: 'card'  },
  { id: 'grid3', label: 'Comfortable', icon: RiLayoutMasonryLine, gridClass: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5', cardMode: 'card'  },
  { id: 'grid2', label: 'Large',       icon: RiLayoutRowLine,     gridClass: 'grid grid-cols-1 sm:grid-cols-2 gap-6',                cardMode: 'card'  },
  { id: 'list',  label: 'List',        icon: RiListCheck2,        gridClass: 'flex flex-col gap-2',                                  cardMode: 'list'  },
];

const SORT_OPTIONS = [
  { value: 'discount_desc', label: 'Highest Discount' },
  { value: 'price_asc',     label: 'Price: Low → High' },
  { value: 'price_desc',    label: 'Price: High → Low' },
  { value: 'name_asc',      label: 'Name A–Z' },
];

/* ── Product row (list mode) ────────────────────────────────── */
const ProductRow = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onProductClick }) => {
  const img         = product.images?.[0];
  const hasDiscount = product.discount > 0;
  const finalPrice  = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;

  return (
    <div
      onClick={() => onProductClick(product)}
      className="group flex items-center gap-4 bg-white border border-zinc-100 p-3.5 cursor-pointer
                 transition-all duration-200 hover:border-zinc-300 hover:shadow-sm rounded-sm"
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-sm bg-zinc-50 overflow-hidden flex-shrink-0 border border-zinc-100">
        {img ? (
          <img
            src={`${API}/uploads/${img}`}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <RiShoppingBagLine className="text-zinc-200 text-2xl" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-400
                           border border-zinc-100 bg-zinc-50 px-2 py-0.5 rounded-sm">
            {product.category}
          </span>
          {hasDiscount && (
            <span className="text-[9px] font-black bg-orange-500 text-white px-1.5 py-0.5 rounded-sm">
              -{product.discount}%
            </span>
          )}
        </div>
        <h3 className="text-sm font-black text-black truncate">{product.name}</h3>
        <p className="text-xs text-zinc-400 line-clamp-1 hidden sm:block">{product.description}</p>
      </div>

      {/* Price + actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="hidden sm:block text-right">
          {hasDiscount ? (
            <>
              <div className="text-base font-black text-black leading-tight">
                KSh {Math.round(finalPrice).toLocaleString()}
              </div>
              <div className="text-xs text-zinc-400 line-through">
                KSh {product.price.toLocaleString()}
              </div>
            </>
          ) : (
            <div className="text-base font-black text-black">
              KSh {product.price.toLocaleString()}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          {/* Mobile price */}
          <div className="sm:hidden text-right">
            {hasDiscount ? (
              <>
                <div className="text-sm font-black text-black">KSh {Math.round(finalPrice).toLocaleString()}</div>
                <div className="text-[10px] text-zinc-400 line-through">KSh {product.price.toLocaleString()}</div>
              </>
            ) : (
              <div className="text-sm font-black text-black">KSh {product.price.toLocaleString()}</div>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={e => { e.stopPropagation(); onToggleWishlist(product.id); }}
            className={`w-8 h-8 rounded-sm border flex items-center justify-center transition-all ${
              isWishlisted
                ? 'bg-black border-black text-white'
                : 'border-zinc-200 text-zinc-400 hover:border-orange-500 hover:text-orange-500'
            }`}
          >
            {isWishlisted ? <RiHeartFill size={13} /> : <RiHeartLine size={13} />}
          </button>

          {/* Add to cart */}
          <button
            onClick={e => { e.stopPropagation(); onAddToCart(product); }}
            className="flex items-center gap-1.5 bg-orange-500 text-white text-[10px] font-black
                       uppercase tracking-[0.08em] px-3 py-2 rounded-sm hover:bg-orange-600
                       transition-colors active:scale-95"
          >
            <RiAddLine size={13} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Empty state ─────────────────────────────────────────────── */
const EmptyState = ({ onClear }) => (
  <div className="flex flex-col items-center justify-center py-28 gap-5 text-center">
    <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 flex items-center justify-center rounded-sm">
      <RiSearchLine className="text-2xl text-zinc-300" />
    </div>
    <div>
      <p className="text-sm font-black text-black tracking-tight">No deals found</p>
      <p className="text-xs text-zinc-400 mt-1">Try adjusting your search or filters</p>
    </div>
    <button
      onClick={onClear}
      className="text-[10px] font-black uppercase tracking-[0.12em] text-white bg-black
                 border border-black px-5 py-2.5 rounded-sm hover:bg-zinc-800 transition"
    >
      Clear all filters
    </button>
  </div>
);

/* ── Main ─────────────────────────────────────────────────────── */
const DealsView = ({ onAddToCart, onToggleWishlist, wishlist, onProductClick }) => {
  const [products, setProducts]         = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [sort, setSort]                 = useState('discount_desc');
  const [showSort, setShowSort]         = useState(false);
  const [layoutId, setLayoutId]         = useState(() => localStorage.getItem('dealsLayout') || 'grid4');
  const [activeCategory, setActiveCategory] = useState('All');

  const activeLayout = LAYOUTS.find(l => l.id === layoutId) || LAYOUTS[0];
  const activeSortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label || 'Sort';

  useEffect(() => {
    axios.get(`${API}/products/deals`)
      .then(res => { setProducts(res.data); setFiltered(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...products];
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory);
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) || (p.brand && p.brand.toLowerCase().includes(term))
      );
    }
    if      (sort === 'price_asc')     result.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc')    result.sort((a, b) => b.price - a.price);
    else if (sort === 'discount_desc') result.sort((a, b) => b.discount - a.discount);
    else if (sort === 'name_asc')      result.sort((a, b) => a.name.localeCompare(b.name));
    setFiltered(result);
  }, [products, search, sort, activeCategory]);

  useEffect(() => { localStorage.setItem('dealsLayout', layoutId); }, [layoutId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-zinc-100" />
          <div className="absolute inset-0 rounded-full border-2 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Loading deals…</p>
      </div>
    );
  }

  const handleClear = () => { setSearch(''); setActiveCategory('All'); setSort('discount_desc'); };

  return (
    <div className="relative">

      {/* ── Page header ─────────────────────────────────────── */}
      <div className="mb-6 pb-6 border-b border-zinc-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-5 h-[2px] bg-orange-500" />
          <p className="font-black uppercase text-orange-500"
             style={{ fontSize: '0.58rem', letterSpacing: '0.22em' }}>
            Limited Time
          </p>
        </div>
        <div className="flex items-end justify-between gap-4">
          <h1 className="text-black font-black leading-tight"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 2.3rem)', letterSpacing: '-0.025em' }}>
            Today's Deals
          </h1>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <RiPercentLine className="text-orange-500" size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-400">
              {products.length} deals active
            </span>
          </div>
        </div>
      </div>

      {/* ── Sticky toolbar ──────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white pt-1 pb-4 space-y-3 border-b border-zinc-100 mb-6">

        {/* Search + sort + layout */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search */}
          <div className="relative flex-1">
            <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or brand…"
              className="w-full pl-10 pr-10 py-3 text-xs font-bold bg-white border border-zinc-200
                         rounded-sm outline-none transition-all
                         focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15
                         placeholder:text-zinc-300 placeholder:font-normal"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-orange-500 transition-colors"
              >
                <RiCloseLine size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-[0.1em]
                           border border-zinc-200 rounded-sm bg-white text-zinc-500
                           hover:border-zinc-400 hover:text-black transition-all"
              >
                <RiFilterLine size={13} />
                <span className="hidden sm:inline">{activeSortLabel}</span>
                <span className="sm:hidden">Sort</span>
                <RiArrowDownSLine size={13} className={`transition-transform ${showSort ? 'rotate-180' : ''}`} />
              </button>
              {showSort && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-zinc-100
                                  rounded-sm shadow-lg z-20 overflow-hidden">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSort(opt.value); setShowSort(false); }}
                        className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-[0.08em]
                                   flex items-center justify-between transition-colors
                                   ${sort === opt.value
                                     ? 'bg-orange-500 text-white'
                                     : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
                                   }`}
                      >
                        {opt.label}
                        {sort === opt.value && <RiCheckLine size={12} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Layout switcher */}
            <div className="flex items-center p-0.5 border border-zinc-200 rounded-sm bg-white gap-0.5">
              {LAYOUTS.map(({ id, label, icon: Icon }) => {
                const active = layoutId === id;
                return (
                  <button
                    key={id}
                    onClick={() => setLayoutId(id)}
                    title={label}
                    className={`w-8 h-8 rounded-sm flex items-center justify-center transition-all ${
                      active
                        ? 'bg-orange-500 text-white'
                        : 'text-zinc-400 hover:text-black hover:bg-zinc-50'
                    }`}
                  >
                    <Icon size={14} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(({ label }) => {
            const active = activeCategory === label;
            return (
              <button
                key={label}
                onClick={() => setActiveCategory(label)}
                className={`flex-shrink-0 text-[9px] font-black uppercase tracking-[0.1em] px-3.5 py-1.5 rounded-sm border transition-all ${
                  active
                    ? 'bg-black text-white border-black'
                    : 'border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-black'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400">
            <span className="text-black">{filtered.length}</span>{' '}
            deal{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'All' && (
              <> · <span className="text-black">{activeCategory}</span></>
            )}
            {search && (
              <> · "<span className="text-black">{search}</span>"</>
            )}
          </p>
          <span className="text-[9px] font-black uppercase tracking-[0.16em] text-zinc-300 hidden sm:block">
            {activeLayout.label} view
          </span>
        </div>
      </div>

      {/* ── Product grid / list ──────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className={activeLayout.gridClass}>
          {filtered.map(product =>
            activeLayout.cardMode === 'list' ? (
              <ProductRow
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlist.includes(product.id)}
                onProductClick={onProductClick}
              />
            ) : (
              <div
                key={product.id}
                onClick={() => onProductClick(product)}
                className="cursor-pointer"
              >
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlist.includes(product.id)}
                  onPreview={onProductClick}
                />
              </div>
            )
          )}
        </div>
      ) : (
        <EmptyState onClear={handleClear} />
      )}
    </div>
  );
};

export default DealsView;