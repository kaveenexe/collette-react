import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, FormControl, Dropdown, InputGroup } from 'react-bootstrap';
import Apiservice from '../../components/product/Apiservice';
import { AuthContext } from "../../context/AuthContext";

const ProductCategory = {
  Shirts: 'Shirts',
  TShirts: 'T-Shirts',
  Trousers: 'Trousers',
  Shorts: 'Shorts',
  Pants: 'Pants',
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const vendorId = user.userId;

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (user.role === 'Vendor') {
          // If the user is a vendor, fetch vendor-specific products
          const data = await Apiservice.getAllProducts(vendorId);
          setProducts(data);
          setFilteredProducts(data);
        } else if (user.role === 'Administrator') {
          // If the user is an admin, fetch all products
          const data = await Apiservice.getProducts();
          setProducts(data);
          setFilteredProducts(data);
        }
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [vendorId, user.role]); // Adding user.role as a dependency
  
  
  

  useEffect(() => {
    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'All' || product.category === selectedCategory)
    );
    setFilteredProducts(results);
  }, [searchTerm, selectedCategory, products]);

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

  const handleDeleteProduct = async (productId) => {
    try {
      await Apiservice.deleteProduct(vendorId, productId);
      setProducts(products.filter(product => product.id !== productId));
      setFilteredProducts(filteredProducts.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleEditProduct = (product) => {
    navigate('/createproduct', { state: { productToEdit: product } });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-4">
        <Link to="/createproduct" className="btn btn-primary">
          Create New Product
        </Link>
      </div>
      <h1 className="mb-4">Products</h1>
      
      <Form className="mb-4">
        <InputGroup>
          <FormControl
            placeholder="Search products..."
            aria-label="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary">
              {selectedCategory}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSelectedCategory('All')}>All</Dropdown.Item>
              {Object.entries(ProductCategory).map(([key, value]) => (
                <Dropdown.Item key={key} onClick={() => setSelectedCategory(key)}>
                  {value}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </InputGroup>
      </Form>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">ID : {product.uniqueProductId}</h6>
                <p className="card-text">{product.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Rs.{product.price.toFixed(2)}</span>
                  <span className="badge bg-secondary">
                    {ProductCategory[product.category] || product.category}
                  </span>
                  <button className="btn btn-secondary" onClick={() => handleEditProduct(product)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
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