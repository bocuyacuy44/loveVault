import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserPlus, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

// Halaman Register dengan design modern minimalis
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

  // Submit form register
  const onSubmit = e => {
    e.preventDefault();
    if (username === '' || email === '' || password === '') {
      toast.error('Silakan isi semua kolom');
    } else if (password !== password2) {
      toast.error('Password tidak cocok');
    } else if (password.length < 6) {
      toast.error('Password harus minimal 6 karakter');
    } else {
      register({ username, email, password });
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>
          <FaUserPlus /> Bergabung dengan LoveVault
        </h1>
        <p>Mulai simpan kenangan indah Anda hari ini</p>
      </div>

      <div className="form-body">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="username">
              <FaUser /> Nama Pengguna
            </label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              className="form-control"
              placeholder="Masukkan nama pengguna"
              required
            />
          </div>

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
              placeholder="Masukkan password (min. 6 karakter)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password2">
              <FaLock /> Konfirmasi Password
            </label>
            <input
              type="password"
              name="password2"
              value={password2}
              onChange={onChange}
              className="form-control"
              placeholder="Ulangi password Anda"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg">
            <FaUserPlus /> Daftar
          </button>
        </form>

        <p className="text-center my-4">
          Sudah punya akun? <Link to="/login" style={{color: 'var(--accent-color)', fontWeight: '500'}}>Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;