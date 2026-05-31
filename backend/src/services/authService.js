/**
 * @file authService.js
 * @description Business logic layer untuk autentikasi
 * 
 * Service layer memisahkan logika bisnis dari controller.
 * Controller hanya menangani HTTP request/response,
 * sedangkan semua operasi database dan logika ada di sini.
 * 
 * Pattern ini membuat kode lebih:
 * - Testable (bisa di-unit test tanpa HTTP)
 * - Reusable (bisa dipanggil dari berbagai controller)
 * - Maintainable (perubahan logika cukup di satu tempat)
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

// Jumlah salt rounds untuk bcrypt
// 10 adalah standar industri: aman namun tidak terlalu lambat
// Setiap penambahan 1 = dua kali lebih lambat (10 = ~100ms, 12 = ~400ms)
const SALT_ROUNDS = 10;

/**
 * Mendaftarkan user baru ke database
 * @param {string} username
 * @param {string} email
 * @param {string} password - plaintext password
 * @returns {Promise<{user: object}>}
 * @throws {Error} Jika email/username sudah terdaftar
 */
const registerUser = async (username, email, password) => {
  // 1. Cek apakah email sudah terdaftar
  const { data: existingEmail } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingEmail) {
    const error = new Error('Email sudah terdaftar');
    error.statusCode = 409; // Conflict
    throw error;
  }

  // 2. Cek apakah username sudah diambil
  const { data: existingUsername } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .single();

  if (existingUsername) {
    const error = new Error('Username sudah digunakan');
    error.statusCode = 409; // Conflict
    throw error;
  }

  // 3. Hash password menggunakan bcrypt
  // bcrypt.hash() secara otomatis:
  //   - Membuat random salt
  //   - Menggabungkan salt + password
  //   - Melakukan hashing sebanyak 2^SALT_ROUNDS iterasi
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // 4. Simpan user baru ke Supabase
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert([
      {
        username,
        email,
        password: hashedPassword,
      },
    ])
    .select('id, username, email, created_at') // Jangan kembalikan password!
    .single();

  if (insertError) {
    const error = new Error('Gagal menyimpan data user: ' + insertError.message);
    error.statusCode = 500;
    throw error;
  }

  return { user: newUser };
};

/**
 * Memverifikasi kredensial user dan menghasilkan JWT token
 * @param {string} email
 * @param {string} password - plaintext password
 * @returns {Promise<{token: string, user: object}>}
 * @throws {Error} Jika email tidak ditemukan atau password salah
 */
const loginUser = async (email, password) => {
  // 1. Cari user berdasarkan email
  const { data: user, error: findError } = await supabase
    .from('users')
    .select('id, username, email, password') // Butuh password untuk verifikasi
    .eq('email', email)
    .single();

  // PENTING: Jangan bedakan pesan error "email tidak ada" vs "password salah"
  // Ini mencegah user enumeration attack
  if (findError || !user) {
    const error = new Error('Email atau password salah');
    error.statusCode = 401; // Unauthorized
    throw error;
  }

  // 2. Verifikasi password dengan bcrypt.compare()
  // bcrypt.compare() mengekstrak salt dari hash yang tersimpan,
  // lalu membandingkan hasil hash dengan password yang diinput
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error('Email atau password salah');
    error.statusCode = 401;
    throw error;
  }

  // 3. Generate JWT token
  // Payload JWT berisi informasi yang akan tersedia di req.user
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });

  // 4. Kembalikan token dan data user (tanpa password)
  const { password: _, ...userWithoutPassword } = user;

  return {
    token,
    user: userWithoutPassword,
  };
};

/**
 * Mendapatkan data profile user berdasarkan ID
 * @param {string} userId
 * @returns {Promise<{user: object}>}
 */
const getUserProfile = async (userId) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, username, email, created_at')
    .eq('id', userId)
    .single();

  if (error || !user) {
    const err = new Error('User tidak ditemukan');
    err.statusCode = 404;
    throw err;
  }

  return { user };
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
