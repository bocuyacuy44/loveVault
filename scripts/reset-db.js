const { exec } = require('child_process');

// Fungsi untuk menjalankan perintah secara berurutan
function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Menjalankan: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
      }
      console.log(`Stdout: ${stdout}`);
      resolve(stdout);
    });
  });
}

// Fungsi utama untuk reset database
async function resetDatabase() {
  try {
    // Menghapus semua data
    await runCommand('npx sequelize-cli db:migrate:undo:all');
    console.log('Semua migrasi berhasil dibatalkan');

    // Menjalankan migrasi ulang
    await runCommand('npx sequelize-cli db:migrate');
    console.log('Migrasi berhasil dijalankan ulang');

    // Menjalankan seeder
    await runCommand('npx sequelize-cli db:seed:all');
    console.log('Seeder berhasil dijalankan');

    console.log('Reset database selesai!');
  } catch (error) {
    console.error('Terjadi kesalahan saat reset database:', error);
  }
}

// Konfirmasi sebelum reset
console.log('\x1b[31m%s\x1b[0m', 'PERINGATAN: Ini akan menghapus SEMUA data di database!');
console.log('Tekan Ctrl+C untuk membatalkan atau tunggu 5 detik untuk melanjutkan...');

setTimeout(() => {
  console.log('Memulai reset database...');
  resetDatabase();
}, 5000);