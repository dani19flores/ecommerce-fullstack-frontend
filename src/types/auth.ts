export interface User {
  id: number
  username: string
  email: string
  date_joined: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginPayload {
  username: string
  password: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
  password2: string
}
