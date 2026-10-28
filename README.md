# wp-angular-cms

CMS headless con WordPress como backend de contenido, Express como BFF y Angular 22 como frontend publico (SSR) y panel de administracion.

WordPress nunca se expone al navegador: el frontend solo habla con el BFF.

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

- Node >= 22 y npm workspaces (`apps/api`, `apps/web`, `packages/shared`).
- API: Express 5, TypeScript, Zod, jose, scrypt, pino, helmet, cors, compression, express-rate-limit.
- Web: Angular 22 standalone, signals, SSR (`@angular/ssr`), Vitest.
- CMS: WordPress local en XAMPP.
- Tipos compartidos: `@cms/shared`.

## Estructura

```
apps/api/            Express 5 + TypeScript (BFF)
apps/web/            Angular 22 standalone + SSR
packages/shared/     tipos y contratos compartidos
docs/context/        memoria persistente del proyecto
.opencode/           agentes, skills, comandos y hooks
```

## Comandos

```bash
npm install
npm run dev          # API :4001 + Angular :4200
npm run dev:api      # solo API
npm run dev:web      # solo web
npm run build
npm run typecheck
npm test
npm run hash-password -w @cms/api -- "tu-password"
```

## Configuracion

Copia `.env.example` a `.env` y define tus valores. Los secretos viven solo en `.env` (ignorado por git).

Variables: `NODE_ENV`, `PORT`, `CORS_ORIGINS`, `JWT_SECRET`, `AUTH_COOKIE_NAME`, `AUTH_TOKEN_TTL_HOURS`, `ADMIN_USERNAME`, `ADMIN_DISPLAY_NAME`, `ADMIN_PASSWORD_HASH`, `WP_URL`, `WP_USER`, `WP_APP_PASSWORD`, `WP_REST_PATH`, `WP_API`, `WP_GRAPHQL_URL`, `REDIS_URL`, `DATABASE_URL`.

`REDIS_URL` y `DATABASE_URL` estan previstas pero aun no se usan. Las Application Passwords de WordPress solo se usan desde el servidor y requieren HTTPS en produccion.

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

## Verificacion

```bash
npm run typecheck && npm run build && npm test
```

## Estado y contexto

La memoria del proyecto vive en `docs/context/`:

- `HANDOFF.md`: estado actual y proximo paso.
- `PROJECT_STATE.md`: vision, estructura y funcionalidad.
- `DECISIONS.md`: ADRs.
- `DEVLOG.md`: historial cronologico.
- `CONVENTIONS.md`: convenciones de codigo y documentacion.
