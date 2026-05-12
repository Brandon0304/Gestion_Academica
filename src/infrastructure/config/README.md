# infrastructure/config/ — Configuración

**Responsabilidad**: Cargar variables de entorno, configurar la inyección de
dependencias (composición root) y ensamblar la aplicación.

Archivos:
- **env.ts** — Carga y valida .env con Zod
- **di.ts** — Composición root (wire up de dependencias)
- **app.ts** — Ensamblado de Express/Fastify + rutas + middleware
- **server.ts** — Punto de entrada
