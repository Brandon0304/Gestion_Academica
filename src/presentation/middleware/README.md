# presentation/middleware/ — Middleware HTTP

- **auth.middleware.ts** — Verificar JWT, extraer usuario
- **role.middleware.ts** — Autorización por rol
- **validate.middleware.ts** — Validación de body/query con Zod
- **error-handler.middleware.ts** — Capturar errores y devolver response formateado
- **request-logger.middleware.ts** — Log de cada request con ID de correlación
- **rate-limiter.middleware.ts** — Rate limiting por IP
