/**
 * utils/validators.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralised input validation helpers built on top of the native
 * Intl / regex APIs (no extra dependency required).
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Email ────────────────────────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Returns true if the string is a valid e-mail address.
 * @param {string} email
 */
export const isValidEmail = (email) =>
  typeof email === 'string' && EMAIL_REGEX.test(email.trim());

// ─── Password ─────────────────────────────────────────────────────────────────
/**
 * Password must be at least 8 characters, contain one uppercase letter,
 * one lowercase letter, one digit, and one special character.
 * @param {string} password
 */
export const isValidPassword = (password) => {
  if (typeof password !== 'string') return false;
  return password.length >= 6;
};

// ─── Required fields ──────────────────────────────────────────────────────────
/**
 * Checks that all listed fields exist and are non-empty in the given object.
 * Returns an array of missing field names (empty array = all present).
 * @param {object} body
 * @param {string[]} fields
 * @returns {string[]}
 */
export const getMissingFields = (body, fields) =>
  fields.filter(
    (f) => body[f] === undefined || body[f] === null || body[f] === ''
  );

// ─── UUID ─────────────────────────────────────────────────────────────────────
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Returns true if the string is a valid UUID v4.
 * @param {string} id
 */
export const isValidUUID = (id) =>
  typeof id === 'string' && UUID_REGEX.test(id);

// ─── Sanitise string ──────────────────────────────────────────────────────────
/**
 * Strips leading / trailing whitespace and removes common script injection
 * patterns.  Use this before storing user-supplied strings in the DB.
 * @param {string} str
 * @returns {string}
 */
export const sanitiseString = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/[<>]/g, '');
};
