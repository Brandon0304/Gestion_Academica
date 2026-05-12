# ADR-001 — Seguridad y Rate Limiting

**Estado**: Aceptado
**Fecha**: 2026-05-12

## Contexto

La API REST de G_ACADEMICA se encuentra expuesta sin capas de seguridad básicas:
- Sin headers de seguridad HTTP (Content-Security-Policy, X-Frame-Options, etc.)
- Sin límite de requests por IP (vulnerable a ataques de fuerza bruta y DDoS)
- Sin protección contra parameter pollution

## Opciones consideradas

### Headers de seguridad

| Opción | Evaluación |
|---|---|
| **Helmet** | Elegido. Middleware Express que configura ~15 headers de seguridad automáticamente (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, etc.). Es el estándar de facto en Express. |
| Manual (headers uno por uno) | Descartado. Helmet ya cubre todos los casos relevantes, mantenerlo manual es propenso a errores. |

### Rate Limiting

| Opción | Evaluación |
|---|---|
| **express-rate-limit** | Elegido. Middleware simple y configurable, soporta store en memoria (suficiente para MVP) y stores externos (Redis) para escalar. |
| rate-limiter-flexible | Descartado. Más complejo de configurar; express-rate-limit cubre el caso de uso inmediato. |

### Documentación API

| Opción | Evaluación |
|---|---|
| **swagger-jsdoc + swagger-ui-express** | Elegido. swagger-jsdoc permite mantener la especificación OpenAPI como comentarios JSDoc junto al código (no se desincroniza). swagger-ui-express sirve la UI en `/api-docs`. |
| Manual (archivo yaml separado) | Descartado. Se desincroniza fácilmente del código. |

## Decisión

| Dimensión | Decisión |
|---|---|
| **Headers de seguridad** | Helmet con configuración por defecto |
| **Rate Limiting** | express-rate-limit: 100 requests/minuto por IP (configurable vía `RATE_LIMIT_MAX`) |
| **Documentación API** | swagger-jsdoc + swagger-ui-express en ruta `/api-docs` |
| **Configuración** | Variables de entorno `RATE_LIMIT_MAX`, `CORS_ORIGINS` |

## Consecuencias

### Positivas
- Protección inmediata contra ataques comunes (clickjacking, XSS, MIME sniffing, etc.)
- Límite de requests evita abusos por fuerza bruta en login
- Documentación API auto-contenida y siempre sincronizada con el código
- Todo configurable por entorno sin tocar código

### Negativas
- Rate limiting puede afectar integraciones legítimas si no se ajusta el límite
- Swagger agrega ~500KB al bundle y una ruta más

## Atributos de calidad afectados

| Atributo | Impacto | Mitigación |
|---|---|---|
| **Seguridad** | ▲ Alto — headers HTTP + rate limiting | Helmet y rate-limit configurados con valores conservadores |
| **Mantenibilidad** | ▲ Medio — documentación junto al código | Los decoradores JSDoc se actualizan con el código |
| **Rendimiento** | ▼ Bajo — overhead mínimo de Helmet + rate-limit en memoria | express-rate-limit en memoria es ~1ms por request |
