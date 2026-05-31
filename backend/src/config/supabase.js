/**
 * @file supabase.js
 * @description Konfigurasi dan inisialisasi Supabase client
 * 
 * Supabase client adalah pintu masuk ke database PostgreSQL kita.
 * Kita menggunakan anon key untuk operasi dari server side,
 * yang dikontrol oleh Row Level Security (RLS) di Supabase.
 */

const { createClient } = require('@supabase/supabase-js');

// Ambil kredensial dari environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Validasi: pastikan env variables tersedia sebelum app berjalan
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase credentials. Please check SUPABASE_URL and SUPABASE_ANON_KEY in your .env file.'
  );
}

/**
 * Supabase client instance (singleton)
 * Digunakan di seluruh aplikasi untuk query ke database
 */
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // Nonaktifkan auto-refresh token Supabase karena kita pakai JWT sendiri
    autoRefreshToken: false,
    persistSession: false,
  },
});

module.exports = supabase;
