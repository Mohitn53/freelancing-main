/**
 * services/projectService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * CRUD + file-upload operations for the `projects` table.
 * All database interactions use the service-role Supabase client.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import supabase from '../config/supabaseClient.js';

// ─── Create ───────────────────────────────────────────────────────────────────
/**
 * Creates a new project row owned by the authenticated user.
 * @param {object} payload  { title, description, status, owner_id }
 * @returns {object}  The newly created project row.
 */
export const createProject = async (payload) => {
  const { data, error } = await supabase
    .from('projects')
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ─── Read All ─────────────────────────────────────────────────────────────────
/**
 * Returns all projects.  Admins see everything; regular users see only theirs.
 * @param {string|null} userId  Pass null for admin (no filter).
 * @returns {object[]}
 */
export const getAllProjects = async (userId = null) => {
  let query = supabase
    .from('projects')
    .select('*, profiles(name, email)')
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('owner_id', userId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

// ─── Read One ─────────────────────────────────────────────────────────────────
/**
 * Fetches a single project by ID.
 * @param {string} projectId
 * @returns {object}
 */
export const getProjectById = async (projectId) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*, profiles(name, email)')
    .eq('id', projectId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ─── Update ───────────────────────────────────────────────────────────────────
/**
 * Partially updates a project.
 * @param {string} projectId
 * @param {object} updates  Fields to update.
 * @returns {object}  The updated project row.
 */
export const updateProject = async (projectId, updates) => {
  const { data, error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', projectId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ─── Delete ───────────────────────────────────────────────────────────────────
/**
 * Permanently deletes a project.
 * @param {string} projectId
 */
export const deleteProject = async (projectId) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) throw new Error(error.message);
};

// ─── File Upload ──────────────────────────────────────────────────────────────
/**
 * Uploads a file buffer to Supabase Storage under the `project-files` bucket.
 * Returns the public URL of the uploaded file.
 *
 * @param {Buffer}  fileBuffer    Raw file buffer from multer.
 * @param {string}  fileName      Original file name.
 * @param {string}  mimeType      MIME type (e.g. 'image/png').
 * @param {string}  projectId     Used to namespace files in the bucket.
 * @returns {string}  Public URL of the uploaded file.
 */
export const uploadProjectFile = async (
  fileBuffer,
  fileName,
  mimeType,
  projectId
) => {
  const filePath = `${projectId}/${Date.now()}-${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('project-files')
    .upload(filePath, fileBuffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (uploadError) throw new Error(uploadError.message);

  // Construct the public URL
  const { data } = supabase.storage
    .from('project-files')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
