# ADR-007 — Patrón de manejo de errores: excepciones vs Result

**Estado**: Aceptado
**Fecha**: 2026-05-12
**Contexto**: El documento AGENTS.md (sección 4) especifica el uso del patrón `Result<T, E>` (unión discriminada de éxito/error) para el flujo de errores en la capa de aplicación. Sin embargo, durante la implementación inicial se optó por un enfoque basado en excepciones con una jerarquía de `AppError` que incluye tipos específicos (`ValidationError`, `NotFoundError`, `ConflictError`, `UnauthorizedError`, `ForbiddenError`) manejados por middleware de error de Express.

**Opciones consideradas**:

1. **Result<T, E>**: Usar un tipo unión `Result<T, E>` para todos los casos de uso, donde `E` es un tipo error. Obliga al llamante a manejar el error explícitamente (no hay excepciones no capturadas). Elegante en lenguajes con pattern matching exhaustivo (Rust, Haskell). En TypeScript requiere uniones discriminadas y type guards, y los case expressions son verbosas sin pattern matching nativo.

2. **Excepciones con AppError**: Lanzar `AppError` y sus subtipos desde casos de uso y dominio, capturados por un middleware central de error. Es el patrón dominante en el ecosistema Express/Node.js y permite propagar errores automáticamente a través del stack de middleware sin acoplar firmas de retorno.

3. **Híbrido**: Usar Result en la capa de dominio y excepciones en la capa de aplicación. Introduce complejidad de dos patrones diferentes sin beneficio claro.

**Decisión**: Se adopta exclusivamente el patrón de **excepciones con AppError** y se actualiza AGENTS.md para reflejar la decisión real.

**Consecuencias**:

- Positivas:
  - Consistente con el ecosistema Express: el middleware `error-handler.middleware.ts` captura todos los `AppError` y devuelve respuestas JSON estructuradas.
  - Menos verboso que Result en TypeScript (no requiere `if (result.isOk())` en cada llamada).
  - La jerarquía de errores (`ValidationError`, `NotFoundError`, `ConflictError`, etc.) proporciona semántica clara y códigos HTTP automáticos.
  - Los casos de uso tienen firmas limpias: `execute(input): Promise<Output>` sin envoltorios de Result.

- Negativas:
  - TypeScript no fuerza al llamante a manejar cada tipo de error (puede propagarse sin manejo explícito).
  - Los errores inesperados (no AppError) se transforman en 500 genéricos, lo que es aceptable para este dominio.

**Atributos de calidad afectados**:

- Mantenibilidad: mejora — menos código boilerplate que Result.
- Testabilidad: neutral — los tests usan `rejects.toThrow()` que es idiomático en Vitest.
- Seguridad: no afectado — los errores se sanitizan en el middleware antes de responder.
