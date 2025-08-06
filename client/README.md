# LoveVault Frontend

Ini adalah bagian frontend dari aplikasi LoveVault, yang dibangun menggunakan React.js.

## Teknologi yang Digunakan

- React.js - Library JavaScript untuk membangun antarmuka pengguna
- React Router - Untuk navigasi antar halaman
- Axios - Untuk melakukan HTTP request ke API backend
- React Icons - Untuk ikon-ikon UI
- React Datepicker - Untuk input tanggal
- React Toastify - Untuk notifikasi

## Struktur Direktori

```
src/
├── components/       # Komponen React yang dapat digunakan kembali
│   ├── layout/       # Komponen layout seperti Navbar, Footer, dll
│   └── routing/      # Komponen untuk routing seperti PrivateRoute
├── context/          # Context API untuk state management
├── pages/            # Halaman-halaman aplikasi
├── utils/            # Utilitas dan helper functions
├── App.js            # Komponen utama aplikasi
├── App.css           # Styling untuk App.js
├── index.js          # Entry point aplikasi
└── index.css         # Styling global
```

## Fitur

- Autentikasi pengguna (login, register, logout)
- Manajemen profil pengguna
- Melihat daftar kenangan
- Membuat kenangan baru
- Mengedit kenangan
- Menghapus kenangan
- Mengunggah foto untuk kenangan
- Mengelola tag untuk kenangan
- Pencarian kenangan berdasarkan kata kunci
- Filter kenangan berdasarkan tag

## Cara Menjalankan

1. Pastikan Node.js dan npm sudah terinstal di komputer Anda
2. Instal dependensi dengan menjalankan `npm install`
3. Jalankan aplikasi dengan `npm start`
4. Aplikasi akan berjalan di `http://localhost:3000`

## Catatan

Aplikasi ini dikonfigurasi untuk proxy ke backend yang berjalan di `http://localhost:5000`. Pastikan backend sudah berjalan sebelum menggunakan fitur-fitur yang memerlukan API.