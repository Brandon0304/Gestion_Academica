# Contratos de API REST — G_ACADEMICA

> Contratos oficiales de la API REST. Todos los endpoints listados están
> implementados. Ver estado actual en Swagger UI: `http://localhost:3000/api-docs`.

---

## Convenciones globales

### Base URL
```
/api/v1
```

### Formato de errores
Todas las respuestas de error siguen esta estructura:
```json
{
  "error": {
    "code": "ENROLLMENT_CLOSED",
    "message": "El período de inscripciones está cerrado",
    "details": [
      { "field": "courseId", "message": "El curso no acepta inscripciones en esta fecha" }
    ]
  }
}
```

Códigos de error estándar:
- `VALIDATION_ERROR` — datos de entrada inválidos
- `NOT_FOUND` — recurso no encontrado
- `CONFLICT` — violación de regla de negocio (ej: choque de horarios)
- `UNAUTHORIZED` — no autenticado
- `FORBIDDEN` — sin permisos
- `INTERNAL_ERROR` — error interno del servidor

### Paginación
Toda lista paginada sigue este formato:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 150,
    "totalPages": 8
  }
}
```
Parámetros de query: `?page=1&pageSize=20`. Default: page=1, pageSize=20. Máximo pageSize=100.

### Autenticación
- Header: `Authorization: Bearer <token>`
- Los tokens se obtienen via `POST /api/v1/auth/login`
- Los endpoints públicos no requieren header de auth
- Los endpoints protegidos devuelven 401 si el token falta o expiró

### Roles y permisos
| Rol | Prefijo en rutas |
|---|---|
| admin | Sin restricción |
| directive | Lectura total, escritura limitada |
| teacher | Sus cursos y estudiantes |
| student | Sus datos e inscripciones |
| secretary | Gestión de estudiantes, cursos, inscripciones |

---

## Endpoints por módulo

### Autenticación

| Método | Ruta | Descripción | Auth | Body | Response |
|---|---|---|---|---|---|
| POST | /auth/login | Iniciar sesión | No | { email, password } | { token, user } |
| GET | /auth/me | Perfil del usuario actual | Sí | — | { id, email, role, profile } |

### Estudiantes

| Método | Ruta | Descripción | Auth | Body | Response |
|---|---|---|---|---|---|
| GET | /students | Listar estudiantes (paginado) | Sí | — | Paginated<Student> |
| GET | /students/:id | Obtener estudiante por ID | Sí | — | Student |
| POST | /students | Crear estudiante | admin, secretary | CreateStudentDTO | Student |
| PUT | /students/:id | Actualizar estudiante | admin, secretary | UpdateStudentDTO | Student |
| DELETE | /students/:id | Eliminar (soft) estudiante | admin | — | 204 |

### Docentes

| Método | Ruta | Descripción | Auth | Body | Response |
|---|---|---|---|---|---|
| GET | /teachers | Listar docentes | Sí | — | Paginated<Teacher> |
| GET | /teachers/:id | Obtener docente | Sí | — | Teacher |
| POST | /teachers | Crear docente | admin, secretary | CreateTeacherDTO | Teacher |
| PUT | /teachers/:id | Actualizar docente | admin, secretary | UpdateTeacherDTO | Teacher |
| DELETE | /teachers/:id | Eliminar (soft) docente | admin | — | 204 |

### Cursos

| Método | Ruta | Descripción | Auth | Body | Response |
|---|---|---|---|---|---|
| GET | /courses | Listar cursos (filtrable) | Sí | — | Paginated<Course> |
| GET | /courses/:id | Obtener curso | Sí | — | Course |
| POST | /courses | Crear curso | admin, secretary | CreateCourseDTO | Course |
| PUT | /courses/:id | Actualizar curso | admin, secretary | UpdateCourseDTO | Course |
| DELETE | /courses/:id | Eliminar (soft) curso | admin | — | 204 |
| PATCH | /courses/:id/status | Cambiar estado del curso | admin, secretary | { status } | Course |

### Asignaturas

| Método | Ruta | Descripción | Auth | Body | Response |
|---|---|---|---|---|---|
| GET | /subjects | Listar asignaturas | Sí | — | Paginated<Subject> |
| GET | /subjects/:id | Obtener asignatura | Sí | — | Subject |
| POST | /subjects | Crear asignatura | admin | CreateSubjectDTO | Subject |
| PUT | /subjects/:id | Actualizar asignatura | admin | UpdateSubjectDTO | Subject |
| DELETE | /subjects/:id | Eliminar (soft) asignatura | admin | — | 204 |

### Períodos Académicos

| Método | Ruta | Descripción | Auth | Body | Response |
|---|---|---|---|---|---|
| GET | /academic-periods | Listar períodos | Sí | — | Paginated<AcademicPeriod> |
| GET | /academic-periods/:id | Obtener período | Sí | — | AcademicPeriod |
| POST | /academic-periods | Crear período | admin | CreatePeriodDTO | AcademicPeriod |
| PUT | /academic-periods/:id | Actualizar período | admin | UpdatePeriodDTO | AcademicPeriod |
| DELETE | /academic-periods/:id | Eliminar período | admin | — | 204 |

### Planes de Estudio

| Método | Ruta | Descripción | Auth | Body | Response |
|---|---|---|---|---|---|
| GET | /study-plans | Listar planes | Sí | — | Paginated<StudyPlan> |
| GET | /study-plans/:id | Obtener plan con asignaturas | Sí | — | StudyPlan |
| POST | /study-plans | Crear plan | admin | CreatePlanDTO | StudyPlan |
| PUT | /study-plans/:id | Actualizar plan | admin | UpdatePlanDTO | StudyPlan |
| DELETE | /study-plans/:id | Eliminar plan | admin | — | 204 |

### Aulas

| Método | Ruta | Descripción | Auth | Body | Response |
|---|---|---|---|---|---|
| GET | /classrooms | Listar aulas | Sí | — | Paginated<Classroom> |
| GET | /classrooms/:id | Obtener aula | Sí | — | Classroom |
| POST | /classrooms | Crear aula | admin | CreateClassroomDTO | Classroom |
| PUT | /classrooms/:id | Actualizar aula | admin | UpdateClassroomDTO | Classroom |
| DELETE | /classrooms/:id | Eliminar aula | admin | — | 204 |

### Inscripciones

| Método | Ruta | Descripción | Auth | Body | Response |
|---|---|---|---|---|---|
| GET | /enrollments | Listar inscripciones | Sí | — | Paginated<Enrollment> |
| GET | /enrollments/:id | Obtener inscripción | Sí | — | Enrollment |
| POST | /enrollments | Inscribir estudiante en curso | admin, secretary | { studentId, courseId } | Enrollment |
| PATCH | /enrollments/:id/status | Cambiar estado de inscripción | admin | { status } | Enrollment |

### Calificaciones

| Método | Ruta | Descripción | Auth | Body | Response |
|---|---|---|---|---|---|
| GET | /grades/enrollment/:enrollmentId | Listar calificaciones de una inscripción | Sí | — | Grade[] |
| POST | /grades | Registrar calificación | teacher, admin | CreateGradeDTO | Grade |
| PUT | /grades/:id | Actualizar calificación | teacher, admin | UpdateGradeDTO | Grade |
| DELETE | /grades/:id | Eliminar calificación | admin | — | 204 |
| POST | /grades/enrollment/:enrollmentId/calculate-final | Calcular nota final | teacher, admin | — | { finalGrade } |

### Reportes

| Método | Ruta | Descripción | Auth | Body | Response |
|---|---|---|---|---|---|
| GET | /reports/students/:studentId/history | Historial académico del estudiante | admin, directive, secretary | — | StudentAcademicHistory |
| GET | /reports/courses/:courseId/grades | Calificaciones del curso | admin, directive, teacher, secretary | — | CourseGradeReport |

---

## Estados HTTP

| Código | Uso |
|---|---|
| 200 OK | GET, PUT, PATCH exitosos |
| 201 Created | POST exitoso |
| 204 No Content | DELETE exitoso |
| 400 Bad Request | Error de validación en body/query |
| 401 Unauthorized | Token faltante o inválido |
| 403 Forbidden | Sin permisos para el recurso |
| 404 Not Found | Recurso no existe |
| 409 Conflict | Regla de negocio violada (cupo, prerrequisito, horario) |
| 422 Unprocessable Entity | Datos semánticamente inválidos |
| 429 Too Many Requests | Rate limit excedido |
| 500 Internal Server Error | Error inesperado |

---

## Ejemplos de request/response

### POST /auth/login
```json
// Request
{ "email": "juan.perez@academia.edu", "password": "MiPassword123" }

// Response 200
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "juan.perez@academia.edu",
    "role": "student"
  }
}

// Response 401
{ "error": { "code": "UNAUTHORIZED", "message": "Credenciales inválidas" } }
```

### POST /enrollments (inscripción con validaciones)
```json
// Request
{ "studentId": "uuid-student", "courseId": "uuid-course" }

// Response 201
{
  "id": "uuid-enrollment",
  "studentId": "uuid-student",
  "courseId": "uuid-course",
  "status": "enrolled",
  "enrollmentDate": "2026-05-11T10:00:00Z"
}

// Response 409 (choque horario)
{
  "error": {
    "code": "CONFLICT",
    "message": "El estudiante tiene un choque de horario",
    "details": [
      { "field": "courseId", "message": "El horario del curso coincide con el curso MAT101-2026-1 (lunes 08:00-10:00)" }
    ]
  }
}

// Response 409 (prerrequisito)
{
  "error": {
    "code": "CONFLICT",
    "message": "Prerrequisitos no cumplidos",
    "details": [
      { "field": "prerequisites", "message": "La asignatura requiere aprobar Matemáticas Básicas (nota mínima: 11)" }
    ]
  }
}
```

### GET /courses?page=1&pageSize=10
```json
// Response 200
{
  "data": [
    {
      "id": "uuid",
      "code": "MAT101-2026-1",
      "name": "Matemáticas I",
      "credits": 4,
      "maxCapacity": 40,
      "enrolledCount": 35,
      "status": "open",
      "teacher": { "id": "uuid", "fullName": "Dr. Carlos López" },
      "schedule": { "days": ["monday", "wednesday"], "startTime": "08:00", "endTime": "10:00" },
      "academicPeriod": { "id": "uuid", "name": "2026-1" }
    }
  ],
  "pagination": { "page": 1, "pageSize": 10, "total": 45, "totalPages": 5 }
}
```

### POST /grades (registrar calificación)
```json
// Request
{
  "enrollmentId": "uuid-enrollment",
  "evaluationType": "exam",
  "value": 16.5,
  "percentage": 30,
  "maxValue": 20,
  "observation": "Primer parcial"
}

// Response 201
{
  "id": "uuid-grade",
  "enrollmentId": "uuid-enrollment",
  "evaluationType": "exam",
  "value": 16.5,
  "percentage": 30,
  "maxValue": 20,
  "registeredAt": "2026-05-11T10:00:00Z"
}

// Response 400 (error de validación)
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "La suma de porcentajes supera el 100%",
    "details": [{ "field": "percentage", "message": "El total acumulado de porcentajes es 95%, agregar 30% excede el 100%" }]
  }
}
```
