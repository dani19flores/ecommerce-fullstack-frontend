import { apiClient } from './client'
import type { Product } from '../types/product'

// El backend expone /api/products/ con page_size deshabilitado (ver
// products/pagination.py), así que devuelve un array plano en vez del
// sobre paginado { count, next, previous, results }.
export async function fetchProducts(): Promise<Product[]> {
  const { data } = await apiClient.get<Product[]>('/api/products/')
  return data
}
