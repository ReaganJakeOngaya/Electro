import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  RiSearchLine, RiCloseLine, RiFilterLine, RiCheckLine,
  RiLayoutGridLine, RiLayoutMasonryLine, RiLayoutRowLine, RiListCheck2,
  RiHeartLine, RiHeartFill, RiAddLine, RiShoppingBagLine,
} from 'react-icons/ri';
import { API } from '../common/constants';
import { CATEGORIES } from '../common/constants';
import ProductCard from '../common/ProductCard';

/* ── Layout configs (same as ProductsView) ── */
const LAYOUTS = [
  { id: 'grid4', label: 'Grid', icon: RiLayoutGridLine, gridClass: 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4', cardMode: 'card' },
  { id: 'grid3', label: 'Comfortable', icon: RiLayoutMasonryLine, gridClass: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5', cardMode: 'card' },
  { id: 'grid2', label: 'Large', icon: RiLayoutRowLine, gridClass: 'grid grid-cols-1 sm:grid-cols-2 gap-6', cardMode: 'card' },
  { id: 'list', label: 'List', icon: RiListCheck2, gridClass: 'flex flex-col gap-3', cardMode: 'list' },
];

/* ── List row (discount‑aware) ── */
const ProductRow = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onProductClick }) => {
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

/* ── Main DealsView with sticky toolbar ────────────────────── */
const DealsView = ({ onAddToCart, onToggleWishlist, wishlist, onProductClick }) => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('discount_desc');
  const [showSort, setShowSort] = useState(false);
  const [layoutId, setLayoutId] = useState(() => localStorage.getItem('dealsLayout') || 'grid4');
  const [activeCategory, setActiveCategory] = useState('All');

  const activeLayout = LAYOUTS.find(l => l.id === layoutId) || LAYOUTS[0];

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
      result = result.filter(p => p.name.toLowerCase().includes(term) || (p.brand && p.brand.toLowerCase().includes(term)));
    }
    if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sort === 'discount_desc') result.sort((a, b) => b.discount - a.discount);
    else if (sort === 'name_asc') result.sort((a, b) => a.name.localeCompare(b.name));
    setFiltered(result);
  }, [products, search, sort, activeCategory]);

  useEffect(() => { localStorage.setItem('dealsLayout', layoutId); }, [layoutId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="sticky top-0 z-20 bg-zinc-50/95 backdrop-blur-sm pt-1 pb-3 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search deals by name or brand…"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black shadow-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black">
                <RiCloseLine size={14} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border border-zinc-200 rounded-xl bg-white text-zinc-600 hover:border-zinc-400 hover:text-black h-full shadow-sm"
              >
                <RiFilterLine size={14} />
                <span className="hidden sm:inline">
                  {sort === 'discount_desc' ? 'Highest Discount' :
                   sort === 'price_asc' ? 'Price: Low → High' :
                   sort === 'price_desc' ? 'Price: High → Low' : 'Name A–Z'}
                </span>
                <span className="sm:hidden">Sort</span>
              </button>
              {showSort && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-zinc-100 rounded-2xl overflow-hidden z-20 shadow-lg">
                    {[
                      { value: 'discount_desc', label: 'Highest Discount' },
                      { value: 'price_asc', label: 'Price: Low → High' },
                      { value: 'price_desc', label: 'Price: High → Low' },
                      { value: 'name_asc', label: 'Name A–Z' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSort(opt.value); setShowSort(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-zinc-50 flex justify-between ${sort === opt.value ? 'text-black' : 'text-zinc-500'}`}
                      >
                        {opt.label}
                        {sort === opt.value && <RiCheckLine size={12} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-0.5 p-1 rounded-xl border border-zinc-200 bg-white shadow-sm">
              {LAYOUTS.map(({ id, label, icon: Icon }) => {
                const active = layoutId === id;
                return (
                  <button
                    key={id}
                    onClick={() => setLayoutId(id)}
                    title={label}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${active ? 'bg-black text-white' : 'text-zinc-400 hover:text-black hover:bg-zinc-50'}`}
                  >
                    <Icon size={15} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category pills – wrapping */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(({ label }) => (
            <button
              key={label}
              onClick={() => setActiveCategory(label)}
              className={`flex-shrink-0 text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all
                          ${activeCategory === label ? 'bg-black text-white border-black' : 'border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-black'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center pt-1">
          <p className="text-xs font-medium text-zinc-400">
            <span className="font-black text-black">{filtered.length}</span> deal{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'All' && <> in <span className="font-bold text-black">{activeCategory}</span></>}
          </p>
          <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.12em] hidden sm:block">
            {activeLayout.label} view
          </span>
        </div>
      </div>

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
              <div key={product.id} onClick={() => onProductClick(product)} className="cursor-pointer">
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
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
            <RiSearchLine className="text-2xl text-zinc-300" />
          </div>
          <div>
            <p className="text-sm font-bold text-black">No deals found</p>
            <p className="text-xs text-zinc-400 mt-1">Try adjusting your search or filters</p>
          </div>
          <button
            onClick={() => { setSearch(''); setActiveCategory('All'); setSort('discount_desc'); }}
            className="text-xs font-bold text-black border border-zinc-200 px-4 py-2 rounded-xl hover:bg-zinc-50 transition"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default DealsView;