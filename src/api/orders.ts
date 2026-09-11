import { apiClient } from './client'
import type { CheckoutItemPayload, Order } from '../types/order'

export async function checkout(items: CheckoutItemPayload[]): Promise<Order> {
  const { data } = await apiClient.post<Order>('/order/checkout/', { items })
  return data
}

export async function fetchMyOrders(): Promise<Order[]> {
  const { data } = await apiClient.get<Order[]>('/order/')
  return data
}

export async function updateOrderStatus(orderId: number, status: string): Promise<Order> {
  const { data } = await apiClient.patch<Order>(`/order/${orderId}/`, { status })
  return data
}
