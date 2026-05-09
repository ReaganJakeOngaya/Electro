// src/components/admin/ProductFormModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../common/constants';
import { getToken } from '../common/utils/auth';
import { RiCloseLine, RiUploadLine } from 'react-icons/ri';

const CATEGORIES = [
  'Smartphones', 'Laptops', 'Audio', 'Wearables', 'Cameras', 'Accessories',
  'TV', 'Soundbar', 'Gaming', 'Drones', 'Printers', 'Networking', 'Storage', 'Software'
];

const ProductFormModal = ({ open, onClose, product, onSaved }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    price: '',
    discount: 0,
    category: 'Smartphones',
    color: '',
    manufacture_date: '',
    images: [],
    stock: 0,
    low_stock_threshold: 5,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        brand: product.brand || '',
        price: product.price || '',
        discount: product.discount || 0,
        category: product.category || 'Smartphones',
        color: product.color || '',
        manufacture_date: product.manufacture_date || '',
        images: product.images || [],
        stock: product.stock ?? 0,
        low_stock_threshold: product.low_stock_threshold ?? 5,
      });
      setImagePreviews(product.images?.map(img => `${API}/uploads/${img}`) || []);
    } else {
      setFormData({
        name: '', description: '', brand: '', price: '', discount: 0,
        category: 'Smartphones', color: '', manufacture_date: '', images: [],
        stock: 0, low_stock_threshold: 5,
      });
      setImageFiles([]);
      setImagePreviews([]);
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = getToken();

    try {
      let uploadedPaths = formData.images;
      if (imageFiles.length > 0) {
        const uploadData = new FormData();
        imageFiles.forEach(file => uploadData.append('images', file));
        const uploadRes = await axios.post(`${API}/admin/upload`, uploadData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        uploadedPaths = [...uploadedPaths, ...uploadRes.data.filenames];
      }

      const payload = {
        ...formData,
        price: Number(formData.price),
        discount: Number(formData.discount) || 0,
        images: uploadedPaths,
        manufacture_date: formData.manufacture_date || null,
        stock: parseInt(formData.stock) || 0,
        low_stock_threshold: parseInt(formData.low_stock_threshold) || 5,
      };
      if (product?.id) {
        await axios.put(`${API}/admin/products/${product.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API}/admin/products`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto">
          <div className="sticky top-0 bg-white border-b border-zinc-100 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-black tracking-tight">{product ? 'Edit Product' : 'New Product'}</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-xl border border-zinc-200 flex items-center justify-center">
              <RiCloseLine size={15} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="form-label">Product Name</label>
              <input name="name" value={formData.name} onChange={handleChange} required className="form-input" />
            </div>
            <div>
              <label className="form-label">Brand (optional)</label>
              <input name="brand" value={formData.brand} onChange={handleChange} className="form-input" placeholder="e.g., Apple, Samsung, Sony" />
            </div>
            <div>
              <label className="form-label">Description</label>
              <textarea name="description" rows="3" value={formData.description} onChange={handleChange} required className="form-input" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Price (KSh)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="form-input" />
              </div>
              <div>
                <label className="form-label">Discount (%)</label>
                <input type="number" name="discount" value={formData.discount} onChange={handleChange} min="0" max="100" step="1" className="form-input" />
              </div>
              <div>
                <label className="form-label">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="form-input">
                  {CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Color (optional)</label>
                <input name="color" value={formData.color} onChange={handleChange} className="form-input" />
              </div>
              <div>
                <label className="form-label">Manufacture date (optional)</label>
                <input type="date" name="manufacture_date" value={formData.manufacture_date} onChange={handleChange} className="form-input" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Stock Quantity</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} min="0" className="form-input" />
              </div>
              <div>
                <label className="form-label">Low Stock Threshold</label>
                <input type="number" name="low_stock_threshold" value={formData.low_stock_threshold} onChange={handleChange} min="1" className="form-input" />
              </div>
            </div>
            <div>
              <label className="form-label">Product Images</label>
              <div className="flex flex-wrap gap-3 mt-2">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-zinc-200">
                    <img src={src} alt="preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-black/70 text-white rounded-bl-lg p-1">
                      <RiCloseLine size={10} />
                    </button>
                  </div>
                ))}
                <label className="w-16 h-16 rounded-lg border border-dashed border-zinc-300 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50">
                  <RiUploadLine size={20} className="text-zinc-400" />
                  <span className="text-[9px] text-zinc-400">Upload</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProductFormModal;