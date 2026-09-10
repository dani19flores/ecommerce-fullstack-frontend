import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-semibold text-gray-900">
          eCommerce
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            Productos
          </Link>
          <Link to="/cart" className="text-gray-600 hover:text-gray-900">
            Carrito{totalItems > 0 && ` (${totalItems})`}
          </Link>

          {isAuthenticated ? (
            <>
              <span className="text-gray-500">Hola, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-gray-900 px-3 py-1.5 font-medium text-white hover:bg-gray-700"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-gray-900 px-3 py-1.5 font-medium text-white hover:bg-gray-700"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
