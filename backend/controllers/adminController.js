/**
 * controllers/adminController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Admin-only APIs.  All routes in this controller are protected by
 * verifyToken + requireRole('admin') at the route level.
 *
 * Routes handled:
 *   GET    /admin/users          – list all users
 *   GET    /admin/analytics      – platform analytics
 *   DELETE /admin/projects/:id   – force-delete any project
 * ─────────────────────────────────────────────────────────────────────────────
 */

import supabase from '../config/supabaseClient.js';
import { deleteProject } from '../services/projectService.js';
import { isValidUUID } from '../utils/validators.js';

// ─── GET /admin/users ─────────────────────────────────────────────────────────
/**
 * @desc   Return all registered users with role info
 * @access Admin only
 *
 * Response 200:
 * { success: true, count: N, data: { users: [...] } }
 */
export const adminGetAllUsers = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, phone, role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    res.status(200).json({
      success: true,
      count: data.length,
      data: { users: data },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /admin/analytics ─────────────────────────────────────────────────────
/**
 * @desc   Platform-wide analytics snapshot
 * @access Admin only
 *
 * Response 200:
 * {
 *   success : true,
 *   data    : {
 *     totalUsers    : number,
 *     adminCount    : number,
 *     totalProjects : number,
 *     projectsByStatus : { active, inactive, archived }
 *   }
 * }
 */
export const adminGetAnalytics = async (req, res, next) => {
  try {
    // Run counts in parallel for speed
    const [usersResult, projectsResult] = await Promise.all([
      supabase.from('profiles').select('role', { count: 'exact', head: false }),
      supabase
        .from('projects')
        .select('status', { count: 'exact', head: false }),
    ]);

    if (usersResult.error) throw new Error(usersResult.error.message);
    if (projectsResult.error) throw new Error(projectsResult.error.message);

    const users = usersResult.data || [];
    const projects = projectsResult.data || [];

    // Aggregate
    const adminCount = users.filter((u) => u.role === 'admin').length;

    const projectsByStatus = projects.reduce(
      (acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      },
      { active: 0, inactive: 0, archived: 0 }
    );

    res.status(200).json({
      success: true,
      data: {
        totalUsers: users.length,
        adminCount,
        regularUserCount: users.length - adminCount,
        totalProjects: projects.length,
        projectsByStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /admin/projects/:id ───────────────────────────────────────────────
/**
 * @desc   Force-delete any project regardless of owner
 * @access Admin only
 *
 * Response 200:
 * { success: true, message: "Project deleted by admin." }
 */
export const adminDeleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid project ID.' });
    }

    // Verify project exists before deleting
    const { data: existing, error: findError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', id)
      .single();

    if (findError || !existing) {
      return res
        .status(404)
        .json({ success: false, message: 'Project not found.' });
    }

    await deleteProject(id);

    res
      .status(200)
      .json({ success: true, message: 'Project deleted by admin.' });
  } catch (error) {
    next(error);
  }
};
