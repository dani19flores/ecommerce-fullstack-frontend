import { Link, useNavigate } from 'react-router-dom'

import { useCart } from '../hooks/useCart'

export function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-gray-500">Tu carrito está vacío.</p>
        <Link to="/" className="mt-4 inline-block font-medium text-gray-900 underline">
          Ver productos
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Tu carrito</h1>

      <ul className="flex flex-col gap-4">
        {items.map(({ product, quantity }) => (
          <li
            key={product.id}
            className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4"
          >
            <div>
              <p className="font-medium text-gray-900">{product.title}</p>
              <p className="text-sm text-gray-500">${product.price} c/u</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => updateQuantity(product.id, Number(e.target.value))}
                className="w-16 rounded-md border border-gray-300 px-2 py-1 text-center"
              />
              <button
                onClick={() => removeItem(product.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Quitar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
        <span className="text-lg font-semibold text-gray-900">Total: ${totalPrice.toFixed(2)}</span>
        <button
          onClick={() => navigate('/checkout')}
          className="rounded-md bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700"
        >
          Ir a pagar
        </button>
      </div>
    </main>
  )
}
