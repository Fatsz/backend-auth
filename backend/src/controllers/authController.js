/**
 * @file authController.js
 * @description Controller untuk autentikasi (Register & Login)
 * 
 * Controller bertugas:
 * 1. Menerima data dari request HTTP
 * 2. Memanggil service layer untuk logika bisnis
 * 3. Mengirimkan response HTTP ke client
 * 
 * Controller TIDAK berisi logika bisnis — itu tugas service layer.
 */

const authService = require('../services/authService');

/**
 * Handler: Register User Baru
 * POST /api/auth/register
 * 
 * Body: { username, email, password }
 * Response: 201 Created + user data
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Panggil service untuk proses registrasi
    const { user } = await authService.registerUser(username, email, password);

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil! Silakan login.',
      data: { user },
    });
  } catch (error) {
    // Gunakan statusCode dari service jika ada, default 500
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server',
    });
  }
};

/**
 * Handler: Login User
 * POST /api/auth/login
 * 
 * Body: { email, password }
 * Response: 200 OK + JWT token + user data
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Panggil service untuk verifikasi dan generate token
    const { token, user } = await authService.loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server',
    });
  }
};

/**
 * Handler: Logout
 * POST /api/auth/logout
 * 
 * Catatan: Logout dengan JWT bersifat client-side.
 * Server hanya menginstruksikan client untuk menghapus token.
 * Untuk produksi, implementasikan token blacklist menggunakan Redis.
 */
const logout = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logout berhasil. Silakan hapus token dari penyimpanan lokal Anda.',
  });
};

module.exports = {
  register,
  login,
  logout,
};
