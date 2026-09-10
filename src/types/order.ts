import type { CartItem } from '../store/cartSlice'

export interface Order {
  id: string
  items: CartItem[]
  total: number
  createdAt: string
}
