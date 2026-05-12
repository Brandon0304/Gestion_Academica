# Plan de Pruebas — G_ACADEMICA

> Estrategia y organización de pruebas para el backend.

---

## Stack de testing

| Herramienta | Versión | Propósito |
|---|---|---|
| Vitest | ^3.x | Test runner (rápido, nativo TypeScript) |
| Vitest (built-in) | — | Mocks y spies |
| In-memory repositories | — | Reemplazar Prisma en tests unitarios |

---

## Estructura de tests

Los tests viven junto al archivo que prueban con sufijo `.test.ts`:

```
src/
├── domain/
│   └── entities/
│       ├── student.ts
│       ├── student.test.ts
│       └── ...
├── application/
│   └── use-cases/
│       ├── create-course.use-case.ts
│       ├── create-course.use-case.test.ts
│       └── ...
└── infrastructure/
    └── persistence/
        ├── prisma-student-repository.ts
        └── (tests de integración aquí, pendientes)
```

### Categorías de pruebas

| Categoría | Qué prueba | Herramienta | Dependencia externa |
|---|---|---|---|
| **Unitarias** | Entidades, Value Objects, Casos de uso | Vitest + mocks | Ninguna (repos in-memory) |
| **Integración** | Repositorios Prisma contra BD real | Vitest | PostgreSQL (testcontainers) |
| **E2E** | Flujo completo HTTP → BD → HTTP | Vitest + supertest | PostgreSQL + App |

---

## Tests unitarios (implementados)

### Domain Entities

| Archivo | Tests | Qué cubre |
|---|---|---|
| `student.test.ts` | Creación con datos válidos, errores de validación, actualización de datos | Reglas de negocio de Student |
| `teacher.test.ts` | Creación, validación de especialidades | Reglas de negocio de Teacher |
| `subject.test.ts` | Creación, validación de créditos | Reglas de negocio de Subject |
| `course.test.ts` | Creación, cambio de estado, validación de capacidad/cupo | Reglas de Course |
| `enrollment.test.ts` | Creación, cambio de estado | Reglas de Enrollment |
| `grade.test.ts` | Creación, validación de porcentajes y valores | Reglas de Grade |
| `academic-period.test.ts` | Creación, validación de fechas | Reglas de AcademicPeriod |
| `classroom.test.ts` | Creación, validación de capacidad | Reglas de Classroom |
| `study-plan.test.ts` | Creación, agregar/remover asignaturas, validación | Reglas de StudyPlan |

### Use Cases (Application)

| Archivo | Tests | Qué cubre |
|---|---|---|
| `login.use-case.test.ts` | Login exitoso, credenciales inválidas | Autenticación |
| Various CRUD use cases | Crear, listar, obtener, actualizar, eliminar | Operaciones CRUD estándar |
| `create-enrollment.use-case.test.ts` | Inscripción exitosa, choque horario, cupo lleno, duplicado, prerrequisitos | Reglas de negocio de inscripción |
| `register-grade.use-case.test.ts` | Registro exitoso, validación de porcentajes, inscripción no activa | Reglas de calificaciones |
| `create-study-plan.use-case.test.ts` | Creación con asignaturas, datos inválidos | Planes de estudio |
| `list-study-plans.use-case.test.ts` | Listado paginado, filtros | Planes de estudio |
| `student-academic-history.use-case.test.ts` | Historial completo, datos de cursos y períodos | Reportes |
| `course-grade-report.use-case.test.ts` | Reporte con calificaciones, datos de estudiantes y docente | Reportes |

### Infrastructure

| Archivo | Tests | Qué cubre |
|---|---|---|
| (Pendiente) | Tests de integración con Prisma | Repositorios contra BD real |

---

## Tests de integración (pendientes)

Cada repositorio Prisma debe tener un test que verifique:

1. **CRUD básico** — crear, leer, actualizar, eliminar (soft) una entidad
2. **Consultas específicas** — métodos de búsqueda del repositorio
3. **Manejo de errores** — registro no encontrado, violación de unicidad

Se recomienda usar `testcontainers` para levantar PostgreSQL en un contenedor Docker
aislado por cada suite de tests, o bien una BD dedicada `g_academica_test` con
migraciones aplicadas antes de cada ejecución.

---

## Tests E2E (implementados)

Tests de extremo a extremo que verifican flujos completos del negocio usando `supertest` + Vitest + BD real.

### Flujos cubiertos

| Archivo | Flujo | Qué verifica |
|---|---|---|
| `tests/e2e/core-flows.e2e.test.ts` | **Auth & RBAC** | Login con todos los roles, GET /auth/me, control de acceso por rol, header X-Request-ID |
| | **CRUD Estudiante** | Crear, obtener, listar, actualizar y eliminar un estudiante como admin |
| | **Curso + Inscripción + Calificaciones** | Crear curso, inscribir estudiante, rechazar duplicado, registrar calificaciones, actualizar nota, calcular nota final |
| | **Reportes** | Historial académico por estudiante, reporte de calificaciones por curso, error 404 |
| | **Planes de Estudio** | CRUD completo de plan de estudios |

### Requisitos

- PostgreSQL corriendo (local o Docker)
- Migraciones aplicadas (`npx prisma migrate deploy`)
- Seed de datos cargado (`npx prisma db seed`)

### Ejecución

```bash
# Con BD local
npm run test:e2e

# Con Docker (full stack: BD + migraciones + seed + tests)
npm run test:integration:e2e
```

### Configuración

Las variables de entorno se definen en `vitest.config.e2e.ts`:
- `DATABASE_URL`: conexión a PostgreSQL
- `JWT_SECRET`: secreto para tokens JWT
- `RATE_LIMIT_MAX`: 10000 (desactivar rate limiting en tests)
- `LOG_LEVEL`: error

Los tests crean sus propios datos de prueba con prefijo `e2e-` y los limpian
en el hook `afterAll` de cada suite.

---

## Cobertura actual

```
Archivos: 20 unitarios + 1 smoke + 1 E2E (67 tests)
Pruebas:  152 unitarios + 20 smoke + ~45 E2E
Fallos:   0
```

Para generar reporte de cobertura:
```bash
npm run test:coverage
```

---

## Cómo ejecutar las pruebas

```bash
# Tests unitarios
npm run test

# Tests en modo watch (desarrollo)
npm run test:watch

# Tests con cobertura
npm run test:coverage
```

---

## Convenciones para escribir tests

1. **Arrange-Act-Assert**: estructura clara en 3 bloques separados por línea en blanco.
2. **Nombres descriptivos**: `it('should not allow enrollment when student has schedule conflict', ...)`
3. **Un `it` por comportamiento**: si hay múltiples validaciones, múltiples `it`.
4. **Repositorios in-memory**: usar `InMemoryXxxRepository` en vez de mocks manuales.
5. **Data builders**: usar métodos factory (`createStudentData()`) en vez de objetos literales repetidos.
