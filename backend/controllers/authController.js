/**
 * controllers/authController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * HTTP layer for authentication routes.
 * Delegates business logic to services/authService.js.
 *
 * Routes handled:
 *   POST  /auth/signup
 *   POST  /auth/login
 *   POST  /auth/logout
 *   GET   /auth/me
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  signUpUser,
  signInUser,
  signOutUser,
  getCurrentUser,
} from '../services/authService.js';

import {
  isValidEmail,
  isValidPassword,
  getMissingFields,
} from '../utils/validators.js';

// ─── POST /auth/signup ────────────────────────────────────────────────────────
/**
 * @desc   Register a new user
 * @access Public
 *
 * Body: { email, password, name }
 *
 * Response 201:
 * {
 *   success : true,
 *   message : "Account created successfully.",
 *   data    : { user }
 * }
 */
export const signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // ── Validate required fields ──
    const missing = getMissingFields(req.body, ['email', 'password', 'name']);
    if (missing.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`,
      });
    }

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid email address.' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const { user } = await signUpUser(email, password, name);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /auth/login ─────────────────────────────────────────────────────────
/**
 * @desc   Login with email + password
 * @access Public
 *
 * Body: { email, password }
 *
 * Response 200:
 * {
 *   success      : true,
 *   message      : "Login successful.",
 *   data         : { user, accessToken, refreshToken }
 * }
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const missing = getMissingFields(req.body, ['email', 'password']);
    if (missing.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`,
      });
    }

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid email address.' });
    }

    const { user, session } = await signInUser(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        user,
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresAt: session.expires_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /auth/logout ────────────────────────────────────────────────────────
/**
 * @desc   Revoke the current session
 * @access Private (verifyToken)
 *
 * Response 200:
 * { success: true, message: "Logged out successfully." }
 */
export const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    await signOutUser(token);

    res
      .status(200)
      .json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
};

// ─── GET /auth/me ─────────────────────────────────────────────────────────────
/**
 * @desc   Get the currently authenticated user's profile
 * @access Private (verifyToken)
 *
 * Response 200:
 * {
 *   success : true,
 *   data    : { profile }
 * }
 */
export const getMe = async (req, res, next) => {
  try {
    const userId = req.user.sub; // injected by verifyToken middleware
    const profile = await getCurrentUser(userId);

    res.status(200).json({ success: true, data: { profile } });
  } catch (error) {
    next(error);
  }
};
