import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET!; // Ensure this is set in .env

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const path = req.nextUrl.pathname;

  try {
    // Enhanced logging in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('Middleware processing path:', path);
    }

    // Check if this is a custom auth API route (login/register)
    if (path.startsWith('/auth/')) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth API route detected, bypassing session check:', path);
      }
      return res;
    }

    // Ensure environment variables are set for Supabase
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase environment variables are not set.');
    }

    // Create Supabase client (for Google OAuth)
    const supabase = createMiddlewareClient({ req, res });

    // Get session information from Supabase
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Log session existence for debugging (in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Supabase session exists:', !!session);
    }

    // Check for protected routes
    const protectedPaths = ['/dashboard', '/profile', '/admin'];
    const isProtected = protectedPaths.some(p => path.startsWith(p));

    if (isProtected) {
      // Check JWT token (cookie or Authorization header)
      const jwtToken = req.cookies.get('token')?.value || req.headers.get('Authorization')?.split(' ')[1];

      if (!session && !jwtToken) {
        // If no Supabase session and no JWT token, redirect to login
        return NextResponse.redirect(new URL('/login', req.url));
      }

      // If there's a JWT token, verify it
      if (jwtToken) {
        try {
          const decoded = jwt.verify(jwtToken, jwtSecret) as { userId: string; email: string };

          // Optional: Attach decoded token to the request (useful for logging)
          if (process.env.NODE_ENV === 'development') {
            console.log('Decoded JWT:', decoded);
          }
        } catch (err) {
          console.warn('Invalid JWT token:', err);
          return NextResponse.redirect(new URL('/login', req.url));
        }
      }
    }

    // Redirect logged-in users to dashboard if they try to access login or register pages
    if ((path === '/login' || path === '/register') && session) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return res;
  } catch (error) {
    console.error('Error in middleware:', error);
    return res;
  }
}

// Limit middleware to paths that need auth or session context
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/auth/:path*', // Ensure that auth API routes like /auth/login and /auth/register are bypassed
  ],
};
