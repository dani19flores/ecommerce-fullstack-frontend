import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { clearStoredTokens, getStoredTokens, setStoredTokens } from '../utils/storage'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export const apiClient = axios.create({ baseURL })

apiClient.interceptors.request.use((config) => {
  const tokens = getStoredTokens()
  if (tokens?.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`
  }
  return config
})

// Evita disparar varios refresh en paralelo si varias requests fallan con
// 401 al mismo tiempo: todas esperan la misma promesa de refresh.
let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const tokens = getStoredTokens()
  if (!tokens?.refresh) {
    throw new Error('No hay refresh token disponible')
  }
  const response = await axios.post<{ access: string }>(
    `${baseURL}/api/token/jwt/refresh/`,
    { refresh: tokens.refresh },
  )
  setStoredTokens({ access: response.data.access, refresh: tokens.refresh })
  return response.data.access
}

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean }

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null
        })
        const newAccessToken = await refreshPromise
        originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`)
        return apiClient(originalRequest)
      } catch (refreshError) {
        clearStoredTokens()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
