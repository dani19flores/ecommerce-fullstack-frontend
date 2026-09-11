import { useEffect } from 'react'

import { ProductCard } from '../components/product/ProductCard'
import { useAuth } from '../hooks/useAuth'
import { fetchProducts } from '../store/productsSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

export function HomePage() {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAuth()
  const products = useAppSelector((state) => state.products.items)
  const status = useAppSelector((state) => state.products.status)
  const error = useAppSelector((state) => state.products.error)

  // Se vuelve a pedir en cada visita a Home y cada vez que cambia el
  // login: la API requiere estar autenticado, así que si el usuario
  // entra/sale de sesión el listado tiene que refrescarse.
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch, isAuthenticated])

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Productos</h1>

      {status === 'pending' && <p className="text-gray-500">Cargando productos...</p>}

      {status === 'rejected' && <p className="text-red-600">{error}</p>}

      {status === 'fulfilled' && products.length === 0 && (
        <p className="text-gray-500">No hay productos disponibles.</p>
      )}

      {status === 'fulfilled' && products.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}
