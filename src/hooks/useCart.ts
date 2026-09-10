import { useCallback } from 'react'

import { addItem, clearCart, removeItem, updateQuantity } from '../store/cartSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import type { Product } from '../types/product'

export function useCart() {
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.cart.items)

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      dispatch(addItem({ product, quantity }))
    },
    [dispatch],
  )

  const removeFromCart = useCallback(
    (productId: number) => {
      dispatch(removeItem(productId))
    },
    [dispatch],
  )

  const setQuantity = useCallback(
    (productId: number, quantity: number) => {
      dispatch(updateQuantity({ productId, quantity }))
    },
    [dispatch],
  )

  const clear = useCallback(() => {
    dispatch(clearCart())
  }, [dispatch])

  return {
    items,
    addItem: addToCart,
    removeItem: removeFromCart,
    updateQuantity: setQuantity,
    clearCart: clear,
    totalItems,
    totalPrice,
  }
}
