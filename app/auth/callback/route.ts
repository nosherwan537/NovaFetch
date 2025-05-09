// app/auth/callback/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { syncUserFromOAuth } from '../../../lib/DB/profileSync';

export const dynamic = 'force-dynamic'; // Important for auth routes

// Helper function to safely log sensitive information
function safeLogKey(key: string) {
  if (!key) return 'MISSING';
  if (key.length < 10) return 'TOO_SHORT';
  // Show beginning and end format only - not the actual key contents
  return `${key.substring(0, 5)}...${key.substring(key.length - 5)}`;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login', requestUrl.origin));
  }

  try {
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // More detailed environment debug
    console.log('DETAILED AUTH DEBUG INFO:');
    console.log('- URL exists:', !!supabaseUrl);
    console.log('- URL value:', supabaseUrl?.substring(0, 10) + '...');
    console.log('- KEY exists:', !!supabaseAnonKey);
    console.log('- KEY format check:', safeLogKey(supabaseAnonKey || ''));
    console.log('- Code parameter length:', code?.length);
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.redirect(new URL('/login?error=config', requestUrl.origin));
    }

    // Response for redirect (create early so we can attach cookies)
    const redirectUrl = new URL('/home', requestUrl.origin);
    const response = NextResponse.redirect(redirectUrl);
    
    // Create a new cookie store
    const cookieStore = await cookies();
    
    // Create a Supabase client for server-side operations
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get: (name) => {
            const cookie = cookieStore.get(name);
            console.log(`Cookie get: ${name} -> ${cookie ? 'exists' : 'missing'}`);
            return cookie?.value;
          },
          set: (name, value, options) => {
            console.log(`Cookie set: ${name} (length: ${value.length})`);
            cookieStore.set(name, value, options);
            response.cookies.set(name, value, options);
          },
          remove: (name, options) => {
            console.log(`Cookie remove: ${name}`);
            cookieStore.delete(name);
            response.cookies.delete(name);
          }
        }
      }
    );
    
    console.log('Attempting to exchange code for session...');
    
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error);
      console.error('Error details:', JSON.stringify(error));
      
      // More specific error handling
      if (error.message?.includes('API key')) {
        console.error('API Key validation failed. Check that your key is correct and active.');
        // For security, don't show the actual API key error to the user
        return NextResponse.redirect(new URL('/login?error=auth_configuration', requestUrl.origin));
      }
      
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin));
    }

    console.log('Successfully exchanged code for session!');

    if (!data?.session?.user) {
      console.error('No user session returned');
      return NextResponse.redirect(new URL('/login?error=no-session', requestUrl.origin));
    }
    
    // Sync the user data
    try {
      await syncUserFromOAuth(data.session.user);
      console.log('User data synchronized successfully');
    } catch (syncError) {
      console.error('Error syncing user:', syncError);
      // Continue anyway
    }

    return response;
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    return NextResponse.redirect(new URL('/login?error=unexpected', requestUrl.origin));
  }
}