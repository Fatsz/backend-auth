/**
 * @file authRoutes.js
 * @description Definisi route untuk autentikasi
 * 
 * Struktur URL: /api/auth/*
 * - POST /api/auth/register  → Registrasi user baru
 * - POST /api/auth/login     → Login dan dapatkan JWT
 * - POST /api/auth/logout    → Logout (protected)
 */

const express = require('express');
const router = express.Router();

// Import controller
const authController = require('../controllers/authController');

// Import middleware
const { validateRegister, validateLogin } = require('../middleware/validateMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/auth/register
 * @desc    Mendaftarkan user baru
 * @access  Public
 * 
 * Middleware pipeline: validateRegister → authController.register
 * Validasi input dilakukan SEBELUM sampai ke controller
 */
router.post('/register', validateRegister, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login dan mendapatkan JWT token
 * @access  Public
 */
router.post('/login', validateLogin, authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (server hanya memberi instruksi)
 * @access  Protected (perlu token)
 */
router.post('/logout', verifyToken, authController.logout);

module.exports = router;
