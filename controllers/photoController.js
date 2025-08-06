// controllers/photoController.js - Controller untuk mengelola foto

const fs = require('fs');
const path = require('path');
const { Photo, Memory } = require('../models');

/**
 * Upload foto untuk kenangan tertentu
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.uploadPhoto = async (req, res) => {
  try {
    // Cek apakah kenangan ada dan milik pengguna yang login
    const memory = await Memory.findOne({
      where: { 
        id: req.params.memoryId,
        user_id: req.user.id
      }
    });

    if (!memory) {
      // Hapus file yang sudah diupload jika kenangan tidak ditemukan
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ msg: 'Kenangan tidak ditemukan' });
    }

    // Jika tidak ada file yang diupload
    if (!req.file) {
      return res.status(400).json({ msg: 'Tidak ada file yang diupload' });
    }

    // Simpan informasi foto ke database
    const photo = await Photo.create({
      memory_id: memory.id,
      file_path: `/uploads/${path.basename(req.file.path)}`,
      caption: req.body.caption || ''
    });

    res.status(201).json(photo);
  } catch (err) {
    // Hapus file yang sudah diupload jika terjadi error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Mendapatkan semua foto untuk kenangan tertentu
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getPhotos = async (req, res) => {
  try {
    // Cek apakah kenangan ada dan milik pengguna yang login
    const memory = await Memory.findOne({
      where: { 
        id: req.params.memoryId,
        user_id: req.user.id
      }
    });

    if (!memory) {
      return res.status(404).json({ msg: 'Kenangan tidak ditemukan' });
    }

    // Ambil semua foto untuk kenangan ini
    const photos = await Photo.findAll({
      where: { memory_id: memory.id },
      order: [['upload_date', 'DESC']]
    });

    res.json(photos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Mengupdate caption foto
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.updatePhoto = async (req, res) => {
  try {
    // Cek apakah foto ada dan milik kenangan pengguna yang login
    const photo = await Photo.findByPk(req.params.id, {
      include: [{
        model: Memory,
        as: 'memory',
        where: { user_id: req.user.id }
      }]
    });

    if (!photo) {
      return res.status(404).json({ msg: 'Foto tidak ditemukan' });
    }

    // Update caption foto
    photo.caption = req.body.caption;
    await photo.save();

    res.json(photo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Menghapus foto
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.deletePhoto = async (req, res) => {
  try {
    // Cek apakah foto ada dan milik kenangan pengguna yang login
    const photo = await Photo.findByPk(req.params.id, {
      include: [{
        model: Memory,
        as: 'memory',
        where: { user_id: req.user.id }
      }]
    });

    if (!photo) {
      return res.status(404).json({ msg: 'Foto tidak ditemukan' });
    }

    // Hapus file fisik
    const filePath = path.join(__dirname, '..', photo.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Hapus data foto dari database
    await photo.destroy();

    res.json({ msg: 'Foto berhasil dihapus' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};