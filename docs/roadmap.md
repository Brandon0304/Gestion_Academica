# Roadmap — G_ACADEMICA

---

## Estado de módulos

| Módulo | Prioridad | Estado | Dependencia |
|---|---|---|---|
| Autenticación y Usuarios | 🔴 Crítica | Completado | — |
| Estudiantes | 🔴 Crítica | Completado | Autenticación |
| Docentes | 🔴 Crítica | Completado | Autenticación |
| Períodos Académicos | 🔴 Crítica | Completado | — |
| Asignaturas | 🔴 Crítica | Completado | — |
| Planes de Estudio | 🟡 Alta | Completado | Asignaturas |
| Cursos | 🔴 Crítica | Completado | Asignaturas, Docentes, Períodos Académicos, Aulas |
| Inscripciones | 🔴 Crítica | Completado | Estudiantes, Cursos |
| Aulas | 🟡 Alta | Completado | — |
| Calificaciones | 🟡 Alta | Completado | Inscripciones |
| Reportes | 🟢 Media | Completado | Todos los anteriores |
| Seed de datos | 🔴 Crítica | Completado | — |
| Migraciones Prisma | 🔴 Crítica | Completado | Schema |
| Documentación técnica | 🟢 Media | Completado | — |

**Leyenda**: 🔴 Crítica = necesario para MVP | 🟡 Alta = siguiente iteración | 🟢 Media = backlog

---

## Dependencias entre módulos

```
Autenticación ─────────────────────────────────────────────────────┐
Estudiantes ──┐                                                    │
Docentes ─────┤                                                    │
Períodos ─────┤                                                    │
Asignaturas ──┤                                                    │
Aulas ────────┤                                                    │
              ├──▶ Cursos ──▶ Inscripciones ──▶ Calificaciones ──▶ Reportes
              │                                                    ▲
Planes ───────┘                                                    │
              (no bloquea cursos pero es │
               necesario para asignaturas) ─────────────────────────┘
```

---

## Estado de Sprints

### Sprint 0 — Fundación ✅
**Objetivo**: Inicializar el proyecto con toda la configuración base.

| Tarea | Estado |
|---|---|
| Inicializar proyecto Node.js + TypeScript | ✅ |
| Configurar tsconfig.json (strict mode) | ✅ |
| Configurar ESLint | ✅ |
| Configurar Vitest | ✅ |
| Configurar Prisma con PostgreSQL (Docker) | ✅ |
| Crear schema.prisma con todas las entidades | ✅ |
| Crear seed de datos de prueba (prisma/seed.ts) | ✅ |
| Configurar estructura de carpetas Clean Architecture | ✅ |
| Configurar logger estructurado | ✅ |
| Generar migraciones Prisma | ✅ |

### Sprint 1 — Autenticación y Estudiantes ✅
**Objetivo**: Login funcional + CRUD de estudiantes.

| Tarea | Estado |
|---|---|
| Implementar entidad User en Domain | ✅ |
| Implementar caso de uso Login | ✅ |
| Implementar middleware JWT | ✅ |
| Implementar CRUD de Estudiantes | ✅ |
| Tests de autenticación | ✅ |
| Tests de estudiantes | ✅ |

### Sprint 2 — Docentes, Asignaturas, Períodos, Aulas ✅
**Objetivo**: Catálogos base para poder crear cursos.

| Tarea | Estado |
|---|---|
| CRUD Docentes | ✅ |
| CRUD Asignaturas | ✅ |
| CRUD Períodos Académicos | ✅ |
| CRUD Aulas | ✅ |
| Tests | ✅ |

### Sprint 3 — Cursos e Inscripciones ✅
**Objetivo**: Núcleo del sistema — crear cursos e inscribir estudiantes con validaciones.

| Tarea | Estado |
|---|---|
| CRUD Cursos | ✅ |
| CRUD Inscripciones | ✅ |
| Validación de cupo, horario, período, duplicados | ✅ |
| Tests | ✅ |

### Sprint 4 — Calificaciones ✅
**Objetivo**: Registrar notas y calcular promedios.

| Tarea | Estado |
|---|---|
| CRUD Calificaciones | ✅ |
| Cálculo de nota final ponderada | ✅ |
| Auto-aprobación/reprobación | ✅ |
| Tests | ✅ |

### Sprint 5 — Reportes y Cierre ✅

| Tarea | Estado |
|---|---|
| Reporte de historial académico por estudiante | ✅ |
| Reporte de calificaciones por curso | ✅ |
| Planes de Estudio (CRUD completo) | ✅ |
| Migraciones Prisma | ✅ |
| Documentación API contracts y testing | ✅ |
| Pruebas de integración (smoke tests) | ✅ |
| End-to-end testing | ✅ |

### Sprint 6 — Hardening y Seguridad ✅

| Tarea | Estado |
|---|---|
| Data-level RBAC (control acceso por fila) | ✅ |
| Request ID / correlation ID | ✅ |
| Health check con verificación de BD | ✅ |
| Graceful shutdown (SIGTERM/SIGINT) | ✅ |
| Rate limiters diferenciados (login, registro, API) | ✅ |
| Smoke tests automatizados (Docker Compose) | ✅ |
| ADRs documentados (004, 005, 006) | ✅ |

---

## Definition of Done (por módulo)

Un módulo se considera **completado** cuando cumple TODOS estos criterios:

1. **Domain**: entidades con reglas de negocio, value objects, interfaces de repositorio definidas
2. **Application**: casos de uso implementados para todas las operaciones (CRUD + operaciones de dominio)
3. **Infrastructure**: implementaciones de repositorios (Prisma), adaptadores necesarios
4. **Presentation**: endpoints REST implementados con validación y autorización
5. **Tests unitarios**: cobertura ≥ 80% de casos de uso y entidades
6. **Tests de integración**: al menos un test que verifique el flujo completo (controller → BD → response)
7. **Documentación**: módulo listado en docs/roadmap.md como completado
8. **Sin antipatrones**: verificado contra la sección 6 del AGENTS.md
9. **Linter y typecheck**: pasa `npm run lint` y `npm run typecheck` sin errores
