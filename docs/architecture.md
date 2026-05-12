# Arquitectura del Sistema — G_ACADEMICA

## Estilo arquitectónico

**Clean Architecture** (Arquitectura Hexagonal / Puertos y Adaptadores).

Se elige este estilo porque el dominio académico presenta las siguientes características que lo favorecen:

- **Reglas de negocio complejas y cambiantes**: cálculo de promedios ponderados, validación de prerrequisitos, detección de choques de horario. Estas reglas deben poder modificarse sin afectar la infraestructura.
- **Múltiples canales de entrada**: aunque comenzamos con REST API, el sistema podría exponerse como GraphQL, cola de mensajes o UI web. La lógica de negocio no debe acoplarse a HTTP.
- **Alta testabilidad**: los casos de uso deben poder probarse con repositorios en memoria, sin base de datos ni servidor HTTP.
- **Larga vida útil**: los sistemas académicos se mantienen por décadas. Separar el dominio de la infraestructura evita deuda técnica por obsolescencia de frameworks.

---

## Diagrama de capas

```
┌──────────────────────────────────────────────────────────────────┐
│                       INFRASTRUCTURE                              │
│                                                                   │
│  ┌─────────────┐  ┌──────────┐  ┌─────────┐  ┌───────────────┐  │
│  │ Persistence  │  │   Auth   │  │  Email  │  │    Config     │  │
│  │ (Prisma/DB)  │  │ (JWT)    │  │(Nodemailer)│  │ (env/var)    │  │
│  └──────┬───────┘  └────┬─────┘  └────┬────┘  └───────┬───────┘  │
│         │               │              │               │          │
│  ┌──────▼───────────────▼──────────────▼───────────────▼───────┐  │
│  │                     PRESENTATION                              │  │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐                │  │
│  │  │ Routes    │  │Controllers│  │Middleware │                │  │
│  │  │ (definición)│ │(handler)  │  │(auth,     │                │  │
│  │  │           │  │           │  │ validation)│                │  │
│  │  └───────────┘  └─────┬─────┘  └───────────┘                │  │
│  └────────────────────────┼──────────────────────────────────────┘  │
│                           │                                         │
│  ┌────────────────────────▼──────────────────────────────────────┐  │
│  │                   APPLICATION                                  │  │
│  │  ┌──────────────────┐  ┌──────────────────┐                   │  │
│  │  │   Use Cases      │  │      DTOs        │                   │  │
│  │  │ (orquestan flujo)│  │ (data transfer)  │                   │  │
│  │  └────────┬─────────┘  └──────────────────┘                   │  │
│  └───────────┼──────────────────────────────────────────────────────┘  │
│              │                                                         │
│  ┌───────────▼──────────────────────────────────────────────────────┐  │
│  │                      DOMAIN                                      │  │
│  │  ┌───────────┐  ┌──────────────┐  ┌──────────┐  ┌──────────┐   │  │
│  │  │ Entities  │  │ Value Objects│  │Services  │  │Repository│   │  │
│  │  │ (reglas)  │  │ (inmutables) │  │(domain)  │  │(interfaz)│   │  │
│  │  └───────────┘  └──────────────┘  └──────────┘  └──────────┘   │  │
│  │  ┌───────────┐                                                 │  │
│  │  │  Events   │                                                 │  │
│  │  └───────────┘                                                 │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Responsabilidades por capa

| Capa | Responsabilidad | ¿Puede depender de? |
|---|---|---|
| **Domain** | Entidades con reglas de negocio, value objects, interfaces de repositorio, eventos de dominio, servicios de dominio | Nada (es el centro) |
| **Application** | Casos de uso (orquestar flujo), DTOs, puertos de salida (interfaces para servicios externos) | Domain |
| **Infrastructure** | Implementaciones concretas de repositorios (Prisma/PostgreSQL), adaptadores de email, JWT, logger, configuración | Domain, Application |
| **Presentation** | Routes, controllers, middleware (auth, validación), serializers/deserializers | Application (solo casos de uso y DTOs) |

---

## Reglas de dependencia

1. **Las dependencias apuntan hacia adentro**: Presentation → Application → Domain. Infrastructure → Application/Domain.
2. **Domain no sabe nada de las demás capas**: no importa Express, Prisma, JWT ni ningún framework.
3. **Application desconoce la infraestructura**: solo conoce interfaces definidas en Domain (`StudentRepository`) o en sus propios puertos (`EmailSender`).
4. **La inyección de dependencias se configura en la entrada de la aplicación** (composición root), típicamente en `src/infrastructure/config/dependency-injection.ts`.
5. **Cruce entre módulos del mismo nivel**: un caso de uso puede llamar a otro caso de uso (Application → Application), pero no directamente a entidades de otro módulo sin pasar por su caso de uso.

---

## Módulos del sistema

| Módulo | Responsabilidad |
|---|---|
| **Estudiantes** | Gestión del ciclo de vida del estudiante: registro, actualización, consulta de historial, cambio de estado |
| **Docentes** | Gestión de docentes: registro, asignación a cursos, consulta de carga académica |
| **Cursos** | Creación, apertura, cierre de cursos; control de cupo; gestión de horarios y aulas |
| **Asignaturas** | Catálogo de asignaturas; definición de prerrequisitos; relación con plan de estudios |
| **Inscripciones** | Proceso de inscripción con validación de prerrequisitos, cupo y choque de horarios |
| **Calificaciones** | Registro de notas por evaluación; cálculo de nota final; generación de actas |
| **Períodos Académicos** | Gestión de ciclos lectivos; control de fechas de inscripción y actividad |
| **Planes de Estudio** | Definición y mantenimiento de estructuras curriculares |
| **Aulas** | Catálogo de espacios físicos disponibles para cursos |
| **Autenticación y Autorización** | Login, roles, permisos, gestión de sesiones |
| **Reportes** | Generación de reportes académicos, estadísticas, históricos |
| **Usuarios** | Cuentas de acceso, perfil, cambio de contraseña |

---

## Justificación vs Atributos de Calidad

| Atributo | Impacto de Clean Architecture |
|---|---|
| **Mantenibilidad** | Alto — cambiar de ORM, framework HTTP o BD requiere cambios localizados en Infrastructure sin tocar Domain ni Application |
| **Testabilidad** | Alto — los casos de uso se testean con implementaciones mock/in-memory de repositorios; no se necesita levantar BD ni servidor HTTP |
| **Escalabilidad** | Medio — la separación en módulos permite extraer bounded contexts a microservicios si es necesario, pero el monolito modular es suficiente para el alcance actual |
| **Seguridad** | Medio — la validación y autorización se implementan como middleware en Presentation y como policies en Application, manteniendo el dominio libre de preocupaciones de seguridad |
| **Observabilidad** | Medio — el logging y la trazabilidad se implementan en Infrastructure como adaptadores; los casos de uso emiten eventos que el logger consume |
