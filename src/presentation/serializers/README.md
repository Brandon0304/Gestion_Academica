# presentation/serializers/ — Serializadores

Transforman entidades/DTOs del dominio en respuestas JSON para la API.

Cada módulo tiene su serializer:
- **student.serializer.ts**
- **course.serializer.ts**
- etc.

Los serializers son funciones puras que reciben un objeto de dominio/DTO y devuelven
un objeto JSON plano. No hacen consultas ni contienen lógica de negocio.
