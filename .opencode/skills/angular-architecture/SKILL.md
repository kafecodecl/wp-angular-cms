---
name: angular-architecture
description: "Usar cuando se trabaje en apps/web de wp-angular-cms: Angular 22 standalone, signals, SSR, rutas, panel admin, proxy o estilos."
---

# Angular en wp-angular-cms

## Version y modo

- Angular 22 con componentes standalone y SSR (`@angular/ssr`).
- `apps/web/src/app/app.routes.server.ts` define render modes.
- Rutas publicas: SSR/prerender.
- Rutas `/admin/**`: `RenderMode.Client` (dependen de cookie de sesion).
- `allowedHosts` en `angular.json`: `localhost`, `127.0.0.1`.

## Estructura

```
src/app/
  app.routes.ts          rutas publicas y admin
  app.routes.server.ts   render modes
  app.config.ts          providers (router, http, hydration)
  core/
    api.service.ts       wrapper de HttpClient hacia /api
    auth.service.ts      login/logout/me con signals
    auth.guard.ts        proteccion de /admin
  pages/
    home/                sitio publico
    login/               /admin/login
    admin/               panel CRUD
```

## Convenciones

- Componentes standalone; importa solo lo que usan.
- `ChangeDetectionStrategy.OnPush` por defecto en paginas.
- Signals para estado local y de sesion; `computed` para derivados.
- Servicios `providedIn: 'root'` en `core/`.
- `HttpClient` con `withCredentials: true` para la cookie `cms_session`.
- No llames a WordPress directo: usa `/api`.
- Tipos compartidos desde `packages/shared`; no los dupliques.
- Formularios admin: validacion en cliente + errores del BFF.

## Desarrollo

- Proxy: `apps/web/proxy.conf.json` envia `/api` y `/health` a `http://localhost:4001`.
- `npm run dev` arranca API y web con `concurrently`.
- Web en `:4200`, API en `:4001`.

## Verificacion

```bash
npm run typecheck --workspace apps/web
npm run build --workspace apps/web
```

Si tocaste rutas o SSR, prueba `/`, `/admin/login` y `/admin` (redirige a login sin sesion).
