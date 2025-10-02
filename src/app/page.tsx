'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user && profile) {
      router.push('/tasks')
    }
  }, [user, profile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-blue-600">Lingua Future</h1>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/auth/login"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            The Future of Language Learning
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover how AI is revolutionizing English language education. 
            Join Lingua Future, an innovative platform that combines traditional 
            learning methods with cutting-edge artificial intelligence to create 
            personalized, effective, and engaging language learning experiences.
          </p>
          
          {/* AI Role Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              The Role of AI in Shaping the Future of Language
            </h3>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="text-xl font-semibold text-blue-600 mb-4">Personalized Learning</h4>
                <p className="text-gray-600 mb-6">
                  AI adapts to your learning style, pace, and preferences, creating 
                  customized lesson plans and exercises that maximize your progress.
                </p>
                
                <h4 className="text-xl font-semibold text-blue-600 mb-4">Instant Feedback</h4>
                <p className="text-gray-600">
                  Get immediate, detailed feedback on your writing, speaking, and 
                  comprehension skills with AI-powered analysis and suggestions.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-blue-600 mb-4">Smart Tutoring</h4>
                <p className="text-gray-600 mb-6">
                  Our AI assistant provides 24/7 support, answering questions, 
                  explaining grammar concepts, and helping you understand assignments.
                </p>
                
                <h4 className="text-xl font-semibold text-blue-600 mb-4">Progress Analytics</h4>
                <p className="text-gray-600">
                  Track your learning journey with detailed analytics and insights 
                  that help you identify strengths and areas for improvement.
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-blue-600 text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-3">Interactive Tasks</h3>
              <p className="text-gray-600">
                Engage with diverse assignments, from essays to multimedia projects, 
                all designed to enhance your English skills.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-blue-600 text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-3">AI Assistant</h3>
              <p className="text-gray-600">
                Get instant help with your studies through our intelligent AI tutor 
                that understands context and provides relevant guidance.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-blue-600 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your improvement with detailed analytics and performance 
                metrics that show your learning journey.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              Ready to Transform Your English Learning?
            </h3>
            <p className="text-lg text-gray-600">
              Join thousands of students and teachers already using Lingua Future
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/auth/register?role=student"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Learning as Student
              </Link>
              <Link
                href="/auth/register?role=teacher"
                className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Teach with AI
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Lingua Future. Empowering language learning through AI.</p>
        </div>
      </footer>
    </div>
  )
}
