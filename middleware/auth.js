// middleware/auth.js - Middleware untuk autentikasi pengguna

const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware untuk memverifikasi token JWT
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
module.exports = function(req, res, next) {
  // Mendapatkan token dari header
  const token = req.header('x-auth-token');

  // Cek apakah tidak ada token
  if (!token) {
    return res.status(401).json({ msg: 'Tidak ada token, otorisasi ditolak' });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tambahkan user dari payload ke request
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token tidak valid' });
  }
};