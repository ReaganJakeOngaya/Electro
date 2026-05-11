// src/components/admin/AdminProducts.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API } from '../common/constants';
import { getToken } from '../common/utils/auth';
import ProductFormModal from './ProductFormModal';
import { RiEditLine, RiDeleteBinLine, RiAddLine, RiSearchLine, RiCloseLine } from 'react-icons/ri';

const AdminProducts = ({ products, onRefresh }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  React.useEffect(() => {
    if (search.trim() === '') {
      setFilteredProducts(products);
    } else {
      const term = search.toLowerCase();
      setFilteredProducts(products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.brand && p.brand.toLowerCase().includes(term)) ||
        p.category.toLowerCase().includes(term)
      ));
    }
  }, [search, products]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await axios.delete(`${API}/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      onRefresh();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleProductSaved = () => {
    onRefresh();
    handleModalClose();
  };

  const discountedPrice = (price, discount) => {
    if (!discount || discount === 0) return null;
    return Math.round(price * (1 - discount / 100));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-black">Products</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your product catalog</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm border border-zinc-200 rounded-xl bg-white focus:outline-none focus:border-black"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black">
                <RiCloseLine size={14} />
              </button>
            )}
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-black text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-zinc-800 whitespace-nowrap"
          >
            <RiAddLine size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="px-6 py-3 text-xs font-black uppercase tracking-wider text-zinc-400">Image</th>
                <th className="px-6 py-3 text-xs font-black uppercase tracking-wider text-zinc-400">Name</th>
                <th className="px-6 py-3 text-xs font-black uppercase tracking-wider text-zinc-400">Brand</th>
                <th className="px-6 py-3 text-xs font-black uppercase tracking-wider text-zinc-400">Category</th>
                <th className="px-6 py-3 text-xs font-black uppercase tracking-wider text-zinc-400">Price</th>
                <th className="px-6 py-3 text-xs font-black uppercase tracking-wider text-zinc-400">Discount</th>
                <th className="px-6 py-3 text-xs font-black uppercase tracking-wider text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const hasDiscount = product.discount && product.discount > 0;
                const finalPrice = hasDiscount ? discountedPrice(product.price, product.discount) : product.price;
                return (
                  <tr key={product.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-lg bg-zinc-100 overflow-hidden">
                        {product.images?.[0] && (
                          <img src={`${API}/uploads/${product.images[0]}`} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-black">{product.name}</td>
                    <td className="px-6 py-4 text-zinc-500 text-sm">{product.brand || '—'}</td>
                    <td className="px-6 py-4 text-zinc-500 text-sm">{product.category}</td>
                    <td className="px-6 py-4">
                      {hasDiscount ? (
                        <div>
                          <span className="font-bold text-black">KSh {finalPrice.toLocaleString()}</span>
                          <span className="text-xs text-zinc-400 line-through ml-2">KSh {product.price.toLocaleString()}</span>
                        </div>
                      ) : (
                        <span className="font-bold">KSh {product.price.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {hasDiscount ? (
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                          -{product.discount}%
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(product)} className="p-1 text-zinc-400 hover:text-black transition">
                          <RiEditLine size={18} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-1 text-zinc-400 hover:text-red-600 transition">
                          <RiDeleteBinLine size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr><td colSpan="7" className="px-6 py-12 text-center text-zinc-400">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductFormModal
        open={modalOpen}
        onClose={handleModalClose}
        product={editingProduct}
        onSaved={handleProductSaved}
      />
    </div>
  );
};

export default AdminProducts;