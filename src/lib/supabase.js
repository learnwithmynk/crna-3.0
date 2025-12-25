/**
 * Supabase Client
 *
 * Initializes and exports the Supabase client for use throughout the app.
 * Used for database queries, auth, and realtime subscriptions.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not found. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local'
  );
}

// Use placeholder URL when not configured to prevent crash during development
const placeholderUrl = 'https://placeholder.supabase.co';
const placeholderKey = 'placeholder-key';

export const supabase = createClient(
  supabaseUrl || placeholderUrl,
  supabaseAnonKey || placeholderKey
);

/**
 * Helper to check if Supabase is properly configured
 */
export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export default supabase;
