export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          surname: string
          role: 'student' | 'teacher'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          surname: string
          role: 'student' | 'teacher'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          surname?: string
          role?: 'student' | 'teacher'
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          links: string | null
          deadline: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          links?: string | null
          deadline: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          links?: string | null
          deadline?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      task_materials: {
        Row: {
          id: string
          task_id: string
          file_name: string
          file_url: string
          file_type: string
          file_size: number
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          file_name: string
          file_url: string
          file_type: string
          file_size: number
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          file_name?: string
          file_url?: string
          file_type?: string
          file_size?: number
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          task_id: string
          student_id: string
          status: 'submitted' | 'graded'
          grade: number | null
          feedback: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          task_id: string
          student_id: string
          status?: 'submitted' | 'graded'
          grade?: number | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          student_id?: string
          status?: 'submitted' | 'graded'
          grade?: number | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      submission_files: {
        Row: {
          id: string
          submission_id: string
          file_name: string
          file_url: string
          file_type: string
          file_size: number
          created_at: string
        }
        Insert: {
          id?: string
          submission_id: string
          file_name: string
          file_url: string
          file_type: string
          file_size: number
          created_at?: string
        }
        Update: {
          id?: string
          submission_id?: string
          file_name?: string
          file_url?: string
          file_type?: string
          file_size?: number
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskMaterial = Database['public']['Tables']['task_materials']['Row']
export type Submission = Database['public']['Tables']['submissions']['Row']
export type SubmissionFile = Database['public']['Tables']['submission_files']['Row']
