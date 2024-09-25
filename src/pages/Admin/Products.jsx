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

  return (
    <div className="container mt-4">
      <Link to="/createproduct" className="btn btn-primary">
          Create New Product
        </Link>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Product Catalog</h1>
        
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
                  <span className="text-muted">${product.price.toFixed(2)}</span>
                  <span className="badge bg-secondary">
                    {ProductCategory[product.category] || product.category}
                  </span>
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