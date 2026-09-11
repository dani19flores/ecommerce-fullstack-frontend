import { useEffect, useState } from 'react'

import { useOrders } from '../hooks/useOrders'
import type { OrderStatus } from '../types/order'

const STATUS_LABELS: Record<OrderStatus, string> = {
  created: 'Creado',
  paid: 'Pagado',
  shipped: 'En tránsito',
  refunded: 'Reembolsado',
  canceled: 'Cancelado',
  completed: 'Entregado',
}

const STATUS_OPTIONS = Object.keys(STATUS_LABELS) as OrderStatus[]

export function OrdersPage() {
  const { orders, fetchStatus, error, loadOrders, setStatus } = useOrders()
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  // El panel de estado y la lista leen del mismo slice de Redux: al
  // cambiar el status de una fila, los conteos de aquí abajo se
  // recalculan solos, sin pedir nada de nuevo al backend.
  const activeCount = orders.filter((order) => order.active).length
  const inTransitCount = orders.filter((order) => order.status === 'shipped').length
  const deliveredCount = orders.filter((order) => order.status === 'completed').length

  async function handleStatusChange(orderId: number, status: OrderStatus) {
    setUpdatingId(orderId)
    try {
      await setStatus(orderId, status)
    } catch {
      // el error ya queda expuesto vía useOrders().error
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Mis pedidos</h1>

      {fetchStatus === 'pending' && <p className="text-gray-500">Cargando pedidos...</p>}

      {fetchStatus === 'rejected' && <p className="text-red-600">{error}</p>}

      {fetchStatus === 'fulfilled' && (
        <>
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-2xl font-semibold text-gray-900">{activeCount}</p>
              <p className="text-sm text-gray-500">Activas</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-2xl font-semibold text-gray-900">{inTransitCount}</p>
              <p className="text-sm text-gray-500">En tránsito</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-2xl font-semibold text-gray-900">{deliveredCount}</p>
              <p className="text-sm text-gray-500">Entregadas</p>
            </div>
          </div>

          {error && fetchStatus === 'fulfilled' && <p className="mb-4 text-sm text-red-600">{error}</p>}

          {orders.length === 0 ? (
            <p className="text-gray-500">Todavía no tienes pedidos.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {orders.map((order) => (
                <li key={order.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-900">Pedido #{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.timestamp).toLocaleDateString()} — ${order.total}
                      </p>
                    </div>
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="rounded-md border border-gray-300 px-2 py-1 text-sm disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <ul className="mt-2 flex flex-col gap-1 text-sm text-gray-600">
                    {order.items.map((item) => (
                      <li key={item.product.id}>
                        {item.product.title} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  )
}
