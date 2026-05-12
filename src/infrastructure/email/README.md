# infrastructure/email/ — Servicio de correo

**Responsabilidad**: Implementar la interfaz EmailSender (definida en application/ports/)
usando Nodemailer o un servicio transaccional (SendGrid, AWS SES).

Eventos que disparan emails:
- Bienvenida al estudiante registrado
- Confirmación de inscripción
- Notificación de calificaciones
- Recuperación de contraseña
