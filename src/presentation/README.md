# presentation/ — Capa de presentación

**Responsabilidad**: Recibir requests HTTP y devolver respuestas. Conecta el
mundo exterior con los casos de uso de la aplicación.

**Depende de**: application/

**No contiene**: lógica de negocio, consultas a BD, ni reglas del dominio.

## Contenido

- **controllers/** — Handlers que reciben req y llaman casos de uso
- **routes/** — Definición de rutas y middleware asociado
- **middleware/** — Autenticación, validación (Zod/Joi), rate limiting
- **serializers/** — Transformación de entidades/DTOs a responses JSON
