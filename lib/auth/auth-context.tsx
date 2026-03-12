'use client'

// ============================================================================
// Auth Context — Provides current user + role throughout the app
// ============================================================================

import { createContext, useCallback, useState, type ReactNode } from 'react'
import type { User, Role } from '@/lib/rbac'
import { getMockUser } from './mock-users'

export interface AuthContextValue {
  /** Current authenticated user, or null if not logged in */
  user: User | null
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
