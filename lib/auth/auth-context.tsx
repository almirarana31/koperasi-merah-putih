'use client'

// ============================================================================
// Auth Context — Provides current user + role throughout the app
// ============================================================================

import { createContext, useCallback, useState, useEffect, type ReactNode } from 'react'
import type { User, Role } from '@/lib/rbac'
import { getMockUser } from './mock-users'

export interface AuthContextValue {
  /** Current authenticated user, or null if not logged in */
  user: User | null
  /** Whether auth state is still resolving */
  isLoading: boolean
  /** Whether the user is authenticated */
  isAuthenticated: boolean
  /** Login as a specific role (uses mock user data) */
  loginAs: (role: Role) => void
  /** Login with a specific user object */
  loginWithUser: (user: User) => void
  /** Logout — clears current user */
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  loginAs: () => {},
  loginWithUser: () => {},
  logout: () => {},
})

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for cookie session on initialization
    const cookies = typeof document !== 'undefined' ? document.cookie.split('; ') : []
    const sessionCookie = cookies.find(c => c.startsWith('kopdes-session='))
    
    if (sessionCookie) {
      try {
        const role = sessionCookie.split('=')[1] as Role
        const mockUser = getMockUser(role)
        setUser(mockUser)
      } catch (e) {
        console.error("Failed to restore session", e)
      }
    }
    setIsLoading(false)
  }, [])

  const loginAs = useCallback((role: Role) => {
    const mockUser = getMockUser(role)
    setUser(mockUser)
  }, [])

  const loginWithUser = useCallback((u: User) => {
    setUser(u)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        loginAs,
        loginWithUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
