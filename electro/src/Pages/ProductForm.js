import React, { useState } from 'react'; 
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductForm.css';

const ProductForm = () => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        color: '',
        manufactureDate: '',
        images: null,
        price: '',
        category: ''
    });

    const [loading, setLoading] = useState(false); // Loading state
    const [errorMessage, setErrorMessage] = useState(''); // Error message

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    // Handle file input changes
    const handleFileChange = (e) => {
        setProduct({ ...product, images: e.target.files });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        const formData = new FormData();
        Object.keys(product).forEach((key) => {
            if (key === 'images') {
                Array.from(product[key] || []).forEach((file) => formData.append('images', file));
            } else {
                formData.append(key, product[key]);
            }
        });

        try {
            const response = await axios.post('http://localhost:5000/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('Response:', response.data);
            alert('Product added successfully!');
            setProduct({
                name: '',
                description: '',
                color: '',
                manufactureDate: '',
                images: null,
                price: '',
                category: ''
            });
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            setErrorMessage(error.response?.data?.error || 'Failed to add product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Add New Product</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Product Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Color</label>
                    <input
                        type="text"
                        className="form-control"
                        name="color"
                        value={product.color}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Date of Manufacture</label>
                    <input
                        type="date"
                        className="form-control"
                        name="manufactureDate"
                        value={product.manufactureDate}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Images</label>
                    <input
                        type="file"
                        className="form-control"
                        name="images"
                        multiple
                        onChange={handleFileChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <input
                        type="text"
                        className="form-control"
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Adding Product...' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;
