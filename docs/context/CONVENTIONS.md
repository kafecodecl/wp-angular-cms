# Convenciones - wp-angular-cms

## Idioma

- Documentacion y comunicacion con el usuario: español.
- Codigo, nombres de variables, tipos y commits: ingles.
- Fechas en ISO `YYYY-MM-DD`.

## Comandos

```bash
npm run dev          # API + web
npm run dev:api
npm run dev:web
npm run build
npm run typecheck
npm test             # solo apps/web
npm run hash-password -w @cms/api -- "tu-password"
```

## API (apps/api)

- TypeScript estricto; imports con extension `.js`.
- Capas: `routes` -> `wordpress/service` -> `wordpress/client`.
- Validacion en el borde con Zod; no confies en `req.body`/`req.query`.
- Errores con `AppError`; el middleware central responde `{ error: { code, message } }`.
- No expongas detalles internos ni credenciales de WordPress.
- Nuevas variables de entorno: actualiza `env.ts` y `.env.example`.
- No añadas cache sin definir claves, TTL e invalidacion.

## Web (apps/web)

- Angular standalone; sin `NgModule`.
- `ChangeDetectionStrategy.OnPush` en paginas; signals para estado.
- Servicios en `core/` con `providedIn: 'root'`.
- `withCredentials: true` para rutas admin.
- No llames a WordPress: usa `/api`.
- Tipos desde `@cms/shared`; no dupliques contratos.
- Rutas publicas con SSR; `/admin/**` con `RenderMode.Client`.

## Seguridad

- Secretos solo en `.env`; nunca en docs, codigo, tests, commits ni mensajes.
- No commitear `.env`, `.opencode/state/` ni artefactos de build.
- Application Passwords solo desde el servidor y solo sobre HTTPS en produccion.
- No deshabilitar `helmet`, CORS ni rate limit sin justificacion y ADR.
- Revisar el diff en busca de tokens antes de cerrar una tarea.

## Git

- No commitear, hacer push, reset --hard ni reescribir historia sin pedido explicito.
- Commits pequenos y con mensaje en ingles, estilo conventional (`feat:`, `fix:`, `docs:`, `chore:`).
- Antes de commitear: `git status`, `git diff` y verificar que no haya secretos.

## Documentacion

- Cambio de codigo -> entrada en `DEVLOG.md`.
- Cambio de estado/proximo paso -> `HANDOFF.md`.
- Decision estructural -> `DECISIONS.md` + `PROJECT_STATE.md`.
- Si el codigo contradice un doc, corrige el doc en el mismo cambio.
- No inventes verificaciones: copia comandos y resultados reales.

## Verificacion

Antes de dar una tarea por terminada:

```bash
npm run typecheck
npm run build
npm test
```

Y un smoke test de los endpoints afectados. Si el cambio es solo de docs/config, indicalo y valida al menos el JSON/YAML afectado.
