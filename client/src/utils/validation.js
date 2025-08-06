// Fungsi untuk validasi email
const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// Fungsi untuk validasi password
const validatePassword = (password) => {
  // Minimal 6 karakter
  return password.length >= 6;
};

// Fungsi untuk validasi username
const validateUsername = (username) => {
  // Minimal 3 karakter, hanya huruf, angka, dan underscore
  const re = /^[a-zA-Z0-9_]{3,}$/;
  return re.test(username);
};

// Fungsi untuk validasi form login
const validateLoginForm = (email, password) => {
  const errors = {};
  
  if (!email) {
    errors.email = 'Email harus diisi';
  } else if (!validateEmail(email)) {
    errors.email = 'Format email tidak valid';
  }
  
  if (!password) {
    errors.password = 'Password harus diisi';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Fungsi untuk validasi form registrasi
const validateRegisterForm = (username, email, password, password2) => {
  const errors = {};
  
  if (!username) {
    errors.username = 'Username harus diisi';
  } else if (!validateUsername(username)) {
    errors.username = 'Username minimal 3 karakter dan hanya boleh berisi huruf, angka, dan underscore';
  }
  
  if (!email) {
    errors.email = 'Email harus diisi';
  } else if (!validateEmail(email)) {
    errors.email = 'Format email tidak valid';
  }
  
  if (!password) {
    errors.password = 'Password harus diisi';
  } else if (!validatePassword(password)) {
    errors.password = 'Password minimal 6 karakter';
  }
  
  if (!password2) {
    errors.password2 = 'Konfirmasi password harus diisi';
  } else if (password !== password2) {
    errors.password2 = 'Password tidak cocok';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Fungsi untuk validasi form memory
const validateMemoryForm = (title) => {
  const errors = {};
  
  if (!title) {
    errors.title = 'Judul kenangan harus diisi';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export {
  validateEmail,
  validatePassword,
  validateUsername,
  validateLoginForm,
  validateRegisterForm,
  validateMemoryForm
};