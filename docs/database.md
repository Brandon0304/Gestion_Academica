# Modelo de Datos — G_ACADEMICA

> Documento generado a partir del modelo de dominio. Pendiente de validación
> contra el schema de base de datos real cuando exista.

---

## Convenciones generales

- **IDs**: UUID v4 para todas las tablas. Razón: evitar enumeración secuencial, facilitar migraciones distribuidas y prevenir colisiones en integraciones futuras.
- **Timestamps**: toda tabla incluye `created_at`, `updated_at`. Donde aplique, `deleted_at` para soft delete.
- **Soft delete**: se usa `deleted_at` (timestamp nulo = activo, no nulo = eliminado lógico). Las consultas siempre filtran `WHERE deleted_at IS NULL` por defecto.
- **Encoding**: UTF-8 para todos los campos de texto.
- **Nombres**: `snake_case` para columnas y tablas. En plural para tablas.

---

## Entidades y campos

### `students`
| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK, default uuid_generate_v4() | Identificador único |
| first_name | VARCHAR(100) | NOT NULL | Nombre |
| last_name | VARCHAR(100) | NOT NULL | Apellido |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Correo institucional |
| document_id | VARCHAR(20) | NOT NULL, UNIQUE | Documento de identidad |
| birth_date | DATE | | Fecha de nacimiento |
| phone | VARCHAR(20) | | Teléfono de contacto |
| address | TEXT | | Dirección |
| enrollment_date | DATE | NOT NULL | Fecha de ingreso |
| status | ENUM('active','inactive','graduated','suspended') | NOT NULL, DEFAULT 'active' | Estado del estudiante |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| deleted_at | TIMESTAMPTZ | NULLABLE | Soft delete |

### `teachers`
| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| first_name | VARCHAR(100) | NOT NULL | |
| last_name | VARCHAR(100) | NOT NULL | |
| email | VARCHAR(255) | NOT NULL, UNIQUE | |
| document_id | VARCHAR(20) | NOT NULL, UNIQUE | |
| specialty | VARCHAR(255) | | Especialidad académica |
| degree | VARCHAR(255) | | Título máximo |
| hire_date | DATE | NOT NULL | Fecha de contratación |
| status | ENUM('active','inactive') | NOT NULL, DEFAULT 'active' | |
| created_at | TIMESTAMPTZ | NOT NULL | |
| updated_at | TIMESTAMPTZ | NOT NULL | |
| deleted_at | TIMESTAMPTZ | NULLABLE | |

### `subjects`
| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| code | VARCHAR(20) | NOT NULL, UNIQUE | Código de la asignatura |
| name | VARCHAR(200) | NOT NULL | |
| description | TEXT | | |
| credits | INTEGER | NOT NULL, CHECK(credits > 0) | Créditos académicos |
| theory_hours | INTEGER | DEFAULT 0 | Horas teóricas semanales |
| practice_hours | INTEGER | DEFAULT 0 | Horas prácticas semanales |
| study_plan_id | UUID | FK → study_plans(id) | Plan de estudios al que pertenece |
| created_at | TIMESTAMPTZ | NOT NULL | |
| updated_at | TIMESTAMPTZ | NOT NULL | |
| deleted_at | TIMESTAMPTZ | NULLABLE | |

### `study_plans`
| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| name | VARCHAR(200) | NOT NULL | |
| code | VARCHAR(20) | NOT NULL, UNIQUE | |
| description | TEXT | | |
| year | INTEGER | NOT NULL, CHECK(year >= 1900) | Año de vigencia |
| total_credits | INTEGER | NOT NULL, CHECK(total_credits > 0) | |
| status | ENUM('draft','active','replaced') | NOT NULL, DEFAULT 'draft' | |
| created_at | TIMESTAMPTZ | NOT NULL | |
| updated_at | TIMESTAMPTZ | NOT NULL | |
| deleted_at | TIMESTAMPTZ | NULLABLE | |

### `prerequisites`
| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| subject_id | UUID | FK → subjects(id), NOT NULL | Asignatura que requiere el prerrequisito |
| prerequisite_id | UUID | FK → subjects(id), NOT NULL | Asignatura prerrequisito |
| type | ENUM('required','recommended') | NOT NULL, DEFAULT 'required' | |
| created_at | TIMESTAMPTZ | NOT NULL | |

Índice único compuesto: `(subject_id, prerequisite_id)`.

### `academic_periods`
| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| name | VARCHAR(100) | NOT NULL | Ej: "2026-1", "Semestre A 2026" |
| start_date | DATE | NOT NULL | Inicio del período |
| end_date | DATE | NOT NULL, CHECK(end_date > start_date) | Fin del período |
| enrollment_start | DATE | NOT NULL | Inicio de inscripciones |
| enrollment_end | DATE | NOT NULL, CHECK(enrollment_end > enrollment_start) | Fin de inscripciones |
| status | ENUM('planned','active','closed') | NOT NULL, DEFAULT 'planned' | |
| created_at | TIMESTAMPTZ | NOT NULL | |
| updated_at | TIMESTAMPTZ | NOT NULL | |
| deleted_at | TIMESTAMPTZ | NULLABLE | |

### `classrooms`
| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| code | VARCHAR(20) | NOT NULL, UNIQUE | Código del aula (ej: "A-101") |
| name | VARCHAR(100) | | Nombre descriptivo |
| capacity | INTEGER | NOT NULL, CHECK(capacity > 0) | Capacidad máxima |
| type | ENUM('classroom','laboratory','workshop') | NOT NULL, DEFAULT 'classroom' | |
| location | VARCHAR(255) | | Edificio/ubicación |
| created_at | TIMESTAMPTZ | NOT NULL | |
| updated_at | TIMESTAMPTZ | NOT NULL | |
| deleted_at | TIMESTAMPTZ | NULLABLE | |

### `courses`
| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| code | VARCHAR(20) | NOT NULL, UNIQUE | Código del curso (ej: "MAT101-2026-1") |
| name | VARCHAR(200) | NOT NULL | |
| description | TEXT | | |
| credits | INTEGER | NOT NULL, CHECK(credits > 0) | |
| max_capacity | INTEGER | NOT NULL, CHECK(max_capacity > 0) | Cupo máximo de estudiantes |
| subject_id | UUID | FK → subjects(id), NOT NULL | Asignatura asociada |
| teacher_id | UUID | FK → teachers(id), NOT NULL | Docente a cargo |
| academic_period_id | UUID | FK → academic_periods(id), NOT NULL | Período académico |
| classroom_id | UUID | FK → classrooms(id) | Aula asignada |
| schedule | JSONB | | Horario (ver detalle abajo) |
| status | ENUM('open','closed','in_progress','finished') | NOT NULL, DEFAULT 'open' | |
| created_at | TIMESTAMPTZ | NOT NULL | |
| updated_at | TIMESTAMPTZ | NOT NULL | |
| deleted_at | TIMESTAMPTZ | NULLABLE | |

Índice: `(subject_id, academic_period_id)` para evitar duplicados del mismo curso en el mismo período.

Estructura del JSONB `schedule`:
```json
{
  "days": ["monday", "wednesday"],
  "start_time": "08:00",
  "end_time": "10:00"
}
```
[POR DEFINIR: si se requiere soporte multip jornada o bloques]

### `enrollments`
| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| student_id | UUID | FK → students(id), NOT NULL | |
| course_id | UUID | FK → courses(id), NOT NULL | |
| enrollment_date | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| status | ENUM('enrolled','approved','failed','withdrawn') | NOT NULL, DEFAULT 'enrolled' | |
| final_grade | DECIMAL(5,2) | CHECK(final_grade IS NULL OR final_grade >= 0) | Nota final (calculada) |
| created_at | TIMESTAMPTZ | NOT NULL | |
| updated_at | TIMESTAMPTZ | NOT NULL | |
| deleted_at | TIMESTAMPTZ | NULLABLE | |

Índice único: `(student_id, course_id)` — un estudiante no puede inscribirse dos veces al mismo curso.

### `grades`
| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| enrollment_id | UUID | FK → enrollments(id), NOT NULL | |
| evaluation_type | VARCHAR(50) | NOT NULL | Ej: "exam", "quiz", "project", "homework" |
| value | DECIMAL(5,2) | NOT NULL, CHECK(value >= 0) | Nota obtenida |
| percentage | DECIMAL(5,2) | NOT NULL, CHECK(percentage > 0 AND percentage <= 100) | Porcentaje del total |
| max_value | DECIMAL(5,2) | NOT NULL, DEFAULT 20 | Valor máximo posible (ej: 20) |
| observation | TEXT | | |
| registered_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| created_at | TIMESTAMPTZ | NOT NULL | |
| updated_at | TIMESTAMPTZ | NOT NULL | |

Índice: `(enrollment_id)` para consultas rápidas de todas las notas de una inscripción.

### `users`
| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| email | VARCHAR(255) | NOT NULL, UNIQUE | |
| password_hash | VARCHAR(255) | NOT NULL | Hash bcrypt |
| role | ENUM('admin','directive','teacher','student','secretary') | NOT NULL | |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | |
| last_login | TIMESTAMPTZ | | |
| created_at | TIMESTAMPTZ | NOT NULL | |
| updated_at | TIMESTAMPTZ | NOT NULL | |
| deleted_at | TIMESTAMPTZ | NULLABLE | |

### `student_users` (tabla de unión polimórfica)
| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| user_id | UUID | PK, FK → users(id) | |
| student_id | UUID | PK, FK → students(id) | |
| created_at | TIMESTAMPTZ | NOT NULL | |

### `teacher_users` (tabla de unión polimórfica)
| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| user_id | UUID | PK, FK → users(id) | |
| teacher_id | UUID | PK, FK → teachers(id) | |
| created_at | TIMESTAMPTZ | NOT NULL | |

---

## Relaciones (Cardinalidad)

```
students 1────────N enrollments N────────1 courses
                                                   │
teachers 1────────N courses                        │
                                                   1
subjects 1────────N courses                        │
                                                   │
subjects 1────────N prerequisites N────────1 subjects (autorreferencial)
                                                   1
study_plans 1─────N subjects                       │
                                                   │
academic_periods 1─N courses                       │
                                                   │
classrooms 1───────N courses                       │
                                                   │
enrollments 1──────N grades                        │
                                                   │
users 1────────────1 students (opcional vía student_users)
users 1────────────1 teachers (opcional vía teacher_users)
```

---

## Índices recomendados

| Índice | Tabla | Columnas | Razón |
|---|---|---|---|
| idx_enrollments_student | enrollments | student_id | Buscar inscripciones de un estudiante |
| idx_enrollments_course | enrollments | course_id | Buscar inscritos en un curso |
| idx_courses_period | courses | academic_period_id | Filtrar cursos por período |
| idx_courses_teacher | courses | teacher_id | Carga horaria del docente |
| idx_grades_enrollment | grades | enrollment_id | Todas las notas de una inscripción |
| idx_subjects_plan | subjects | study_plan_id | Asignaturas de un plan |
| idx_prerequisites_subject | prerequisites | subject_id | Prerrequisitos de una asignatura |
| idx_users_email | users | email | Búsqueda por email (login) |
| idx_unique_enrollment | enrollments | (student_id, course_id) | Evitar doble inscripción |
| idx_unique_prerequisite | prerequisites | (subject_id, prerequisite_id) | Evitar prerrequisitos duplicados |

---

## Decisiones de diseño

| Decisión | Opción elegida | Alternativa descartada | Motivo |
|---|---|---|---|
| **Tipo de ID** | UUID v4 | Auto-increment INT | Los UUID permiten exponer IDs en APIs sin exponer información secuencial; evitan colisiones en migraciones distribuidas |
| **Soft delete** | `deleted_at` timestamp | DELETE físico | Auditoría y recuperación de datos; las consultas por defecto excluyen eliminados |
| **Timestamps** | `created_at`, `updated_at`, `deleted_at` | Solo created_at | Trazabilidad completa de cambios |
| **Horario en cursos** | JSONB | Tabla separada `schedules` | Los horarios son simples (día + hora inicio + hora fin); JSONB evita joins innecesarios y permite flexibilidad |
| **Enums** | Enum nativo de PostgreSQL | VARCHAR con CHECK | Tipado fuerte a nivel BD, evita valores inválidos |
| **Polimorfismo Usuario** | Tablas de unión (student_users, teacher_users) | Columna `user_id` nullable en students y teachers | Una persona puede ser estudiante y docente a la vez; las tablas de unión evitan columnas nulas y permiten roles múltiples |
| **Nota final** | Columna calculada en enrollments | Cálculo siempre en tiempo real | Almacenar la nota final evita recalcular cada consulta; se actualiza cuando cambian las calificaciones |
| **Decimales** | DECIMAL(5,2) | FLOAT o REAL | Precisión exacta para calificaciones; evita errores de redondeo |
