// src/Components/Products/ProductsView.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API, CATEGORIES, SORT_OPTIONS } from '../common/constants';
import ProductCard from '../common/ProductCard';
import { RiSearchLine, RiCloseLine, RiFilterLine, RiCheckLine, RiLayoutGridLine, RiLayoutMasonryLine, RiLayoutRowLine, RiListCheck2 } from 'react-icons/ri';

const LAYOUTS = [
  { id: 'grid4', label: 'Grid', icon: RiLayoutGridLine, gridClass: 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4', cardMode: 'card' },
  { id: 'grid3', label: 'Comfortable', icon: RiLayoutMasonryLine, gridClass: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5', cardMode: 'card' },
  { id: 'grid2', label: 'Large', icon: RiLayoutRowLine, gridClass: 'grid grid-cols-1 sm:grid-cols-2 gap-6', cardMode: 'card' },
  { id: 'list', label: 'List', icon: RiListCheck2, gridClass: 'flex flex-col gap-3', cardMode: 'list' },
];

const ProductRow = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onProductClick }) => (
  <div className="group flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-sm hover:border-orange-500 transition-all cursor-pointer" onClick={() => onProductClick(product)}>
    <div className="w-20 h-20 bg-gray-50 flex items-center justify-center flex-shrink-0">
      {product.images?.[0] ? (
        <img src={`${API}/uploads/${product.images[0]}`} alt={product.name} className="w-full h-full object-contain" />
      ) : (
        <RiShoppingBagLine className="text-gray-300 text-2xl" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">{product.category}</p>
      <h3 className="text-sm font-black text-black truncate">{product.name}</h3>
      <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
      <div className="flex items-center gap-3 mt-1">
        <span className="text-base font-black text-black">KSh {product.price.toLocaleString()}</span>
        {product.discount > 0 && <span className="text-xs text-gray-400 line-through">KSh {Math.round(product.price * (1 - product.discount/100)).toLocaleString()}</span>}
      </div>
    </div>
    <div className="flex gap-2">
      <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} className="btn-sm btn-primary">Add</button>
      <button onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }} className={`w-8 h-8 flex items-center justify-center rounded-sm border ${isWishlisted ? 'bg-black border-black text-white' : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'}`}>
        {isWishlisted ? <RiHeartFill size={14} /> : <RiHeartLine size={14} />}
      </button>
    </div>
  </div>
);

const ProductsView = ({ onAddToCart, onToggleWishlist, wishlist, onProductClick, activeCategory, onCategoryChange }) => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(12);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [showSort, setShowSort] = useState(false);
  const [layoutId, setLayoutId] = useState('grid4');
  const activeLayout = LAYOUTS.find(l => l.id === layoutId) || LAYOUTS[0];

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

  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    let result = [...products];
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory);
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(term) || p.description?.toLowerCase().includes(term));
    }
    if (sort === 'price_asc') result.sort((a,b) => a.price - b.price);
    else if (sort === 'price_desc') result.sort((a,b) => b.price - a.price);
    else if (sort === 'name_asc') result.sort((a,b) => a.name.localeCompare(b.name));
    setFiltered(result);
  }, [products, search, sort, activeCategory]);

  return (
    <div className="relative">
      {/* Sticky header – editorial style */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm pt-1 pb-3 space-y-3 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                <RiCloseLine size={14} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-[0.08em] border border-gray-200 rounded-sm bg-white text-gray-600 hover:border-gray-400 hover:text-black transition-all"
              >
                <RiFilterLine size={14} />
                <span className="hidden sm:inline">{SORT_OPTIONS.find(o => o.value === sort)?.label}</span>
                <span className="sm:hidden">Sort</span>
              </button>
              {showSort && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-sm shadow-lg z-20">
                    {SORT_OPTIONS.map(o => (
                      <button
                        key={o.value}
                        onClick={() => { setSort(o.value); setShowSort(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-black uppercase tracking-[0.06em] hover:bg-gray-50 flex justify-between ${sort === o.value ? 'text-black' : 'text-gray-500'}`}
                      >
                        {o.label}
                        {sort === o.value && <RiCheckLine size={12} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-0.5 p-0.5 border border-gray-200 rounded-sm bg-white">
              {LAYOUTS.map(({ id, label, icon: Icon }) => {
                const active = layoutId === id;
                return (
                  <button
                    key={id}
                    onClick={() => setLayoutId(id)}
                    title={label}
                    className={`w-8 h-8 rounded-sm flex items-center justify-center transition-all duration-150 ${active ? 'bg-black text-white' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}
                  >
                    <Icon size={15} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {/* Category pills – sharp, uppercase */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(({ label }) => (
            <button
              key={label}
              onClick={() => onCategoryChange(label)}
              className={`flex-shrink-0 text-[10px] font-black uppercase tracking-[0.08em] px-3.5 py-1.5 border transition-all rounded-sm ${activeCategory === label ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-black'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex justify-between items-center pt-1">
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">
            <span className="text-black">{filtered.length}</span> product{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'All' && <> in <span className="text-black">{activeCategory}</span></>}
          </p>
          <span className="text-[9px] font-black uppercase tracking-[0.16em] text-gray-300 hidden sm:block">
            {activeLayout.label} view
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {filtered.length > 0 ? (
            <div className={activeLayout.gridClass}>
              {filtered.map(p => activeLayout.cardMode === 'list' ? (
                <ProductRow
                  key={p.id}
                  product={p}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlist.includes(p.id)}
                  onProductClick={onProductClick}
                />
              ) : (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlist.includes(p.id)}
                  onPreview={onProductClick}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 bg-gray-50 border border-gray-100 flex items-center justify-center">
                <RiSearchLine className="text-2xl text-gray-300" />
              </div>
              <div>
                <p className="text-sm font-black text-black">No products found</p>
                <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
              </div>
              <button
                onClick={() => { setSearch(''); onCategoryChange('All'); }}
                className="text-xs font-black uppercase tracking-[0.1em] text-black border border-gray-200 px-4 py-2 rounded-sm hover:bg-gray-50"
              >
                Clear filters
              </button>
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p-1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-200 rounded-sm text-xs font-black disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-xs font-black">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p+1))}
                disabled={page === totalPages}
                className="px-3 py-1 border border-gray-200 rounded-sm text-xs font-black disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsView;