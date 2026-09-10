# eCommerce Frontend

Frontend en React + TypeScript que consume la API de [fullstack_test](https://github.com/dani19flores/fullstack_test) (Django REST Framework, autenticación JWT).

## Stack

- React + TypeScript + Vite
- React Router
- Axios (con interceptor que renueva el access token automáticamente vía refresh token)
- Context API (auth + carrito)
- Tailwind CSS

## Arquitectura

```
src/
  types/          Tipos compartidos (User, Product, tokens...)
  api/            Cliente axios + funciones por dominio (auth, products)
  context/        AuthContext y CartContext
  hooks/          useAuth, useCart
  components/     Componentes reutilizables (layout, producto)
  pages/          Vistas por ruta
  router/         Definición de rutas
```

## Cómo correrlo

1. Backend corriendo en `http://localhost:8000` (ver [fullstack_test](https://github.com/dani19flores/fullstack_test)).
2. Copiar `.env.example` a `.env` (por defecto apunta a `http://localhost:8000`).
3.
   ```bash
   npm install
   npm run dev
   ```
