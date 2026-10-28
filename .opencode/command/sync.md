---
description: Lee el contexto del proyecto y reporta estado, riesgos y proximo paso sin modificar archivos.
agent: orchestrator
---

Sincroniza el contexto de wp-angular-cms:

1. Lee `docs/context/HANDOFF.md`, `PROJECT_STATE.md`, `CONVENTIONS.md` y las ultimas entradas de `DEVLOG.md`.
2. Revisa `git status --short` y `git diff --stat`.
3. Compara lo documentado con el codigo actual y señala contradicciones.

Responde en 5 lineas: que funciona, que esta en curso, que esta roto, proximo paso y riesgo/decision a respetar. No modifiques archivos.
