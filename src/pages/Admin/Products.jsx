import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Apiservice from '../../components/product/Apiservice';

const ProductCategory = {
  Shirts: 'Shirts',
  TShirts: 'T-Shirts',
  Trousers: 'Trousers',
  Shorts: 'Shorts',
  Pants: 'Pants',
  // Add more categories as needed
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = "user123";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await Apiservice.getAllProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger m-3" role="alert">
      {error}
    </div>
  );

  const handleAddToCart = async (product) => {
    try {
      const cartItem = {
        ProductId: product.id, // Make sure this matches the property name in your Product model
        ProductName: product.name, // Make sure this matches the property name in your Product model
        Quantity: 1,
        Price: product.price
      };
      await Apiservice.addToCart(userId, cartItem);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between">
      <Link to="/createproduct" className="btn btn-primary">
          Create New Product
        </Link>
        <Link to="/viewcart" className="btn btn-primary">
          View Cart
        </Link>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Products</h1>
        
      </div>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {products.map(product => (
          <div key={product.id} className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">ID: {product.uniqueProductId}</h6>
                <p className="card-text">{product.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Rs.{product.price.toFixed(2)}</span>
                  <span className="badge bg-secondary">
                    {ProductCategory[product.category] || product.category}
                  </span>
                  <button className="btn btn-primary" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                </div>
              </div>
              <div className="card-footer" style={{ backgroundColor: product.stockQuantity < 5 ? '#f8d7da' : '' }}> 
                <small className="text-muted">Stock: {product.stockQuantity}</small>
                <span className={`badge float-end ${product.stockQuantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                  {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;