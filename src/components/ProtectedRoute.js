import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Protect routes based on user's login status and roles
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useContext(AuthContext);

  // Show loading spinner or indicator while session is being restored
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user or token, redirect to login
  if (!user || !token) {
    return <Navigate to="/login" />;
  }

  // If user is logged in, but their role isn't allowed, redirect to unauthorized page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  // If user is logged in and has the correct role, render the route
  return children;
};

export default ProtectedRoute;
