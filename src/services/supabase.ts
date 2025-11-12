/**
 * Supabase Client Configuration
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from '@/types/database';
import Constants from 'expo-constants';

// Environment variables from expo-constants
const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl || '';
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey || '';

// Debug logging
console.log('Supabase Config:', {
  url: SUPABASE_URL ? '✓ URL found' : '✗ URL missing',
  key: SUPABASE_ANON_KEY ? '✓ Key found' : '✗ Key missing',
  urlValue: SUPABASE_URL,
  keyLength: SUPABASE_ANON_KEY ? SUPABASE_ANON_KEY.length : 0,
});

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables');
  console.error('Available config:', Constants.expoConfig?.extra);
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with AsyncStorage
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
