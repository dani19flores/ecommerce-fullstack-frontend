import { useEffect, useState } from 'react'

import { fetchProducts } from '../api/products'
import { ProductCard } from '../components/product/ProductCard'
import type { Product } from '../types/product'

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setError('No se pudieron cargar los productos. ¿Iniciaste sesión?'))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Productos</h1>

      {isLoading && <p className="text-gray-500">Cargando productos...</p>}

      {!isLoading && error && <p className="text-red-600">{error}</p>}

      {!isLoading && !error && products.length === 0 && (
        <p className="text-gray-500">No hay productos disponibles.</p>
      )}

      {!isLoading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}
