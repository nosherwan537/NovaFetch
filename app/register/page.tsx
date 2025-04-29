"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // In a real app, you would handle registration here
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes only - in a real app you would create a user account
      if (name && email && password) {
        // Successful registration would redirect to login
        router.push("/login")
      } else {
        setError("Please fill in all fields")
      }
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-300 hover:shadow-[0_15px_50px_-12px_rgba(0,0,0,0.25)] dark:hover:shadow-[0_15px_50px_-12px_rgba(0,0,0,0.6)]">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-purple-500 animate-fade-in">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-all duration-200 hover:underline hover:underline-offset-2"
            >
              Sign in
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-4 rounded-md text-sm border-l-4 border-red-500 animate-fade-in">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div className="transition-all duration-200 transform hover:translate-y-[-2px]">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm transition-all duration-200 focus:shadow-md"
                placeholder="John Doe"
              />
            </div>

            <div className="transition-all duration-200 transform hover:translate-y-[-2px]">
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm transition-all duration-200 focus:shadow-md"
                placeholder="you@example.com"
              />
            </div>

            <div className="transition-all duration-200 transform hover:translate-y-[-2px]">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm transition-all duration-200 focus:shadow-md"
                placeholder="••••••••"
              />
            </div>

            <div className="transition-all duration-200 transform hover:translate-y-[-2px]">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm transition-all duration-200 focus:shadow-md"
                placeholder="••••••••"
              />
              {password && (
                <div className="mt-2">
                  <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        password.length < 6 
                          ? "w-1/4 bg-red-500" 
                          : password.length < 10 
                            ? "w-2/4 bg-yellow-500" 
                            : "w-full bg-green-500"
                      }`}></div>
                  </div>
                  <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                    {password.length < 6 
                      ? "Weak password" 
                      : password.length < 10 
                        ? "Medium password" 
                        : "Strong password"}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center group">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200 cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300 cursor-pointer group-hover:text-gray-700 dark:group-hover:text-gray-100"
            >
              I agree to the{" "}
              <span className="text-blue-600 hover:text-blue-500 dark:text-blue-400">terms and conditions</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-purple-500 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
          >
            {isLoading ? "Registering..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  )
}
