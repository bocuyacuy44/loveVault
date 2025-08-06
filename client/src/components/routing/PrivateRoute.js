import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

// Komponen untuk melindungi rute yang memerlukan autentikasi
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Jika masih loading, tampilkan spinner
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // Jika tidak terautentikasi, redirect ke halaman login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Jika terautentikasi, tampilkan komponen anak
  return children;
};

export default PrivateRoute;