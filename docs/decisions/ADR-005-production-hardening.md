# ADR-005 — Hardening de Producción

**Estado**: Aceptado
**Fecha**: 2026-05-12
**Contexto**: El sistema funcionaba correctamente en desarrollo pero carecía de varias características necesarias para entornos productivos: (1) no había trazabilidad de requests (correlation ID), (2) el health check solo verificaba que el servidor respondía, no la conectividad con la base de datos, (3) no había manejo de señales de terminación (SIGTERM/SIGINT), (4) los rate limiters eran genéricos sin diferenciación por tipo de endpoint.

**Opciones consideradas**:

1. **Request ID**: Generar UUID por request y propagarlo en headers de respuesta y logs — elegido por simplicidad.
2. **Health check con DB**: Agregar `SELECT 1` vía Prisma para verificar conectividad con PostgreSQL — elegido.
3. **Graceful shutdown**: Cerrar el HTTP server y desconectar Prisma antes de salir — elegido.
4. **Rate limiters por endpoint**: Diferenciar entre login (10 req/15min), registro (5 req/hora) y API general (200 req/min) — elegido.

**Decisión**: Se implementaron los siguientes cambios:

### Request ID
- Nuevo middleware `requestIdMiddleware` en `src/presentation/middleware/request-id.middleware.ts`.
- Genera un UUID v4 si el cliente no envía `X-Request-ID`.
- Lo propaga en el header de respuesta `X-Request-ID`.
- Extiende el tipo `Request` de Express con `requestId?: string`.
- El `errorHandler` ahora incluye `requestId` en todas las respuestas de error (tanto `AppError` como errores inesperados).

### Health Check Mejorado
- El endpoint `GET /health` ahora ejecuta `SELECT 1` vía Prisma para verificar la conexión a la base de datos.
- Responde `200 { status: 'ok', db: 'connected' }` si la BD responde.
- Responde `503 { status: 'error', db: 'disconnected' }` si la BD no responde.

### Graceful Shutdown
- El servidor captura `SIGTERM` y `SIGINT`.
- En la señal, cierra el HTTP server (deja de aceptar nuevas conexiones) y luego desconecta Prisma.
- Timeout de 10 segundos para forzar cierre si las conexiones existentes no se completan.

### Rate Limiters Diferenciados
- `loginLimiter`: 10 requests por ventana de 15 minutos (ya existía).
- `registerLimiter`: 5 requests por hora (nuevo, aplicado a `POST /auth/register`).
- `apiLimiter`: 200 requests por minuto (disponible para rutas que necesiten un límite más restrictivo que el global).

**Consecuencias**:
- Positivo: trazabilidad completa de errores con `requestId` en respuestas y logs.
- Positivo: los health checks ahora detectan problemas de BD antes de que afecten a los usuarios.
- Positivo: el servidor se cierra limpiamente sin corromper conexiones de BD.
- Positivo: los rate limiters específicos protegen endpoints sensibles (login, registro) sin afectar la API general.
- Negativo: overhead mínimo por la generación de UUID en cada request (despreciable).

**Atributos de calidad afectados**:
- **Observabilidad**: mejora significativa — correlation ID en cada request y error.
- **Confiabilidad**: mejora — graceful shutdown evita corrupción de datos; health check detecta fallos de BD.
- **Seguridad**: mejora — rate limiting específico para registro y login.
