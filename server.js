// server.js - File utama untuk menjalankan server Express

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

// Inisialisasi aplikasi Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menyediakan akses ke folder uploads untuk menyimpan dan mengakses foto
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rute API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/memories', require('./routes/memories'));
app.use('/api/photos', require('./routes/photos'));
app.use('/api/tags', require('./routes/tags'));

// Serve static assets jika dalam mode production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Port untuk server
const PORT = process.env.PORT || 5000;

// Fungsi untuk menghubungkan ke database dan menjalankan server
async function startServer() {
  try {
    // Sinkronisasi model dengan database
    await sequelize.authenticate();
    console.log('Koneksi database berhasil.');
    
    // Jalankan server
    app.listen(PORT, () => {
      console.log(`Server berjalan di port ${PORT}`);
    });
  } catch (error) {
    console.error('Tidak dapat terhubung ke database:', error);
  }
}

startServer();