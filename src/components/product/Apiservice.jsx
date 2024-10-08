import axios from 'axios';

// const API_BASE_URL = 'https://localhost:7001/api';

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

// Define the API service object with methods for different API calls
const apiService = {
  // Fetch all products for a specific vendor
  getAllProducts: async (vendorId) => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/products?vendorId=${vendorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Fetch all products (likely for admin use)
  getProducts: async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/customer/products`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Create a new product
  createProduct: async (vendorId, productData) => {
    try {
      console.log('Creating product for vendor:', vendorId);
      console.log('Product data:', productData);
      const response = await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/api/products?vendorId=${vendorId}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update an existing product
  updateProduct: async (vendorId, id, productData) => {
    try {
      console.log('Updating product for vendor:', vendorId);
      console.log('Product data:', productData);
      const response = await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/products/${id}?vendorId=${vendorId}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Delete a product
  deleteProduct: async (vendorId, id) => {
    try {
      await axiosInstance.delete(`${process.env.REACT_APP_API_BASE_URL}/api/products/${id}?vendorId=${vendorId}`);
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }
  },
};

export default apiService;