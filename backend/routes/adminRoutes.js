/**
 * routes/adminRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * All routes require verifyToken + requireRole('admin').
 *
 * GET    /admin/users          – list all users
 * GET    /admin/analytics      – platform analytics
 * DELETE /admin/projects/:id   – force-delete any project
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Router } from 'express';
import {
  adminGetAllUsers,
  adminGetAnalytics,
  adminDeleteProject,
} from '../controllers/adminController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Every admin route requires a valid JWT + admin role
router.use(verifyToken, requireRole('admin'));

router.get('/users', adminGetAllUsers);
router.get('/analytics', adminGetAnalytics);
router.delete('/projects/:id', adminDeleteProject);

export default router;
