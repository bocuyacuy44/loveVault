import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserPlus } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

// Halaman Register untuk pendaftaran pengguna baru
const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });

  const { username, email, password, password2 } = formData;
  const { register, isAuthenticated, error, clearErrors } = useContext(AuthContext);
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

  // Submit form registrasi
  const onSubmit = e => {
    e.preventDefault();
    if (password !== password2) {
      toast.error('Password tidak cocok');
    } else if (password.length < 6) {
      toast.error('Password harus minimal 6 karakter');
    } else {
      register({
        username,
        email,
        password
      });
    }
  };

  return (
    <div className="form-container">
      <h1>
        <FaUserPlus /> Daftar Akun
      </h1>
      <p>Buat akun untuk menyimpan kenangan berharga Anda</p>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>
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
            minLength="6"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password2">Konfirmasi Password</label>
          <input
            type="password"
            name="password2"
            value={password2}
            onChange={onChange}
            className="form-control"
            required
            minLength="6"
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Daftar
        </button>
      </form>

      <p className="my-1">
        Sudah punya akun? <Link to="/login">Masuk</Link>
      </p>
    </div>
  );
};

export default Register;