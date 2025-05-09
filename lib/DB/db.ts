// lib/DB/db.ts

import { createBrowserClient } from '@supabase/ssr';
import{ createServerClient } from '@supabase/ssr';
// Use environment variables - matching what's used in server components
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validation to catch missing environment variables early
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
