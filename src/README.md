# src/ — Código fuente

El código se organiza siguiendo Clean Architecture en 4 capas + 1 capa compartida:

- **domain/** — Entidades, value objects, interfaces de repositorio, eventos de dominio
- **application/** — Casos de uso, DTOs, puertos de salida
- **infrastructure/** — Implementaciones concretas (Prisma, JWT, Nodemailer, logger)
- **presentation/** — Controladores, rutas, middleware, serializers
- **shared/** — Errores, utilidades, helpers comunes

Regla de oro: las dependencias apuntan hacia adentro (nada de domain conoce a infrastructure).
