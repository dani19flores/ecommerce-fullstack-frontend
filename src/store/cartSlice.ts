import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Product } from '../types/product'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
}

const STORAGE_KEY = 'ecommerce_cart'

function loadCart(): CartItem[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as CartItem[]
  } catch {
    return []
  }
}

function persist(items: CartItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

const initialState: CartState = { items: loadCart() }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<{ product: Product; quantity?: number }>) {
      const { product, quantity = 1 } = action.payload
      const existing = state.items.find((item) => item.product.id === product.id)
      if (existing) {
        existing.quantity += quantity
      } else {
        state.items.push({ product, quantity })
      }
      persist(state.items)
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.product.id !== action.payload)
      persist(state.items)
    },
    updateQuantity(state, action: PayloadAction<{ productId: number; quantity: number }>) {
      const { productId, quantity } = action.payload
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.product.id !== productId)
      } else {
        const item = state.items.find((item) => item.product.id === productId)
        if (item) item.quantity = quantity
      }
      persist(state.items)
    },
    clearCart(state) {
      state.items = []
      persist(state.items)
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
