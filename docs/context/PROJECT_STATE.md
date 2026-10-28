# Estado del proyecto - wp-angular-cms

> Ultima actualizacion: 2026-10-27
> Fuente de verdad: el codigo. Actualizar este documento al cerrar cada hito.

## Vision

Sitio headless con WordPress como CMS, Express como BFF y Angular 22 como frontend publico (SSR) y panel de administracion. WordPress nunca se expone al navegador.

```
Navegador / SSR Angular (:4200)
        |
        |  /api, /health (proxy en dev)
        v
Express BFF (:4001)  <-- unica salida al CMS
        |
        |  REST + Application Password
        v
WordPress (http://localhost/anguldpress)
```

## Stack

- Node >= 22 (entorno local: Node 24).
- npm workspaces: `apps/api`, `apps/web`, `packages/shared`.
- API: Express 5, TypeScript 6, Zod 4, jose, scrypt, pino, helmet, cors, compression, express-rate-limit, ioredis (previsto).
- Web: Angular 22, standalone components, signals, SSR (`@angular/ssr`), Vitest.
- CMS: WordPress 7.1.3 en XAMPP, permalinks planos, REST en `index.php/wp-json`.
- Tipos compartidos: `@cms/shared`.

## Estructura

```
apps/api/
  src/app.ts                 composicion de la app
  src/index.ts               arranque HTTP
  src/config/env.ts          validacion de entorno con Zod
  src/routes/                health, auth, admin, content
  src/wordpress/             client, service, rest-base
  src/middleware/            auth, error-handler
  src/lib/                   jwt, password, errors, logger
apps/web/
  src/app/core/              api.service, auth.service, auth.guard
  src/app/pages/             home, login, admin
  src/app/app.routes.ts      rutas
  src/app/app.routes.server.ts  render modes
packages/shared/
  src/index.ts               contratos y tipos
docs/context/                memoria persistente
.opencode/                   agentes, skills, comandos, hooks
```

## Funcionalidad implementada

### API

- `GET /health` con estado de WordPress y Redis (configurado/no configurado).
- Auth admin local: login, logout, sesion actual y rate limit.
- Contenido publico: site info, posts, post por slug, pages, page por slug, media, categorias y tags.
- Admin de posts contra WordPress: listar, obtener, crear, actualizar y eliminar.
- Cliente WordPress con Basic Auth, timeout y errores normalizados.
- Autodeteccion de la base REST (`wp-json` o `index.php/wp-json`).

### Web

- Home publica minima que consulta `/health` y `/api/site` en el cliente (`afterNextRender`).
- `/admin/login` con formulario y sesion via cookie.
- `/admin` protegido por `authGuard`, con listado, creacion, edicion y borrado de posts.
- SSR con `RenderMode.Prerender` para rutas publicas y `RenderMode.Client` para `/admin/**`.

### Shared

- Tipos `WPPost`, `WPPage`, `WPMedia`, `WPTerm`, `WPUser`, `WPSiteInfo`, `Paginated`, `PostInput`, `AuthUser`, `LoginResponse`, `HealthResponse`, `ServiceStatus`, `DeletePostResponse`.

## Endpoints del BFF

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| GET | `/health` | No | Salud de API y WordPress |
| POST | `/api/auth/login` | No | Login admin (rate limit) |
| POST | `/api/auth/logout` | No | Limpia cookie |
| GET | `/api/auth/me` | Cookie | Usuario de sesion |
| GET | `/api/site` | No | Info del sitio |
| GET | `/api/wp/me` | Basic WP | Usuario WP autenticado |
| GET | `/api/posts` | No | Lista paginada de posts |
| GET | `/api/posts/:slug` | No | Post por slug |
| GET | `/api/pages` | No | Lista paginada de pages |
| GET | `/api/pages/:slug` | No | Page por slug |
| GET | `/api/media` | No | Lista paginada de media |
| GET | `/api/categories` | No | Categorias |
| GET | `/api/tags` | No | Tags |
| GET | `/api/admin/posts` | Cookie | Lista admin (incluye borradores) |
| GET | `/api/admin/posts/:id` | Cookie | Post admin por ID |
| POST | `/api/admin/posts` | Cookie | Crear post |
| PUT | `/api/admin/posts/:id` | Cookie | Actualizar post |
| DELETE | `/api/admin/posts/:id` | Cookie | Borrar post (`?force=true` para definitivo) |

## Auth

- El admin del BFF es local, no es un usuario de WordPress.
- Credenciales en `.env`: `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` (scrypt).
- Sesion: JWT firmado con `jose`, cookie `AUTH_COOKIE_NAME` (`cms_session`), httpOnly, sameSite lax, `secure` en produccion, TTL `AUTH_TOKEN_TTL_HOURS` (8 h).
- Rate limit: 10 intentos / 15 min por IP en login.
- WordPress usa `WP_USER` + `WP_APP_PASSWORD` solo desde el servidor.

## WordPress local

- URL: `http://localhost/anguldpress`.
- Document root: symlink `/Applications/XAMPP/htdocs/anguldpress` -> `/Users/felipehrnndz/Documents/Proyectos/wordpress-sites/anguldpress`.
- Instalacion stock de WordPress 7.1.3 (114 MB): temas Twenty Twenty-Three/Four/Five, plugin Akismet, sin `uploads/`, sin tema, plugin ni mu-plugin propio.
- REST: `http://localhost/anguldpress/index.php/wp-json` (`WP_REST_PATH=index.php/wp-json`).
- `wp-config.php` define `WP_ENVIRONMENT_TYPE=local` para permitir Application Passwords sobre HTTP local. No usar en produccion.
- Backup de la config: `wp-config.php.bak.20261027215900`.
- Inventario de contenido (2026-10-27): 2 posts (`hello-world`, `prueba`), 1 page (`sample-page`), 0 media, 1 categoria (`Uncategorized`), 0 tags; sin menus ni ACF.
- No se versiona en este repo: core, `wp-config.php` y base de datos quedan fuera (ADR-009).

## Entorno

Variables en `.env` (solo nombres): `NODE_ENV`, `PORT`, `CORS_ORIGINS`, `JWT_SECRET`, `AUTH_COOKIE_NAME`, `AUTH_TOKEN_TTL_HOURS`, `ADMIN_USERNAME`, `ADMIN_DISPLAY_NAME`, `ADMIN_PASSWORD_HASH`, `WP_URL`, `WP_USER`, `WP_APP_PASSWORD`, `WP_REST_PATH`, `WP_API`, `WP_GRAPHQL_URL`, `REDIS_URL`, `DATABASE_URL`.

`REDIS_URL` y `DATABASE_URL` estan previstas pero aun no se usan.

## Como ejecutar

```bash
npm run dev          # API :4001 + web :4200
npm run dev:api      # solo API
npm run dev:web      # solo web
npm run build
npm run typecheck
npm test             # tests de apps/web
```

## Verificacion conocida

- Typecheck, build y tests (2) pasaron tras el ultimo cambio de codigo.
- Login admin: 200; credenciales invalidas: 401.
- Admin posts: listar 200, crear 201, editar 200, borrar 200.
- Dev server en segundo plano: PID 16700, log `/tmp/wp-angular-cms-dev.log`.

## Limitaciones y riesgos

- El WordPress local es una instalacion stock sin diseno ni contenido propio: no hay nada que migrar, el sitio publico se disena desde cero.
- El admin solo gestiona posts; faltan pages, media, categorias y tags.
- No hay subida de media desde el panel.
- Redis esta previsto pero no implementado; no hay cache ni invalidacion.
- No hay tests de API; `npm test` solo cubre `apps/web`.
- CSRF: la cookie es sameSite lax; si el admin se sirve cross-site, hace falta token CSRF.
- Application Passwords sobre HTTP solo es aceptable en local; produccion requiere HTTPS.
- El REST con permalinks planos depende de `WP_REST_PATH` o de la autodeteccion.
- El SSR/prerender publico no consulta la API en build (la home lo hace en cliente); falta decidir estrategia de datos para SEO (ADR-010).

## Proximos pasos

1. ADR-010: estrategia de datos SSR/SEO (resolver en servidor, `TransferState`, render modes por ruta).
2. Rutas publicas reales en Angular: home con ultimos posts, `/blog/:slug`, `/pagina/:slug` y `/categoria/:slug`.
3. Ampliar el admin: pages, media, categorias y tags.
4. Implementar cache Redis con invalidacion en escrituras.
5. Endurecer produccion: HTTPS, secretos, CORS, CSRF, backups y observabilidad.
6. Añadir tests de API y e2e del flujo admin.

## Archivos clave

- `apps/api/src/app.ts` - montaje de rutas y middlewares.
- `apps/api/src/config/env.ts` - contrato de entorno.
- `apps/api/src/wordpress/service.ts` - operaciones de contenido.
- `apps/api/src/wordpress/rest-base.ts` - autodeteccion REST.
- `apps/api/src/routes/admin.routes.ts` - CRUD admin.
- `apps/web/src/app/app.routes.ts` - rutas web.
- `apps/web/src/app/core/api.service.ts` - cliente del BFF.
- `packages/shared/src/index.ts` - contratos compartidos.
