// src/components/admin/AdminProducts.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { API } from '../common/constants';
import { getToken } from '../common/utils/auth';
import ProductFormModal from './ProductFormModal';
import { RiEditLine, RiDeleteBinLine, RiAddLine } from 'react-icons/ri';

const AdminProducts = ({ products, onRefresh }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await axios.delete(`${API}/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      onRefresh();
    } catch (err) {
      alert('Failed to delete product');
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-black">Products</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-black text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-zinc-800"
        >
          <RiAddLine size={16} /> Add Product
        </button>
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
              {products.map((product) => {
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
                        <button onClick={() => handleEdit(product)} className="p-1 text-zinc-400 hover:text-black">
                          <RiEditLine size={18} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-1 text-zinc-400 hover:text-red-600">
                          <RiDeleteBinLine size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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