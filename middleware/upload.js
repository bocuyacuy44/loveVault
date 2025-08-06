// middleware/upload.js - Middleware untuk upload file menggunakan multer

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pastikan direktori uploads ada
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Konfigurasi penyimpanan untuk multer
 * Menyimpan file di folder uploads dengan nama unik
 */
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Membuat nama file unik dengan timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

/**
 * Filter file untuk hanya menerima gambar
 * @param {Object} req - Request object
 * @param {Object} file - File object
 * @param {Function} cb - Callback function
 */
const fileFilter = (req, file, cb) => {
  // Menerima hanya file gambar
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

/**
 * Konfigurasi multer untuk upload
 */
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Batas ukuran file 5MB
  },
  fileFilter: fileFilter
});

module.exports = upload;