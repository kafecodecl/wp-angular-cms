---
description: Actualiza la memoria del proyecto y genera un handoff para retomar sin incoherencias.
agent: docs-keeper
---

Actualiza la memoria de wp-angular-cms con el trabajo de esta sesion:

1. Revisa `git status --short`, `git diff --stat` y los archivos cambiados.
2. Añade una entrada al final de `docs/context/DEVLOG.md` con objetivo, cambios, verificacion y pendientes.
3. Reemplaza el snapshot de `docs/context/HANDOFF.md` con el estado actual y el proximo paso concreto.
4. Si hubo una decision estructural nueva, añadela a `docs/context/DECISIONS.md`.
5. Si cambio la arquitectura, endpoints o auth, actualiza `docs/context/PROJECT_STATE.md`.

No inventes resultados ni incluyas secretos. Devuelve un resumen de 5 lineas.
