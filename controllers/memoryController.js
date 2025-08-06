// controllers/memoryController.js - Controller untuk mengelola kenangan

const { Memory, Photo, Tag, User, sequelize } = require('../models');

/**
 * Mendapatkan semua kenangan milik pengguna yang sedang login
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getMemories = async (req, res) => {
  try {
    const memories = await Memory.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Photo,
          as: 'photos',
          attributes: ['id', 'file_path', 'caption']
        },
        {
          model: Tag,
          as: 'tags',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ],
      order: [['memory_date', 'DESC']]
    });

    res.json(memories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Mendapatkan detail satu kenangan berdasarkan ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getMemory = async (req, res) => {
  try {
    const memory = await Memory.findOne({
      where: { 
        id: req.params.id,
        user_id: req.user.id
      },
      include: [
        {
          model: Photo,
          as: 'photos',
          attributes: ['id', 'file_path', 'caption', 'upload_date']
        },
        {
          model: Tag,
          as: 'tags',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ]
    });

    if (!memory) {
      return res.status(404).json({ msg: 'Kenangan tidak ditemukan' });
    }

    res.json(memory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Membuat kenangan baru
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.createMemory = async (req, res) => {
  const { title, description, location, memory_date, tags } = req.body;
  const transaction = await sequelize.transaction();

  try {
    // Buat kenangan baru
    const memory = await Memory.create({
      title,
      description,
      location,
      memory_date,
      user_id: req.user.id
    }, { transaction });

    // Jika ada tags, proses tags
    if (tags && tags.length > 0) {
      // Proses setiap tag
      for (const tagName of tags) {
        // Cari atau buat tag
        const [tag] = await Tag.findOrCreate({
          where: { name: tagName.toLowerCase() },
          transaction
        });

        // Hubungkan tag dengan kenangan
        await memory.addTag(tag, { transaction });
      }
    }

    await transaction.commit();
    res.status(201).json(memory);
  } catch (err) {
    await transaction.rollback();
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Mengupdate kenangan yang ada
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.updateMemory = async (req, res) => {
  const { title, description, location, memory_date, tags } = req.body;
  const transaction = await sequelize.transaction();

  try {
    // Cari kenangan yang akan diupdate
    const memory = await Memory.findOne({
      where: { 
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!memory) {
      await transaction.rollback();
      return res.status(404).json({ msg: 'Kenangan tidak ditemukan' });
    }

    // Update data kenangan
    memory.title = title || memory.title;
    memory.description = description !== undefined ? description : memory.description;
    memory.location = location !== undefined ? location : memory.location;
    memory.memory_date = memory_date || memory.memory_date;
    
    await memory.save({ transaction });

    // Jika ada tags, update tags
    if (tags && tags.length > 0) {
      // Hapus semua tag yang ada
      await memory.setTags([], { transaction });

      // Tambahkan tag baru
      for (const tagName of tags) {
        const [tag] = await Tag.findOrCreate({
          where: { name: tagName.toLowerCase() },
          transaction
        });

        await memory.addTag(tag, { transaction });
      }
    }

    await transaction.commit();
    
    // Ambil data kenangan yang sudah diupdate dengan relasi
    const updatedMemory = await Memory.findByPk(memory.id, {
      include: [
        {
          model: Photo,
          as: 'photos',
          attributes: ['id', 'file_path', 'caption']
        },
        {
          model: Tag,
          as: 'tags',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    });

    res.json(updatedMemory);
  } catch (err) {
    await transaction.rollback();
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Menghapus kenangan
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.deleteMemory = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    // Cari kenangan yang akan dihapus
    const memory = await Memory.findOne({
      where: { 
        id: req.params.id,
        user_id: req.user.id
      },
      include: [{
        model: Photo,
        as: 'photos'
      }]
    });

    if (!memory) {
      await transaction.rollback();
      return res.status(404).json({ msg: 'Kenangan tidak ditemukan' });
    }

    // Hapus kenangan
    await memory.destroy({ transaction });
    await transaction.commit();

    res.json({ msg: 'Kenangan berhasil dihapus' });
  } catch (err) {
    await transaction.rollback();
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Mencari kenangan berdasarkan kata kunci
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.searchMemories = async (req, res) => {
  const { keyword } = req.query;

  try {
    const memories = await Memory.findAll({
      where: {
        user_id: req.user.id,
        [sequelize.Op.or]: [
          { title: { [sequelize.Op.iLike]: `%${keyword}%` } },
          { description: { [sequelize.Op.iLike]: `%${keyword}%` } },
          { location: { [sequelize.Op.iLike]: `%${keyword}%` } }
        ]
      },
      include: [
        {
          model: Photo,
          as: 'photos',
          attributes: ['id', 'file_path', 'caption']
        },
        {
          model: Tag,
          as: 'tags',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ],
      order: [['memory_date', 'DESC']]
    });

    res.json(memories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};