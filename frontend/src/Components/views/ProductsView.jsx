import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../common/constants';
import { CATEGORIES, SORT_OPTIONS } from '../common/constants';
import ProductCard from '../common/ProductCard';
import { RiSearchLine, RiCloseLine, RiFilterLine, RiCheckLine, RiLayoutGridLine, RiLayoutMasonryLine, RiLayoutRowLine, RiListCheck2 } from 'react-icons/ri';

const LAYOUTS = [
  { id: 'grid4', label: 'Grid', icon: RiLayoutGridLine, gridClass: 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4', cardMode: 'card' },
  { id: 'grid3', label: 'Comfortable', icon: RiLayoutMasonryLine, gridClass: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5', cardMode: 'card' },
  { id: 'grid2', label: 'Large', icon: RiLayoutRowLine, gridClass: 'grid grid-cols-1 sm:grid-cols-2 gap-6', cardMode: 'card' },
  { id: 'list', label: 'List', icon: RiListCheck2, gridClass: 'flex flex-col gap-3', cardMode: 'list' },
];

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
      setFiltered(res.data.products);
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
      {/* Sticky header – same as before */}
      <div className="sticky top-0 z-20 bg-zinc-50/95 backdrop-blur-sm pt-1 pb-3 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black shadow-sm" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"><RiCloseLine size={14} /></button>}
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <button onClick={() => setShowSort(!showSort)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border border-zinc-200 rounded-xl bg-white text-zinc-600 hover:border-zinc-400 hover:text-black transition-all h-full shadow-sm"><RiFilterLine size={14} /><span className="hidden sm:inline">{SORT_OPTIONS.find(o => o.value === sort)?.label}</span><span className="sm:hidden">Sort</span></button>
              {showSort && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-zinc-100 rounded-2xl overflow-hidden z-20 shadow-lg">
                    {SORT_OPTIONS.map(o => (
                      <button key={o.value} onClick={() => { setSort(o.value); setShowSort(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-zinc-50 flex justify-between ${sort === o.value ? 'text-black' : 'text-zinc-500'}`}>{o.label}{sort === o.value && <RiCheckLine size={12} />}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-0.5 p-1 rounded-xl border border-zinc-200 bg-white shadow-sm">
              {LAYOUTS.map(({ id, label, icon: Icon }) => {
                const active = layoutId === id;
                return <button key={id} onClick={() => setLayoutId(id)} title={label} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 ${active ? 'bg-black text-white shadow-sm' : 'text-zinc-400 hover:text-black hover:bg-zinc-50'}`}><Icon size={15} /></button>;
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(({ label }) => (
            <button key={label} onClick={() => onCategoryChange(label)} className={`flex-shrink-0 text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all ${activeCategory === label ? 'bg-black text-white border-black' : 'border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-black'}`}>{label}</button>
          ))}
        </div>
        <div className="flex justify-between items-center pt-1">
          <p className="text-xs font-medium text-zinc-400"><span className="font-black text-black">{filtered.length}</span> product{filtered.length !== 1 ? 's' : ''}{activeCategory !== 'All' && <> in <span className="font-bold text-black">{activeCategory}</span></>}</p>
          <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.12em] hidden sm:block">{activeLayout.label} view</span>
        </div>
      </div>

      {loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" /></div> : (
        <>
          {filtered.length > 0 ? (
            <div className={activeLayout.gridClass}>
              {filtered.map(p => activeLayout.cardMode === 'list' ? (
                <div key={p.id} onClick={() => onProductClick(p)} className="cursor-pointer"><ProductRow product={p} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} isWishlisted={wishlist.includes(p.id)} onProductClick={onProductClick} /></div>
              ) : (
                <div key={p.id} onClick={() => onProductClick(p)} className="cursor-pointer"><ProductCard product={p} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} isWishlisted={wishlist.includes(p.id)} onPreview={onProductClick} /></div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center"><RiSearchLine className="text-2xl text-zinc-300" /></div>
              <div><p className="text-sm font-bold text-black">No products found</p><p className="text-xs text-zinc-400 mt-1">Try adjusting your search or filters</p></div>
              <button onClick={() => { setSearch(''); onCategoryChange('All'); }} className="text-xs font-bold text-black border border-zinc-200 px-4 py-2 rounded-xl hover:bg-zinc-50">Clear filters</button>
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-3 py-1 border rounded-lg disabled:opacity-50">Previous</button>
              <span className="px-3 py-1">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="px-3 py-1 border rounded-lg disabled:opacity-50">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsView;