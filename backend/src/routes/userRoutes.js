/**
 * @file userRoutes.js
 * @description Definisi route untuk operasi user
 * 
 * Struktur URL: /api/user/*
 * Semua route di sini WAJIB melewati verifyToken middleware
 */

const express = require('express');
const router = express.Router();

// Import controller dan middleware
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/user/profile
 * @desc    Mendapatkan data profile user yang sedang login
 * @access  Protected
 * 
 * Alur: Request → verifyToken (cek JWT) → getProfile (ambil dari DB)
 */
router.get('/profile', verifyToken, userController.getProfile);

module.exports = router;
