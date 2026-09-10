import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { AppRouter } from './router/AppRouter'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
