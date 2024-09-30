import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Store user data
  const [token, setToken] = useState(null); // Store JWT token
  const [loading, setLoading] = useState(true); // Loading state for restoring session
  const navigate = useNavigate();

  // Login function to store user and token data
  const login = (userData, jwtToken) => {
    setUser({
      userId: userData.userId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      email: userData.email,  // Add email
      address: userData.address,  // Add address
      nic: userData.nic  // Add NIC
    });
    setToken(jwtToken);
    localStorage.setItem('user', JSON.stringify(userData)); // Store user data in local storage
    console.log()
    localStorage.setItem('token', jwtToken); // Store JWT token
  };

  // Logout function to clear user and token data
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to login page after logout
  };

  // Automatically load user data if JWT token is found in localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(storedUser); // Set user data from local storage
      setToken(storedToken); // Set token from local storage
    }
    setLoading(false); // Finished loading
  }, []); // This useEffect runs only once when the component mounts

  if (loading) {
    return <Spin tip="Loading..." />; // Show a loading indicator while restoring the session
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
