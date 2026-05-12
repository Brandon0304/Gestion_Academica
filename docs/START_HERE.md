# START_HERE — Guía de inicio para el agente

## Orden de lectura al iniciar una sesión nueva

1. **AGENTS.md** — leer completo para entender gobierno, reglas y principios
2. **docs/architecture.md** — entender la arquitectura y reglas de dependencia
3. **docs/domain.md** — entender el modelo de dominio y reglas de negocio
4. **docs/roadmap.md** — saber en qué sprint estamos y qué sigue
5. **docs/api-contracts.md** — solo si el objetivo involucra endpoints REST
6. **docs/database.md** — solo si el objetivo involucra persistencia
7. **docs/decisions/ADR-*.md** — leer los ADRs relevantes al módulo actual
8. **README.md de la carpeta src/modules/<modulo>** — entender el módulo específico

> Si ya conoces los documentos anteriores de una sesión previa, revisa solo los
> ADRs nuevos y la sección de roadmap actualizada.

---

## Checklist de verificación antes de escribir código

Antes de crear o modificar cualquier archivo, verifica:

- [ ] Leí AGENTS.md y entiendo los principios y antipatrones
- [ ] Revisé los ADRs existentes que puedan afectar mi decisión
- [ ] Identifiqué la capa donde va el cambio (Domain / Application / Infrastructure / Presentation)
- [ ] Verifiqué que el cambio no rompe las reglas de dependencia
- [ ] Identifiqué qué patrón de diseño aplica y puedo justificarlo vs. Atributos de Calidad
- [ ] Verifiqué que el cambio no introduce antipatrones prohibidos (God Object, Anemic Domain, lógica en controladores, etc.)
- [ ] Revisé si existen convenciones de código para el archivo que voy a crear/modificar
- [ ] Si la decisión es significativa: ¿necesito un ADR nuevo?
- [ ] Verifiqué que el stack que asumo coincide con `package.json`, `tsconfig.json`, etc.

---

## Plantilla de prompt de inicio

```
El módulo actual es: [nombre del módulo]
El objetivo es: [qué se va a implementar]
La iteración actual es: [Sprint X]
El stack activo es: [Node/TS, Express/Fastify, Prisma/Drizzle, PostgreSQL]
ADR relevantes: [ADR-XXX, ADR-YYY]
```

---

## Recordatorio de principios y antipatrones

### Principios que aplicar siempre

| Principio | Pregunta de verificación |
|---|---|
| **SRP** | ¿Esta clase/módulo tiene solo una razón de cambiar? |
| **OCP** | ¿Puedo extender el comportamiento sin modificar código existente? |
| **LSP** | ¿Puedo intercambiar implementaciones sin romper tests? |
| **ISP** | ¿Las interfaces son específicas y pequeñas? |
| **DIP** | ¿Las dependencias apuntan hacia adentro (Domain)? |

### Antipatrones que rechazar siempre

| Antipatrón | Cómo detectarlo |
|---|---|
| **God Object** | Clase con >10 métodos o >200 líneas |
| **Anemic Domain Model** | Entidad con solo getters/setters, sin métodos de negocio |
| **Lógica en controller** | `if` con reglas de negocio en el handler HTTP |
| **Dependencia circular** | Módulo A importa B y B importa A (directa o transitivamente) |
| **Magic string** | `if (role === 'admin')` en vez de `if (role === UserRole.ADMIN)` |
| **SQL fuera del repo** | Consultas a BD desde use cases o controllers |
| **`any`** | Cualquier uso de `any` en TypeScript |
| **Catch silencioso** | `catch (e) {}` o solo `console.error(e)` |

---

## Proceso de 7 pasos para decisiones difíciles

```
1. IDENTIFICAR  → 2. INVESTIGAR  → 3. EVALUAR  → 4. DECIDIR  → 5. DOCUMENTAR  → 6. IMPLEMENTAR  → 7. VERIFICAR
```

Si en cualquier momento no estás seguro de una decisión, vuelve al paso 1 y
verifica que el problema está bien definido antes de buscar soluciones.
