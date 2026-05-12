# shared/errors/ — Errores del sistema

Jerarquía de errores para toda la aplicación:

- **AppError** — Clase base de errores del dominio/aplicación
- **ValidationError** — Datos de entrada inválidos
- **NotFoundError** — Recurso no encontrado
- **ConflictError** — Regla de negocio violada
- **UnauthorizedError** — No autenticado
- **ForbiddenError** — Sin permisos
- **InfrastructureError** — Error de infraestructura no recuperable

Los errores se propagan desde domain/application hacia presentation/ donde el
middleware de errores los transforma en responses HTTP.
