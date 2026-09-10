import type { AuthTokens } from '../types/auth'

const STORAGE_KEY = 'ecommerce_auth_tokens'

export function getStoredTokens(): AuthTokens | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthTokens
  } catch {
    return null
  }
}

export function setStoredTokens(tokens: AuthTokens): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
}

export function clearStoredTokens(): void {
  localStorage.removeItem(STORAGE_KEY)
}
