import { configureStore } from '@reduxjs/toolkit'

import authReducer from './authSlice'
import cartReducer from './cartSlice'
import orderReducer from './orderSlice'
import productsReducer from './productsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
    orders: orderReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
