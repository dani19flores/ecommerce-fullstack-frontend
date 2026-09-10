import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'

import * as authApi from '../api/auth'
import type { LoginPayload, RegisterPayload, User } from '../types/auth'
import { clearStoredTokens, getStoredTokens, setStoredTokens } from '../utils/storage'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const tokens = getStoredTokens()
    if (!tokens) {
      setIsLoading(false)
      return
    }
    authApi
      .fetchProfile()
      .then(setUser)
      .catch(() => clearStoredTokens())
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    const tokens = await authApi.login(payload)
    setStoredTokens(tokens)
    const profile = await authApi.fetchProfile()
    setUser(profile)
  }, [])

  // El endpoint de registro crea el usuario pero no autentica: después de
  // registrar, hacemos login con las mismas credenciales para obtener el
  // JWT y dejar al usuario ya autenticado.
  const register = useCallback(
    async (payload: RegisterPayload) => {
      await authApi.register(payload)
      await login({ username: payload.username, password: payload.password })
    },
    [login],
  )

  const logout = useCallback(() => {
    clearStoredTokens()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: user !== null, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
