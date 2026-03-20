/**
 * services/authService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * All Supabase Auth operations live here.
 * Controllers call these service functions – keeping business logic
 * separate from HTTP concerns.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import supabase from '../config/supabaseClient.js';
import supabaseAuth from '../config/supabaseAuthClient.js';

// ─── Sign Up ──────────────────────────────────────────────────────────────────
/**
 * Registers a new user with Supabase Auth and creates their profile row.
 * @param {string} email
 * @param {string} password
 * @param {string} name
 * @returns {{ user, session }}
 */
export const signUpUser = async (email, password, name) => {
  // 1. Create the auth user
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // auto-confirm for backend-managed signup
    user_metadata: { name },
  });

  if (error) throw new Error(error.message);

  const user = data.user;

  // 2. Insert a matching profile row (role defaults to 'user')
  const { error: profileError } = await supabase.from('profiles').insert({
    id: user.id,
    name,
    email,
    role: 'user',
  });

  if (profileError) {
    // Roll back: delete the auth user if profile creation fails
    await supabase.auth.admin.deleteUser(user.id);
    throw new Error(profileError.message);
  }

  return { user };
};

// ─── Sign In ──────────────────────────────────────────────────────────────────
/**
 * Signs a user in with email + password using Supabase Auth.
 * Returns the session object (which contains the access token / JWT).
 * @param {string} email
 * @param {string} password
 * @returns {{ user, session }}
 */
export const signInUser = async (email, password) => {
  const { data, error } = await supabaseAuth.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return { user: data.user, session: data.session };
};

// ─── Sign Out ─────────────────────────────────────────────────────────────────
/**
 * Revokes the user's current session / refresh token.
 * @param {string} jwt  The access token from the Authorization header.
 */
export const signOutUser = async (jwt) => {
  // Use the anon client scoped to this token to sign out
  const { error } = await supabase.auth.admin.signOut(jwt);
  if (error) throw new Error(error.message);
};

// ─── Get current user ─────────────────────────────────────────────────────────
/**
 * Fetches the authenticated user's profile from the database.
 * @param {string} userId  The sub claim from the verified JWT.
 * @returns {object} profile row
 */
export const getCurrentUser = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, phone, address, role, created_at')
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message);

  return data;
};
