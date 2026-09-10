import type { Product } from '../../types/product'
import { useCart } from '../../hooks/useCart'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900">{product.title}</h3>
      <p className="text-gray-500">${product.price}</p>
      <button
        onClick={() => addItem(product)}
        className="mt-auto rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
      >
        Agregar al carrito
      </button>
    </div>
  )
}
