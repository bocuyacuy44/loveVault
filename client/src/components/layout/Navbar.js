import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaSignOutAlt, FaUser, FaSignInAlt, FaUserPlus, FaPlus } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';

// Komponen Navbar Modern dengan design minimalis
const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fungsi untuk menangani logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Link untuk pengguna yang sudah login
  const authLinks = (
    <ul>
      <li>
        <Link to="/profile">
          <FaUser /> {user && user.username}
        </Link>
      </li>
      <li>
        <button onClick={handleLogout} className="btn btn-secondary">
          <FaSignOutAlt /> Keluar
        </button>
      </li>
    </ul>
  );

  // Link untuk pengguna yang belum login
  const guestLinks = (
    <ul>
      <li>
        <Link to="/login" className="btn btn-secondary">
          <FaSignInAlt /> Masuk
        </Link>
      </li>
      <li>
        <Link to="/register" className="btn btn-primary">
          <FaUserPlus /> Daftar
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="brand">
          <FaHeart /> LoveVault
        </Link>
        <div className="navbar-menu">
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;