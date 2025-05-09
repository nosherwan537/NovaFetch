// lib/DB/supabaseClient.ts

import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

// Directly hardcoded Supabase values
const supabaseUrl = 'https://xrugyfitkpwvfiwrrpgw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhydWd5Zml0a3B3dmZpd3JycGd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NTA2NzIsImV4cCI6MjA2MTUyNjY3Mn0.5OoZbw7YAed4bYVuTNVKYMKjeeKzh5cA29CBj7Dh5k4';

// Client for browser usage
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Client for direct server-side usage (outside of middleware or route handlers)
export const serverSupabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Utility function to check Supabase credentials (can be called from tests/debugging)
export async function checkSupabaseCredentials(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    let error;
    try {
      const result = await serverSupabase.from('_test_connection').select('*').limit(1);
      error = result.error;
    } catch (e) {
      error = e;
    }

    if (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code !== 'PGRST301') {
        return {
          success: false,
          message: `Connection failed: ${(error as any).message} (${(error as any).code})`,
        };
      }
    }

    return {
      success: true,
      message: 'Supabase connection successful',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
