'use client'

import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { AuroraBackground } from '@/components/ui/aurora-background'

export default function Home() {
  const { user, loading, signOut } = useAuth()

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="h-screen w-screen bg-gradient-to-r from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white "

      >
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-purple-500 shadow-lg">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-2xl font-extrabold text-white relative z-30">NovaFetch</h1>
            <nav>
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard" className="text-white hover:underline relative z-30">
                    Dashboard
                  </Link>
                  <button
                    onClick={signOut}
                    className="bg-white text-red-600 hover:bg-red-100 py-2 px-4 rounded text-sm font-semibold shadow-md transition-transform duration-300 hover:scale-105 relative z-30"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4 relative z-30">
                  <Link href="/login" className="text-white hover:underline ">
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-white text-blue-600 hover:bg-blue-100 py-2 px-4 rounded text-sm font-semibold shadow-md transition-transform duration-300 hover:scale-105 relative z-30"
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-400 dark:to-purple-500 relative z-30">
              Welcome to NovaFetch
            </h2>
            <p className="mb-8 max-w-md mx-auto text-lg relative z-30">
              A Next.js application with Supabase authentication and Google OAuth integration.
            </p>

            {user ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md mx-auto border border-blue-100 dark:border-gray-700 relative z-30"
              >
                <h3 className="text-xl font-semibold mb-2">Logged in as:</h3>
                <p className="mb-4 text-blue-700 dark:text-blue-300">{user.email}</p>
                <Link
                  href="/dashboard"
                  className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-6 rounded shadow-md transition-transform duration-300 hover:scale-105 relative z-30"
                >
                  Go to Dashboard
                </Link>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-10 space-x-4"
              >
                <Link
                  href="/login"
                  className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-6 rounded shadow-md text-base font-semibold transition-transform duration-300 hover:scale-105 relative z-30"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-6 rounded shadow-md text-base font-semibold transition-transform duration-300 hover:scale-105 relative z-30 "
                >
                  Register
                </Link>
              </motion.div>
            )}
          </div>
        </main>
      </motion.div>
    </AuroraBackground>
  )
}
