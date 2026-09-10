import { apiClient } from './client'
import type { AuthTokens, LoginPayload, RegisterPayload, User } from '../types/auth'

export async function login(payload: LoginPayload): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>('/api/token/jwt/', payload)
  return data
}

export async function register(payload: RegisterPayload): Promise<void> {
  await apiClient.post('/accounts/register/', payload)
}

export async function fetchProfile(): Promise<User> {
  const { data } = await apiClient.get<User>('/accounts/profile/')
  return data
}
