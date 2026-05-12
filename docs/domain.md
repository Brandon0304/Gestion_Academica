# Modelo de Dominio — G_ACADEMICA

## Entidades principales

### Estudiante (Student)
Representa a una persona matriculada en la institución.
- **Atributos**: id, nombre, apellido, email, documentoIdentidad, fechaNacimiento, telefono, direccion, fechaIngreso, estado (activo/inactivo/egresado/suspendido)
- **Comportamiento**: inscribirseEnCurso(), obtenerHistorialAcademico(), calcularPromedioGeneral(), verificarPreRequisitos()

### Docente (Teacher)
Persona responsable de impartir cursos.
- **Atributos**: id, nombre, apellido, email, documentoIdentidad, especialidad, titulo, fechaContratacion, estado (activo/inactivo)
- **Comportamiento**: asignarACurso(), registrarCalificaciones(), obtenerCargaHoraria()

### Curso (Course)
Oferta académica concreta de una asignatura en un período específico.
- **Atributos**: id, codigo, nombre, descripcion, creditos, capacidadMaxima, aula, horario, periodoAcademicoId, docenteId, asignaturaId, estado (abierto/cerrado/en-curso/finalizado)
- **Comportamiento**: verificarCupo(), inscribirEstudiante(), cerrarInscripciones(), finalizar()

### Asignatura (Subject)
Materia del plan de estudios (plantilla del curso).
- **Atributos**: id, codigo, nombre, descripcion, creditos, horasTeoricas, horasPracticas, planEstudioId
- **Comportamiento**: verificarPreRequisitos(), perteneceAPlan()

### Inscripción (Enrollment)
Relación entre un estudiante y un curso en un período. Marca académica.
- **Atributos**: id, estudianteId, cursoId, fechaInscripcion, estado (inscrito/aprobado/reprobado/retirado), calificacionFinal
- **Comportamiento**: registrarCalificacion(), calcularNotaFinal(), generarActa()

### Calificación (Grade)
Evaluación individual dentro de un curso.
- **Atributos**: id, inscripcionId, tipoEvaluacion, valor, porcentaje, fechaRegistro, observaciones
- **Comportamiento**: validarRango(), calcularPonderacion()

### Período Académico (AcademicPeriod)
Ciclo lectivo (semestre, trimestre, año).
- **Atributos**: id, nombre, fechaInicio, fechaFin, fechaInicioInscripciones, fechaFinInscripciones, estado (planificado/activo/cerrado)
- **Comportamiento**: estaEnPeriodoInscripcion(), estaActivo(), contieneFecha()

### Plan de Estudios (StudyPlan)
Estructura curricular que agrupa asignaturas.
- **Atributos**: id, nombre, codigo, descripcion, añoVigencia, creditosTotales, estado (borrador/vigente/reemplazado)
- **Comportamiento**: agregarAsignatura(), calcularCreditosTotales(), estaVigente()

### Requisito (Prerequisite)
Relación de prerrequisito entre asignaturas.
- **Atributos**: id, asignaturaId, prerrequisitoId, tipo (obligatorio/recomendado)
- **Comportamiento**: validarCumplimiento()

### Aula (Classroom)
Espacio físico donde se imparten cursos.
- **Atributos**: id, codigo, nombre, capacidad, tipo (aula/laboratorio/taller), ubicacion

### Usuario (User)
Cuenta de acceso al sistema.
- **Atributos**: id, email, passwordHash, rol (admin/directivo/docente/estudiante/secretaria), activo, ultimoAcceso
- **Comportamiento**: autenticar(), cambiarPassword(), tienePermiso()

---

## Relaciones entre entidades

| Entidad A | Cardinalidad | Entidad B | Cardinalidad | Tipo | Descripción |
|---|---|---|---|---|---|
| Estudiante | 1 | Inscripción | N | 1:N | Un estudiante tiene muchas inscripciones |
| Curso | 1 | Inscripción | N | 1:N | Un curso tiene muchas inscripciones |
| Estudiante | N | Curso | N | N:N | A través de Inscripción |
| Curso | N | Docente | 1 | N:1 | Un docente puede impartir varios cursos |
| Curso | N | Asignatura | 1 | N:1 | Una asignatura se ofrece como varios cursos |
| Curso | N | Período Académico | 1 | N:1 | Un período tiene muchos cursos |
| Asignatura | N | Plan de Estudios | 1 | N:1 | Un plan contiene muchas asignaturas |
| Asignatura | N | Asignatura | N | N:N | A través de Requisito (prerrequisitos) |
| Inscripción | 1 | Calificación | N | 1:N | Una inscripción tiene muchas calificaciones |
| Usuario | 1 | Estudiante | 0..1 | 1:0..1 | Un usuario puede ser estudiante |
| Usuario | 1 | Docente | 0..1 | 1:0..1 | Un usuario puede ser docente |

---

## Reglas de negocio críticas

1. **Cupo disponible**: un estudiante no puede inscribirse en un curso si este ha alcanzado su capacidad máxima (`capacidadMaxima`).

2. **Prerrequisitos**: un estudiante no puede inscribirse en un curso si no ha aprobado todas las asignaturas prerrequisito definidas en el plan de estudios. [POR DEFINIR: qué nota mínima se considera "aprobado"]

3. **Choque de horarios**: un estudiante no puede inscribirse simultáneamente en dos cursos cuyos horarios se superpongan.

4. **Período de inscripción**: las inscripciones solo pueden realizarse dentro del rango `fechaInicioInscripciones` - `fechaFinInscripciones` del Período Académico.

5. **Ciclo de calificaciones**: solo se pueden registrar calificaciones si el curso está en estado "en-curso" o "finalizado". [POR DEFINIR: si hay fechas límite por evaluación]

6. **Rango de notas**: cada calificación debe estar dentro del rango definido (ej: 0-20 o 0-100). [POR DEFINIR: escala concreta por institución]

7. **Ponderación**: la suma de porcentajes de todas las calificaciones de un curso debe ser exactamente 100%.

8. **Sobrecupo por docente**: [POR DEFINIR: si existe un límite máximo de estudiantes por docente o por curso]

9. **Inscripción única**: un estudiante no puede inscribirse dos veces al mismo curso en el mismo período académico.

10. **Estado del curso al modificar notas**: una vez finalizado un curso, las calificaciones no pueden modificarse sin autorización especial. [POR DEFINIR: flujo de revisión]

---

## Glosario

| Término | Definición |
|---|---|
| **Asignatura** | Materia o disciplina dentro de un plan de estudios (ej: "Matemáticas I") |
| **Curso** | Oferta concreta de una asignatura en un período, con docente, aula y horario definidos |
| **Inscripción** | Registro de un estudiante en un curso para un período académico |
| **Calificación** | Nota o puntuación obtenida en una evaluación específica |
| **Nota final** | Promedio ponderado de todas las calificaciones de un curso |
| **Período académico** | Ciclo lectivo (semestre, trimestre, bimestre, etc.) |
| **Plan de estudios** | Estructura curricular que define las asignaturas requeridas para una carrera o programa |
| **Prerrequisito** | Asignatura que debe aprobarse antes de cursar otra |
| **Crédito** | Unidad de medida del trabajo académico (horas de clase/estudio) |
| **Marca académica** | Sinónimo de inscripción con la nota final que queda en el historial del estudiante |
| **Acta de notas** | Documento oficial con las calificaciones finales de un curso |
| **Retiro** | Acción de abandonar un curso después de inscrito, con o sin penalización académica |
