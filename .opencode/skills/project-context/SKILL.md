---
name: project-context
description: Usar al iniciar o retomar trabajo en wp-angular-cms, cuando el usuario pide estado, contexto, handoff o continuidad. Carga la memoria del proyecto y evita incoherencias.
---

# Contexto persistente del proyecto

## Orden de lectura

1. `docs/context/HANDOFF.md` - snapshot mas reciente.
2. `docs/context/PROJECT_STATE.md` - arquitectura y funcionalidad implementada.
3. `docs/context/CONVENTIONS.md` - reglas de codigo y verificacion.
4. `docs/context/DECISIONS.md` - decisiones que no deben revertirse sin ADR.
5. `docs/context/DEVLOG.md` - historial; lee las ultimas 2-3 entradas.

Comprueba tambien `git status --short` y `git diff --stat`.

## Como resumir el estado

Responde en 5 lineas:

1. Que funciona hoy.
2. Que esta en curso o sin commitear.
3. Que esta roto o bloqueado.
4. Cual es el proximo paso acordado.
5. Que decision o riesgo hay que respetar.

## Resolucion de contradicciones

- El codigo es la fuente de verdad sobre lo implementado.
- `DECISIONS.md` manda sobre preferencias personales.
- Si el codigo contradice un doc, corrige el doc en el mismo cambio.
- Si falta informacion, dilo; no la inventes.

## Actualizacion

- Cambio de codigo -> entrada en `DEVLOG.md`.
- Cambio de estado/proximo paso -> `HANDOFF.md`.
- Cambio de arquitectura, contrato o seguridad -> `DECISIONS.md` + `PROJECT_STATE.md`.
- Cierre de sesion -> `/handoff` o delegar en `docs-keeper`.

No escribas secretos. Las credenciales viven en `.env`.
