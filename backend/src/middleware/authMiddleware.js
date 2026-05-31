/**
 * @file authMiddleware.js
 * @description Middleware autentikasi JWT
 * 
 * Setiap request ke protected route wajib melewati middleware ini.
 * Middleware memverifikasi JWT token dari Authorization header,
 * lalu menyimpan data user ke req.user untuk digunakan controller.
 * 
 * Format header yang diharapkan:
 * Authorization: Bearer <token>
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware: Verifikasi JWT Token
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const verifyToken = (req, res, next) => {
  try {
    // 1. Ambil Authorization header
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Token tidak ditemukan.',
      });
    }

    // 2. Pastikan format "Bearer <token>"
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: 'Format token tidak valid. Gunakan format: Bearer <token>',
      });
    }

    const token = parts[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Token kosong.',
      });
    }

    // 3. Verifikasi token menggunakan secret key
    // jwt.verify() akan throw error jika token tidak valid atau expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Simpan payload user ke req.user untuk diakses controller
    req.user = decoded;

    next();
  } catch (error) {
    // Handle berbagai jenis error JWT
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token sudah kadaluarsa. Silakan login kembali.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid.',
      });
    }

    if (error.name === 'NotBeforeError') {
      return res.status(401).json({
        success: false,
        message: 'Token belum aktif.',
      });
    }

    // Generic error
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat verifikasi token.',
    });
  }
};

module.exports = { verifyToken };
