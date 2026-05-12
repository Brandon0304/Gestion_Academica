# ADR-002 — Validación de Prerrequisitos en Inscripciones

**Estado**: Aceptado
**Fecha**: 2026-05-12
**Contexto**: El sistema permite inscribir estudiantes en cursos sin verificar que hayan aprobado las asignaturas prerrequisito. El schema de Prisma ya incluye la tabla `prerequisites` con relación many-to-many entre asignaturas, pero la lógica de negocio no la utiliza. Esto puede llevar a que estudiantes se inscriban en cursos sin la base académica necesaria.

**Opciones consideradas**:
1. Validar prerrequisitos en el `EnrollmentValidator` consultando la tabla de prerrequisitos y las inscripciones aprobadas del estudiante — elegida.
2. Validar en el frontend únicamente — inseguro, la regla de negocio quedaría fuera del dominio.
3. Crear un Domain Service separado `PrerequisiteChecker` — sobreingeniería para este caso, la validación cabe en el `EnrollmentValidator` existente.

**Decisión**: Agregar el método `findPrerequisites(subjectId)` al `SubjectRepository` y `findApprovedByStudentAndSubject(studentId, subjectId)` al `EnrollmentRepository`. El `EnrollmentValidator` inyecta `SubjectRepository` y, después de las validaciones existentes, consulta los prerrequisitos de la asignatura del curso. Para cada prerrequisito, verifica si el estudiante tiene una inscripción aprobada (`status === 'approved'`) en algún curso de esa asignatura. Si falta algún prerrequisito, lanza `ConflictError` con los detalles.

**Consecuencias**:
- Positivo: los estudiantes no pueden inscribirse en cursos sin prerrequisitos aprobados.
- Positivo: la validación usa datos existentes (tabla `prerequisites`, enrollments aprobados), sin necesidad de nuevas tablas.
- Negativo: la consulta `findApprovedByStudentAndSubject` requiere un JOIN entre enrollment, course y subject, que puede ser lento con muchos datos — mitigado con índice en `course.subject_id`.
- Negativo: la implementación InMemory es aproximada (requiere CourseRepository inyectado) — los tests pueden mockear el método directamente.

**Atributos de calidad afectados**: Mantenibilidad (la regla está en el dominio), Seguridad (no se puede eludir desde el frontend).
