// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalState';

const ProtectedRoute = ({ children }) => {
  const { token } = useGlobalState();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;