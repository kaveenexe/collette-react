import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InventoryManagement.css';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/inventory/products`);
        console.log(response.data); // Log the response to inspect the field names
        setInventory(response.data);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      }
    };

    fetchInventory();
  }, []);

  const renderStockAlert = (stockQuantity, alertLevel) => {
    if (stockQuantity <= alertLevel) {
      return <span className="low-stock">Low Stock: {stockQuantity} units</span>;
    }
    return <span>{stockQuantity} units</span>;
  };

  const handleDeleteProduct = async (productId) => {
    try {
      // Call the delete API
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/inventory/${productId}`);
      
      // If successful, remove the item from the local state
      setInventory((prevInventory) =>
        prevInventory.filter((item) => item.productId !== productId)
      );
      alert('Product deleted successfully.');
    } catch (error) {
      // Check if the error is a 403 Forbidden (blocked deletion)
      if (error.response && error.response.status === 403) {
        alert('Failed to delete the product. ' + error.response.data); // Show the backend error message
      } else {
        alert('Failed to delete the product. Please try again.');
      }
    }
  };

  return (
    <div className="inventory-management">
      <h2>Inventory Management</h2>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Category</th>
            <th>Product Name</th>
            <th>Stock Level</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.productId}>
              <td>{item.productId}</td>
              <td>{item.category}</td>
              <td>{item.productName}</td>
              <td>{renderStockAlert(item.stockQuantity, 5)}</td>
              <td>
  <button
    className="remove-btn"
    disabled={item.stockQuantity === 0}
    onClick={() => handleDeleteProduct(item.productId)}
  >
    Remove Product
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryManagement;
