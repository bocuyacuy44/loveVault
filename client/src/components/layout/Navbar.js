import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaSignOutAlt, FaUser, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';

// Komponen Navbar untuk navigasi aplikasi
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
        <Link to="/memories/create">
          <FaHeart /> Tambah Kenangan
        </Link>
      </li>
      <li>
        <Link to="/profile">
          <FaUser /> {user && user.username}
        </Link>
      </li>
      <li>
        <a href="#!" onClick={handleLogout}>
          <FaSignOutAlt /> Keluar
        </a>
      </li>
    </ul>
  );

  // Link untuk pengguna yang belum login
  const guestLinks = (
    <ul>
      <li>
        <Link to="/login">
          <FaSignInAlt /> Masuk
        </Link>
      </li>
      <li>
        <Link to="/register">
          <FaUserPlus /> Daftar
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar">
      <h1 className="brand">
        <Link to="/">
          <FaHeart /> LoveVault
        </Link>
      </h1>
      {isAuthenticated ? authLinks : guestLinks}
    </nav>
  );
};

export default Navbar;