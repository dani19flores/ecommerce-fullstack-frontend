import { useCallback } from 'react'

import { login as loginThunk, logout as logoutAction, register as registerThunk } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import type { LoginPayload, RegisterPayload } from '../types/auth'

export function useAuth() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const isLoading = useAppSelector((state) => state.auth.isLoading)

  const login = useCallback(
    async (payload: LoginPayload) => {
      await dispatch(loginThunk(payload)).unwrap()
    },
    [dispatch],
  )

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await dispatch(registerThunk(payload)).unwrap()
    },
    [dispatch],
  )

  const logout = useCallback(() => {
    dispatch(logoutAction())
  }, [dispatch])

  return { user, isAuthenticated: user !== null, isLoading, login, register, logout }
}
