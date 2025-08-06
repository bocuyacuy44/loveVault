import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaSearch } from 'react-icons/fa';

// Halaman NotFound dengan design modern minimalis
const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">
          <FaExclamationTriangle />
        </div>
        
        <div className="error-code">404</div>
        
        <h1>Halaman Tidak Ditemukan</h1>
        
        <p>
          Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin URL yang Anda masukkan salah 
          atau halaman tersebut telah dipindahkan.
        </p>
        
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary btn-lg">
            <FaHome /> Kembali ke Beranda
          </Link>
          <Link to="/" className="btn btn-secondary btn-lg">
            <FaSearch /> Cari Kenangan
          </Link>
        </div>
        
        <div className="not-found-suggestions">
          <h3>Yang bisa Anda lakukan:</h3>
          <ul>
            <li>Periksa kembali URL yang Anda masukkan</li>
            <li>Kembali ke beranda dan mulai dari sana</li>
            <li>Gunakan fitur pencarian untuk menemukan kenangan</li>
            <li>Buat kenangan baru jika belum ada</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;