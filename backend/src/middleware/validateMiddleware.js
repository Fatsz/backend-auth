/**
 * @file validateMiddleware.js
 * @description Middleware untuk validasi input request
 * 
 * Validasi input adalah lapisan pertama keamanan API.
 * Kita memvalidasi data sebelum sampai ke controller/database,
 * untuk mencegah data kotor masuk ke sistem.
 */

/**
 * Validasi format email menggunakan regex standar
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Middleware: Validasi input Register
 * Cek: username, email, password wajib diisi dan format benar
 */
const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];

  // --- Validasi Username ---
  if (!username || username.trim() === '') {
    errors.push('Username wajib diisi');
  } else if (username.trim().length < 3) {
    errors.push('Username minimal 3 karakter');
  } else if (username.trim().length > 50) {
    errors.push('Username maksimal 50 karakter');
  } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
    errors.push('Username hanya boleh mengandung huruf, angka, dan underscore');
  }

  // --- Validasi Email ---
  if (!email || email.trim() === '') {
    errors.push('Email wajib diisi');
  } else if (!isValidEmail(email.trim())) {
    errors.push('Format email tidak valid');
  }

  // --- Validasi Password ---
  if (!password) {
    errors.push('Password wajib diisi');
  } else if (password.length < 8) {
    errors.push('Password minimal 8 karakter');
  } else if (password.length > 128) {
    errors.push('Password terlalu panjang (maksimal 128 karakter)');
  }

  // Jika ada error, kembalikan 422 Unprocessable Entity
  if (errors.length > 0) {
    return res.status(422).json({
      success: false,
      message: 'Validasi gagal',
      errors,
    });
  }

  // Sanitasi: trim whitespace dari input
  req.body.username = username.trim();
  req.body.email = email.trim().toLowerCase();

  next();
};

/**
 * Middleware: Validasi input Login
 * Cek: email dan password wajib diisi
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  // --- Validasi Email ---
  if (!email || email.trim() === '') {
    errors.push('Email wajib diisi');
  } else if (!isValidEmail(email.trim())) {
    errors.push('Format email tidak valid');
  }

  // --- Validasi Password ---
  if (!password) {
    errors.push('Password wajib diisi');
  }

  if (errors.length > 0) {
    return res.status(422).json({
      success: false,
      message: 'Validasi gagal',
      errors,
    });
  }

  // Sanitasi
  req.body.email = email.trim().toLowerCase();

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
};
