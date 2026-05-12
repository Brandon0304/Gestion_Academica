# ADR-006 — Pruebas de Integración y Smoke Tests

**Estado**: Aceptado
**Fecha**: 2026-05-12
**Contexto**: El proyecto contaba con 61 tests unitarios que verificaban casos de uso y entidades de forma aislada, pero no había pruebas que verificaran el sistema funcionando de forma integrada (API real + base de datos real + autenticación real). No existía una forma automatizada de verificar que todos los endpoints respondían correctamente después de un deploy.

**Opciones consideradas**:

1. **Smoke tests con Vitest contra Docker**: Pruebas que ejecutan requests HTTP reales contra el stack completo en Docker, usando Vitest como runner. Elegido porque reusa el mismo tooling de testing existente.

2. **Postman/Newman collection**: Usar la colección Postman existente con Newman. Descartado porque requiere mantener un formato de prueba diferente y no se integra bien con el pipeline de CI actual.

3. **Supertest con base de datos de prueba**: Usar Supertest para hacer requests HTTP contra la app Express sin levantar Docker completo. Descartado porque no prueba la configuración real de producción (Dockerfile, migrations, seed).

**Decisión**: Se implementaron las siguientes pruebas y configuraciones:

### Smoke Tests
- Archivo: `tests/smoke/integration.smoke.test.ts`
- Usa Vitest con `fetch` nativo para hacer requests HTTP reales contra la API.
- Configurable via variable de entorno `API_URL` (default: `http://localhost:3000`).
- Grupos de pruebas:
  - **Health**: verifica que `GET /health` responde `200` con `db: 'connected'`.
  - **Auth & RBAC**: login con todos los roles (admin, teacher, student, secretary), verifica `GET /auth/me`, verifica que `GET /users` requiere admin.
  - **Data-level RBAC**: verifica que un estudiante solo ve su propio perfil, que no puede acceder a otros perfiles, que un docente solo ve sus cursos.
  - **CRUD Endpoints**: prueba creación y consulta de estudiantes, docentes, periodos académicos, materias.
  - **Request ID**: verifica que todas las respuestas incluyen `X-Request-ID`.
  - **Error handling**: verifica que errores incluyen `requestId`.

### Script de Smoke Test
- `scripts/smoke-test.sh`: script bash que espera a que la API esté saludable (polling con timeout de 60s) y luego ejecuta los smoke tests.
- Comando: `npm run test:smoke`

### Docker Compose de Testing
- `docker-compose.test.yml` actualizado con tres servicios:
  - `postgres-test`: PostgreSQL 16 aislado (puerto 5433).
  - `backend-test`: build del backend con migrations + seed.
  - `smoke-test`: ejecuta los smoke tests contra `backend-test`.
- Comando: `npm run test:integration`

**Consecuencias**:
- Positivo: verificación automatizada del stack completo antes de cada deploy.
- Positivo: detección temprana de regresiones en la API, autenticación y RBAC.
- Positivo: reuso del runner Vitest existente (sin nuevas herramientas).
- Positivo: los smoke tests se ejecutan en CI dentro del pipeline de GitHub Actions.
- Negativo: los tests de integración son más lentos (~2-3 minutos incluyendo build de Docker).
- Negativo: dependencia de Docker para ejecutar tests de integración.

**Atributos de calidad afectados**:
- **Confiabilidad**: mejora significativa — verificación real del stack antes de cada release.
- **Mantenibilidad**: mejora — los smoke tests actúan como documentación viva de los flujos críticos.
- **Testabilidad**: mejora — cobertura de pruebas a nivel de integración que complementa los tests unitarios.
