import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { fetchProducts as fetchProductsRequest } from '../api/products'
import type { Product } from '../types/product'

interface ProductsState {
  items: Product[]
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected'
  error: string | null
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
}

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProductsRequest()
    } catch {
      return rejectWithValue('No se pudieron cargar los productos. ¿Iniciaste sesión?')
    }
  },
)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'pending'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'fulfilled'
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'rejected'
        state.error = action.payload ?? 'Ocurrió un error al cargar los productos.'
      })
  },
})

export default productsSlice.reducer
