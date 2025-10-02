'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { supabase } from '@/lib/supabase'
import { Task } from '@/types/database'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

interface TaskWithGrade extends Task {
  grade: number | null
  status: string
}

export default function RatingPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<TaskWithGrade[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [averageGrade, setAverageGrade] = useState(0)

  const fetchRatingData = useCallback(async () => {
    try {
      if (profile?.role === 'student') {
        // Fetch student's submissions with grades
        const { data: submissionsData, error: submissionsError } = await supabase
          .from('submissions')
          .select(`
            *,
            tasks(*)
          `)
          .eq('student_id', user?.id)
          .eq('status', 'graded')

        if (submissionsError) {
          console.error('Error fetching submissions:', submissionsError)
          return
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tasksWithGrades = submissionsData?.map((submission: any) => ({
          ...submission.tasks,
          grade: submission.grade,
          status: submission.status
        })) || []

        setTasks(tasksWithGrades)

        // Calculate average grade
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const grades = tasksWithGrades.map((task: any) => task.grade).filter((grade: any) => grade !== null) as number[]
        if (grades.length > 0) {
          setAverageGrade(grades.reduce((sum, grade) => sum + grade, 0) / grades.length)
        }
      } else if (profile?.role === 'teacher') {
        // Fetch all tasks created by teacher
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('created_by', user?.id)
          .order('created_at', { ascending: false })

        if (tasksError) {
          console.error('Error fetching tasks:', tasksError)
          return
        }

        setTasks(tasksData || [])
      }
    } catch (error) {
      console.error('Error fetching rating data:', error)
    } finally {
      setLoadingData(false)
    }
  }, [profile, user])

  useEffect(() => {
    if (!loading && (!user || !profile)) {
      router.push('/')
      return
    }

    if (profile) {
      fetchRatingData()
    }
  }, [user, profile, loading, router, fetchRatingData])

  if (loading || loadingData) {
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
      day: 'numeric'
    })
  }

  // Prepare chart data
  const chartData = tasks.map((task, index) => ({
    name: `Task ${index + 1}`,
    grade: task.grade || 0,
    fullName: task.title.length > 20 ? task.title.substring(0, 20) + '...' : task.title
  }))

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {profile.role === 'student' ? 'My Progress' : 'Class Analytics'}
          </h1>
          <p className="mt-2 text-gray-600">
            {profile.role === 'student' 
              ? 'Track your learning progress and grades'
              : 'Monitor student performance and class analytics'
            }
          </p>
        </div>

        {profile.role === 'student' && (
          <>
            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">📊</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Average Grade</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {averageGrade > 0 ? averageGrade.toFixed(1) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold">✅</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Completed Tasks</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {tasks.filter(task => task.grade !== null).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 font-semibold">📈</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                    <p className="text-2xl font-semibold text-gray-900">{tasks.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Chart */}
            {chartData.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Grade Progress</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fullName" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip 
                        formatter={(value: number) => [value, 'Grade']}
                        labelFormatter={(label: string) => `Task: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="grade" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}

        {/* Tasks Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {profile.role === 'student' ? 'My Grades' : 'All Tasks'}
            </h2>
          </div>
          
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {profile.role === 'student' 
                  ? 'No graded tasks yet.' 
                  : 'No tasks created yet.'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deadline
                    </th>
                    {profile.role === 'student' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {task.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(task.deadline)}
                      </td>
                      {profile.role === 'student' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          {task.grade !== null ? (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              task.grade >= 8 ? 'bg-green-100 text-green-800' :
                              task.grade >= 6 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {task.grade}/10
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          task.status === 'graded' ? 'bg-green-100 text-green-800' :
                          task.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status === 'graded' ? 'Graded' :
                           task.status === 'submitted' ? 'Submitted' : 'Not Submitted'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
