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

const apiService = {
  getAllProducts: async (vendorId) => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/products?vendorId=${vendorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProducts: async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/customer/products`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

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

  deleteProduct: async (vendorId, id) => {
    try {
      await axiosInstance.delete(`${process.env.REACT_APP_API_BASE_URL}/api/products/${id}?vendorId=${vendorId}`);
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }
  },

  // getCart: async (userId) => {
  //   const response = await axios.get(`${API_BASE_URL}/cart/${userId}`);
  //   return response.data;
  // },

  // addToCart: async (userId, item) => {
  //   try {
  //     const response = await axios.post(`${API_BASE_URL}/cart/${userId}/items`, item);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error adding to cart:', error);
  //     throw error;
  //   }
  // },

  // removeFromCart: async (userId, productId) => {
  //   await axios.delete(`${API_BASE_URL}/cart/${userId}/items/${productId}`);
  // },

  // updateCartItemQuantity: async (userId, productId, quantity) => {
  //   try {
  //     const response = await axios.put(`${API_BASE_URL}/cart/${userId}/items/${productId}`,
  //       quantity, // Send quantity as a plain value, not an object
  //       {
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error updating cart item quantity:', error);
  //     throw error;
  //   }
  // },


  // clearCart: async (userId) => {
  //   await axios.delete(`${API_BASE_URL}/cart/${userId}`);
  // },
};

export default apiService;