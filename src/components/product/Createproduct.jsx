import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Apiservice from '../../components/product/Apiservice';

const ProductCategory = {
  Shirts: 'Shirts',
  TShirts: 'T-Shirts',
  Trousers: 'Trousers',
  Shorts: 'Shorts',
  Pants: 'Pants',
  // Add more categories as needed
};

const Createproduct = () => {
  const [product, setProduct] = useState({
    uniqueProductId: '',
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    vendorId: '',
    isActive: true,
    category: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let tempErrors = {};
    if (!product.uniqueProductId.trim()) tempErrors.uniqueProductId = "Unique Product ID is required";
    if (!product.name.trim()) tempErrors.name = "Name is required";
    if (!product.price) tempErrors.price = "Price is required";
    else if (isNaN(product.price) || Number(product.price) <= 0) tempErrors.price = "Price must be a positive number";
    if (!product.stockQuantity) tempErrors.stockQuantity = "Stock quantity is required";
    else if (isNaN(product.stockQuantity) || !Number.isInteger(Number(product.stockQuantity)) || Number(product.stockQuantity) < 0) {
      tempErrors.stockQuantity = "Stock quantity must be a non-negative integer";
    }
    if (!product.vendorId.trim()) tempErrors.vendorId = "Vendor ID is required";
    if (!product.category) tempErrors.category = "Category is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const productToSend = {
          uniqueProductId: product.uniqueProductId,
          name: product.name,
          description: product.description,
          price: parseFloat(product.price),
          stockQuantity: parseInt(product.stockQuantity),
          vendorId: product.vendorId,
          isActive: product.isActive,
          category: product.category  // This should now match the enum values
        };
        await Apiservice.createProduct(productToSend);
        navigate('/dashboard/products');
      } catch (err) {
        setErrors({ submit: 'Failed to create product. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Create New Product</h1>
      {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="uniqueProductId" className="form-label">Unique Product ID</label>
          <input
            type="text"
            className={`form-control ${errors.uniqueProductId ? 'is-invalid' : ''}`}
            id="uniqueProductId"
            name="uniqueProductId"
            value={product.uniqueProductId}
            onChange={handleChange}
            required
          />
          {errors.uniqueProductId && <div className="invalid-feedback">{errors.uniqueProductId}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Product Name</label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            className={`form-control ${errors.price ? 'is-invalid' : ''}`}
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            step="0.01"
            required
          />
          {errors.price && <div className="invalid-feedback">{errors.price}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="stockQuantity" className="form-label">Stock Quantity</label>
          <input
            type="number"
            className={`form-control ${errors.stockQuantity ? 'is-invalid' : ''}`}
            id="stockQuantity"
            name="stockQuantity"
            value={product.stockQuantity}
            onChange={handleChange}
            required
          />
          {errors.stockQuantity && <div className="invalid-feedback">{errors.stockQuantity}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="vendorId" className="form-label">Vendor ID</label>
          <input
            type="text"
            className={`form-control ${errors.vendorId ? 'is-invalid' : ''}`}
            id="vendorId"
            name="vendorId"
            value={product.vendorId}
            onChange={handleChange}
            required
          />
          {errors.vendorId && <div className="invalid-feedback">{errors.vendorId}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            className={`form-select ${errors.category ? 'is-invalid' : ''}`}
            id="category"
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {Object.entries(ProductCategory).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
          {errors.category && <div className="invalid-feedback">{errors.category}</div>}
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isActive"
            name="isActive"
            checked={product.isActive}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="isActive">Active</label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default Createproduct;