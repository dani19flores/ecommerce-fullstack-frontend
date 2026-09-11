import type { Product } from './product'

// Debe coincidir con ORDER_STATUS_CHOICES en el modelo Order del backend.
export type OrderStatus = 'created' | 'paid' | 'shipped' | 'refunded' | 'canceled' | 'completed'

export interface OrderItem {
  product: Product
  quantity: number
}

export interface Order {
  id: number
  order_id: string
  status: OrderStatus
  active: boolean
  shipping_total: string
  total: string
  timestamp: string
  items: OrderItem[]
}

export interface CheckoutItemPayload {
  product_id: number
  quantity: number
}
