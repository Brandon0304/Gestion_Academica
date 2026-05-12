# G_ACADEMICA

Sistema de gestión académica para administrar el ciclo de vida educativo: estudiantes, docentes, cursos, inscripciones, calificaciones, planes de estudio y reportes.

## Stack

| Tecnología | Uso |
|---|---|
| Node.js + TypeScript | Runtime y lenguaje |
| Express | Framework HTTP |
| PostgreSQL | Base de datos relacional |
| Prisma | ORM con tipado seguro |
| Vitest | Testing |
| Docker | Entorno de desarrollo |

## Requisitos

- Node.js 22+
- Docker (para PostgreSQL)
- npm

## Inicio rápido

```bash
# 1. Clonar e instalar dependencias
npm install

# 2. Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env según sea necesario

# 3. Iniciar PostgreSQL
docker compose up -d

# 4. Migrar BD y sembrar datos de prueba
npm run db:migrate
npm run db:seed

# 5. Iniciar backend
npm run dev
```

Servidor en `http://localhost:3000`. Documentación Swagger en `http://localhost:3000/api-docs`.

## Comandos principales

```bash
npm run dev              # Backend en desarrollo con hot-reload
npm run test             # Tests unitarios
npm run test:smoke:local # Smoke tests (reinicia servidor automáticamente)
npm run test:e2e         # Tests end-to-end
npm run lint             # Linter
npm run typecheck        # Verificación de tipos
npm run db:studio        # Prisma Studio (explorar BD)
```

## Arquitectura

Clean Architecture con 4 capas: **Domain** → **Application** → **Infrastructure** → **Presentation**.

```
src/
├── domain/         # Entidades, value objects, repositorios (interfaces)
├── application/    # Casos de uso, DTOs, puertos
├── infrastructure/ # Persistencia, auth, email, logging
├── presentation/   # Controladores, middleware, rutas, serializadores
└── shared/         # Errores, utilidades
```

Ver `docs/architecture.md` para detalle completo.

## Documentación

| Documento | Contenido |
|---|---|
| `docs/domain.md` | Modelo de dominio y reglas de negocio |
| `docs/architecture.md` | Arquitectura y decisiones técnicas |
| `docs/api-contracts.md` | Contratos de API REST |
| `docs/database.md` | Modelo de datos |
| `docs/testing.md` | Estrategia de pruebas |
| `docs/roadmap.md` | Estado del proyecto y sprints |
| `docs/decisions/` | ADRs (Architecture Decision Records) |

## Licencia

Proyecto interno — uso académico.
