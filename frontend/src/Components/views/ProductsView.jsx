import React, { useState, useRef } from 'react';
import {
  RiSearchLine, RiCloseLine, RiFilterLine, RiCheckLine,
  RiLayoutGridLine, RiLayoutMasonryLine, RiLayoutRowLine, RiListCheck2,
  RiHeartLine, RiHeartFill, RiAddLine, RiShoppingBagLine,
} from 'react-icons/ri';
import ProductCard from '../common/ProductCard';
import { CATEGORIES, SORT_OPTIONS } from '../common/constants';

/* ── Layout configs ────────────────────────────────────────── */
const LAYOUTS = [
  { id: 'grid4', label: 'Grid', icon: RiLayoutGridLine, gridClass: 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4', cardMode: 'card' },
  { id: 'grid3', label: 'Comfortable', icon: RiLayoutMasonryLine, gridClass: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5', cardMode: 'card' },
  { id: 'grid2', label: 'Large', icon: RiLayoutRowLine, gridClass: 'grid grid-cols-1 sm:grid-cols-2 gap-6', cardMode: 'card' },
  { id: 'list', label: 'List', icon: RiListCheck2, gridClass: 'flex flex-col gap-3', cardMode: 'list' },
];

/* ── List-mode product row ─────────────────────────────────── */
const ProductRow = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onProductClick }) => {
  const API = 'http://localhost:5000';
  const img = product.images?.[0];
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;

  return (
    <div
      onClick={() => onProductClick(product)}
      className="group flex items-center gap-4 bg-white rounded-2xl border border-zinc-100 p-3 cursor-pointer transition-all duration-200 hover:border-zinc-300 hover:shadow-md"
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-zinc-50 overflow-hidden flex-shrink-0 border border-zinc-100">
        {img ? (
          <img src={`${API}/uploads/${img}`} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><RiShoppingBagLine className="text-zinc-200 text-2xl" /></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400 border border-zinc-100 bg-zinc-50 px-2 py-0.5 rounded-full">{product.category}</span>
          {hasDiscount && <span className="text-[9px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded-full">-{product.discount}%</span>}
        </div>
        <h3 className="text-sm font-bold text-black truncate">{product.name}</h3>
        <p className="text-xs text-zinc-400 line-clamp-1 hidden sm:block">{product.description}</p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="hidden sm:block">
          {hasDiscount ? (
            <div>
              <span className="text-base font-black">KSh {Math.round(discountedPrice).toLocaleString()}</span>
              <span className="text-xs text-zinc-400 line-through ml-2">KSh {product.price.toLocaleString()}</span>
            </div>
          ) : (
            <span className="text-base font-black">KSh {product.price.toLocaleString()}</span>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="sm:hidden">
            {hasDiscount ? (
              <div>
                <span className="text-sm font-black">KSh {Math.round(discountedPrice).toLocaleString()}</span>
                <span className="text-[10px] text-zinc-400 line-through ml-1">KSh {product.price.toLocaleString()}</span>
              </div>
            ) : (
              <span className="text-sm font-black">KSh {product.price.toLocaleString()}</span>
            )}
          </div>
          <button
            onClick={e => { e.stopPropagation(); onToggleWishlist(product.id); }}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${isWishlisted ? 'bg-black border-black text-white' : 'border-zinc-200 text-zinc-400 hover:border-zinc-400 hover:text-black'}`}
          >
            {isWishlisted ? <RiHeartFill size={13} /> : <RiHeartLine size={13} />}
          </button>
          <button
            onClick={e => { e.stopPropagation(); onAddToCart(product); }}
            className="flex items-center gap-1.5 bg-black text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-zinc-800 transition-colors active:scale-95"
          >
            <RiAddLine size={13} /><span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main ProductsView with sticky toolbar ─────────────────── */
const ProductsView = ({
  products, onAddToCart, onToggleWishlist, wishlist,
  onProductClick, activeCategory, onCategoryChange,
}) => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [showSort, setShowSort] = useState(false);
  const [layoutId, setLayoutId] = useState('grid4');
  const searchRef = useRef(null);

  const activeLayout = LAYOUTS.find(l => l.id === layoutId) || LAYOUTS[0];

  const filtered = products
    .filter(p => (activeCategory === 'All' || p.category === activeCategory) &&
      (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price;
      if (sort === 'price_desc') return b.price - a.price;
      if (sort === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="relative">
      {/* Sticky header – search, sort, layout, categories */}
      <div className="sticky top-0 z-20 bg-zinc-50/95 backdrop-blur-sm pt-1 pb-3 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-xl
                         text-black placeholder:text-zinc-400 outline-none
                         focus:border-black focus:ring-1 focus:ring-black transition-all shadow-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black">
                <RiCloseLine size={14} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border border-zinc-200 rounded-xl bg-white text-zinc-600 hover:border-zinc-400 hover:text-black transition-all h-full shadow-sm"
              >
                <RiFilterLine size={14} />
                <span className="hidden sm:inline">{SORT_OPTIONS.find(o => o.value === sort)?.label}</span>
                <span className="sm:hidden">Sort</span>
              </button>
              {showSort && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-zinc-100 rounded-2xl overflow-hidden z-20 shadow-lg">
                    {SORT_OPTIONS.map(o => (
                      <button
                        key={o.value}
                        onClick={() => { setSort(o.value); setShowSort(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-zinc-50 flex justify-between ${sort === o.value ? 'text-black' : 'text-zinc-500'}`}
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
            <div className="flex items-center gap-0.5 p-1 rounded-xl border border-zinc-200 bg-white shadow-sm">
              {LAYOUTS.map(({ id, label, icon: Icon }) => {
                const active = layoutId === id;
                return (
                  <button
                    key={id}
                    onClick={() => setLayoutId(id)}
                    title={label}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 ${active ? 'bg-black text-white shadow-sm' : 'text-zinc-400 hover:text-black hover:bg-zinc-50'}`}
                  >
                    <Icon size={15} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category pills – wrap, no scroll */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(({ label }) => (
            <button
              key={label}
              onClick={() => onCategoryChange(label)}
              className={`flex-shrink-0 text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all
                          ${activeCategory === label ? 'bg-black text-white border-black' : 'border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-black'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Count and active layout label */}
        <div className="flex justify-between items-center pt-1">
          <p className="text-xs font-medium text-zinc-400">
            <span className="font-black text-black">{filtered.length}</span> product{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'All' && <> in <span className="font-bold text-black">{activeCategory}</span></>}
          </p>
          <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.12em] hidden sm:block">
            {activeLayout.label} view
          </span>
        </div>
      </div>

      {/* Product grid/list */}
      {filtered.length > 0 ? (
        <div className={activeLayout.gridClass}>
          {filtered.map(p =>
            activeLayout.cardMode === 'list' ? (
              <ProductRow
                key={p.id}
                product={p}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlist.includes(p.id)}
                onProductClick={onProductClick}
              />
            ) : (
              <div key={p.id} onClick={() => onProductClick(p)} className="cursor-pointer">
                <ProductCard
                  product={p}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlist.includes(p.id)}
                  onPreview={onProductClick}
                />
              </div>
            )
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
            <RiSearchLine className="text-2xl text-zinc-300" />
          </div>
          <div>
            <p className="text-sm font-bold text-black">No products found</p>
            <p className="text-xs text-zinc-400 mt-1">Try adjusting your search or filters</p>
          </div>
          <button
            onClick={() => { setSearch(''); onCategoryChange('All'); }}
            className="text-xs font-bold text-black border border-zinc-200 px-4 py-2 rounded-xl hover:bg-zinc-50 transition"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsView;