/**
 * routes/projectRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * POST   /projects              – create project
 * GET    /projects              – list projects
 * GET    /projects/:id          – single project
 * PUT    /projects/:id          – update project
 * DELETE /projects/:id          – delete project
 * POST   /projects/:id/upload   – upload file to project
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Router } from 'express';
import multer from 'multer';
import {
  createProjectHandler,
  getAllProjectsHandler,
  getProjectByIdHandler,
  updateProjectHandler,
  deleteProjectHandler,
  uploadProjectFileHandler,
} from '../controllers/projectController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

// Multer – store files in memory (buffer) before uploading to Supabase Storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (_req, file, cb) => {
    // Allow images and common document types
    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type.'), false);
    }
  },
});

// All project routes require authentication
router.use(verifyToken);

router.post('/', createProjectHandler);
router.get('/', getAllProjectsHandler);
router.get('/:id', getProjectByIdHandler);
router.put('/:id', updateProjectHandler);
router.delete('/:id', deleteProjectHandler);

// File upload – multer runs before the controller
router.post('/:id/upload', upload.single('file'), uploadProjectFileHandler);

export default router;
