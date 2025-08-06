// routes/auth.js - Rute untuk autentikasi pengguna

const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Mendaftarkan pengguna baru
// @access  Public
router.post('/register', register);

// @route   POST api/auth/login
// @desc    Login pengguna dan mendapatkan token
// @access  Public
router.post('/login', login);

// @route   GET api/auth/me
// @desc    Mendapatkan data pengguna yang sedang login
// @access  Private
router.get('/me', auth, getMe);

module.exports = router;