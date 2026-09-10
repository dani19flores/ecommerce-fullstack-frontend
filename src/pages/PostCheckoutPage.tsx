import { Link } from 'react-router-dom'

export function PostCheckoutPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">¡Gracias por tu compra!</h1>
      <p className="mt-2 text-gray-500">Tu pedido fue registrado correctamente.</p>
      <Link to="/" className="mt-6 inline-block font-medium text-gray-900 underline">
        Volver a la tienda
      </Link>
    </main>
  )
}
