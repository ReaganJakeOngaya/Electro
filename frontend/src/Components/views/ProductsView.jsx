import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API, CATEGORIES, SORT_OPTIONS } from '../common/constants';
import ProductCard from '../common/ProductCard';
import {
  RiSearchLine, RiCloseLine, RiFilterLine, RiCheckLine,
  RiLayoutGridLine, RiLayoutMasonryLine, RiLayoutRowLine, RiListCheck2,
  RiHeartLine, RiHeartFill, RiShoppingBagLine, RiArrowDownSLine,
  RiArrowLeftSLine, RiArrowRightSLine, RiApps2Line,
} from 'react-icons/ri';

/* ── Layout definitions ───────────────────────────────────────
   micro  → compact ProductCard tiles, lots on screen at once
   grid4  → standard 4-col
   grid3  → comfortable 3-col
   grid2  → large 2-col
   list   → horizontal row
   ─────────────────────────────────────────────────────────── */
const LAYOUTS = [
  {
    id: 'micro',
    label: 'Micro',
    icon: RiApps2Line,
    gridClass: 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2',
    cardMode: 'micro',
  },
  {
    id: 'grid4',
    label: 'Grid',
    icon: RiLayoutGridLine,
    gridClass: 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4',
    cardMode: 'card',
  },
  {
    id: 'grid3',
    label: 'Comfortable',
    icon: RiLayoutMasonryLine,
    gridClass: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5',
    cardMode: 'card',
  },
  {
    id: 'grid2',
    label: 'Large',
    icon: RiLayoutRowLine,
    gridClass: 'grid grid-cols-1 sm:grid-cols-2 gap-6',
    cardMode: 'card',
  },
  {
    id: 'list',
    label: 'List',
    icon: RiListCheck2,
    gridClass: 'flex flex-col gap-2',
    cardMode: 'list',
  },
];

/* ── Product row (list mode) ──────────────────────────────────── */
const ProductRow = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onProductClick }) => {
  const img         = product.images?.[0];
  const hasDiscount = product.discount > 0;
  const finalPrice  = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;

  return (
    <div
      onClick={() => onProductClick(product)}
      className="group flex items-center gap-4 p-4 bg-white border border-zinc-100 rounded-sm
                 hover:border-zinc-300 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="w-[72px] h-[72px] bg-gradient-to-b from-zinc-50 to-white flex items-center justify-center
                      flex-shrink-0 rounded-sm border border-zinc-100 overflow-hidden">
        {img ? (
          <img src={`${API}/uploads/${img}`} alt={product.name}
               className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <RiShoppingBagLine className="text-zinc-300 text-2xl" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-zinc-400
                         border border-zinc-100 bg-zinc-50 px-2 py-0.5 rounded-sm">
            {product.category}
          </p>
          {hasDiscount && (
            <span className="text-[9px] font-black bg-orange-500 text-white px-1.5 py-0.5 rounded-sm">
              -{product.discount}%
            </span>
          )}
        </div>
        <h3 className="text-sm font-black text-black truncate">{product.name}</h3>
        <p className="text-xs text-zinc-400 line-clamp-1 hidden sm:block">{product.description}</p>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-sm font-black text-black">
            KSh {hasDiscount ? Math.round(finalPrice).toLocaleString() : product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-zinc-400 line-through">KSh {product.price.toLocaleString()}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={e => { e.stopPropagation(); onToggleWishlist(product.id); }}
          className={`w-8 h-8 flex items-center justify-center rounded-sm border transition-all ${
            isWishlisted ? 'bg-black border-black text-white' : 'border-zinc-200 text-zinc-400 hover:border-orange-500 hover:text-orange-500'
          }`}
        >
          {isWishlisted ? <RiHeartFill size={13} /> : <RiHeartLine size={13} />}
        </button>
        <button
          onClick={e => { e.stopPropagation(); onAddToCart(product); }}
          className="flex items-center gap-1.5 bg-orange-500 text-white text-[10px] font-black
                     uppercase tracking-[0.08em] px-3 py-2 rounded-sm hover:bg-orange-600
                     transition-colors active:scale-95"
          style={{ boxShadow: '0 2px 8px rgba(240,90,26,0.22)' }}
        >
          Add
        </button>
      </div>
    </div>
  );
};

/* ── Empty state ──────────────────────────────────────────────── */
const EmptyState = ({ onClear }) => (
  <div className="flex flex-col items-center justify-center py-28 gap-5 text-center">
    <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 flex items-center justify-center rounded-sm">
      <RiSearchLine className="text-2xl text-zinc-300" />
    </div>
    <div>
      <p className="text-sm font-black text-black">No products found</p>
      <p className="text-xs text-zinc-400 mt-1">Try adjusting your search or filters</p>
    </div>
    <button
      onClick={onClear}
      className="text-[10px] font-black uppercase tracking-[0.12em] text-white bg-black
                 px-5 py-2.5 rounded-sm hover:bg-zinc-800 transition"
    >
      Clear filters
    </button>
  </div>
);

/* ── Main ─────────────────────────────────────────────────────── */
const ProductsView = ({ onAddToCart, onToggleWishlist, wishlist, onProductClick, activeCategory, onCategoryChange }) => {
  const [products, setProducts]     = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage]                   = useState(12);
  const [search, setSearch]         = useState('');
  const [sort, setSort]             = useState('default');
  const [showSort, setShowSort]     = useState(false);
  const [layoutId, setLayoutId]     = useState(() => localStorage.getItem('productsLayout') || 'grid4');

  const activeLayout    = LAYOUTS.find(l => l.id === layoutId) || LAYOUTS[1];
  const activeSortLabel = SORT_OPTIONS?.find(o => o.value === sort)?.label || 'Default';

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/products?page=${page}&per_page=${perPage}`);
      setProducts(res.data.products);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [page]);
  useEffect(() => { localStorage.setItem('productsLayout', layoutId); }, [layoutId]);

  useEffect(() => {
    let result = [...products];
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory);
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) || p.description?.toLowerCase().includes(term)
      );
    }
    if      (sort === 'price_asc')  result.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sort === 'name_asc')   result.sort((a, b) => a.name.localeCompare(b.name));
    setFiltered(result);
  }, [products, search, sort, activeCategory]);

  return (
    <div className="relative">

      {/* ── Page header ───────────────────────────────────────── */}
      <div className="mb-6 pb-6 border-b border-zinc-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-5 h-[2px] bg-orange-500" />
          <p className="font-black uppercase text-orange-500"
             style={{ fontSize: '0.58rem', letterSpacing: '0.22em' }}>Catalogue</p>
        </div>
        <h1 className="text-black font-black leading-tight"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 2.3rem)', letterSpacing: '-0.025em' }}>
          All Products
        </h1>
      </div>

      {/* ── Sticky toolbar ────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white pt-1 pb-4 space-y-3 border-b border-zinc-100 mb-6">

        {/* Search + sort + layout */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search */}
          <div className="relative flex-1">
            <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
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
            {/* Sort */}
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
                    {(SORT_OPTIONS || [
                      { value: 'default',    label: 'Default'           },
                      { value: 'price_asc',  label: 'Price: Low → High' },
                      { value: 'price_desc', label: 'Price: High → Low' },
                      { value: 'name_asc',   label: 'Name A–Z'          },
                    ]).map(o => (
                      <button
                        key={o.value}
                        onClick={() => { setSort(o.value); setShowSort(false); }}
                        className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-[0.08em]
                                   flex items-center justify-between transition-colors
                                   ${sort === o.value
                                     ? 'bg-orange-500 text-white'
                                     : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
                                   }`}
                      >
                        {o.label}
                        {sort === o.value && <RiCheckLine size={12} />}
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
                    className={`w-8 h-8 rounded-sm flex items-center justify-center transition-all relative ${
                      active ? 'bg-orange-500 text-white' : 'text-zinc-400 hover:text-black hover:bg-zinc-50'
                    }`}
                  >
                    <Icon size={id === 'micro' ? 13 : 14} />
                    {/* Micro badge */}
                    {id === 'micro' && (
                      <span className={`absolute -top-1 -right-1 text-[6px] font-black px-0.5 rounded-sm leading-none
                                        ${active ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'}`}>
                        MAX
                      </span>
                    )}
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
                onClick={() => onCategoryChange(label)}
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

        {/* Count + hint */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400">
            <span className="text-black">{filtered.length}</span>{' '}
            product{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'All' && <> · <span className="text-black">{activeCategory}</span></>}
            {search && <> · "<span className="text-black">{search}</span>"</>}
          </p>
          <div className="flex items-center gap-2">
            {activeLayout.id === 'micro' && (
              <span className="text-[9px] font-black uppercase tracking-[0.12em] text-orange-500
                               bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-sm">
                Compact view
              </span>
            )}
            <span className="text-[9px] font-black uppercase tracking-[0.16em] text-zinc-300 hidden sm:block">
              {activeLayout.label}
            </span>
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-2 border-zinc-100" />
            <div className="absolute inset-0 rounded-full border-2 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Loading products…</p>
        </div>
      ) : filtered.length > 0 ? (
        <>
          <div className={activeLayout.gridClass}>
            {filtered.map(p => {
              if (activeLayout.cardMode === 'list') {
                return (
                  <ProductRow
                    key={p.id}
                    product={p}
                    onAddToCart={onAddToCart}
                    onToggleWishlist={onToggleWishlist}
                    isWishlisted={wishlist.includes(p.id)}
                    onProductClick={onProductClick}
                  />
                );
              }
              if (activeLayout.cardMode === 'micro') {
                return (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onAddToCart={onAddToCart}
                    onToggleWishlist={onToggleWishlist}
                    isWishlisted={wishlist.includes(p.id)}
                    onPreview={onProductClick}
                    compact
                  />
                );
              }
              return (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlist.includes(p.id)}
                  onPreview={onProductClick}
                />
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10 pt-8 border-t border-zinc-100">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-zinc-200 rounded-sm
                           text-[10px] font-black uppercase tracking-[0.1em] text-zinc-500
                           hover:border-zinc-400 hover:text-black transition-all
                           disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <RiArrowLeftSLine size={14} /> Prev
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                  .reduce((acc, n, idx, arr) => {
                    if (idx > 0 && n - arr[idx - 1] > 1) acc.push('…');
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((item, i) =>
                    item === '…' ? (
                      <span key={`e-${i}`} className="px-2 text-zinc-300 text-xs font-black">…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item)}
                        className={`w-8 h-8 rounded-sm text-[10px] font-black transition-all ${
                          page === item
                            ? 'bg-orange-500 text-white'
                            : 'border border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-black'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-zinc-200 rounded-sm
                           text-[10px] font-black uppercase tracking-[0.1em] text-zinc-500
                           hover:border-zinc-400 hover:text-black transition-all
                           disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next <RiArrowRightSLine size={14} />
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState onClear={() => { setSearch(''); onCategoryChange('All'); }} />
      )}
    </div>
  );
};

export default ProductsView;