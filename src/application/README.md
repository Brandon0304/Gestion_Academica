# application/ — Capa de aplicación

**Responsabilidad**: Orquestar flujos completos coordinando repositorios y servicios
de dominio. Cada caso de uso ejecuta una operación atómica del negocio.

**Depende de**: domain/

**No depende de**: infrastructure/, presentation/

## Contenido

- **use-cases/** — Casos de uso (uno por operación, ej: `RegisterStudentUseCase`)
- **dtos/** — Objetos de transferencia de datos (entrada/salida)
- **ports/** — Interfaces para servicios externos (EmailSender, FileStorage, etc.)
