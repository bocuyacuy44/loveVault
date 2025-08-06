// routes/users.js - Rute untuk mengelola pengguna

const express = require('express');
const router = express.Router();
const { User } = require('../models');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// @route   PUT api/users/profile
// @desc    Mengupdate profil pengguna
// @access  Private
router.put('/profile', auth, async (req, res) => {
  const { username, email, password, newPassword } = req.body;
  
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
    if (password && newPassword) {
      const isMatch = await bcrypt.compare(password, user.password_hash);
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

module.exports = router;