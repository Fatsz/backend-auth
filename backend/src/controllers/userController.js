/**
 * @file userController.js
 * @description Controller untuk data user (Profile)
 * 
 * Endpoint ini adalah contoh Protected Route — hanya bisa diakses
 * oleh user yang sudah login dan memiliki JWT token yang valid.
 */

const authService = require('../services/authService');

/**
 * Handler: Get Profile User
 * GET /api/user/profile
 * 
 * Header: Authorization: Bearer <token>
 * Response: 200 OK + data profile user
 * 
 * Data user tersedia di req.user karena sudah diinjeksi oleh authMiddleware
 */
const getProfile = async (req, res) => {
  try {
    // req.user.id berasal dari payload JWT yang di-decode oleh authMiddleware
    const userId = req.user.id;

    // Ambil data terbaru dari database (bukan hanya dari token)
    // Ini penting agar perubahan username/email langsung terlihat
    const { user } = await authService.getUserProfile(userId);

    return res.status(200).json({
      success: true,
      message: 'Data profile berhasil diambil',
      data: { user },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server',
    });
  }
};

module.exports = {
  getProfile,
};
