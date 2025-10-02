'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import Layout from '@/components/Layout'
import { supabase } from '@/lib/supabase'
import { Task, TaskMaterial, Submission, SubmissionFile } from '@/types/database'
import { Calendar, FileText, ExternalLink, Download, CheckCircle, Clock, XCircle, Bot } from 'lucide-react'
import AIAnalysis from '@/components/AIAnalysis'
import Link from 'next/link'

export default function TaskDetailPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string

  const [task, setTask] = useState<Task & { materials: TaskMaterial[] } | null>(null)
  const [submission, setSubmission] = useState<Submission & { files: SubmissionFile[] } | null>(null)
  const [submissions, setSubmissions] = useState<(Submission & { student: { name: string, surname: string }, files: SubmissionFile[] })[]>([])
  const [allStudents, setAllStudents] = useState<{ id: string, name: string, surname: string }[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<(Submission & { student: { name: string, surname: string }, files: SubmissionFile[] }) | null>(null)
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)
  const [analysisText, setAnalysisText] = useState('')

  const fetchTaskData = useCallback(async () => {
    try {
      // Use mock data instead of database queries
      const mockTask = {
        id: taskId,
        title: 'Sample Task',
        description: 'This is a sample task for testing purposes. Students should complete this assignment and submit their work.',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        links: 'https://example.com/resources',
        created_by: 'teacher-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        materials: [
          {
            id: '1',
            task_id: taskId,
            file_name: 'sample-document.pdf',
            file_url: 'https://example.com/sample.pdf',
            file_type: 'application/pdf',
            file_size: 1024000,
            created_at: new Date().toISOString()
          }
        ]
      }

      setTask(mockTask)

      if (profile?.role === 'student') {
        // Mock student submission data
        const mockSubmission = {
          id: 'submission-1',
          task_id: taskId,
          student_id: profile.id,
          status: 'submitted' as const,
          grade: null,
          feedback: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          files: [
            {
              id: 'file-1',
              submission_id: 'submission-1',
              file_name: 'my-assignment.pdf',
              file_url: 'https://example.com/my-assignment.pdf',
              file_type: 'application/pdf',
              file_size: 2048000,
              created_at: new Date().toISOString()
            }
          ]
        }
        setSubmission(mockSubmission)
      } else if (profile?.role === 'teacher') {
        // Mock submissions data for teachers
        const mockSubmissions = [
          {
            id: 'sub-1',
            task_id: taskId,
            student_id: 'student-1',
            status: 'graded' as const,
            grade: 8,
            feedback: 'Good work!',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            student: { name: 'John', surname: 'Doe' },
            files: [
              {
                id: 'file-1',
                submission_id: 'sub-1',
                file_name: 'john-assignment.pdf',
                file_url: 'https://example.com/john-assignment.pdf',
                file_type: 'application/pdf',
                file_size: 1536000,
                created_at: new Date().toISOString()
              }
            ]
          },
          {
            id: 'sub-2',
            task_id: taskId,
            student_id: 'student-2',
            status: 'submitted' as const,
            grade: null,
            feedback: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            student: { name: 'Jane', surname: 'Smith' },
            files: [
              {
                id: 'file-2',
                submission_id: 'sub-2',
                file_name: 'jane-assignment.docx',
                file_url: 'https://example.com/jane-assignment.docx',
                file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                file_size: 3072000,
                created_at: new Date().toISOString()
              }
            ]
          }
        ]

        setSubmissions(mockSubmissions)

        // Mock students data
        const mockStudents = [
          { id: 'student-1', name: 'John', surname: 'Doe' },
          { id: 'student-2', name: 'Jane', surname: 'Smith' },
          { id: 'student-3', name: 'Bob', surname: 'Johnson' },
          { id: 'student-4', name: 'Alice', surname: 'Brown' }
        ]

        setAllStudents(mockStudents)
      }
    } catch (error) {
      console.error('Error fetching task data:', error)
    } finally {
      setLoadingData(false)
    }
  }, [profile, taskId])

  useEffect(() => {
    if (!loading && (!user || !profile)) {
      router.push('/')
      return
    }

    if (profile && taskId) {
      fetchTaskData()
    }
  }, [user, profile, loading, router, taskId, fetchTaskData])

  const handleFileUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return

    setUploading(true)

    try {
      // Create or update submission
      let submissionId = submission?.id

      if (!submissionId) {
        const { data: newSubmission, error: submissionError } = await supabase
          .from('submissions')
          .insert({
            task_id: taskId,
            student_id: user?.id,
            status: 'submitted'
          })
          .select()
          .single()

        if (submissionError) {
          console.error('Error creating submission:', submissionError)
          return
        }

        submissionId = newSubmission.id
      }

      // Upload files
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `submissions/${taskId}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('files')
          .upload(filePath, file)

        if (uploadError) {
          console.error('Error uploading file:', uploadError)
          continue
        }

        const { data: { publicUrl } } = supabase.storage
          .from('files')
          .getPublicUrl(filePath)

        // Save file record
        await supabase
          .from('submission_files')
          .insert({
            submission_id: submissionId,
            file_name: file.name,
            file_url: publicUrl,
            file_type: file.type,
            file_size: file.size
          })
      }

      // Refresh data
      await fetchTaskData()
      setSelectedFiles(null)
    } catch (error) {
      console.error('Error uploading files:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleGradeSubmission = async (submissionId: string, grade: number) => {
    try {
      await supabase
        .from('submissions')
        .update({
          grade,
          status: 'graded'
        })
        .eq('id', submissionId)

      await fetchTaskData()
    } catch (error) {
      console.error('Error grading submission:', error)
    }
  }

  const handleViewSubmission = (submission: Submission & { student: { name: string, surname: string }, files: SubmissionFile[] }) => {
    setSelectedSubmission(submission)
    setShowSubmissionModal(true)
  }

  if (loading || loadingData) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  if (!user || !profile || !task) {
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

  const gradedSubmissions = submissions.filter(s => s.status === 'graded' && s.student)
  const submittedSubmissions = submissions.filter(s => s.status === 'submitted' && s.student)
  
  // Find students who haven't submitted this task
  const submittedStudentIds = submissions.map(s => s.student_id)
  const notSubmittedStudents = allStudents.filter(student => 
    !submittedStudentIds.includes(student.id)
  )

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/tasks"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Tasks
          </Link>
        </div>

        {/* Task Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
            
            {task.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
              </div>
            )}

            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              <span className={isOverdue(task.deadline) ? 'text-red-600' : ''}>
                Due: {formatDate(task.deadline)}
              </span>
            </div>

            {task.links && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Links</h3>
                <div className="flex items-center text-blue-600">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  <a href={task.links} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {task.links}
                  </a>
                </div>
              </div>
            )}

            {task.materials && task.materials.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Materials</h3>
                <div className="space-y-2">
                  {task.materials.map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm text-gray-700">{material.file_name}</span>
                      </div>
                      <a
                        href={material.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Student Submission Section */}
        {profile.role === 'student' && (
          <div className="space-y-6">
            {/* AI Analysis Section */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Bot className="h-6 w-6 text-purple-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">AI Writing Assistant</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    Powered by AI
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY && 
                    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY !== 'your_openrouter_api_key_here' &&
                    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY.length > 20
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {process.env.NEXT_PUBLIC_OPENROUTER_API_KEY && 
                     process.env.NEXT_PUBLIC_OPENROUTER_API_KEY !== 'your_openrouter_api_key_here' &&
                     process.env.NEXT_PUBLIC_OPENROUTER_API_KEY.length > 20
                      ? 'API Connected' 
                      : 'Demo Mode'
                    }
                  </span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Get instant AI feedback on your writing. Paste your text below and let AI analyze grammar, style, and vocabulary.
              </p>
              <div className="space-y-3">
                <textarea
                  value={analysisText}
                  onChange={(e) => setAnalysisText(e.target.value)}
                  placeholder="Paste your essay, assignment, or any text you want to improve..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAIAnalysis(true)}
                    disabled={!analysisText.trim()}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    Analyze with AI
                  </button>
                  <button
                    onClick={() => setAnalysisText('')}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Submission Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit Your Work</h2>
              
              {submission && submission.files && submission.files.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your Submitted Files</h3>
                  <div className="space-y-2">
                    {submission.files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-700">{file.file_name}</span>
                        </div>
                        <a
                          href={file.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Files
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setSelectedFiles(e.target.files)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <button
                  onClick={handleFileUpload}
                  disabled={!selectedFiles || uploading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload Files'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Teacher Management Section */}
        {profile.role === 'teacher' && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Completed & Graded</p>
                    <p className="text-3xl font-bold">{gradedSubmissions.length}</p>
                  </div>
                  <CheckCircle className="h-12 w-12 text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">Pending Review</p>
                    <p className="text-3xl font-bold">{submittedSubmissions.length}</p>
                  </div>
                  <Clock className="h-12 w-12 text-yellow-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Not Submitted</p>
                    <p className="text-3xl font-bold">{notSubmittedStudents.length}</p>
                  </div>
                  <XCircle className="h-12 w-12 text-red-200" />
                </div>
              </div>
            </div>

            {/* Submissions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Graded Submissions */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Completed & Graded
                  </h2>
                </div>
                <div className="p-6">
                  {gradedSubmissions.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No graded submissions yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {gradedSubmissions.map((submission) => (
                        <div key={submission.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-green-600 text-sm font-medium">
                                {(submission.student?.name || 'U')[0]}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {submission.student?.name || 'Unknown'} {submission.student?.surname || 'Student'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {submission.grade}/10
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submitted but not graded */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-100">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-yellow-600" />
                    Pending Review
                  </h2>
                </div>
                <div className="p-6">
                  {submittedSubmissions.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No pending submissions</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {submittedSubmissions.map((submission) => (
                        <div key={submission.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-yellow-600 text-sm font-medium">
                                  {(submission.student?.name || 'U')[0]}
                                </span>
                              </div>
                              <button
                                onClick={() => handleViewSubmission(submission)}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {submission.student?.name || 'Unknown'} {submission.student?.surname || 'Student'}
                              </button>
                            </div>
                            <select
                              onChange={(e) => handleGradeSubmission(submission.id, parseInt(e.target.value))}
                              className="text-xs border border-gray-300 rounded-lg px-3 py-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              defaultValue=""
                            >
                              <option value="">Grade</option>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(grade => (
                                <option key={grade} value={grade}>{grade}</option>
                              ))}
                            </select>
                          </div>
                          
                          {submission.files && submission.files.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs text-gray-600 font-medium">Files ({submission.files.length}):</p>
                              <div className="space-y-1">
                                {submission.files.slice(0, 2).map((file) => (
                                  <div key={file.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                                    <div className="flex items-center min-w-0 flex-1">
                                      <FileText className="h-3 w-3 mr-2 text-gray-400 flex-shrink-0" />
                                      <span className="text-xs text-gray-700 truncate">{file.file_name}</span>
                                    </div>
                                    <a
                                      href={file.file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 text-xs ml-2 flex-shrink-0"
                                    >
                                      <Download className="h-3 w-3" />
                                    </a>
                                  </div>
                                ))}
                                {submission.files.length > 2 && (
                                  <p className="text-xs text-gray-500 text-center">
                                    +{submission.files.length - 2} more files
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Not submitted */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <XCircle className="h-5 w-5 mr-2 text-red-600" />
                    Not Submitted
                  </h2>
                </div>
                <div className="p-6">
                  {notSubmittedStudents.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">All students submitted!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notSubmittedStudents.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-red-600 text-sm font-medium">
                                {(student.name || 'U')[0]}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {student.name || 'Unknown'} {student.surname || 'Student'}
                              </p>
                            </div>
                          </div>
                          <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                            Pending
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submission Modal */}
        {showSubmissionModal && selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedSubmission.student?.name || 'Unknown'} {selectedSubmission.student?.surname || 'Student'} - Submitted Work
                  </h3>
                  <button
                    onClick={() => setShowSubmissionModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                {selectedSubmission.files && selectedSubmission.files.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">Submitted Files:</h4>
                    <div className="space-y-2">
                      {selectedSubmission.files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-gray-500" />
                            <div>
                              <span className="text-sm text-gray-700">{file.file_name}</span>
                              <p className="text-xs text-gray-500">
                                {file.file_type} • {(file.file_size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <a
                            href={file.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No files submitted.</p>
                )}

                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Grade this submission:</span>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleGradeSubmission(selectedSubmission.id, parseInt(e.target.value))
                          setShowSubmissionModal(false)
                        }
                      }}
                      className="text-sm border rounded px-3 py-1"
                      defaultValue=""
                    >
                      <option value="">Select Grade</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(grade => (
                        <option key={grade} value={grade}>{grade}/10</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Analysis Modal */}
        {showAIAnalysis && (
          <AIAnalysis
            text={analysisText}
            onClose={() => setShowAIAnalysis(false)}
          />
        )}
      </div>
    </Layout>
  )
}
