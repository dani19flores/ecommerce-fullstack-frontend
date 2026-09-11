import { Link } from 'react-router-dom'

import { useOrders } from '../hooks/useOrders'

export function PostCheckoutPage() {
  const { orders } = useOrders()
  const lastOrder = orders[0]

  return (
    <main className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">¡Gracias por tu compra!</h1>
      <p className="mt-2 text-gray-500">Tu pedido fue registrado correctamente.</p>

      {lastOrder && (
        <div className="mt-6 rounded-lg border border-gray-200 p-4 text-left text-sm">
          <p className="font-medium text-gray-900">Pedido #{lastOrder.id}</p>
          <ul className="mt-2 flex flex-col gap-1 text-gray-600">
            {lastOrder.items.map((item) => (
              <li key={item.product.id}>
                {item.product.title} × {item.quantity}
              </li>
            ))}
          </ul>
          <p className="mt-2 font-semibold text-gray-900">Total: ${lastOrder.total}</p>
        </div>
      )}

      <Link to="/" className="mt-6 inline-block font-medium text-gray-900 underline">
        Volver a la tienda
      </Link>
    </main>
  )
}
