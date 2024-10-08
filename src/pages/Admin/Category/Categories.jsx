import React, { useState } from 'react';
import './Category.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const products = ['Shirts', 'T-shirts', 'Trousers', 'Shorts', 'Pants'];

  // Add category function
  const addCategory = () => {
    if (selectedProduct && categoryName && description) {
      setCategories([
        ...categories,
        {
          id: Date.now(),
          product: selectedProduct,
          name: categoryName,
          description: description,
        },
      ]);
      setSelectedProduct('');
      setCategoryName('');
      setDescription('');
    }
  };

  // Edit category function
  const editCategory = (category) => {
    setSelectedProduct(category.product);
    setCategoryName(category.name);
    setDescription(category.description);
    setIsEditing(true);
    setEditingCategoryId(category.id);
  };

  // Update category function
  const updateCategory = () => {
    setCategories(
      categories.map((category) =>
        category.id === editingCategoryId
          ? { ...category, product: selectedProduct, name: categoryName, description: description }
          : category
      )
    );
    setIsEditing(false);
    setSelectedProduct('');
    setCategoryName('');
    setDescription('');
    setEditingCategoryId(null);
  };

  // Delete category function
  const deleteCategory = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  return (
    <div className="category-management-container">
      <div className="category-management">
        <h2>Category Management</h2>
        <div className="form">
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Select a Product</option>
            {products.map((product) => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {isEditing ? (
            <button onClick={updateCategory}>Update Category</button>
          ) : (
            <button onClick={addCategory}>Add Category</button>
          )}
        </div>
      </div>

      <div className="category-table">
        <h2>Category List</h2>
        {categories.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.product}</td>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => editCategory(category)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteCategory(category.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No categories available</p>
        )}
      </div>
    </div>
  );
};

export default Categories;
