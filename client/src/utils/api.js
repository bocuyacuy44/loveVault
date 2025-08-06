import axios from 'axios';

// Mengatur token di header untuk setiap request
const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
    console.log('Auth token set in axios headers from api.js:', token);
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
    console.log('Auth token removed from axios headers in api.js');
  }
};

// Fungsi untuk menangani error dari API
const handleApiError = error => {
  console.error('API Error:', error.response || error);
  const errorMessage =
    error.response?.data?.msg ||
    error.response?.data?.message ||
    error.response?.data?.error ||
    'Terjadi kesalahan pada server';
  
  return errorMessage;
};

// Fungsi untuk memformat tanggal
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Inisialisasi token dari localStorage saat aplikasi dimuat
const initializeAuthToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
    console.log('Auth token initialized from localStorage in api.js');
  }
};

// Panggil inisialisasi token
initializeAuthToken();

export { setAuthToken, handleApiError, formatDate };