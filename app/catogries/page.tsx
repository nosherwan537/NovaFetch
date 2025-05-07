'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/DB/db'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Category {
  id: number
  name: string
  description: string
}

export default function CategoriesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('*')
      if (error) {
        setError('Failed to fetch categories.')
        console.error(error)
      } else {
        setCategories(data || [])
      }
    }

    fetchCategories()
  }, [])

  return (
    <main className="min-h-screen px-4 py-10 bg-gradient-to-br from-gray-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white transition-all duration-300">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-400 dark:to-purple-500">
          Explore Categories
        </h1>

        {error && (
          <div className="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 p-4 rounded-md text-sm mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <h2 className="text-xl font-semibold text-blue-600 dark:text-cyan-400 mb-2">
                {cat.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {cat.description}
              </p>
              <Link
                href={`/categories/${cat.id}`}
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
              >
                View Details →
              </Link>
            </motion.div>
          ))}
        </div>

        {!loading && user && categories.length === 0 && (
          <div className="mt-10 text-center text-gray-600 dark:text-gray-400">
            No categories found.
          </div>
        )}
      </div>
    </main>
  )
}
