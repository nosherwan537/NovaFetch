'use client'

import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4">Loading...</p>
      </div>
    </div>
  }
  
  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="mb-4">Welcome, {user.email}!</p>
        
        <div className="mt-6">
          <button
            onClick={signOut}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}