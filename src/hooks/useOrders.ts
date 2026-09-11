import { useCallback } from 'react'

import { fetchOrders, placeOrder, updateOrderStatus } from '../store/orderSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import type { CartItem } from '../store/cartSlice'
import type { OrderStatus } from '../types/order'

export function useOrders() {
  const dispatch = useAppDispatch()
  const orders = useAppSelector((state) => state.orders.orders)
  const fetchStatus = useAppSelector((state) => state.orders.fetchStatus)
  const checkoutStatus = useAppSelector((state) => state.orders.checkoutStatus)
  const updateStatus = useAppSelector((state) => state.orders.updateStatus)
  const error = useAppSelector((state) => state.orders.error)

  const loadOrders = useCallback(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  const checkout = useCallback(
    async (items: CartItem[]) => {
      return dispatch(placeOrder(items)).unwrap()
    },
    [dispatch],
  )

  const setStatus = useCallback(
    async (orderId: number, status: OrderStatus) => {
      return dispatch(updateOrderStatus({ orderId, status })).unwrap()
    },
    [dispatch],
  )

  return { orders, fetchStatus, checkoutStatus, updateStatus, error, loadOrders, checkout, setStatus }
}
