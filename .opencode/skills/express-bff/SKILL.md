---
name: express-bff
description: "Usar cuando se trabaje en apps/api de wp-angular-cms: Express 5, capas, Zod, auth JWT/scrypt, cliente WordPress, errores y cache."
---

# Express BFF en wp-angular-cms

## Arquitectura por capas

```
routes/        validacion Zod + respuesta HTTP
wordpress/     service (dominio) + client (HTTP) + rest-base
middleware/    auth, error-handler
lib/           jwt, password, errors
config/        env validado con Zod
```

- Las rutas no llaman a WordPress directo: usan `wordpress/service`.
- El cliente HTTP centraliza base URL, Basic Auth y errores.
- Los contratos publicos viven en `packages/shared`.

## Entorno

Variables en `.env` (nombres, no valores):

- `PORT`, `CORS_ORIGINS`, `NODE_ENV`
- `JWT_SECRET`, `AUTH_COOKIE_NAME`, `AUTH_TOKEN_TTL_HOURS`
- `ADMIN_USERNAME`, `ADMIN_DISPLAY_NAME`, `ADMIN_PASSWORD_HASH`
- `WP_URL`, `WP_REST_PATH`, `WP_USER`, `WP_APP_PASSWORD`, `WP_API`, `WP_GRAPHQL_URL`
- `REDIS_URL`, `DATABASE_URL` (previstas, aun sin uso)

`apps/api/src/config/env.ts` valida con Zod. Si añades una variable, actualiza `.env.example`.

## Auth

- Login admin local: `POST /api/auth/login`.
- Password verificado con scrypt (`ADMIN_PASSWORD_HASH`).
- Sesion: JWT en cookie `cms_session` httpOnly, sameSite lax, 8 h.
- Rate limit en login (10 intentos / 15 min).
- `requireAuth` protege `/api/admin/**`.
- No cambies el modelo de auth sin ADR.

## Errores

- Lanza `AppError` con status y codigo.
- `error-handler` traduce a JSON `{ error: { code, message } }`.
- No filtres stack traces ni detalles de WordPress en produccion.

## Cache (pendiente)

- No añadir cache sin definir claves e invalidacion.
- Plan: Redis para contenido publico, invalidar en escrituras admin.
- Mide antes de optimizar; documenta TTL y estrategia.

## Verificacion

```bash
npm run typecheck --workspace apps/api
npm test
curl -s http://localhost:4001/health
```

Smoke de auth: login con credenciales de `.env`, comprobar cookie y `GET /api/auth/me`; luego `GET /api/admin/posts`.
