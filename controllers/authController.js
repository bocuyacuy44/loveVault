// controllers/authController.js - Controller untuk autentikasi pengguna

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Mendaftarkan pengguna baru
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Cek apakah pengguna sudah ada
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ msg: 'Pengguna dengan email ini sudah ada' });
    }

    user = await User.findOne({ where: { username } });
    if (user) {
      return res.status(400).json({ msg: 'Username sudah digunakan' });
    }

    // Enkripsi password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Buat pengguna baru
    user = await User.create({
      username,
      email,
      password_hash
    });

    // Buat payload JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    // Buat token JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Login pengguna
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cek apakah pengguna ada
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Kredensial tidak valid' });
    }

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Kredensial tidak valid' });
    }

    // Buat payload JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    // Buat token JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Mendapatkan data pengguna yang sedang login
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'created_at']
    });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};