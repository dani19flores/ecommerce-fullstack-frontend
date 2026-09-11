# Términos del módulo, aplicados a este proyecto

Para cada término: qué es, y **por qué lo necesitamos específicamente aquí** (no solo la definición genérica).

## Axios

Cliente HTTP para que el navegador le hable a la API de Django (`http://localhost:8000`). Se centraliza en una sola instancia en [`src/api/client.ts`](../src/api/client.ts) en vez de llamarlo suelto desde cada componente, porque necesitamos que **toda** petición pase por dos interceptores:

- Uno que agrega `Authorization: Bearer <access>` automáticamente a cada request.
- Uno que, si la respuesta es `401` (el access token JWT expiró), pide un access token nuevo con el refresh token y reintenta la petición original sin que el usuario note nada.

Sin Axios tendríamos que repetir esa lógica de headers/retry a mano en cada `fetch()`.

## createAsyncThunk

Cada acción de auth (`login`, `register`, `restoreSession` en [`src/store/authSlice.ts`](../src/store/authSlice.ts)) implica una llamada a la API que tarda y puede fallar. `createAsyncThunk` envuelve esa llamada async y **genera solo tres acciones** (`pending` / `fulfilled` / `rejected`) que el slice puede escuchar, en vez de que nosotros tengamos que despachar cada una a mano y manejar errores por nuestra cuenta.

Ejemplo real: `register` primero llama al endpoint de registro, y si sale bien, dispara internamente el thunk de `login` con las mismas credenciales — así queda logueado automáticamente tras registrarse.

## extraReducers

Un `slice` (`createSlice`) solo puede definir reducers para acciones que él mismo crea. Pero las acciones de `login`/`register`/`restoreSession` las genera `createAsyncThunk`, **fuera** del slice. `extraReducers` es el punto donde `authSlice` "escucha" esas acciones ajenas y decide qué hacer con `state.user` y `state.isLoading` cuando llegan.

## Local Storage

El estado de Redux vive solo en memoria: si recargas la página, se pierde. Por eso lo que necesita sobrevivir a un refresh (o a cerrar y volver a abrir la pestaña) se guarda aparte, en `localStorage`:

- **Tokens JWT** ([`src/utils/storage.ts`](../src/utils/storage.ts)): si no los guardáramos, cada F5 te desloguearía.
- **Carrito** (dentro de [`src/store/cartSlice.ts`](../src/store/cartSlice.ts)): para que no se vacíe si recargas la página antes de pagar.

Al arrancar la app, `restoreSession` lee esos tokens guardados e intenta recuperar el perfil del usuario, para que la sesión "sobreviva" al refresh.

## OrderSlice

**Todavía no existe en este proyecto.** Sería el slice encargado de manejar las órdenes/pedidos confirmados (su `initialState`, y probablemente un `createAsyncThunk` para mandar el pedido al backend). Hoy el checkout ([`src/pages/CheckoutPage.tsx`](../src/pages/CheckoutPage.tsx)) solo vacía el carrito local y navega a la pantalla de "gracias por tu compra" — no hay endpoint de órdenes en el backend todavía, así que no hay nada real que ese slice pudiera guardar.

## Redux Toolkit

Es la forma moderna de usar Redux. Se eligió sobre Context API (que usamos al principio) porque, a medida que el carrito y la sesión se leen desde muchos componentes a la vez (`Navbar`, `ProductCard`, `CartPage`, `ProtectedRoute`...), Context re-renderiza a *todos* sus consumidores ante cualquier cambio, mientras que Redux + `useSelector` solo re-renderiza el componente que realmente lee el pedazo de estado que cambió. También trae gratis las Redux DevTools para depurar viendo cada acción.

## slice

Cada "rebanada" del estado global, con su propio `initialState`, sus reducers, y las acciones que genera. Este proyecto tiene dos: `authSlice` (usuario logueado) y `cartSlice` (productos en el carrito), combinados en un solo store en [`src/store/store.ts`](../src/store/store.ts). Separarlos así evita que todo el estado de la app viva en un único reducer gigante.

## spinners

**Todavía no hay spinners visuales (ícono animado) en este proyecto.** Lo que sí hay son *estados* de carga (`isLoading` en `authSlice`, `isSubmitting` local en los formularios) que hoy se muestran como texto: "Cargando productos...", el botón deshabilitado diciendo "Entrando..." o "Creando cuenta...". Un spinner sería el paso siguiente: reemplazar (o acompañar) ese texto con un ícono girando mientras `isLoading`/`isSubmitting` es `true`.

## useDispatch

El hook de React-Redux para **enviar** una acción al store (ej. "quiero hacer login", "agrega este producto al carrito"). En vez de usarlo directo, este proyecto lo envuelve como `useAppDispatch` en [`src/store/hooks.ts`](../src/store/hooks.ts), para que TypeScript conozca el tipo exacto del `dispatch` (incluyendo que puede despachar thunks async) sin tener que anotarlo a mano cada vez que se usa.

## useSelector

El hook para **leer** un pedazo del estado global dentro de un componente (ej. `state.cart.items`, `state.auth.user`). Igual que `useDispatch`, se envuelve como `useAppSelector` (mismo archivo) para que TypeScript sepa la forma completa de `RootState` y te avise si intentas leer un campo que no existe.

---

Estos dos hooks (`useAppDispatch`/`useAppSelector`) casi nunca se llaman directo en las páginas: están escondidos detrás de `useAuth()` y `useCart()` ([`src/hooks/`](../src/hooks/)), que son los que en verdad usan `Navbar`, `LoginPage`, `CartPage`, etc. Esa capa intermedia es la que permitió migrar de Context a Redux sin tocar ni una página.
