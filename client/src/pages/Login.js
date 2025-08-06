import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSignInAlt } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

// Halaman Login untuk autentikasi pengguna
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
      <h1>
        <FaSignInAlt /> Masuk
      </h1>
      <p>Masuk ke akun Anda untuk mengakses kenangan</p>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Masuk
        </button>
      </form>

      <p className="my-1">
        Belum punya akun? <Link to="/register">Daftar</Link>
      </p>
    </div>
  );
};

export default Login;