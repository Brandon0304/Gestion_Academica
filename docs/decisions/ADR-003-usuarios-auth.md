# ADR-003 — Gestión de Usuarios, Auto-Registro y Perfil

**Estado**: Aceptado
**Fecha**: 2026-05-12
**Contexto**: El sistema solo permitía login con usuarios precargados desde el seed. No había forma de listar, editar roles, activar/desactivar usuarios desde la interfaz administrativa. Tampoco existía auto-registro para estudiantes ni cambio de contraseña. El refresh token se generaba pero no había endpoint para renovar el access token.

**Opciones consideradas**:
1. CRUD completo de usuarios con `findAll` paginado en el repositorio — elegido.
2. Auto-registro como caso de uso separado que crea User + Student simultáneamente — elegido.
3. Cambio de contraseña con validación de contraseña actual — elegido por seguridad.
4. Refresh token endpoint que verifica el token y emite uno nuevo — elegido (simple, reuse `verifyToken`).

**Decisión**: Se implementaron cuatro nuevas funcionalidades:
- **User CRUD**: `ListUsersUseCase` + `UpdateUserUseCase` (permite cambiar rol y estado activo/inactivo). Endpoints `GET /users` y `PATCH /users/:id`, ambos protegidos para admin.
- **Auto-registro**: `RegisterStudentUseCase` que crea User (rol student) + Student en una transacción lógica. Devuelve JWT directamente. Endpoint público `POST /auth/register`.
- **Cambio de contraseña**: `ChangePasswordUseCase` que verifica la contraseña actual antes de actualizar. Endpoint `POST /auth/change-password` (autenticado).
- **Refresh token**: `RefreshTokenUseCase` que verifica el refresh token y emite un nuevo access token. Endpoint público `POST /auth/refresh-token`.

**Consecuencias**:
- Positivo: administradores pueden gestionar usuarios desde el frontend.
- Positivo: estudiantes pueden registrarse sin intervención admin.
- Positivo: renovación de tokens sin necesidad de relogueo.
- Negativo: el auto-registro no tiene verificación de email (captcha/email confirmation sería deseable en producción).
- Negativo: no hay rate-limiting específico en el endpoint de refresh token.

**Atributos de calidad afectados**: Seguridad (cambio de contraseña con validación, roles protegidos), Mantenibilidad (cada feature es un caso de uso), Escalabilidad (listado paginado de usuarios).
