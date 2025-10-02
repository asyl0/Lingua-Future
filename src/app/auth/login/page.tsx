'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, DEMO_MODE } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('Login attempt:', { email, password })

    try {
      // For demo purposes, allow login with test credentials
      if (email === 'student@test.com' && password === 'password') {
        console.log('Student login successful')
        // Simulate successful login for student
        const testUser = {
          id: 'test-student-1',
          email: 'student@test.com',
          profile: {
            id: 'test-student-1',
            name: 'Student',
            surname: 'Test',
            email: 'student@test.com',
            role: 'student' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }
        localStorage.setItem('testUser', JSON.stringify(testUser))
        
        // Force a page reload to trigger AuthContext update
        window.location.href = '/tasks'
        return
      }
      
      if (email === 'teacher@test.com' && password === 'password') {
        console.log('Teacher login successful')
        // Simulate successful login for teacher
        const testUser = {
          id: 'test-teacher-1',
          email: 'teacher@test.com',
          profile: {
            id: 'test-teacher-1',
            name: 'Teacher',
            surname: 'Test',
            email: 'teacher@test.com',
            role: 'teacher' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }
        localStorage.setItem('testUser', JSON.stringify(testUser))
        
        // Force a page reload to trigger AuthContext update
        window.location.href = '/tasks'
        return
      }

      // Check if we're in demo mode
      if (DEMO_MODE) {
        setError('Demo mode: Please use test credentials (student@test.com or teacher@test.com) with password "password"')
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Provide more helpful error messages
        if (error.message.includes('Demo mode')) {
          setError('Demo mode: Please use test credentials (student@test.com or teacher@test.com)')
        } else if (error.message.includes('Invalid API key') || error.message.includes('401')) {
          setError('Server configuration error. Please contact support.')
        } else if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password.')
        } else {
          setError(error.message)
        }
      } else if (data.user) {
        // Check if user has a profile
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()

          if (profile) {
            router.push('/tasks')
          } else {
            setError('Profile not found. Please contact support.')
          }
        } catch (profileError) {
          console.warn('Could not fetch profile:', profileError)
          // Continue to tasks page even if profile fetch fails
          router.push('/tasks')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Lingua Future
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/auth/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          {/* Demo Mode Info - Show only in demo mode */}
          {DEMO_MODE && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm">
              <div className="text-blue-800 font-medium mb-2">🎯 Demo Mode</div>
              <div className="text-blue-700 space-y-1">
                <div><strong>Student:</strong> student@test.com</div>
                <div><strong>Teacher:</strong> teacher@test.com</div>
                <div><strong>Password:</strong> password</div>
              </div>
              <div className="mt-2 text-xs text-blue-600">
                To enable real authentication, set up Supabase credentials in .env.local
              </div>
            </div>
          )}


          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              ← Back to home
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
