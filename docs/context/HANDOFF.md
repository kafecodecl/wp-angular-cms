# Handoff - wp-angular-cms

> Snapshot: 2026-10-27
> Este archivo se reemplaza en cada cierre. El historial vive en `DEVLOG.md`.

## Estado actual

- El monorepo funciona: API en `:4001` (PID 16803), Angular en `:4200` (PID 16801) y WordPress local conectado.
- Dev server en segundo plano: PID 16700. Log: `/tmp/wp-angular-cms-dev.log`.
- Auth admin, contenido publico y CRUD de posts implementados y verificados.
- Arquitectura agentica de opencode activa: 6 agentes, 6 skills, 4 comandos y hook `dev-journal`.
- Git sincronizado: `main` = `origin/main` en `678c7af`, arbol limpio, remoto SSH `git@github.com:kafecodecl/wp-angular-cms.git`.
- WordPress local: instalacion stock 7.1.3 en `~/Documents/Proyectos/wordpress-sites/anguldpress` (symlink desde XAMPP), sin tema/plugin/mu-plugin propio y sin `uploads/`.
- Contenido WordPress: 2 posts (`hello-world`, `prueba`), 1 page (`sample-page`), 0 media, 1 categoria, 0 tags, sin menus ni ACF.
- WordPress no se versiona en el repo (ADR-009).

## Ultimo trabajo

- Publicacion en GitHub: `7489f35` (bootstrap), `ec17293` y `678c7af` (docs). `origin` cambiado a SSH.
- Autenticacion SSH resuelta con `ssh-add --apple-use-keychain ~/.ssh/id_ed25519`; GitHub responde `Hi kafecodecl!`.
- `README.md` raiz con stack, estructura, comandos, variables y endpoints.
- Auditoria del sitio WordPress: confirmado que es una instalacion stock sin diseno ni contenido propio, asi que **no hay nada que migrar**.
- Decision registrada: WordPress queda fuera del monorepo (ADR-009).
- Documentos actualizados: `PROJECT_STATE.md`, `DECISIONS.md`, `DEVLOG.md` y este `HANDOFF.md`.

## Verificado

- `npm run typecheck` OK, `npm run build` OK (1 ruta prerender), `npm test` OK (2/2), el 2026-10-27.
- `git ls-remote --heads origin` devuelve `refs/heads/main` en `678c7af`; `git status -sb` muestra `## main...origin/main` sin divergencia.
- Conteos via REST (`X-WP-Total`): posts 2, pages 1, media 0, categories 1, tags 0.
- Commit `7489f35` con 89 archivos; `.env`, `node_modules/`, `dist/` y `.opencode/state/` fuera; scan de patrones de secretos sin hallazgos.
- Estado de API/web heredado: login 200, credenciales invalidas 401, admin posts 200, crear 201, editar 200, borrar 200.

## En curso / pendiente

- Nada a medias en codigo: la sesion se cerro antes de empezar el siguiente hito.
- ADR-010 y rutas publicas con datos en servidor.
- Ampliar admin: pages, media, categorias y tags.
- Cache Redis con invalidacion.
- Tests de API y e2e del flujo admin.
- Endurecer produccion: HTTPS, secretos, CORS, CSRF, backups y observabilidad.

## Proximo paso concreto

1. Delegar en `architect` el ADR-010: que se resuelve en servidor (resolver + `TransferState`), render modes por ruta y manejo de 404/errores en SSR.
2. Implementar rutas publicas: home con ultimos posts, `/blog/:slug`, `/pagina/:slug` y `/categoria/:slug`, usando los 2 posts y la page existentes.
3. Smoke test SSR: `curl` al HTML renderizado debe incluir contenido (no solo `afterNextRender`) y el build debe seguir pasando.

## Como retomar

```bash
cd /Users/felipehrnndz/wp-angular-cms
git status && git log --oneline -3
ssh-add --apple-use-keychain ~/.ssh/id_ed25519   # solo si el push falla
ps -p 16700 >/dev/null || npm run dev
npm run typecheck && npm run build && npm test
```

Si el dev server no esta activo, `npm run dev` levanta API y web. WordPress debe estar corriendo en XAMPP.

Si el push falla por `Permission denied (publickey)`, recargar la clave SSH (tiene passphrase y no persiste entre reinicios).

## Riesgos y decisiones vigentes

- La config de opencode es de proyecto: solo aplica si se abre opencode desde esta carpeta.
- No commitear ni hacer push sin pedido explicito.
- No guardar secretos en docs ni en el journal.
- Application Passwords sobre HTTP solo en local; produccion requiere HTTPS.
- El SSR/prerender publico aun no consume datos en build; la home consulta en cliente. Resolver en ADR-010.
- WordPress no versionado (ADR-009): un clone del monorepo no levanta el CMS.
- El dev server en segundo plano muere al reiniciar la maquina; el PID cambia.
