import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Membuat context untuk autentikasi
const AuthContext = createContext();

// Reducer untuk mengelola state autentikasi
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        token: action.payload.token,
        error: null
      };
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Provider component untuk menyediakan state autentikasi ke seluruh aplikasi
export const AuthProvider = ({ children }) => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set header Authorization dengan token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      console.log('Auth token set in axios headers');
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      console.log('Auth token removed from axios headers');
    }
  };

  // Load user jika token ada
  useEffect(() => {
    console.log('AuthContext useEffect running, checking for token');
    if (localStorage.token) {
      console.log('Token found in localStorage:', localStorage.token);
      setAuthToken(localStorage.token);
      loadUser();
    } else {
      console.log('No token found in localStorage');
      dispatch({ type: 'AUTH_ERROR' });
    }
    // eslint-disable-next-line
  }, []);

  // Load user dari server
  const loadUser = async () => {
    try {
      console.log('Attempting to load user with token:', localStorage.token);
      const res = await axios.get('/api/auth/me');
      console.log('User loaded successfully:', res.data);
      dispatch({ type: 'USER_LOADED', payload: res.data });
    } catch (err) {
      console.error('Error loading user:', err.response?.data || err.message);
      toast.error('Gagal memuat data pengguna');
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post('/api/auth/register', formData);
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });
      loadUser();
    } catch (err) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response?.data.message || 'Registration failed'
      });
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      console.log('Attempting to login with:', { email: formData.email });
      const res = await axios.post('/api/auth/login', formData);
      console.log('Login successful, received token:', res.data.token);
      
      // Set token in axios headers
      setAuthToken(res.data.token);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });
      
      // Load user data after successful login
      await loadUser();
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data.msg || 'Invalid credentials'
      });
    }
  };

  // Logout user
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  // Update profile
  const updateProfile = async (formData) => {
    try {
      const res = await axios.put('/api/users/profile', formData);
      dispatch({
        type: 'USER_LOADED',
        payload: res.data
      });
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.msg || err.response?.data?.message || 'Failed to update profile'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        clearErrors,
        loadUser,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;