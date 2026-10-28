# DEVLOG - wp-angular-cms

> Historial cronologico. Las entradas nuevas van al final. No incluir secretos.

## 2026-10-27 - Scaffolding del monorepo

- **Objetivo**: crear la base headless con npm workspaces.
- **Cambios**: `apps/api` (Express 5 + TypeScript), `apps/web` (Angular 22 + SSR), `packages/shared`, scripts raiz y `.env.example`.
- **Verificacion**: instalacion y builds iniciales.
- **Pendientes**: conectar WordPress y definir auth.

## 2026-10-27 - Conexion con WordPress local

- **Objetivo**: leer contenido real desde `http://localhost/anguldpress`.
- **Cambios**: cliente REST con Basic Auth, `wordpressService`, autodeteccion `wp-json` / `index.php/wp-json`, rutas publicas (`/api/site`, `/api/posts`, `/api/pages`, `/api/media`, `/api/categories`, `/api/tags`) y `/api/wp/me`.
- **WordPress**: se añadio `WP_ENVIRONMENT_TYPE=local` en `wp-config.php` (backup `wp-config.php.bak.20261027215900`) para Application Passwords en local.
- **Verificacion**: `/health` y endpoints de contenido responden con datos del sitio.
- **Pendientes**: auth del admin y CRUD.

## 2026-10-27 - Auth admin y CRUD de posts

- **Objetivo**: permitir administracion desde Angular sin exponer WordPress.
- **Cambios**: login/logout/me con JWT httpOnly y scrypt, rate limit, `requireAuth`, CRUD admin de posts, `AuthService`, `authGuard`, `/admin/login` y panel `/admin`.
- **Verificacion**: login 200, credenciales invalidas 401, listar 200, crear 201, editar 200, borrar 200; typecheck, build y tests (2) OK.
- **Pendientes**: pages, media, categorias/tags, cache y migracion del diseno.

## 2026-10-27 - Arquitectura agentica y memoria del proyecto

- **Objetivo**: mantener contexto persistente, registrar el desarrollo y retomar sin incoherencias.
- **Cambios**: `opencode.json` (agente por defecto e instrucciones), `AGENTS.md`, 6 agentes, 6 skills, 4 comandos, hook `dev-journal`, `docs/context/` y `.gitignore` para `.opencode/state/`. Se inicializo git sin commits.
- **Verificacion**: `npm run typecheck` OK, `npm run build` OK (1 ruta prerender), `npm test` 2/2; JSON de `opencode.json`, frontmatter YAML (16 archivos), sintaxis del plugin y redaccion de secretos OK. La carga en runtime de opencode queda pendiente hasta reiniciar.
- **Pendientes**: reiniciar opencode desde la raiz del proyecto, primer commit manual y auditoria de WordPress.
