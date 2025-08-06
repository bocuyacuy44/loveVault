import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { FaUser, FaKey } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

// Halaman Profile untuk mengelola profil pengguna
const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);

  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [activeTab, setActiveTab] = useState('profile');

  const { username, email, currentPassword, newPassword, confirmPassword } = profileData;

  // Update state saat input berubah
  const onChange = e => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // Submit form update profil
  const onSubmitProfile = async e => {
    e.preventDefault();
    try {
      const result = await updateProfile({ username, email });
      if (result.success) {
        toast.success('Profil berhasil diperbarui');
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error('Gagal memperbarui profil');
    }
  };

  // Submit form update password
  const onSubmitPassword = async e => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Password baru tidak cocok');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password baru harus minimal 6 karakter');
      return;
    }

    try {
      const result = await updateProfile({
        currentPassword,
        newPassword
      });

      if (result.success) {
        toast.success('Password berhasil diperbarui');
        setProfileData({
          ...profileData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error('Gagal memperbarui password');
    }
  };

  return (
    <div className="profile-container">
      <h1>
        <FaUser /> Profil Saya
      </h1>

      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FaUser /> Informasi Profil
        </button>
        <button
          className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          <FaKey /> Ubah Password
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'profile' && (
          <form onSubmit={onSubmitProfile} className="form">
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
            <button type="submit" className="btn btn-primary">
              Perbarui Profil
            </button>
          </form>
        )}

        {activeTab === 'password' && (
          <form onSubmit={onSubmitPassword} className="form">
            <div className="form-group">
              <label htmlFor="currentPassword">Password Saat Ini</label>
              <input
                type="password"
                name="currentPassword"
                value={currentPassword}
                onChange={onChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">Password Baru</label>
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={onChange}
                className="form-control"
                required
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Konfirmasi Password Baru</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                className="form-control"
                required
                minLength="6"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Perbarui Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;