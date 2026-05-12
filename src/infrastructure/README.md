# infrastructure/ — Capa de infraestructura

**Responsabilidad**: Implementar las interfaces definidas en domain/ y application/.
Conecta el sistema con el mundo exterior: base de datos, servicios de email, JWT, logger, etc.

**Depende de**: domain/, application/

## Contenido

- **persistence/** — Repositorios (Prisma/Drizzle), migrations, seeds
- **auth/** — JWT, hashing, guard/strategy
- **email/** — Adaptador SMTP (Nodemailer)
- **logging/** — Logger estructurado
- **config/** — Variables de entorno, inyección de dependencias, composición root
