import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Apiservice from '../../components/product/Apiservice';
import { AuthContext } from "../../context/AuthContext";

// Define product categories
const ProductCategory = {
  Shirts: 'Shirts',
  TShirts: 'T-Shirts',
  Trousers: 'Trousers',
  Shorts: 'Shorts',
  Pants: 'Pants',
};

const CreateProduct = () => {
  const { user } = useContext(AuthContext);
  const vendorId = user.userId;

  // Initialize product state
  const [product, setProduct] = useState({
    uniqueProductId: '',
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    isActive: true,
    category: '',
    vendorId: vendorId,
    image: null // New field for image file
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're in edit mode and set product data accordingly
  useEffect(() => {
    const productToEdit = location.state?.productToEdit;
    if (productToEdit) {
      setProduct(productToEdit);
      setIsEditMode(true);
    }
  }, [location]);

  // Form validation
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
    if (!product.category) tempErrors.category = "Category is required";
    if (!product.image && !isEditMode) tempErrors.image = "Image is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setProduct(prevProduct => ({
        ...prevProduct,
        [name]: files[0]
      }));
    } else {
      setProduct(prevProduct => ({
        ...prevProduct,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        Object.keys(product).forEach(key => {
          if (key === 'image') {
            if (product[key]) formData.append(key, product[key]);
          } else {
            formData.append(key, product[key]);
          }
        });
        
        console.log('Sending product data:', formData);
  
        if (isEditMode) {
          await Apiservice.updateProduct(vendorId, product.id, formData);
        } else {
          await Apiservice.createProduct(vendorId, formData);
        }
        
        navigate('/dashboard/products');
      } catch (err) {
        console.error('Error submitting product:', err);
        setErrors({ submit: `Failed to ${isEditMode ? 'update' : 'create'} product. Please try again.` });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">{isEditMode ? 'Edit Product' : 'Create New Product'}</h1>
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
          disabled
            type="text"
            className="form-control"
            id="vendorId"
            name="vendorId"
            value={vendorId}
            readOnly
          />
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
        </div> <div className="mb-3">
          <label htmlFor="image" className="form-label">Product Image</label>
          <input
            type="file"
            className={`form-control ${errors.image ? 'is-invalid' : ''}`}
            id="image"
            name="image"
            onChange={handleChange}
            accept="image/*"
          />
          {errors.image && <div className="invalid-feedback">{errors.image}</div>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Product' : 'Create Product')}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;