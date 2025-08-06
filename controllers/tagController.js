// controllers/tagController.js - Controller untuk mengelola tag

const { Tag, Memory } = require('../models');

/**
 * Mendapatkan semua tag
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getTags = async (req, res) => {
  try {
    // Ambil semua tag yang digunakan oleh kenangan pengguna yang login
    const tags = await Tag.findAll({
      include: [{
        model: Memory,
        as: 'memories',
        where: { user_id: req.user.id },
        attributes: [],
        through: { attributes: [] }
      }],
      order: [['name', 'ASC']]
    });

    res.json(tags);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Mendapatkan kenangan berdasarkan tag
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getMemoriesByTag = async (req, res) => {
  try {
    // Cari tag berdasarkan ID
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      return res.status(404).json({ msg: 'Tag tidak ditemukan' });
    }

    // Ambil semua kenangan dengan tag ini yang dimiliki oleh pengguna yang login
    const memories = await Memory.findAll({
      include: [
        {
          model: Tag,
          as: 'tags',
          where: { id: tag.id },
          through: { attributes: [] }
        }
      ],
      where: { user_id: req.user.id },
      order: [['memory_date', 'DESC']]
    });

    res.json(memories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Membuat tag baru
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;

    // Cek apakah tag sudah ada
    let tag = await Tag.findOne({ where: { name: name.toLowerCase() } });

    if (tag) {
      return res.status(400).json({ msg: 'Tag sudah ada' });
    }

    // Buat tag baru
    tag = await Tag.create({ name: name.toLowerCase() });

    res.status(201).json(tag);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Menghapus tag
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.deleteTag = async (req, res) => {
  try {
    // Cari tag berdasarkan ID
    const tag = await Tag.findByPk(req.params.id, {
      include: [{
        model: Memory,
        as: 'memories',
        where: { user_id: req.user.id },
        attributes: ['id']
      }]
    });

    if (!tag || tag.memories.length === 0) {
      return res.status(404).json({ msg: 'Tag tidak ditemukan atau tidak digunakan oleh kenangan Anda' });
    }

    // Hapus hubungan tag dengan kenangan pengguna
    await Promise.all(tag.memories.map(memory => memory.removeTag(tag)));

    // Cek apakah tag masih digunakan oleh pengguna lain
    const usedByOthers = await Memory.findOne({
      include: [{
        model: Tag,
        as: 'tags',
        where: { id: tag.id }
      }]
    });

    // Jika tidak digunakan oleh pengguna lain, hapus tag
    if (!usedByOthers) {
      await tag.destroy();
    }

    res.json({ msg: 'Tag berhasil dihapus dari kenangan Anda' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};