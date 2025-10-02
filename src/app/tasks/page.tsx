'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
// import { supabase } from '@/lib/supabase' // Not used in mock version
import { Task, TaskMaterial } from '@/types/database'
import { Calendar, FileText, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function TasksPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<(Task & { materials: TaskMaterial[] })[]>([])
  const [loadingTasks, setLoadingTasks] = useState(true)

  const fetchTasks = useCallback(async () => {
    try {
      // For now, use mock data to avoid database issues
      const mockTasks = [
        {
          id: '1',
          title: 'Sample Task 1',
          description: 'This is a sample task for testing',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          links: 'https://example.com',
          created_by: 'teacher-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          materials: []
        },
        {
          id: '2',
          title: 'Sample Task 2',
          description: 'Another sample task',
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          links: null,
          created_by: 'teacher-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          materials: []
        }
      ]
      
      setTasks(mockTasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoadingTasks(false)
    }
  }, [])

  useEffect(() => {
    if (!loading && (!user || !profile)) {
      router.push('/auth/login')
      return
    }

    if (profile) {
      fetchTasks()
    }
  }, [user, profile, loading, router, fetchTasks])

  if (loading || loadingTasks) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  if (!user || !profile) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date()
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {profile.role === 'teacher' ? 'Manage Tasks' : 'My Tasks'}
          </h1>
          {profile.role === 'teacher' && (
            <Link
              href="/tasks/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add New Task
            </Link>
          )}
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
            <p className="mt-1 text-sm text-gray-500">
              {profile.role === 'teacher' 
                ? 'Get started by creating a new task.' 
                : 'No tasks have been assigned yet.'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-blue-500"
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className={isOverdue(task.deadline) ? 'text-red-600' : ''}>
                      Due: {formatDate(task.deadline)}
                    </span>
                  </div>

                  {task.links && (
                    <div className="flex items-center text-sm text-blue-600">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      <span>Contains links</span>
                    </div>
                  )}

                  {task.materials && task.materials.length > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <FileText className="h-4 w-4 mr-2" />
                      <span>{task.materials.length} material(s)</span>
                    </div>
                  )}

                  {isOverdue(task.deadline) && (
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Overdue
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
