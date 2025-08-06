const { spawn } = require('child_process');
const path = require('path');

// Fungsi untuk menjalankan perintah dengan output berwarna
function runCommand(command, args, options = {}) {
  const childProcess = spawn(command, args, {
    ...options,
    stdio: 'inherit',
    shell: true
  });

  childProcess.on('error', (error) => {
    console.error(`Error menjalankan ${command}: ${error.message}`);
  });

  return childProcess;
}

// Menjalankan server backend
console.log('\x1b[36m%s\x1b[0m', 'Menjalankan server backend...');
const backendProcess = runCommand('npm', ['run', 'server'], {
  cwd: path.join(__dirname, '..')
});

// Menjalankan client frontend
console.log('\x1b[35m%s\x1b[0m', 'Menjalankan client frontend...');
const frontendProcess = runCommand('npm', ['start'], {
  cwd: path.join(__dirname, '..', 'client')
});

// Menangani sinyal untuk keluar dengan bersih
process.on('SIGINT', () => {
  console.log('\n\x1b[33m%s\x1b[0m', 'Menghentikan aplikasi...');
  backendProcess.kill();
  frontendProcess.kill();
  process.exit(0);
});