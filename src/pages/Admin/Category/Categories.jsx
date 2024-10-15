import React, { useState, useEffect } from "react";
import "./Category.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [error, setError] = useState(null);

  // Form input state
  const [formInputs, setFormInputs] = useState({
    id: "",
    name: "",
    description: "",
  });

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/category`
      );
      const data = await response.json();
      setCategories(data); // Store categories in state
    } catch (error) {
      setErrorMessage("Error fetching categories");
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories on component mount
  }, []);

  // Handle input changes and update form state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    const categoryDto = {
      id: formInputs.id,
      name: formInputs.name,
      description: formInputs.description,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/category`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(categoryDto),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add category: ${response.statusText}`);
      }

      const result = await response.json();
      setCategories((prevCategories) => [...prevCategories, result]);

      // Reset form inputs after successful addition
      setFormInputs({
        id: "",
        name: "",
        description: "",
      });

      setShowSuccessAlert(true);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
      setShowSuccessAlert(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/category/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete the category");
        }

        // Remove the deleted category from state
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== id)
        );
        setShowSuccessAlert(true);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Populate the form for editing an existing category
  const handleEditCategory = (category) => {
    setIsEditing(true);
    setFormInputs({
      id: category.id,
      name: category.name,
      description: category.description,
    });
  };

  // Update existing category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    const updatedCategory = {
      id: formInputs.id,
      name: formInputs.name,
      description: formInputs.description,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/category/${formInputs.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCategory),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update category: ${response.statusText}`);
      }

      const result = await response.json();

      // Update categories in state immediately after getting the updated category
      setCategories((prevCategories) =>
        prevCategories.map(
          (category) => (category.id === result.id ? result : category) // Ensure we are updating the right category
        )
      );

      // Reset form inputs after successful update
      setFormInputs({
        id: "",
        name: "",
        description: "",
      });
      setIsEditing(false); // Reset editing state
      setShowSuccessAlert(true); // Show success alert
      setErrorMessage(""); // Clear error message
    } catch (error) {
      setErrorMessage(error.message);
      setShowSuccessAlert(false);
    }
  };

  return (
    <div className="category-management-container">
      <div className="category-management">
        <h2>{isEditing ? "Update Category" : "Add New Category"}</h2>
        <div className="form">
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={formInputs.name}
            onChange={handleInputChange}
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formInputs.description}
            onChange={handleInputChange}
          />

          <button
            onClick={isEditing ? handleUpdateCategory : handleAddCategory}
          >
            {isEditing ? "Update Category" : "Add Category"}
          </button>
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
                      onClick={() => handleEditCategory(category)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteCategory(category.id)}
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
