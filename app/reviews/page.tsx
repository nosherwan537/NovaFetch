'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/DB/db'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface Review {
  id: number
  title: string
  content: string
  author: string
  created_at: string
}

export default function ReviewsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError('Failed to load reviews.')
        console.error(error)
      } else {
        setReviews(data || [])
      }
    }

    fetchReviews()
  }, [])

  return (
    <main className="min-h-screen px-4 py-10 bg-gradient-to-b from-gray-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white transition-all duration-300">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-400 dark:to-purple-500">
          User Reviews
        </h1>

        {error && (
          <div className="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 p-4 rounded-md text-sm mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <h2 className="text-xl font-semibold text-blue-600 dark:text-cyan-400 mb-2">
                {review.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {review.content}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>By {review.author}</span>
                <span>{new Date(review.created_at).toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {!loading && user && reviews.length === 0 && (
          <div className="mt-10 text-center text-gray-600 dark:text-gray-400">
            No reviews found.
          </div>
        )}
      </div>
    </main>
  )
}
