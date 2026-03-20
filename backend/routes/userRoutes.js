/**
 * routes/userRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * GET    /users         – list all users  (admin only)
 * GET    /users/:id     – get user        (admin | self)
 * PUT    /users/:id     – update user     (admin | self)
 * DELETE /users/:id     – delete user     (admin only)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// All user routes require a valid JWT first
router.use(verifyToken);

router.get('/', requireRole('admin'), getAllUsers);
router.get('/:id', getUserById);          // ownership check inside controller
router.put('/:id', updateUser);           // ownership / role check inside controller
router.delete('/:id', requireRole('admin'), deleteUser);

export default router;
