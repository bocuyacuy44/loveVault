// routes/users.js - Rute untuk mengelola pengguna

const express = require('express');
const router = express.Router();
const { User, Memory, Photo } = require('../models');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

// @route   PUT api/users/profile
// @desc    Mengupdate profil pengguna
// @access  Private
router.put('/profile', auth, async (req, res) => {
  const { username, email, currentPassword, newPassword } = req.body;
  
  try {
    // Cari pengguna berdasarkan ID
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'Pengguna tidak ditemukan' });
    }
    
    // Jika username diubah, cek apakah username sudah digunakan
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ msg: 'Username sudah digunakan' });
      }
      user.username = username;
    }
    
    // Jika email diubah, cek apakah email sudah digunakan
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ msg: 'Email sudah digunakan' });
      }
      user.email = email;
    }
    
    // Jika password diubah, verifikasi password lama dan update dengan yang baru
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Password lama tidak valid' });
      }
      
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(newPassword, salt);
    }
    
    user.updated_at = new Date();
    await user.save();
    
    // Kembalikan data pengguna tanpa password
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
    
    res.json(userData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/account-stats
// @desc    Mendapatkan statistik akun pengguna (jumlah memories dan photos)
// @access  Private
router.get('/account-stats', auth, async (req, res) => {
  try {
    // Hitung jumlah memories
    const memoryCount = await Memory.count({
      where: { user_id: req.user.id }
    });
    
    // Hitung jumlah photos
    const photoCount = await Photo.count({
      include: [{
        model: Memory,
        as: 'memory',
        where: { user_id: req.user.id }
      }]
    });
    
    res.json({
      memories: memoryCount,
      photos: photoCount
    });
    
  } catch (err) {
    console.error('Error getting account stats:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   DELETE api/users/account
// @desc    Menghapus akun pengguna beserta semua data terkait
// @access  Private
router.delete('/account', auth, async (req, res) => {
  const { password } = req.body;
  
  try {
    // Cari pengguna berdasarkan ID
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'Pengguna tidak ditemukan' });
    }
    
    // Verifikasi password
    if (!password) {
      return res.status(400).json({ msg: 'Password diperlukan untuk menghapus akun' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Password tidak valid' });
    }
    
    // Ambil semua memories milik user beserta photos
    const memories = await Memory.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: Photo,
        as: 'photos'
      }]
    });
    
    // Hapus semua file foto dari sistem file
    for (const memory of memories) {
      if (memory.photos && memory.photos.length > 0) {
        for (const photo of memory.photos) {
          try {
            const filePath = path.join(__dirname, '..', photo.file_path);
            await fs.unlink(filePath);
          } catch (fileErr) {
            // Log error tapi jangan hentikan proses
            console.error(`Error deleting file ${photo.file_path}:`, fileErr.message);
          }
        }
      }
    }
    
    // Hapus user (akan otomatis menghapus memories dan photos karena CASCADE)
    await user.destroy();
    
    res.json({ 
      msg: 'Akun berhasil dihapus',
      deletedMemories: memories.length,
      deletedPhotos: memories.reduce((total, memory) => total + (memory.photos ? memory.photos.length : 0), 0)
    });
    
  } catch (err) {
    console.error('Error deleting account:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;