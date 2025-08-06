import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { FaUser, FaKey, FaEnvelope, FaLock } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

// Halaman Profile dengan design modern minimalis
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
    <div>
      {/* Header */}
      <div className="page-header">
        <h1>
          <FaUser /> Profil Saya
        </h1>
        <p>Kelola informasi akun dan keamanan Anda</p>
      </div>

      {/* Profile Container */}
      <div className="profile-container">
        {/* User Info Card */}
        <div className="user-info-card">
          <div className="user-avatar">
            <FaUser />
          </div>
          <div className="user-details">
            <h3>{user?.username}</h3>
            <p>{user?.email}</p>
            <small>Bergabung sejak {new Date(user?.created_at || Date.now()).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}</small>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-content">
          {/* Tab Navigation */}
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

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'profile' && (
              <div className="profile-form-card">
                <div className="card-header">
                  <h2>Informasi Profil</h2>
                  <p>Perbarui informasi dasar akun Anda</p>
                </div>
                
                <div className="card-body">
                  <form onSubmit={onSubmitProfile}>
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
                        <FaEnvelope /> Alamat Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        className="form-control"
                        placeholder="Masukkan alamat email"
                        required
                      />
                    </div>
                    
                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary btn-lg">
                        <FaUser /> Perbarui Profil
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="profile-form-card">
                <div className="card-header">
                  <h2>Ubah Password</h2>
                  <p>Pastikan akun Anda tetap aman dengan password yang kuat</p>
                </div>
                
                <div className="card-body">
                  <form onSubmit={onSubmitPassword}>
                    <div className="form-group">
                      <label htmlFor="currentPassword">
                        <FaLock /> Password Saat Ini
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={currentPassword}
                        onChange={onChange}
                        className="form-control"
                        placeholder="Masukkan password saat ini"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="newPassword">
                        <FaKey /> Password Baru
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={newPassword}
                        onChange={onChange}
                        className="form-control"
                        placeholder="Masukkan password baru (min. 6 karakter)"
                        required
                        minLength="6"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="confirmPassword">
                        <FaKey /> Konfirmasi Password Baru
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={onChange}
                        className="form-control"
                        placeholder="Ulangi password baru"
                        required
                        minLength="6"
                      />
                    </div>
                    
                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary btn-lg">
                        <FaKey /> Perbarui Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;