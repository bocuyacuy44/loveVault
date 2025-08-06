import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

// Halaman NotFound untuk menangani rute yang tidak ditemukan
const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <FaExclamationTriangle className="not-found-icon" />
        <h1>404</h1>
        <h2>Halaman Tidak Ditemukan</h2>
        <p>Maaf, halaman yang Anda cari tidak ditemukan.</p>
        <Link to="/" className="btn btn-primary">
          <FaHome /> Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default NotFound;