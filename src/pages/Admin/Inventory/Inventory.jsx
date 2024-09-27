import React, { useState, useEffect } from 'react';
import './InventoryManagement.css';

// Sample data - In real implementation, you would fetch this from your API.
const sampleInventory = [
  { productID: '1', productName: 'Product A', stock: 12, alertLevel: 5 },
  { productID: '2', productName: 'Product B', stock: 3, alertLevel: 5 },
  { productID: '3', productName: 'Product C', stock: 15, alertLevel: 10 }
];

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    // Simulate an API call to fetch inventory data
    setInventory(sampleInventory);
  }, []);

  const renderStockAlert = (stock, alertLevel) => {
    if (stock <= alertLevel) {
      return <span className="low-stock">Low Stock: {stock} units</span>;
    }
    return <span>{stock} units</span>;
  };

  return (
    <div className="inventory-management">
      <h2>Inventory Management</h2>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Stock Level</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.productID}>
              <td>{item.productID}</td>
              <td>{item.productName}</td>
              <td>{renderStockAlert(item.stock, item.alertLevel)}</td>
              <td>
                <button className="remove-btn" disabled={item.stock === 0}>
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
