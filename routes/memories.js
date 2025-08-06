// routes/memories.js - Rute untuk mengelola kenangan

const express = require('express');
const router = express.Router();
const { 
  getMemories, 
  getMemory, 
  createMemory, 
  updateMemory, 
  deleteMemory,
  searchMemories
} = require('../controllers/memoryController');
const auth = require('../middleware/auth');

// @route   GET api/memories
// @desc    Mendapatkan semua kenangan pengguna
// @access  Private
router.get('/', auth, getMemories);

// @route   GET api/memories/search
// @desc    Mencari kenangan berdasarkan kata kunci
// @access  Private
router.get('/search', auth, searchMemories);

// @route   GET api/memories/:id
// @desc    Mendapatkan detail satu kenangan
// @access  Private
router.get('/:id', auth, getMemory);

// @route   POST api/memories
// @desc    Membuat kenangan baru
// @access  Private
router.post('/', auth, createMemory);

// @route   PUT api/memories/:id
// @desc    Mengupdate kenangan
// @access  Private
router.put('/:id', auth, updateMemory);

// @route   DELETE api/memories/:id
// @desc    Menghapus kenangan
// @access  Private
router.delete('/:id', auth, deleteMemory);

module.exports = router;