# eCommerce Frontend

Frontend en React + TypeScript que consume la API de [fullstack_test](https://github.com/dani19flores/fullstack_test) (Django REST Framework, autenticación JWT).

**Demo desplegada:** https://dani19flores.github.io/ecommerce-fullstack-frontend/

## Stack

- React + TypeScript + Vite
- React Router
- Axios (con interceptor que renueva el access token automáticamente vía refresh token)
- Redux Toolkit (auth, carrito, productos, órdenes)
- Tailwind CSS

## Arquitectura

```
src/
  types/          Tipos compartidos (User, Product, Order, tokens...)
  api/            Cliente axios + funciones por dominio (auth, products, orders)
  store/          Store de Redux Toolkit y sus slices (auth, cart, products, order)
  hooks/          useAuth, useCart, useOrders
  components/     Componentes reutilizables (layout, producto)
  pages/          Vistas por ruta
  router/         Definición de rutas
```

## Cómo correrlo localmente

1. Backend corriendo en `http://localhost:8000` (ver [fullstack_test](https://github.com/dani19flores/fullstack_test)).
2. Copiar `.env.example` a `.env` (por defecto apunta a `http://localhost:8000`).
3.
   ```bash
   npm install
   npm run dev
   ```

## Deploy

El workflow en `.github/workflows/deploy.yml` compila el proyecto con Vite y lo publica en GitHub Pages en cada push a `main`. La build de producción usa `.env.production` (`VITE_API_URL`), que apunta al backend desplegado en Render.

`vite.config.ts` fija `base: '/ecommerce-fullstack-frontend/'` porque se publica como project page (`usuario.github.io/nombre-repo`). `public/404.html` + el script en `index.html` resuelven el refresh en rutas internas (`/cart`, `/checkout`, etc.), que GitHub Pages no soporta nativamente al no tener rutas del lado servidor.
