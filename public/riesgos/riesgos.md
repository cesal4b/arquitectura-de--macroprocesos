# Daruma — Gestión del Riesgo

Ciclo de vida (6 etapas, progresión lógica): **Configuración → Identificación → Análisis → Controles → Aprobación → Supervisión**.

## Roles (un mismo usuario puede asumir varios)
- **Líder**: gestión general del equipo.
- **Analizador**: evalúa impacto y probabilidad (Riesgo Inherente).
- **Controlador**: diseña, registra y califica efectividad de barreras.
- **Aprobador**: valida riesgo residual y autoriza el paso a supervisión.

## Etapa 0 — Definición de equipos (obligatoria antes de todo)
Riesgos → Definición de equipos → Nuevo. Sin equipo, el sistema no identifica al usuario y no podrá participar en ningún flujo.

## Etapa 1 — Contexto operativo (habilita el botón "Nuevo Riesgo")
Metodología: seleccione siempre **"Procesos"**. Nombre del contexto similar al del equipo/proceso.

## Etapa 2 — Identificación del riesgo
La información viene de la **Matriz Excel de riesgos** (SharePoint de transformación). Copie exactamente Código y Nombre.

### Causas y consecuencias
Daruma **no usa texto libre**: usa variables reutilizables (Elemento de Análisis → Nuevo).

## Etapa 3 — Análisis (Riesgo Inherente)
Evalúe el riesgo "puro", sin controles: ícono de cadena → Impacto y Probabilidad → Guardar.

## Etapa 4 — Registro y evaluación de controles
- Tipo: Preventivo o Detectivo. Estado: siempre "Activo" y "Obligatorio".
- Al evaluar el control, el sistema **recalcula automáticamente el riesgo residual**.

## Etapa 5 — Aprobación
El Aprobador revisa identificación, riesgo inherente, residual y controles.

## Etapa 6 — Supervisión (etapa final)
- Si el riesgo se materializa: menú 3 puntos → Materializar riesgo → cantidad, fecha, nota.
- Para inactivar un control obsoleto: desmarque "Obligatorio" (no se elimina; la trazabilidad queda preservada).

---
*Documento de apoyo generado a partir del instructivo oficial de Daruma — Gestión del Riesgo.*
