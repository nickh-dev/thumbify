"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from './supabase'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    const supabase = createClient()
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signIn = async (email, password) => {
    const supabase = createClient()
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) throw error
      
      // Store the provider in sessionStorage for the callback
      sessionStorage.setItem('provider', 'google')
      
      // Let the OAuth flow handle the redirect
      if (data?.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error signing in with Google:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    const supabase = createClient()
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const updateUserMetadata = async (metadata) => {
    const supabase = createClient()
    try {
      const { data: { user: updatedUser }, error } = await supabase.auth.updateUser({
        data: metadata
      })

      if (error) throw error

      // Update local user state with new metadata
      if (updatedUser) {
        setUser(updatedUser)
      }

      return { user: updatedUser, error: null }
    } catch (error) {
      console.error('Error updating user metadata:', error)
      return { user: null, error }
    }
  }

  const deleteUser = async () => {
    const supabase = createClient()
    try {
      // First, delete the user's profile from the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id)
      
      if (profileError) {
        console.error('Error deleting profile:', profileError)
        // Continue with user deletion even if profile deletion fails
      }

      // Then, delete the user's auth record
      const { error } = await supabase.auth.admin.deleteUser(user.id)
      
      if (error) {
        console.error('Error deleting user:', error)
        throw error
      }

      // Clear local user state
      setUser(null)
      
      return { error: null }
    } catch (error) {
      console.error('Error in deleteUser:', error)
      return { error }
    }
  }

  const updateAvatar = async (url) => {
    setAvatarUrl(url)
  }

  const value = {
    user,
    loading,
    error,
    avatarUrl,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateUserMetadata,
    deleteUser,
    updateAvatar,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
} 