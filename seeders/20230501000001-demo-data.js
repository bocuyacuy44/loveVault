'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Seed users
    const users = await queryInterface.bulkInsert(
      'users',
      [
        {
          username: 'demo_user',
          email: 'demo@example.com',
          password_hash: await bcrypt.hash('password123', 10),
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      { returning: true }
    );

    const userId = users[0].id;

    // Seed memories
    const memories = await queryInterface.bulkInsert(
      'memories',
      [
        {
          user_id: userId,
          title: 'Liburan ke Bali',
          description: 'Liburan yang menyenangkan bersama keluarga di Bali',
          location: 'Bali, Indonesia',
          memory_date: new Date(2023, 0, 15), // 15 Januari 2023
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          user_id: userId,
          title: 'Ulang Tahun ke-25',
          description: 'Perayaan ulang tahun bersama teman-teman',
          location: 'Jakarta, Indonesia',
          memory_date: new Date(2023, 2, 10), // 10 Maret 2023
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      { returning: true }
    );

    // Seed tags
    const tags = await queryInterface.bulkInsert(
      'tags',
      [
        {
          name: 'liburan',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'keluarga',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'ulang tahun',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'teman',
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      { returning: true }
    );

    // Seed memory_tags
    await queryInterface.bulkInsert('memory_tags', [
      {
        memory_id: memories[0].id,
        tag_id: tags[0].id, // liburan
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        memory_id: memories[0].id,
        tag_id: tags[1].id, // keluarga
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        memory_id: memories[1].id,
        tag_id: tags[2].id, // ulang tahun
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        memory_id: memories[1].id,
        tag_id: tags[3].id, // teman
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Catatan: Kita tidak menambahkan seed untuk photos karena memerlukan file fisik
  },

  down: async (queryInterface, Sequelize) => {
    // Menghapus data dalam urutan terbalik
    await queryInterface.bulkDelete('memory_tags', null, {});
    await queryInterface.bulkDelete('tags', null, {});
    await queryInterface.bulkDelete('photos', null, {});
    await queryInterface.bulkDelete('memories', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};