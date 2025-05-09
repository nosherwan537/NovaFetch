"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/DB/db";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check if user is already authenticated
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/home");
      }
    };
    
    checkUser();
    
    // Show message if redirected from registration
    if (searchParams?.get("registered") === "true") {
      setMessage("Registration successful! Please log in.");
    }
  }, [router, searchParams]);

  interface FormEvent extends React.FormEvent<HTMLFormElement> {}

const handleSubmit = async (e: FormEvent): Promise<void> => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Store the token in localStorage or a secure cookie
    localStorage.setItem('token', data.token);
    
    // Redirect to home page
    router.push('/home');
  } catch (err: any) {
    console.error("Login error:", err);
    setError(err.message || "Invalid login credentials. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            // Request access to user's profile data including email, name, and avatar
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) throw error;
      
      // No need to redirect here as the OAuth flow will handle it
    } catch (err) {
      console.error("Google sign-in error:", err);
      if (err instanceof Error) {
        setError(err.message || "Failed to sign in with Google. Please try again.");
      } else {
        setError("Failed to sign in with Google. Please try again.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 ">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl shadow-purple-500/50 ">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-purple-500 transition-transform duration-300 ease-in-out transform hover:scale-105">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-all duration-200 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>

        {/* Message for successful registration */}
        {message && (
          <div className="bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 p-4 rounded-md text-sm border-l-4 border-green-500">
            {message}
          </div>
        )}

        {/* Google Sign-In Button */}
        <div className="flex flex-col space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 shadow-sm hover:shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50 transition-transform duration-300 ease-in-out transform hover:scale-105 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 48 48"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.72 1.22 9.24 3.22l6.9-6.9C35.7 2.08 30.1 0 24 0 14.64 0 6.4 5.64 2.34 13.86l7.92 6.16C12.4 13.08 17.8 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M46.5 24c0-1.5-.14-2.96-.4-4.36H24v8.28h12.7c-.54 2.88-2.16 5.34-4.6 6.98l7.2 5.6C43.6 36.4 46.5 30.8 46.5 24z"
              />
              <path
                fill="#4A90E2"
                d="M12.34 28.02l-7.92 6.16C6.4 42.36 14.64 48 24 48c6.1 0 11.7-2.08 16.14-5.62l-7.2-5.6c-2.34 1.56-5.26 2.48-8.94 2.48-6.2 0-11.6-3.58-14.66-8.84z"
              />
              <path
                fill="#FBBC05"
                d="M12.34 28.02C11.2 25.64 10.5 22.88 10.5 20c0-2.88.7-5.64 1.84-8.02l-7.92-6.16C2.4 10.64 0 16.08 0 20c0 3.92 2.4 9.36 6.42 14.18l7.92-6.16z"
              />
            </svg>
            Sign in with Google
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Or with email and password
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-4 rounded-md text-sm border-l-4 border-red-500">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm transition-transform duration-300 ease-in-out transform hover:scale-105"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <Link
                  href="/reset-password"
                  className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Forgot your password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm transition-transform duration-300 ease-in-out transform hover:scale-105"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember_me"
              name="remember_me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember_me"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-purple-500 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-transform duration-300 ease-in-out transform hover:scale-105 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}