# ADR-004 — Control de Acceso a Nivel de Datos (Data-Level RBAC)

**Estado**: Aceptado
**Fecha**: 2026-05-12
**Contexto**: El sistema contaba con RBAC a nivel de rutas (qué rol puede acceder a cada endpoint), pero no había restricciones a nivel de datos. Un docente podía listar todos los cursos del sistema, un estudiante podía ver inscripciones de otros estudiantes, y un estudiante podía acceder al perfil de cualquier compañero. Esto violaba el principio de mínimo privilegio y exponía datos sensibles.

**Opciones consideradas**:

1. **Pasar UserContext a los casos de uso**: Cada caso de uso recibe el usuario autenticado y aplica filtros internamente. Limpio desde la perspectiva de Clean Architecture, pero requiere modificar muchas interfaces.

2. **Filtrar en los controladores usando repositorios**: Los controladores resuelven el perfil del usuario (studentId/teacherId) usando `findByUserId` en los repositorios y lo pasan como filtro adicional a los casos de uso. Elegida por ser pragmática y minimizar cambios en la capa de dominio/aplicación.

3. **Políticas de autorización separadas (Policy objects)**: Crear objetos `CoursePolicy`, `EnrollmentPolicy`, etc. que encapsulan las reglas de acceso. Más mantenible a largo plazo pero introduce over-engineering para el alcance actual.

**Decisión**: Se implementó la opción 2 (filtros en controladores) con los siguientes cambios:

- Se agregó `findByUserId(userId)` a los interfaces `StudentRepository` y `TeacherRepository` y a sus implementaciones (`PrismaStudentRepository`, `PrismaTeacherRepository`, `InMemoryStudentRepository`, `InMemoryTeacherRepository`).
- Se creó el tipo `UserContext` en `src/shared/types/user-context.ts` para tipar el contexto del usuario autenticado.
- Los siguientes controladores ahora aplican filtros basados en el rol:

| Controlador | Método | Regla |
|---|---|---|
| `CoursesController` | `get()` | Teacher: verifica que el curso le pertenece |
| `CoursesController` | `list()` | Teacher: auto-filtra por `teacherId` |
| `EnrollmentsController` | `get()` | Student: verifica que la inscripción le pertenece |
| `EnrollmentsController` | `list()` | Student: auto-filtra por `studentId` |
| `StudentsController` | `get()` | Student: solo permite ver su propio perfil |
| `StudentsController` | `list()` | Student: solo devuelve su propio perfil |
| `GradesController` | `listByEnrollment()` | Student: verifica que la inscripción le pertenece |
| `ReportsController` | `studentHistory()` | Student: fuerza su propio `studentId` |
| `ReportsController` | `courseReport()` | Teacher: verifica que el curso le pertenece |
| `TimetableController` | `studentTimetable()` | Student: fuerza su propio `studentId` |
| `TimetableController` | `teacherTimetable()` | Teacher: fuerza su propio `teacherId` |

- `ListEnrollmentsUseCase.execute()` ahora acepta un parámetro opcional `studentId` para filtrar.

**Consecuencias**:
- Positivo: estudiantes y docentes solo ven sus propios datos, cumpliendo mínimo privilegio.
- Positivo: cambios mínimos en la arquitectura existente (no se modificaron interfaces de casos de uso existentes, solo se agregaron parámetros).
- Positivo: las reglas de acceso están cerca del punto de entrada (controlador), facilitando la auditoría.
- Negativo: lógica de autorización mezclada con lógica de presentación en los controladores (violación leve de SRP). Se acepta como trade-off para evitar modificar todas las interfaces de casos de uso.
- Negativo: el controlador ahora depende de repositorios (`studentRepository`, `teacherRepository`, `courseRepository`) además de casos de uso.

**Atributos de calidad afectados**:
- **Seguridad**: mejora significativa — los datos ahora están protegidos a nivel de fila.
- **Mantenibilidad**: leve impacto negativo por la mezcla de responsabilidades en controladores.
- **Testabilidad**: los casos de uso permanecen puros y testeables sin contexto de auth.
