// routes/tags.js - Rute untuk mengelola tag

const express = require('express');
const router = express.Router();
const { 
  getTags, 
  getMemoriesByTag, 
  createTag, 
  deleteTag 
} = require('../controllers/tagController');
const auth = require('../middleware/auth');

// @route   GET api/tags
// @desc    Mendapatkan semua tag
// @access  Private
router.get('/', auth, getTags);

// @route   GET api/tags/:id/memories
// @desc    Mendapatkan kenangan berdasarkan tag
// @access  Private
router.get('/:id/memories', auth, getMemoriesByTag);

// @route   POST api/tags
// @desc    Membuat tag baru
// @access  Private
router.post('/', auth, createTag);

// @route   DELETE api/tags/:id
// @desc    Menghapus tag
// @access  Private
router.delete('/:id', auth, deleteTag);

module.exports = router;