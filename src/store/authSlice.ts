import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'

import * as authApi from '../api/auth'
import type { LoginPayload, RegisterPayload, User } from '../types/auth'
import { clearStoredTokens, getStoredTokens, setStoredTokens } from '../utils/storage'

interface AuthState {
  user: User | null
  isLoading: boolean
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
}

export const restoreSession = createAsyncThunk('auth/restoreSession', async () => {
  const tokens = getStoredTokens()
  if (!tokens) return null
  try {
    return await authApi.fetchProfile()
  } catch {
    clearStoredTokens()
    return null
  }
})

// rejectWithValue conserva el AxiosError original como action.payload: si
// dejáramos que el thunk simplemente lanzara el error, Redux Toolkit lo
// serializa a un objeto plano {name, message, stack} y las páginas
// pierden la forma para usar isAxiosError(err) / err.response.
export const login = createAsyncThunk<User, LoginPayload, { rejectValue: unknown }>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const tokens = await authApi.login(payload)
      setStoredTokens(tokens)
      return await authApi.fetchProfile()
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)

// El endpoint de registro crea el usuario pero no autentica: después de
// registrar, hacemos login con las mismas credenciales para obtener el
// JWT y dejar al usuario ya autenticado.
export const register = createAsyncThunk<User, RegisterPayload, { rejectValue: unknown }>(
  'auth/register',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await authApi.register(payload)
      return await dispatch(login({ username: payload.username, password: payload.password })).unwrap()
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      clearStoredTokens()
      state.user = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.isLoading = true
      })
      .addCase(restoreSession.fulfilled, (state, action: PayloadAction<User | null>) => {
        state.user = action.payload
        state.isLoading = false
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
