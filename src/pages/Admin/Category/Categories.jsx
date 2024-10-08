import React, { useState, useEffect } from 'react';
import './Category.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import categoryService from './CategoryService';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const addCategory = async () => {
    if (categoryName && description) {
      try {
        const newCategory = await categoryService.createCategory({
          name: categoryName,
          description: description,
        });
        setCategories([...categories, newCategory]);
        resetForm();
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };

  const editCategory = (category) => {
    setCategoryName(category.name);
    setDescription(category.description);
    setIsEditing(true);
    setEditingCategoryId(category.id);
  };

  const updateCategory = async () => {
    try {
      const updatedCategory = await categoryService.updateCategory(editingCategoryId, {
        name: categoryName,
        description: description,
      });
      setCategories(
        categories.map((category) =>
          category.id === editingCategoryId ? updatedCategory : category
        )
      );
      resetForm();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await categoryService.deleteCategory(id);
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const resetForm = () => {
    setCategoryName('');
    setDescription('');
    setIsEditing(false);
    setEditingCategoryId(null);
  };

  return (
    <div className="category-management-container">
      <div className="category-management">
        <h2>Add New Category</h2>
        <div className="form">

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
                <th>Category Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
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
