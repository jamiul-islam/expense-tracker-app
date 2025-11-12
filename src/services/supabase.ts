/**
 * Supabase Client Configuration
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import Constants from 'expo-constants';

// Lazy initialization of Supabase client
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Environment variables from expo-constants
  const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl || '';
  const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey || '';

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase environment variables');
  }

  // Create Supabase client
  supabaseInstance = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  return supabaseInstance;
}

export const supabase = new Proxy({} as ReturnType<typeof createClient<Database>>, {
  get(_target, prop) {
    const client = getSupabaseClient();
    return (client as any)[prop];
  },
});

export default supabase;
