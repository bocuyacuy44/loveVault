import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaKey, FaEnvelope, FaLock, FaTrashAlt, FaExclamationTriangle } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

// Halaman Profile dengan design modern minimalis
const Profile = () => {
  const { user, updateProfile, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    step: 0,
    confirmText: '',
    password: ''
  });

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

  // Fungsi untuk menghapus akun
  const deleteAccount = async () => {
    try {
      const response = await fetch('/api/users/account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({
          password: deleteConfirmation.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Akun berhasil dihapus. Selamat tinggal!');
        logout();
        navigate('/login');
      } else {
        toast.error(data.msg || 'Gagal menghapus akun');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan saat menghapus akun');
    }
  };

  // Handle langkah konfirmasi hapus akun
  const handleDeleteStep = (step) => {
    setDeleteConfirmation(prev => ({ ...prev, step }));
  };

  // Reset konfirmasi hapus akun
  const resetDeleteConfirmation = () => {
    setDeleteConfirmation({
      step: 0,
      confirmText: '',
      password: ''
    });
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
            <button
              className={`tab-btn danger ${activeTab === 'delete' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('delete');
                resetDeleteConfirmation();
              }}
            >
              <FaTrashAlt /> Hapus Akun
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

            {activeTab === 'delete' && (
              <div className="profile-form-card danger">
                <div className="card-header danger">
                  <h2>
                    <FaExclamationTriangle /> Hapus Akun Permanen
                  </h2>
                  <p>Tindakan ini akan menghapus akun Anda secara permanen dan tidak dapat dibatalkan</p>
                </div>
                
                <div className="card-body">
                  {deleteConfirmation.step === 0 && (
                    <div className="delete-warning">
                      <div className="warning-box">
                        <FaExclamationTriangle className="warning-icon" />
                        <h3>Peringatan!</h3>
                        <p>Jika Anda menghapus akun, hal-hal berikut akan terjadi:</p>
                        <ul>
                          <li>🗑️ Akun Anda akan dihapus secara permanen</li>
                          <li>📝 Semua kenangan/memory yang Anda buat akan dihapus</li>
                          <li>📷 Semua foto yang Anda unggah akan dihapus</li>
                          <li>🔒 Data ini TIDAK DAPAT dipulihkan</li>
                        </ul>
                        <p className="final-warning">
                          <strong>Tindakan ini tidak dapat dibatalkan!</strong>
                        </p>
                      </div>
                      
                      <div className="form-actions">
                        <button 
                          className="btn btn-secondary"
                          onClick={() => setActiveTab('profile')}
                        >
                          Batal
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleDeleteStep(1)}
                        >
                          <FaTrashAlt /> Saya Mengerti, Lanjutkan
                        </button>
                      </div>
                    </div>
                  )}

                  {deleteConfirmation.step === 1 && (
                    <div className="delete-confirmation">
                      <div className="confirmation-box">
                        <h3>Konfirmasi Penghapusan</h3>
                        <p>Untuk melanjutkan, ketik <strong>HAPUS AKUN SAYA</strong> di bawah ini:</p>
                        
                        <div className="form-group">
                          <input
                            type="text"
                            value={deleteConfirmation.confirmText}
                            onChange={(e) => setDeleteConfirmation(prev => ({
                              ...prev,
                              confirmText: e.target.value
                            }))}
                            className="form-control"
                            placeholder="Ketik: HAPUS AKUN SAYA"
                          />
                        </div>
                      </div>
                      
                      <div className="form-actions">
                        <button 
                          className="btn btn-secondary"
                          onClick={() => handleDeleteStep(0)}
                        >
                          Kembali
                        </button>
                        <button 
                          className="btn btn-danger"
                          disabled={deleteConfirmation.confirmText !== 'HAPUS AKUN SAYA'}
                          onClick={() => handleDeleteStep(2)}
                        >
                          Lanjutkan
                        </button>
                      </div>
                    </div>
                  )}

                  {deleteConfirmation.step === 2 && (
                    <div className="delete-final">
                      <div className="final-box">
                        <h3>Langkah Terakhir</h3>
                        <p>Masukkan password Anda untuk mengkonfirmasi penghapusan akun:</p>
                        
                        <div className="form-group">
                          <label htmlFor="deletePassword">
                            <FaLock /> Password Saat Ini
                          </label>
                          <input
                            type="password"
                            value={deleteConfirmation.password}
                            onChange={(e) => setDeleteConfirmation(prev => ({
                              ...prev,
                              password: e.target.value
                            }))}
                            className="form-control"
                            placeholder="Masukkan password untuk konfirmasi"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="form-actions">
                        <button 
                          className="btn btn-secondary"
                          onClick={() => handleDeleteStep(1)}
                        >
                          Kembali
                        </button>
                        <button 
                          className="btn btn-danger"
                          disabled={!deleteConfirmation.password}
                          onClick={deleteAccount}
                        >
                          <FaTrashAlt /> Hapus Akun Sekarang
                        </button>
                      </div>
                    </div>
                  )}
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