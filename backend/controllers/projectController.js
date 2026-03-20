/**
 * controllers/projectController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * HTTP layer for project CRUD + file upload.
 *
 * Routes handled:
 *   POST   /projects            – create project
 *   GET    /projects            – list projects
 *   GET    /projects/:id        – get single project
 *   PUT    /projects/:id        – update project
 *   DELETE /projects/:id        – delete project
 *   POST   /projects/:id/upload – upload a file for a project
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  uploadProjectFile,
} from '../services/projectService.js';

import {
  getMissingFields,
  isValidUUID,
  sanitiseString,
} from '../utils/validators.js';

// ─── POST /projects ───────────────────────────────────────────────────────────
/**
 * @desc   Create a new project
 * @access Private
 *
 * Body: { title, description, status }
 *
 * Response 201:
 * { success: true, data: { project } }
 */
export const createProjectHandler = async (req, res, next) => {
  try {
    const missing = getMissingFields(req.body, ['title']);
    if (missing.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`,
      });
    }

    const { title, description = '', status = 'active' } = req.body;

    const validStatuses = ['active', 'inactive', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const project = await createProject({
      title: sanitiseString(title),
      description: sanitiseString(description),
      status,
      owner_id: req.user.sub,
    });

    res.status(201).json({
      success: true,
      message: 'Project created.',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /projects ────────────────────────────────────────────────────────────
/**
 * @desc   List projects (admin sees all; users see their own)
 * @access Private
 */
export const getAllProjectsHandler = async (req, res, next) => {
  try {
    const isAdmin = req.userRole === 'admin';
    const projects = await getAllProjects(isAdmin ? null : req.user.sub);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: { projects },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /projects/:id ────────────────────────────────────────────────────────
/**
 * @desc   Get a single project by ID
 * @access Private (admin or owner)
 */
export const getProjectByIdHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid project ID.' });
    }

    const project = await getProjectById(id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: 'Project not found.' });
    }

    // Only the owner or an admin can view the project
    if (req.userRole !== 'admin' && project.owner_id !== req.user.sub) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorised to view this project.',
      });
    }

    res.status(200).json({ success: true, data: { project } });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /projects/:id ────────────────────────────────────────────────────────
/**
 * @desc   Update a project
 * @access Private (admin or owner)
 */
export const updateProjectHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid project ID.' });
    }

    const existing = await getProjectById(id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: 'Project not found.' });
    }

    if (req.userRole !== 'admin' && existing.owner_id !== req.user.sub) {
      return res
        .status(403)
        .json({ success: false, message: 'Access denied.' });
    }

    const { title, description, status } = req.body;
    const updates = {};
    if (title) updates.title = sanitiseString(title);
    if (description !== undefined)
      updates.description = sanitiseString(description);
    if (status) {
      const validStatuses = ['active', 'inactive', 'archived'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        });
      }
      updates.status = status;
    }

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'No updatable fields provided.' });
    }

    const project = await updateProject(id, updates);

    res.status(200).json({
      success: true,
      message: 'Project updated.',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /projects/:id ─────────────────────────────────────────────────────
/**
 * @desc   Delete a project
 * @access Private (admin or owner)
 */
export const deleteProjectHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid project ID.' });
    }

    const existing = await getProjectById(id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: 'Project not found.' });
    }

    if (req.userRole !== 'admin' && existing.owner_id !== req.user.sub) {
      return res
        .status(403)
        .json({ success: false, message: 'Access denied.' });
    }

    await deleteProject(id);

    res
      .status(200)
      .json({ success: true, message: 'Project deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// ─── POST /projects/:id/upload ────────────────────────────────────────────────
/**
 * @desc   Upload a file and attach its public URL to a project
 * @access Private (admin or owner)
 *
 * Expects multer middleware (single file, field name: "file") to be applied
 * at the route level before this controller is called.
 *
 * Response 200:
 * { success: true, data: { fileUrl } }
 */
export const uploadProjectFileHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid project ID.' });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: 'No file provided.' });
    }

    const { buffer, originalname, mimetype } = req.file;

    const fileUrl = await uploadProjectFile(
      buffer,
      originalname,
      mimetype,
      id
    );

    // Optionally store the URL on the project row
    await updateProject(id, { file_url: fileUrl });

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully.',
      data: { fileUrl },
    });
  } catch (error) {
    next(error);
  }
};
