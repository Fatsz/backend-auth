/**
 * @file axiosInstance.js
 * @description Konfigurasi Axios untuk komunikasi dengan backend API
 * 
 * Kita membuat instance Axios yang sudah dikonfigurasi dengan:
 * 1. Base URL dari environment variable
 * 2. Request interceptor: otomatis tambahkan JWT token ke setiap request
 * 3. Response interceptor: tangani error 401 (token expired/invalid) secara global
 */

import axios from 'axios';

// Buat instance Axios dengan konfigurasi default
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:5000/api
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout 10 detik
});

// ─── Request Interceptor ──────────────────────────────────────────────────
/**
 * Setiap request yang keluar akan diproses di sini SEBELUM dikirim.
 * Kita otomatis menambahkan JWT token dari localStorage ke header Authorization.
 * Ini berarti kita tidak perlu secara manual menambahkan token di setiap komponen.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ─── Response Interceptor ─────────────────────────────────────────────────
/**
 * Setiap response yang masuk akan diproses di sini.
 * Kita menangani error 401 (Unauthorized) secara global:
 * - Hapus token yang tidak valid dari localStorage
 * - Redirect user ke halaman login
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Response sukses — langsung kembalikan
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau tidak valid — paksa logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect ke login jika bukan sudah di halaman login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
