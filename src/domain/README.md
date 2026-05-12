# domain/ — Capa de dominio

**Responsabilidad**: Contiene las entidades del negocio con sus reglas, value objects
inmutables, interfaces de repositorio, servicios de dominio y eventos de dominio.

**No depende de**: ninguna otra capa. Es el centro del sistema.

## Contenido

- **entities/** — Entidades del dominio con comportamiento encapsulado
- **value-objects/** — Objetos inmutables (Email, DNI, RangoNotas, Horario, etc.)
- **services/** — Operaciones que no pertenecen a una sola entidad
- **repositories/** — Interfaces que la infraestructura implementa
- **events/** — Eventos de dominio para comunicación desacoplada
