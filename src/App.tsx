import { useEffect, type ReactNode } from 'react'
import { Provider } from 'react-redux'

import { AppRouter } from './router/AppRouter'
import { restoreSession } from './store/authSlice'
import { useAppDispatch } from './store/hooks'
import { store } from './store/store'

// Dispara la restauración de sesión una sola vez, al montar la app,
// en vez de hacerlo dentro de useAuth() (que se llama desde varios
// componentes y dispararía el pedido repetidas veces).
function SessionBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(restoreSession())
  }, [dispatch])

  return children
}

function App() {
  return (
    <Provider store={store}>
      <SessionBootstrap>
        <AppRouter />
      </SessionBootstrap>
    </Provider>
  )
}

export default App
