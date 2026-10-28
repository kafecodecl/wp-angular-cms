# Handoff - wp-angular-cms

> Snapshot: 2026-10-27
> Este archivo se reemplaza en cada cierre. El historial vive en `DEVLOG.md`.

## Estado actual

- El monorepo funciona: API en `:4001`, Angular en `:4200`, WordPress local conectado.
- El dev server esta corriendo en segundo plano (PID 16700). Log: `/tmp/wp-angular-cms-dev.log`.
- Auth admin, contenido publico y CRUD de posts estan implementados y verificados.
- Se añadio la arquitectura agentica de opencode (agentes, skills, comandos y hook de journal).
- Git fue inicializado, pero **no hay commits todavia**.

## Ultimo trabajo

- `opencode.json` con `default_agent: orchestrator` e instrucciones persistentes.
- `AGENTS.md` con protocolo de contexto y reglas.
- Subagentes: `orchestrator`, `architect`, `backend`, `frontend`, `reviewer`, `docs-keeper`.
- Skills: `project-context`, `dev-logging`, `wordpress-headless`, `angular-architecture`, `express-bff`, `verification`.
- Comandos: `/sync`, `/handoff`, `/verify`, `/log`.
- Hook `dev-journal` que registra eventos y cambios en `.opencode/state/activity.jsonl` (ignorado por git).
- Documentos de contexto en `docs/context/`.

## Verificado

- `npm run typecheck` OK.
- `npm run build` OK (1 ruta prerender).
- `npm test` OK (2/2).
- `opencode.json` JSON valido, frontmatter YAML de 16 archivos valido, sintaxis del plugin y redaccion de secretos OK.
- Estado de API/web heredado: login 200, admin posts 200, crear 201, editar 200, borrar 200.
- La carga en runtime de agentes/skills/plugin se confirma al reiniciar opencode desde la raiz.

## En curso / pendiente

- Reiniciar opencode desde la raiz del proyecto para que cargue `opencode.json`, agentes, skills y plugin.
- Auditar WordPress y migrar el diseno/contenido publico.
- Completar admin (pages, media, categorias, tags).
- Cache Redis e invalidacion.
- Tests de API y e2e.

## Proximo paso concreto

1. Salir de opencode y abrirlo desde `/Users/felipehrnndz/wp-angular-cms` (la config de proyecto se carga por directorio).
2. Ejecutar `/sync` para confirmar contexto.
3. Ejecutar `/verify` y, si pasa, hacer el primer commit manual del proyecto.
4. Empezar la auditoria de WordPress y documentar el inventario en `PROJECT_STATE.md`.

## Como retomar

```bash
cd /Users/felipehrnndz/wp-angular-cms
ps -p 16700 >/dev/null || npm run dev
npm run typecheck && npm run build && npm test
```

Si el dev server no esta activo, `npm run dev` levanta API y web. WordPress debe estar corriendo en XAMPP.

## Riesgos y decisiones vigentes

- La config de opencode es de proyecto: solo aplica si se abre opencode desde esta carpeta.
- No commitear ni hacer push sin pedido explicito.
- No guardar secretos en docs ni en el journal.
- Application Passwords sobre HTTP solo en local; produccion requiere HTTPS.
- El SSR publico aun no consume datos en build; definir estrategia SEO al migrar el diseno.
