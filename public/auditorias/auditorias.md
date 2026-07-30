# Daruma — Auditorías

Arquitectura: **Programa de Auditoría** (contenedor maestro) → Auditorías individuales anidadas. **Regla fundamental: siempre crear el Programa antes de cualquier auditoría.**

## Roles principales
- **Auditor Líder/Coordinador**: aprueba la planeación y concluye la auditoría. No ejecuta directamente.
- **Auditor**: planea sesiones, crea lista de chequeo, registra hallazgos.
- **Auditado**: acepta o rechaza hallazgos y formula planes de acción.

Un usuario no puede auto-asignarse todos los roles; el auditor no puede auditar su propio proceso.

## Tipos
- **Internas**: 8 etapas, participan los 3 roles, 100% gestionadas en Daruma.
- **Externas**: 4 etapas; el ente regulador no tiene acceso a Daruma, el usuario interno transcribe los hallazgos.

## Programa de auditoría
Programación → Nuevo → Nombre, Objetivo, Alcance, Criterios (ej. ISO 9001:2015) → Guardar.

## Auditoría interna — 8 etapas
1. **Planeación** (Auditor): parámetros, requisitos/criterios, sesión de inicio.
2. **Aprobación del plan** (Auditor Líder).
3. **Lista de chequeo** (Auditor): se genera automáticamente según los requisitos.
4. **Ejecución** (Auditor): registrar hallazgos (conforme/no conforme/oportunidad de mejora).
5. **Aceptación de hallazgos** (Auditado): obligatoria, o el flujo se bloquea.
6. **Aprobación intermedia** (Auditor Líder).
7. **Tratamiento de hallazgos** (Auditado): crear plan de acción para no conformidades.
8. **Evaluación y conclusión** (Auditor Líder): **punto de no retorno**, no se puede editar después de cerrar.

## Auditoría externa — 4 etapas
Registrar hallazgos del informe físico → Tratamiento (si aplica plan de acción) → Conclusión (ícono de rayo) → Informe PDF.

---
*Documento de apoyo generado a partir del instructivo oficial de Daruma — Auditorías.*
