/**
 * routes/authRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * POST  /auth/signup   – register
 * POST  /auth/login    – login
 * POST  /auth/logout   – logout  (token required)
 * GET   /auth/me       – current user profile (token required)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Router } from 'express';
import { signup, login, logout, getMe } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.post('/logout', verifyToken, logout);
router.get('/me', verifyToken, getMe);

export default router;
