## Objetivo

Eliminar la pestaña **Procedimientos** del panel admin y fusionar toda su funcionalidad dentro de **Ficha del proceso**, para evitar la duplicidad que actualmente hace ver la información repetida.

## Alcance

En `src/routes/_authenticated/admin.tsx`:

1. **Quitar la pestaña "Procedimientos"** de la barra de tabs (línea 158) y su `TabsContent` correspondiente (línea 165). No se elimina el componente `ProcedimientosTab` todavía — su contenido se traslada.

2. **Renombrar la pestaña "Ficha del proceso"** a **"Ficha de procesos"** (plural), que será la vista unificada.

3. **Fusionar el contenido dentro de `FichaTab`**, conservando el orden y estilo del screenshot adjunto:
   - **Encabezado**: título + subtítulo *"Registra los procedimientos formales de cada proceso y su avance"* y a la derecha las acciones: `+ Nuevo proceso`, `Expandir todo`, `Contraer todo`, `+ Nuevo procedimiento`.
   - **Tarjetas de métricas** (fila superior): Macroprocesos, Procesos totales, Procesos con procedimientos (X / Y), Procedimientos totales (con desglose "N en catálogo · N registrados") — usando el conteo único ya corregido.
   - **Listado unificado** por macroproceso → proceso. Cada proceso muestra en un solo bloque:
     - Datos de la ficha (líderes responsables, descripción, propósito, avance, estado, fecha objetivo, notas) con botón **Editar ficha**.
     - Sus procedimientos asociados (catálogo + registrados dedupe) con acciones **Nuevo procedimiento / Adjuntar / Editar / Eliminar** y sus campos actuales (responsable, avance, diagrama, estado, entrega).
   - Mantener los diálogos existentes (crear/editar proceso, crear/editar procedimiento) intactos.

4. **Limpieza**: eliminar la definición de `ProcedimientosTab` una vez trasladada la lógica, para no dejar código muerto. Reutilizar los helpers y hooks que hoy usa (`mergedMacros`, `catalogoProcedimientos`, `totalProcedimientosUnicos`, contadores, handlers de diálogos).

## Fuera de alcance

- Cambios de datos, esquema o RLS.
- Cambios en otras pestañas (Dashboard, Avance, Entrenamiento, Accesos).
- Cambios visuales al topbar/layout general.

## Resultado esperado

Una sola pestaña **Ficha de procesos** que sirve tanto para gestionar la ficha del proceso como sus procedimientos, sin duplicidad de secciones ni de conteos.
