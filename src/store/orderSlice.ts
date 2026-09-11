import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'

import * as ordersApi from '../api/orders'
import type { CartItem } from './cartSlice'
import type { Order, OrderStatus } from '../types/order'

type AsyncStatus = 'idle' | 'pending' | 'fulfilled' | 'rejected'

interface OrderState {
  orders: Order[]
  fetchStatus: AsyncStatus
  checkoutStatus: AsyncStatus
  updateStatus: AsyncStatus
  error: string | null
}

const initialState: OrderState = {
  orders: [],
  fetchStatus: 'idle',
  checkoutStatus: 'idle',
  updateStatus: 'idle',
  error: null,
}

export const fetchOrders = createAsyncThunk<Order[], void, { rejectValue: string }>(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await ordersApi.fetchMyOrders()
    } catch {
      return rejectWithValue('No se pudieron cargar tus pedidos.')
    }
  },
)

// El total nunca se manda desde el frontend: el backend lo recalcula del
// precio real de cada producto (ver order/views.py). Aquí solo mandamos
// qué productos y cuántos.
export const placeOrder = createAsyncThunk<Order, CartItem[], { rejectValue: string }>(
  'orders/placeOrder',
  async (items, { rejectWithValue }) => {
    try {
      return await ordersApi.checkout(
        items.map((item) => ({ product_id: item.product.id, quantity: item.quantity })),
      )
    } catch {
      return rejectWithValue('No se pudo completar el pedido. Intenta de nuevo.')
    }
  },
)

export const updateOrderStatus = createAsyncThunk<
  Order,
  { orderId: number; status: OrderStatus },
  { rejectValue: string }
>('orders/updateOrderStatus', async ({ orderId, status }, { rejectWithValue }) => {
  try {
    return await ordersApi.updateOrderStatus(orderId, status)
  } catch {
    return rejectWithValue('No se pudo actualizar el estado del pedido.')
  }
})

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.fetchStatus = 'pending'
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.fetchStatus = 'fulfilled'
        state.orders = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.fetchStatus = 'rejected'
        state.error = action.payload ?? 'Ocurrió un error al cargar tus pedidos.'
      })
      .addCase(placeOrder.pending, (state) => {
        state.checkoutStatus = 'pending'
        state.error = null
      })
      .addCase(placeOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.checkoutStatus = 'fulfilled'
        state.orders.unshift(action.payload)
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.checkoutStatus = 'rejected'
        state.error = action.payload ?? 'Ocurrió un error al confirmar el pedido.'
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.updateStatus = 'pending'
        state.error = null
      })
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
        state.updateStatus = 'fulfilled'
        const index = state.orders.findIndex((order) => order.id === action.payload.id)
        if (index !== -1) {
          state.orders[index] = action.payload
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updateStatus = 'rejected'
        state.error = action.payload ?? 'Ocurrió un error al actualizar el pedido.'
      })
  },
})

export default orderSlice.reducer
