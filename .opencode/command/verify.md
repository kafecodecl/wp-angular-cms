---
description: Ejecuta typecheck, build y tests del monorepo y reporta resultados.
agent: reviewer
---

Verifica el estado actual de wp-angular-cms:

1. Ejecuta `npm run typecheck`.
2. Ejecuta `npm run build`.
3. Ejecuta `npm test`.
4. Si hay endpoints afectados, haz un smoke test con `curl` contra `http://localhost:4001`.
5. Revisa que no haya secretos en el diff.

No edites archivos. Reporta comandos, resultados y veredicto (aprobar / aprobar con cambios / rechazar).
