# ADR-000 — Estado inicial y decisiones fundacionales

**Estado**: Aceptado
**Fecha**: 2026-05-11

## Contexto

El repositorio G_ACADEMICA se inicia como proyecto **greenfield**: sin código fuente, sin dependencias, sin historial de git, sin archivos de configuración. Se requiere establecer las decisiones arquitectónicas fundacionales que regirán todo el desarrollo futuro del sistema de gestión académica.

## Opciones consideradas

### Stack de base de datos
| Opción | Evaluación |
|---|---|
| **PostgreSQL** | Elegido. El dominio académico exige integridad referencial (FK entre estudiantes ↔ inscripciones ↔ cursos ↔ calificaciones), joins constantes entre entidades, restricciones CHECK para validar reglas (notas en rango, fechas coherentes), y soporte para transacciones. |
| MongoDB | Descartado. Las colecciones sin esquema fijo y la falta de joins nativos dificultan las consultas académicas típicas (historial del estudiante, validación de prerrequisitos, reportes cruzados). |
| MySQL | Descartado frente a PostgreSQL por menor soporte de tipos avanzados (JSONB, ENUM, CHECK con expresiones complejas) y ecosistema inferior para TypeScript + Prisma. |

### Arquitectura
| Opción | Evaluación |
|---|---|
| **Clean Architecture (Hexagonal)** | Elegido. El dominio académico tiene reglas de negocio complejas (cálculo de promedios ponderados, prerrequisitos, choques de horario) que NO deben depender de frameworks HTTP ni de la base de datos. Permite testear casos de uso sin infraestructura y cambiar de framework sin tocar el núcleo. |
| MVC tradicional (Express + modelos) | Descartado porque la lógica de negocio termina en los controladores o en modelos acoplados a la BD, violando el Anemic Domain Model antipattern y dificultando el testing. |
| Microservicios | Descartado para el MVP. El dominio académico tiene alta cohesión (estudiante ↔ curso ↔ calificación están fuertemente acoplados). Microservicios agregarían complejidad distributiva (comunicación, transacciones distribuidas, consistencia eventual) sin beneficio inmediato. Se opta por monolito modular que luego puede extraer bounded contexts. |

### Lenguaje y runtime
| Opción | Evaluación |
|---|---|
| **Node.js + TypeScript** | Elegido. TypeScript permite modelar el dominio con tipos precisos (value objects, uniones discriminadas para errores, genéricos para repositorios). El tipado estático reduce errores en reglas de negocio complejas. |
| Python + Django | Descartado porque Django impone su propio ORM y estructura, dificultando Clean Architecture. Python carece de tipado estático nativo. |
| Java + Spring Boot | Descartado por sobreingeniería para el alcance del proyecto; mayor tiempo de desarrollo y configuración. |

### Framework HTTP
| Opción | Evaluación |
|---|---|
| **Express / Fastify** | Elegido (decisión postergada a Sprint 0). Ambos son ligeros, extensibles con plugins y sin opiniones arquitectónicas fuertes. La decisión final se tomará cuando se analice la necesidad de serialización/validación y rendimiento. |
| NestJS | Descartado porque impone decoradores y un acoplamiento a su DI container que dificulta mantener la independencia del dominio. |

### ORM
| Opción | Evaluación |
|---|---|
| **Prisma / Drizzle** | Elegido (decisión postergada a Sprint 0). Ambos ofrecen tipado seguro generado desde la BD, migrations declarativas y buena integración con TypeScript. La decisión final se tomará evaluando: (1) madurez del ecosistema, (2) rendimiento en consultas complejas del dominio académico, (3) facilidad de mock para tests. |
| TypeORM | Descartado por su API verbosa, decoradores que acoplan entidades a la infraestructura, y problemas históricos de mantenibilidad. |

### Testing
| Opción | Evaluación |
|---|---|
| **Vitest** | Elegido. Nativo para TypeScript, rápido (esbuild), compatible con Jest API, soporta cobertura y mocks integrados. |
| Jest | Descartado por ser más lento y requerir configuración adicional para TypeScript. |

## Decisión

Se establece el siguiente stack y prácticas fundacionales:

| Dimensión | Decisión |
|---|---|
| **Lenguaje** | TypeScript (strict mode, sin `any`) |
| **Runtime** | Node.js (última versión LTS) |
| **Arquitectura** | Clean Architecture (Domain → Application → Infrastructure → Presentation) |
| **Base de datos** | PostgreSQL con UUIDs, soft delete, timestamps auditables |
| **Framework HTTP** | Express o Fastify (por decidir en Sprint 0) |
| **ORM** | Prisma o Drizzle (por decidir en Sprint 0) |
| **Testing** | Vitest |
| **Entorno** | Docker + docker-compose (PostgreSQL + app) |
| **Estructura de carpetas** | `src/` con: domain/, application/, infrastructure/, presentation/, shared/ |
| **Documentación de decisiones** | ADRs en `docs/decisions/` |
| **Convenciones** | kebab-case para archivos, PascalCase para clases/tipos, camelCase para variables/métodos, named exports |
| **Manejo de errores** | Excepciones con `AppError` (jerarquía: ValidationError, NotFoundError, ConflictError, UnauthorizedError, ForbiddenError); ver ADR-007 |

## Consecuencias

### Positivas
- La lógica de negocio queda aislada de frameworks y BD, permitiendo cambios tecnológicos sin reescribir el dominio.
- Los casos de uso son testeables con repositorios in-memory, sin levantar infraestructura.
- La estructura modular permite extraer bounded contexts a servicios independientes si el sistema escala.
- Las decisiones quedan documentadas como ADRs, evitando "arquitectura por accidente".

### Negativas
- Mayor cantidad de archivos e interfaces que un enfoque MVC clásico (~30-40% más archivos).
- Se requiere disciplina del equipo para mantener las reglas de dependencia (ninguna capa interna importa de una externa).
- La curva de aprendizaje inicial es más alta para desarrolladores no familiarizados con Clean Architecture.
- El tiempo de configuración inicial (Sprint 0) es mayor que frameworks todo-en-uno como NestJS.

## Atributos de calidad afectados

| Atributo | Impacto | Mitigación |
|---|---|---|
| **Mantenibilidad** | ▲ Alto — capas desacopladas, cambios localizados | Reglas de dependencia estrictas verificadas con ESLint |
| **Testabilidad** | ▲ Alto — dominio sin dependencias externas | Repositorios in-memory en tests unitarios |
| **Escalabilidad** | ▼ Medio — comienza como monolito | Arquitectura modular permite extraer servicios gradualmente |
| **Seguridad** | = Neutro — depende de implementación | Validación en entrada y autorización planificadas desde el inicio |
| **Observabilidad** | = Neutro — se implementa como adapter | Logger estructurado planificado en Infrastructure |

---

**Referencias**: AGENTS.md secciones 1-10, docs/domain.md, docs/architecture.md
