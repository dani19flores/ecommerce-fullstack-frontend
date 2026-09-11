import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { useCart } from '../hooks/useCart'
import { useOrders } from '../hooks/useOrders'

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { checkout } = useOrders()
  const navigate = useNavigate()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Recuerda si hubo items al montar: tras confirmar, clearCart() vacía
  // el carrito antes de navegar y por un instante items.length sería 0
  // en este mismo render — sin esto se dispararía el <Navigate> de abajo
  // en vez de dejar completar la navegación a /post-checkout.
  const [hadItemsOnMount] = useState(() => items.length > 0)

  if (!hadItemsOnMount) {
    return <Navigate to="/cart" replace />
  }

  async function handleConfirm() {
    setError(null)
    setIsSubmitting(true)
    try {
      // El pedido lo crea de verdad el backend (billing profile, cart,
      // order en la base de datos) — el total que se muestra aquí es
      // solo referencia, el que manda el precio real es el servidor.
      await checkout(items)
      clearCart()
      navigate('/post-checkout')
    } catch {
      setError('No se pudo confirmar el pedido. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
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

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
        <span className="text-lg font-semibold text-gray-900">Total: ${totalPrice.toFixed(2)}</span>
        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="rounded-md bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Confirmando...' : 'Confirmar y pagar'}
        </button>
      </div>
    </main>
  )
}
