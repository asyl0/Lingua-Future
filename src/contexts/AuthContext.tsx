'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, DEMO_MODE } from '@/lib/supabase'
import { Profile } from '@/types/database'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to check and load test user
  const loadTestUser = useCallback(() => {
    const testUser = localStorage.getItem('testUser')
    if (testUser) {
      try {
        const userData = JSON.parse(testUser)
        console.log('Loading test user:', userData)
        setUser(userData)
        setProfile(userData.profile)
        setLoading(false)
        return true
      } catch (error) {
        console.error('Error parsing test user data:', error)
        localStorage.removeItem('testUser')
      }
    }
    return false
  }, [])

  useEffect(() => {
    // Check for test user in localStorage first
    if (loadTestUser()) {
      return
    }

    // Check if we're in demo mode
    if (DEMO_MODE) {
      // In demo mode, don't try to authenticate with Supabase
      setLoading(false)
      return
    }

    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          // Silently handle auth errors in demo mode
          if (error.message.includes('Demo mode')) {
            setLoading(false)
            return
          }
          
          console.warn('Auth initialization error:', error.message)
          setLoading(false)
          return
        }
        
        setUser(user)
        
        if (user) {
          // Try to get profile from database first
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single()

            if (profile && !profileError) {
              // Use profile from database
              setProfile(profile)
            } else {
              // Fallback: create profile based on email
              const email = user.email || ''
              const role = email.includes('teacher') ? 'teacher' : 'student'
              
              const newProfile = {
                id: user.id,
                name: user.email?.split('@')[0] || 'User',
                surname: '',
                email: user.email || '',
                role: role as 'student' | 'teacher',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
              
              setProfile(newProfile)
              
              // Try to save profile to database
              await supabase
                .from('profiles')
                .upsert(newProfile)
                .select()
            }
          } catch (error) {
            console.warn('Could not load profile from database:', error)
            // Fallback profile
            const email = user.email || ''
            const role = email.includes('teacher') ? 'teacher' : 'student'
            
            setProfile({
              id: user.id,
              name: user.email?.split('@')[0] || 'User',
              surname: '',
              email: user.email || '',
              role: role as 'student' | 'teacher',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
          }
        }
      } catch (error) {
        console.warn('Error in getUser:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Only set up auth state listener if not in demo mode
    let subscription: { unsubscribe: () => void } | null = null
    
    try {
      const { data } = supabase.auth.onAuthStateChange(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async (event: any, session: any) => {
          try {
            setUser(session?.user ?? null)
            
            if (session?.user) {
              // Try to get profile from database
              try {
                const { data: profile, error: profileError } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .single()

                if (profile && !profileError) {
                  setProfile(profile)
                } else {
                  // Fallback: create profile based on email
                  const email = session.user.email || ''
                  const role = email.includes('teacher') ? 'teacher' : 'student'
                  
                  const newProfile = {
                    id: session.user.id,
                    name: session.user.email?.split('@')[0] || 'User',
                    surname: '',
                    email: session.user.email || '',
                    role: role as 'student' | 'teacher',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  }
                  
                  setProfile(newProfile)
                }
              } catch (error) {
                console.warn('Could not load profile in auth state change:', error)
                // Fallback profile
                const email = session.user.email || ''
                const role = email.includes('teacher') ? 'teacher' : 'student'
                
                setProfile({
                  id: session.user.id,
                  name: session.user.email?.split('@')[0] || 'User',
                  surname: '',
                  email: session.user.email || '',
                  role: role as 'student' | 'teacher',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
              }
            } else {
              setProfile(null)
            }
          } catch (error) {
            console.warn('Error in auth state change:', error)
          } finally {
            setLoading(false)
          }
        }
      )
      subscription = data.subscription
    } catch (error) {
      console.warn('Could not set up auth listener:', error)
      setLoading(false)
    }

    // Listen for storage changes (for test user login)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'testUser') {
        if (e.newValue) {
          loadTestUser()
        } else {
          setUser(null)
          setProfile(null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [loadTestUser])

  const signOut = async () => {
    localStorage.removeItem('testUser')
    setUser(null)
    setProfile(null)
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
