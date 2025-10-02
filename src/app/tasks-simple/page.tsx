'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, FileText, ExternalLink } from 'lucide-react'

export default function SimpleTasksPage() {
  const [tasks] = useState([
    {
      id: '1',
      title: 'Sample Task 1',
      description: 'This is a sample task for testing',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      links: 'https://example.com',
      materials: []
    },
    {
      id: '2',
      title: 'Sample Task 2',
      description: 'Another sample task',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      links: null,
      materials: []
    }
  ])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Lingua Future
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Test User</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                student
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Add New Task
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {task.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {task.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className={isOverdue(task.deadline) ? 'text-red-600' : ''}>
                    Due: {formatDate(task.deadline)}
                  </span>
                </div>

                {task.links && (
                  <div className="flex items-center text-blue-600 mb-4">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    <a href={task.links} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      View Links
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <FileText className="h-4 w-4 mr-1" />
                    <span>{task.materials.length} materials</span>
                  </div>
                  
                  <Link
                    href={`/tasks/${task.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
