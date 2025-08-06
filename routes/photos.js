// routes/photos.js - Rute untuk mengelola foto

const express = require('express');
const router = express.Router();
const { 
  uploadPhoto, 
  getPhotos, 
  updatePhoto, 
  deletePhoto 
} = require('../controllers/photoController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET api/photos/memory/:memoryId
// @desc    Mendapatkan semua foto untuk kenangan tertentu
// @access  Private
router.get('/memory/:memoryId', auth, getPhotos);

// @route   POST api/photos/memory/:memoryId
// @desc    Upload foto untuk kenangan tertentu
// @access  Private
router.post('/memory/:memoryId', auth, upload.single('photo'), uploadPhoto);

// @route   PUT api/photos/:id
// @desc    Mengupdate caption foto
// @access  Private
router.put('/:id', auth, updatePhoto);

// @route   DELETE api/photos/:id
// @desc    Menghapus foto
// @access  Private
router.delete('/:id', auth, deletePhoto);

module.exports = router;