export interface Product {
  id: number
  user: number
  title: string
  slug: string
  price: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
