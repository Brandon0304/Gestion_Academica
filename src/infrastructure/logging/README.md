# infrastructure/logging/ — Logger

**Responsabilidad**: Logger estructurado (JSON) con niveles y correlación por request.
Implementa la interfaz Logger definida en application/ports/.

Formato de log:
```json
{ "level": "info", "timestamp": "2026-05-11T10:00:00Z", "requestId": "uuid", "message": "...", "context": {} }
```
