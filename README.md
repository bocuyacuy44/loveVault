# LoveVault - Aplikasi Penyimpanan Kenangan

LoveVault adalah aplikasi web untuk menyimpan dan mengelola kenangan dan foto-foto wisata Anda. Aplikasi ini memungkinkan Anda untuk mengorganisir kenangan berdasarkan lokasi, tanggal, dan tag, serta menyimpan foto-foto yang terkait dengan kenangan tersebut.

## Fitur

- Autentikasi pengguna (register, login, update profil)
- Manajemen kenangan (tambah, lihat, edit, hapus)
- Upload dan manajemen foto
- Pengelompokan kenangan dengan tag/kategori
- Pencarian kenangan berdasarkan kata kunci
- Tampilan galeri foto

## Teknologi yang Digunakan

- **Backend**: Node.js, Express.js
- **Frontend**: React.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Autentikasi**: JWT (JSON Web Token)
- **Upload File**: Multer

## Struktur Database

- **users**: Menyimpan informasi pengguna
- **memories**: Menyimpan data kenangan/momen
- **photos**: Menyimpan informasi foto-foto
- **tags**: Menyimpan tag/kategori
- **memory_tags**: Tabel relasi many-to-many antara memories dan tags

## Cara Menjalankan Aplikasi

### Prasyarat

- Node.js dan npm terinstal
- PostgreSQL terinstal dan berjalan
- Database PostgreSQL sudah dibuat

### Langkah-langkah

1. Clone repositori ini

2. Instal dependensi
   ```
   npm run install:all
   ```

3. Konfigurasi environment variables
   - Salin file `.env.example` menjadi `.env`
   - Sesuaikan konfigurasi database dan JWT secret

4. Jalankan migrasi database
   ```
   npx sequelize-cli db:migrate
   ```

5. Jalankan aplikasi dalam mode development
   ```
   npm run dev:full
   ```

6. Buka aplikasi di browser
   ```
   http://localhost:3000
   ```

## API Endpoints

### Autentikasi
- `POST /api/auth/register` - Mendaftarkan pengguna baru
- `POST /api/auth/login` - Login pengguna
- `GET /api/auth/me` - Mendapatkan data pengguna yang sedang login

### Pengguna
- `PUT /api/users/profile` - Mengupdate profil pengguna

### Kenangan
- `GET /api/memories` - Mendapatkan semua kenangan pengguna
- `GET /api/memories/search` - Mencari kenangan berdasarkan kata kunci
- `GET /api/memories/:id` - Mendapatkan detail satu kenangan
- `POST /api/memories` - Membuat kenangan baru
- `PUT /api/memories/:id` - Mengupdate kenangan
- `DELETE /api/memories/:id` - Menghapus kenangan

### Foto
- `GET /api/photos/memory/:memoryId` - Mendapatkan semua foto untuk kenangan tertentu
- `POST /api/photos/memory/:memoryId` - Upload foto untuk kenangan tertentu
- `PUT /api/photos/:id` - Mengupdate caption foto
- `DELETE /api/photos/:id` - Menghapus foto

### Tag
- `GET /api/tags` - Mendapatkan semua tag
- `GET /api/tags/:id/memories` - Mendapatkan kenangan berdasarkan tag
- `POST /api/tags` - Membuat tag baru
- `DELETE /api/tags/:id` - Menghapus tag

## Pengembangan Selanjutnya

- Implementasi frontend dengan React
- Fitur berbagi kenangan dengan pengguna lain
- Fitur album foto
- Fitur timeline kenangan
- Integrasi dengan peta untuk menampilkan lokasi kenangan
- Fitur ekspor dan impor data