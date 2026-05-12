# presentation/routes/ — Definición de rutas

Define las rutas de la API y asigna controladores + middleware.

Estructura:
- **index.ts** — Router principal que monta todos los submódulos bajo `/api/v1`
- **auth.routes.ts** — `/api/v1/auth/*`
- **students.routes.ts** — `/api/v1/students/*`
- ... uno por módulo
