# Daruma — Módulo de Gestión Documental

Ciclo de vida (5 fases inalterables): **Solicitud → Configuración → Elaboración → Revisión → Publicación/Aprobación**.

## Roles
- **Administrador General**: controla el flujo maestro, configura metadatos críticos, ejecuta la publicación.
- **Elaborador**: redacta contenido en HTML, inserta imágenes, aplica correcciones.
- **Revisor**: evalúa sin editar la fuente; inserta sugerencias y comentarios.
- **Aprobador**: firma el avance final, valida seguridad, otorga estatus "Vigente".

## Paso 1 — Crear Solicitud (cualquier usuario)
1. Descripción detallada (tipo exacto de documento, nombre, objetivos).
2. Subtipo: **"Creación de nuevo documento"** (obligatorio para documentos nuevos).
3. Área de destino y proceso (si ya existe).
4. Siguiente responsable: generalmente el Administrador General.
5. Fecha de cierre (informativa). Guardar.

## Paso 2 — Crear Documento en "Pro Documental" (Administrador General)
- Tipo de documento primero (asigna la Plantilla automáticamente).
- **Advertencia crítica**: NO modifique Código, Versión, Fecha de vigencia ni Plantilla — se asignan automáticamente.
- Referencia de codificación: **siempre "V1"** para documentos nuevos.
- Configurar equipo (Administrador, Elaboradores, Revisores, Aprobadores). **Punto de no retorno**: al guardar el equipo, los roles quedan sellados.

## Paso 3 — Elaboración
- Editor HTML nativo. Para imágenes: Snipping Tool → copiar → pegar (Ctrl+V).
- Guardar inmediatamente después de insertar imágenes.
- "Firmar elaboración" → "Avanzar a revisión".

## Paso 4 — Revisión
- **Sugerencias** (forma): rojo = eliminado, verde = nuevo.
- **Comentarios** (fondo): observaciones sin modificar el texto.
- Si hay observaciones: "Devolver a elaboración". Si está bien: "Firmar revisión" → "Avanzar a control de cambios".

## Paso 5 — Publicación
- Control de versiones: si no hay cambio de versión, "No aplica" en justificación y cambios.
- Niveles de publicación: **Público** / **Institucional** (recomendado) / **Privado**.
- "Avanzar aprobación" → "Firmar aprobación" → documento queda **Vigente**.

---
*Documento de apoyo generado a partir del instructivo oficial de Daruma — Gestión Documental.*
