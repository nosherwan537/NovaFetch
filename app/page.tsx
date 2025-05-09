'use client'

import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { FaRocket, FaCogs, FaUsers } from 'react-icons/fa'

export default function Home() {
  const { user, loading, signOut } = useAuth()

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-screen h-screen overflow-hidden bg-gradient-to-r from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white flex flex-col"
      >
        {/* Header */}
        <header className="h-[8vh] bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-purple-500 shadow-lg z-50">
          <div className="container mx-auto px-4 py-4 h-full flex justify-between items-center">
            <h1 className="text-2xl font-extrabold text-white">NovaFetch</h1>
            <nav>
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard" className="text-white hover:underline">
                    Dashboard
                  </Link>
                  <button
                    onClick={signOut}
                    className="bg-white text-red-600 hover:bg-red-100 py-2 px-4 rounded text-sm font-semibold shadow-md transition-transform duration-300 hover:scale-105"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/login" className="text-white hover:underline">
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-white text-blue-600 hover:bg-blue-100 py-2 px-4 rounded text-sm font-semibold shadow-md transition-transform duration-300 hover:scale-105"
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <main className="h-[50vh] flex flex-col justify-center items-center text-center px-4 z-50">
          <h2 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-400 dark:to-purple-500">
            Supercharge Your Search
          </h2>
          <p className="mb-6 max-w-xl mx-auto text-lg">
            NovaFetch combines AI-powered insights, Reddit reviews, and YouTube opinions in one place.
          </p>

          {user ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-blue-100 dark:border-gray-700"
            >
              <p className="mb-2 text-blue-700 dark:text-blue-300">Logged in as {user.email}</p>
              <Link
                href="/dashboard"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded shadow-md hover:scale-105 transition-transform"
              >
                Go to Dashboard
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 space-x-4"
            >
              <Link
                href="/login"
                className="inline-block bg-blue-600 text-white py-2 px-6 rounded shadow-md hover:scale-105 transition-transform"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="inline-block bg-purple-600 text-white py-2 px-6 rounded shadow-md hover:scale-105 transition-transform"
              >
                Register
              </Link>
            </motion.div>
          )}
        </main>

        {/* Features */}
        <section className="h-[28vh] bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 flex items-center">
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <FaRocket className="mx-auto text-blue-500 text-4xl mb-2" />
              <h4 className="text-lg font-semibold">Instant AI Insights</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                AI-generated summaries and reviews to save time.
              </p>
            </div>
            <div>
              <FaCogs className="mx-auto text-purple-500 text-4xl mb-2" />
              <h4 className="text-lg font-semibold">Smart Integration</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Unified access to YouTube, Reddit, and Gemini.
              </p>
            </div>
            <div>
              <FaUsers className="mx-auto text-green-500 text-4xl mb-2" />
              <h4 className="text-lg font-semibold">Community Powered</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Real discussions from real users across platforms.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="h-[15vh] bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-purple-500 flex items-center justify-center text-white text-sm">
          <p>© {new Date().getFullYear()} NovaFetch. All rights reserved.</p>
        </footer>
      </motion.div>
    </AuroraBackground>
  )
}
