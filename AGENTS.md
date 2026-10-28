# AGENTS.md - wp-angular-cms

## Objetivo del proyecto

Migrar el sitio WordPress de `http://localhost/anguldpress` a una arquitectura headless:

- **WordPress**: backend de contenido (posts, pages, media, categories, tags).
- **Express BFF** (`apps/api`): unica puerta al CMS, auth, validacion y cache.
- **Angular 22** (`apps/web`): sitio publico con SSR y panel admin client-side.

## Protocolo obligatorio de contexto

Antes de actuar en cualquier tarea:

1. Lee `docs/context/HANDOFF.md` y `docs/context/PROJECT_STATE.md`.
2. Revisa `docs/context/CONVENTIONS.md` y las ultimas entradas de `docs/context/DEVLOG.md`.
3. Consulta `docs/context/DECISIONS.md` antes de proponer cambios estructurales.
4. Si el codigo y los docs se contradicen, gana el codigo: corrige el doc en el mismo cambio.
5. No inventes endpoints, estado, credenciales ni resultados. Verifica con comandos.

Despues de cada cambio relevante:

1. Actualiza `docs/context/DEVLOG.md` (skill `dev-logging`).
2. Actualiza `docs/context/HANDOFF.md` si cambio el estado o el proximo paso.
3. Añade una decision a `docs/context/DECISIONS.md` si cambiaste arquitectura, contratos o seguridad.
4. Actualiza `docs/context/PROJECT_STATE.md` si cambio la estructura, endpoints o funcionalidad.

## Stack y layout

```
apps/api/            Express 5 + TypeScript (BFF)
  src/app.ts         composicion de middlewares y routers
  src/config/        validacion de entorno con Zod
  src/routes/        health, auth, admin, content
  src/wordpress/     cliente REST, servicio y autodeteccion de base
  src/middleware/    auth, manejo de errores
  src/lib/           jwt, password, errores
apps/web/            Angular 22 standalone + SSR
  src/app/core/      api.service, auth.service, auth.guard
  src/app/pages/     home, login, admin
packages/shared/     tipos y contratos compartidos
docs/context/        memoria persistente del proyecto
.opencode/           agentes, skills, comandos y hooks
```

## Comandos

```bash
npm run dev          # API :4001 + Angular :4200
npm run build        # build de todos los workspaces
npm run typecheck    # TypeScript de todo el monorepo
npm test             # tests
npm run hash-password -w @cms/api -- "tu-password"
```

## Reglas de ingenieria

- TypeScript estricto. Sin `any` innecesario.
- Validar entradas en los bordes con Zod.
- Errores de API con `AppError` y el middleware central.
- Angular standalone + signals. Componentes pequenos y tipados.
- SSR para rutas publicas; `RenderMode.Client` para `/admin/**`.
- WordPress no se expone al navegador: el frontend solo habla con el BFF.
- Secretos solo en `.env` (ignorado por git). Nunca en docs, codigo ni commits.
- No commitear, hacer push ni reescribir historia sin pedido explicito.

## Definicion de terminado

- `npm run typecheck` pasa.
- `npm run build` pasa.
- `npm test` pasa (si aplica).
- Smoke test de los endpoints afectados.
- `DEVLOG.md` actualizado y `HANDOFF.md` al dia.
- Sin secretos ni artefactos generados en el cambio.
