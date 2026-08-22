import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Supabase client instance.
 * Gracefully operates or logs warning if environmental variables are pending.
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function getSupabaseClient() {
  if (!supabase) {
    if (process.env.NODE_ENV === 'development') {
      console.info(
        '[Bhopal Civic Memory] Supabase credentials not found in env. Running in local/mock memory mode.'
      );
    }
    return null;
  }
  return supabase;
}
