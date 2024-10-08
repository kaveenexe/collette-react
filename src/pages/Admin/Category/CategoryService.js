import axios from 'axios';

// Create an axios instance
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login page or refresh token
      localStorage.removeItem('token');
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/category`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Create a new category
  createCategory: async (categoryData) => {
    try {
      const response = await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/api/category`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update an existing category
  updateCategory: async (id, categoryData) => {
    try {
      const response = await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/category/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating category with id ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Delete a category
  deleteCategory: async (id) => {
    try {
      await axiosInstance.delete(`${process.env.REACT_APP_API_BASE_URL}/api/category/${id}`);
    } catch (error) {
      console.error(`Error deleting category with id ${id}:`, error);
      throw error;
    }
  },
};

export default categoryService;
