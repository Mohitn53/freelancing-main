/**
 * config/supabaseClient.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Initialises a single Supabase client that uses the SERVICE ROLE key.
 * This client bypasses Row Level Security and is ONLY used on the server.
 * Never expose the service role key to the browser / frontend.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    '❌  Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env'
  );
}

/**
 * Single shared Supabase admin client (service-role).
 * Import this wherever you need Supabase access.
 */
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    // Disable session persistence – the backend is stateless
    persistSession: false,
    autoRefreshToken: false,
  },
});

export default supabase;
