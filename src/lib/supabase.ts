import { createClient } from '@supabase/supabase-js'


// Check if we have real Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY


// More robust demo mode detection
const isValidSupabaseUrl = supabaseUrl && 
  supabaseUrl.startsWith('https://') && 
  supabaseUrl.includes('.supabase.co') &&
  !supabaseUrl.includes('demo')

const isValidSupabaseKey = supabaseAnonKey && 
  supabaseAnonKey.startsWith('eyJ') && 
  supabaseAnonKey.length > 100 &&
  !supabaseAnonKey.includes('demo') &&
  !supabaseAnonKey.includes('placeholder')

const DEMO_MODE = !isValidSupabaseUrl || !isValidSupabaseKey


// Create appropriate client based on mode
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabase: any

if (DEMO_MODE) {
  // Mock client for demo mode - simplified for build compatibility
  const mockQuery = () => Promise.resolve({ data: null, error: { message: 'Demo mode' } })
  const mockQueryChain = {
    eq: () => mockQueryChain,
    single: mockQuery,
    limit: () => Promise.resolve({ data: [], error: null }),
    then: (callback: (result: { data: null, error: { message: string } }) => void) => {
      callback({ data: null, error: { message: 'Demo mode' } })
      return mockQuery()
    }
  }
  
  // Assign Promise methods to make it awaitable
  Object.assign(mockQueryChain, mockQuery())
  
  supabase = {
    auth: {
      signInWithPassword: () => Promise.resolve({ 
        data: { user: null }, 
        error: { message: 'Demo mode: Use test credentials (student@test.com or teacher@test.com)' }
      }),
      signUp: () => Promise.resolve({ 
        data: { user: null }, 
        error: { message: 'Demo mode: Registration disabled. Use test credentials.' }
      }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ 
        data: { user: null }, 
        error: { message: 'Demo mode: Authentication disabled' }
      }),
      onAuthStateChange: () => ({ 
        data: { subscription: { unsubscribe: () => {} } }
      })
    },
    from: () => ({
      select: () => mockQueryChain,
      insert: mockQuery,
      update: mockQuery,
      delete: mockQuery
    })
  }
} else {
  // Real Supabase client
  supabase = createClient(supabaseUrl!, supabaseAnonKey!)
}

export { supabase, DEMO_MODE }
