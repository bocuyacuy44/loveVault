import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSignInAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

// Halaman Login dengan design modern minimalis
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;
  const { login, isAuthenticated, error, clearErrors } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect jika sudah login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }

    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line
  }, [isAuthenticated, error]);

  // Update state saat input berubah
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form login
  const onSubmit = e => {
    e.preventDefault();
    if (email === '' || password === '') {
      toast.error('Silakan isi semua kolom');
    } else {
      login({ email, password });
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>
          <FaSignInAlt /> Selamat Datang Kembali
        </h1>
        <p>Masuk ke akun Anda untuk mengakses kenangan indah</p>
      </div>

      <div className="form-body">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope /> Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="form-control"
              placeholder="Masukkan email Anda"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              <FaLock /> Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="form-control"
              placeholder="Masukkan password Anda"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-block btn-lg">
            <FaSignInAlt /> Masuk
          </button>
        </form>

        <p className="text-center my-4">
          Belum punya akun? <Link to="/register" style={{color: 'var(--accent-color)', fontWeight: '500'}}>Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;