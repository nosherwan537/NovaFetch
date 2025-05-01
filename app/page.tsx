'use client'

import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user, loading, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-xl font-bold">My Next.js App</h1>
          <nav>
            {loading ? (
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-blue-500 hover:underline">
                  Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-blue-500 hover:underline">
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to My App</h2>
          <p className="mb-8 max-w-md mx-auto">
            A Next.js application with Supabase authentication and Google OAuth integration.
          </p>

          {user ? (
            <div className="mt-8 p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-2">Logged in as:</h3>
              <p className="mb-4">{user.email}</p>
              <Link
                href="/dashboard"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                href="/login"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="inline-block bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}