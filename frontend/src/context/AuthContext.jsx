/**
 * @file AuthContext.jsx
 * @description Context API untuk manajemen state autentikasi global
 * 
 * Context API memungkinkan kita berbagi state autentikasi (user, token, loading)
 * ke seluruh komponen tanpa perlu prop drilling (melewati props berlapis-lapis).
 * 
 * Komponen manapun bisa menggunakan hook useAuth() untuk:
 * - Mengecek apakah user sudah login
 * - Mendapatkan data user yang sedang login
 * - Memanggil fungsi login/logout/register
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

// 1. Buat Context
const AuthContext = createContext(null);

/**
 * AuthProvider: Wrapper komponen yang menyediakan state auth ke semua children
 * Letakkan di paling atas di main.jsx agar semua komponen bisa mengaksesnya
 */
export const AuthProvider = ({ children }) => {
  // State: data user yang sedang login
  const [user, setUser] = useState(null);
  // State: loading saat pertama kali app dimuat (cek token di localStorage)
  const [loading, setLoading] = useState(true);
  // State: error global (opsional, untuk debugging)
  const [error, setError] = useState(null);

  /**
   * Inisialisasi: Cek apakah ada token & user tersimpan di localStorage
   * Dipanggil sekali saat app pertama kali dimuat
   * Ini mencegah user harus login ulang setiap refresh halaman
   */
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
          // Pulihkan state user dari localStorage
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        // Jika data localStorage corrupt, bersihkan
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Fungsi Register
   * @param {string} username
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{success: boolean, message: string}>}
   */
  const register = useCallback(async (username, email, password) => {
    try {
      setError(null);
      const response = await axiosInstance.post('/auth/register', {
        username,
        email,
        password,
      });
      return { success: true, message: response.data.message };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.join(', ') ||
        'Registrasi gagal. Coba lagi.';
      setError(message);
      return { success: false, message };
    }
  }, []);

  /**
   * Fungsi Login
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{success: boolean, message: string}>}
   */
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { token, user: userData } = response.data.data;

      // Simpan token dan data user ke localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update state React
      setUser(userData);

      return { success: true, message: response.data.message };
    } catch (err) {
      const message =
        err.response?.data?.message || 'Login gagal. Periksa email dan password Anda.';
      setError(message);
      return { success: false, message };
    }
  }, []);

  /**
   * Fungsi Logout
   * Menghapus token dari localStorage dan mereset state user
   */
  const logout = useCallback(async () => {
    try {
      // Opsional: beritahu server (untuk logging/blacklist token di masa depan)
      await axiosInstance.post('/auth/logout');
    } catch {
      // Abaikan error — tetap logout di client side
    } finally {
      // Hapus semua data dari localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Reset state
      setUser(null);
      setError(null);
    }
  }, []);

  // Nilai yang akan tersedia di semua komponen yang menggunakan useAuth()
  const value = {
    user,        // Data user: { id, username, email }
    loading,     // Boolean: apakah sedang inisialisasi
    error,       // String: pesan error terakhir
    isLoggedIn: !!user, // Boolean: apakah user sudah login
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook useAuth — cara mudah mengakses AuthContext di komponen manapun
 * 
 * Contoh penggunaan:
 * const { user, login, logout, isLoggedIn } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};

export default AuthContext;
