# presentation/controllers/ — Controladores

Cada controlador maneja un recurso/módulo:

- **auth.controller.ts** — Login, refresh, logout, perfil
- **students.controller.ts** — CRUD de estudiantes, historial
- **teachers.controller.ts** — CRUD de docentes, carga horaria
- **courses.controller.ts** — CRUD de cursos, gestión de estado
- **subjects.controller.ts** — CRUD de asignaturas, prerrequisitos
- **enrollments.controller.ts** — Inscripciones, retiros
- **grades.controller.ts** — Calificaciones, nota final
- **academic-periods.controller.ts** — CRUD de períodos
- **study-plans.controller.ts** — CRUD de planes de estudio
- **classrooms.controller.ts** — CRUD de aulas
- **reports.controller.ts** — Reportes y estadísticas

Regla: los controladores NO contienen lógica de negocio. Solo llaman casos de uso y devuelven respuestas.
