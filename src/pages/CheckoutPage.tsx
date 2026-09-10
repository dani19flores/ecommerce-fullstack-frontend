import { useNavigate } from 'react-router-dom'

import { useCart } from '../hooks/useCart'

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()

  function handleConfirm() {
    // Todavía no hay un endpoint de órdenes en el backend: por ahora el
    // checkout solo vacía el carrito localmente y muestra la confirmación.
    clearCart()
    navigate('/post-checkout')
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Confirmar pedido</h1>

      <ul className="flex flex-col gap-2">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="flex justify-between text-sm text-gray-700">
            <span>
              {product.title} × {quantity}
            </span>
            <span>${(Number(product.price) * quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
        <span className="text-lg font-semibold text-gray-900">Total: ${totalPrice.toFixed(2)}</span>
        <button
          onClick={handleConfirm}
          className="rounded-md bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700"
        >
          Confirmar y pagar
        </button>
      </div>
    </main>
  )
}
