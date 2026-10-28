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

## 2026-10-27 - Commit inicial y sincronizacion con GitHub

- **Objetivo**: publicar el proyecto en `https://github.com/kafecodecl/wp-angular-cms.git`.
- **Cambios**: `README.md` raiz (stack, estructura, comandos, variables, endpoints); commit `7489f35` con 89 archivos; `origin` configurado y rama renombrada a `main`.
- **Estado del remoto**: repo creado pero vacio (`size: 0`, sin refs). El README del comando `echo "# wp-angular-cms" >> README.md` no llego a publicarse, asi que se creo desde cero.
- **Verificacion**: `npm run typecheck` OK, `npm run build` OK (1 ruta prerender), `npm test` 2/2; `.env` ignorado y scan de patrones de secretos sin hallazgos.
- **Bloqueo**: `git push -u origin main` falla con `could not read Username for 'https://github.com'`. No hay credenciales: keychain sin `github.com`, `gh` no instalado y `~/.ssh/id_ed25519.pub` sin autorizar.
- **Pendientes**: autenticar GitHub y ejecutar el push; auditoria de WordPress.

## 2026-10-27 - Push inicial a GitHub

- **Objetivo**: publicar `main` en el remoto.
- **Cambios**: `origin` cambiado a SSH (`git@github.com:kafecodecl/wp-angular-cms.git`); `git push -u origin main` publicado `7489f35` y `ec17293`.
- **Verificacion**: `git ls-remote --heads origin` devuelve `refs/heads/main` en `ec17293`; la API de GitHub lista `README.md`, `apps/`, `packages/`, `docs/` y `.opencode/` en la raiz; `main` local sin divergencia (`## main...origin/main`).
- **Nota**: la clave `~/.ssh/id_ed25519` tiene passphrase y requiere `ssh-add --apple-use-keychain` tras reiniciar sesion.
- **Pendientes**: auditoria de WordPress.

## 2026-10-27 - Auditoria de WordPress y cierre de sesion

- **Objetivo**: decidir el alcance del repo respecto al sitio WordPress.
- **Hallazgos**: instalacion stock 7.1.3 (114 MB, 98 MB de core), temas Twenty Twenty-Three/Four/Five y Akismet, sin `uploads/` ni codigo propio; contenido 2 posts, 1 page, 0 media, 1 categoria, 0 tags, sin menus ni ACF. El document root es un symlink a `~/Documents/Proyectos/wordpress-sites/anguldpress`.
- **Decision**: WordPress no se versiona en el monorepo (ADR-009). No hay diseno ni contenido que migrar: el sitio publico se disena desde cero.
- **Verificacion**: `git status` limpio, `main` = `origin/main` en `678c7af`; conteos via REST (`X-WP-Total`).
- **Pendientes**: ADR-010 (estrategia de datos SSR/SEO) y rutas publicas; admin de pages/media/categorias/tags; cache Redis; tests de API/e2e.
