import React, { useState } from 'react';
import './Category.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  // Add category function
  const addCategory = () => {
    if (categoryId && categoryName) {
      setCategories([...categories, { id: categoryId, name: categoryName }]);
      setCategoryId('');
      setCategoryName('');
    }
  };

  // Edit category function
  const editCategory = (id, name) => {
    setCategoryId(id);
    setCategoryName(name);
    setIsEditing(true);
    setEditingCategoryId(id);
  };

  // Update category function
  const updateCategory = () => {
    setCategories(
      categories.map((category) =>
        category.id === editingCategoryId ? { id: categoryId, name: categoryName } : category
      )
    );
    setIsEditing(false);
    setCategoryId('');
    setCategoryName('');
    setEditingCategoryId(null);
  };

  // Delete category function
  const deleteCategory = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  return (
    <div className="category-management-container">
      <div className="category-management">
        <h2>Add Category</h2>
        <div className="form">
          <input
            type="text"
            placeholder="Category ID"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          {isEditing ? (
            <button onClick={updateCategory}>Update Category</button>
          ) : (
            <button onClick={addCategory}>Add Category</button>
          )}
        </div>
      </div>

      <div className="category-table">
        <h3>Category List</h3>
        {categories.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Category ID</th>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>
                    <button className="edit-btn" onClick={() => editCategory(category.id, category.name)}>
                      <FaEdit /> Edit
                    </button>
                    <button className="delete-btn" onClick={() => deleteCategory(category.id)}>
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
