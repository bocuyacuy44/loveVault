const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Memastikan direktori uploads ada
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Direktori uploads berhasil dibuat');
} else {
  console.log('Direktori uploads sudah ada');
}

// Menjalankan migrasi database
console.log('Menjalankan migrasi database...');
exec('npx sequelize-cli db:migrate', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error saat migrasi: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Migrasi berhasil: ${stdout}`);

  // Menjalankan seeder
  console.log('Menjalankan seeder database...');
  exec('npx sequelize-cli db:seed:all', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error saat seeding: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Seeding berhasil: ${stdout}`);
    console.log('Setup database selesai!');
  });
});