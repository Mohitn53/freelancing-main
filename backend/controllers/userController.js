/**
 * controllers/userController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * CRUD operations on the `profiles` table.
 *
 * Routes handled:
 *   GET    /users          – list all users      (admin only)
 *   GET    /users/:id      – single user profile (admin | self)
 *   PUT    /users/:id      – update profile      (admin | self)
 *   DELETE /users/:id      – delete user         (admin only)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import supabase from '../config/supabaseClient.js';
import { sanitiseString, isValidUUID } from '../utils/validators.js';

// ─── GET /users ───────────────────────────────────────────────────────────────
/**
 * @desc   List all user profiles
 * @access Admin only
 */
export const getAllUsers = async (req, res, next) => {
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

// ─── GET /users/:id ───────────────────────────────────────────────────────────
/**
 * @desc   Get a single user by ID
 * @access Admin or the user themselves
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid user ID.' });
    }

    // Non-admins can only fetch their own profile
    if (req.userRole !== 'admin' && req.user.sub !== id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorised to view this profile.',
      });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, phone, address, role, created_at')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, data: { user: data } });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /users/:id ───────────────────────────────────────────────────────────
/**
 * @desc   Update a user profile
 * @access Admin or the user themselves
 *
 * Body (all optional): { name, phone, address }
 * Admin can additionally update: { role }
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid user ID.' });
    }

    // Non-admins can only edit their own profile
    if (req.userRole !== 'admin' && req.user.sub !== id) {
      return res
        .status(403)
        .json({ success: false, message: 'Access denied.' });
    }

    const { name, phone, address, role } = req.body;

    // Build safe update object
    const updates = {};
    if (name !== undefined) updates.name = sanitiseString(name);
    if (phone !== undefined) updates.phone = sanitiseString(phone);
    if (address !== undefined) updates.address = sanitiseString(address);

    // Only admins can change roles
    if (role !== undefined) {
      if (req.userRole !== 'admin') {
        return res
          .status(403)
          .json({ success: false, message: 'Only admins can change roles.' });
      }
      const validRoles = ['admin', 'user'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: `Invalid role. Must be one of: ${validRoles.join(', ')}`,
        });
      }
      updates.role = role;
    }

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'No updatable fields provided.' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select('id, name, email, phone, address, role')
      .single();

    if (error) throw new Error(error.message);

    res.status(200).json({
      success: true,
      message: 'Profile updated.',
      data: { user: data },
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /users/:id ────────────────────────────────────────────────────────
/**
 * @desc   Delete a user (profile row + auth user)
 * @access Admin only
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid user ID.' });
    }

    // Delete profile row first (FK constraint order)
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (profileError) throw new Error(profileError.message);

    // Remove the auth user
    const { error: authError } =
      await supabase.auth.admin.deleteUser(id);

    if (authError) throw new Error(authError.message);

    res
      .status(200)
      .json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
