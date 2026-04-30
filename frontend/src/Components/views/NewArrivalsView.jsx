import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../common/constants';
import ProductCard from '../common/ProductCard';
import { RiGridLine, RiListUnordered, RiSearchLine, RiCloseLine } from 'react-icons/ri';

const NewArrivalsView = ({ onAddToCart, onToggleWishlist, wishlist, onProductClick }) => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState(() => localStorage.getItem('arrivalsLayout') || 'grid');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  useEffect(() => {
    localStorage.setItem('arrivalsLayout', layout);
  }, [layout]);

  useEffect(() => {
    if (search) {
      const term = search.toLowerCase();
      setFiltered(products.filter(p => p.name.toLowerCase().includes(term) || (p.brand && p.brand.toLowerCase().includes(term))));
    } else {
      setFiltered(products);
    }
  }, [search, products]);

  const fetchNewArrivals = async () => {
    try {
      const res = await axios.get(`${API}/products/new-arrivals`);
      setProducts(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLayout = () => setLayout(layout === 'grid' ? 'list' : 'grid');

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Just landed</p>
          <h1 className="text-2xl font-black tracking-tighter">New Arrivals</h1>
        </div>
        <button onClick={toggleLayout} className="p-2 border rounded-xl">{layout === 'grid' ? <RiListUnordered /> : <RiGridLine />}</button>
      </div>
      <div className="relative mb-6">
        <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input type="text" placeholder="Search new arrivals..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-xl" />
      </div>
      {filtered.length === 0 ? <div className="text-center py-20">No products found.</div> : (
        layout === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} isWishlisted={wishlist.includes(p.id)} onPreview={onProductClick} />)}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(p => (
              <div key={p.id} className="flex gap-4 p-3 border rounded-xl">
                <img src={`${API}/uploads/${p.images?.[0] || ''}`} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1"><h3 className="font-bold">{p.name}</h3><p className="text-sm">{p.description}</p><span className="font-black">KSh {p.price.toLocaleString()}</span></div>
                <button onClick={() => onAddToCart(p)} className="bg-black text-white px-4 py-2 rounded-lg">Add</button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default NewArrivalsView;