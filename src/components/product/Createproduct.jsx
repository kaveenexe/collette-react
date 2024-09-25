import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Modal } from 'react-bootstrap';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust this to match your API's URL

const Createproduct = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ name: '', price: '', stock: '' });
  const [modalMode, setModalMode] = useState('add');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleShowModal = (mode, product = {}) => {
    setModalMode(mode);
    setCurrentProduct(mode === 'add' ? { name: '', price: '', stock: '' } : product);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await axios.post(`${API_BASE_URL}/products`, currentProduct);
      } else {
        await axios.put(`${API_BASE_URL}/products/${currentProduct.id}`, currentProduct);
      }
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_BASE_URL}/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <Container className="mt-4">
      <h2>Product Management</h2>
      <Button variant="primary" onClick={() => handleShowModal('add')} className="mb-3">
        Add New Product
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => handleShowModal('edit', product)} className="me-2">
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === 'add' ? 'Add New Product' : 'Edit Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentProduct.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={currentProduct.price}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={currentProduct.stock}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {modalMode === 'add' ? 'Add Product' : 'Update Product'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Createproduct;