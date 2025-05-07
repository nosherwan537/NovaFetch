'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/DB/db'
import { motion } from 'framer-motion'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url?: string
  created_at: string
}

export default function ProductsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError('Failed to load products.')
        console.error(error)
      } else {
        setProducts(data || [])
      }
    }

    fetchProducts()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-400 dark:to-purple-500">
          Our Products
        </h1>

        {error && (
          <div className="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 p-4 rounded-md text-sm mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-transform hover:scale-105"
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-4"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 dark:bg-gray-800 rounded mb-4 flex items-center justify-center text-gray-500 text-sm">
                  No Image
                </div>
              )}
              <h2 className="text-xl font-bold text-blue-600 dark:text-cyan-400 mb-1">
                {product.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {product.description}
              </p>
              <p className="font-semibold text-lg text-purple-700 dark:text-purple-400">
                ${product.price.toFixed(2)}
              </p>
            </motion.div>
          ))}
        </div>

        {!loading && user && products.length === 0 && (
          <div className="mt-10 text-center text-gray-600 dark:text-gray-400">
            No products found.
          </div>
        )}
      </div>
    </main>
  )
}
