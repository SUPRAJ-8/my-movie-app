import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check for JWT token in localStorage or sessionStorage
  const token =
    localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  // If token exists, render the children (AdminDashboard)
  return children;
};

export default ProtectedRoute;
