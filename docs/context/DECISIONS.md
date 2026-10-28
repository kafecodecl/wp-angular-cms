# Decisiones de arquitectura (ADR)

> Solo decisiones que no deberian revertirse sin discusion. Formato: contexto, decision, consecuencias.

## ADR-001 - WordPress headless + Express BFF + Angular

- **Fecha**: 2026-10-27
- **Estado**: aceptada
- **Contexto**: se migra un sitio WordPress existente y se quiere conservar el CMS para edicion, pero con un frontend moderno y controlado.
- **Decision**: WordPress queda como backend de contenido; Express actua como BFF y unica puerta; Angular 22 sirve el sitio publico (SSR) y el admin.
- **Consecuencias**: desacopla el frontend y permite cache/seguridad centralizados. Añade una capa que mantener y exige definir contratos claros.

## ADR-002 - Autodeteccion de la base REST de WordPress

- **Fecha**: 2026-10-27
- **Estado**: aceptada
- **Contexto**: el sitio local usa permalinks planos y la REST queda en `/index.php/wp-json`, mientras que otros entornos usan `/wp-json`.
- **Decision**: `WP_REST_PATH` es opcional; si falta, `rest-base.ts` prueba `wp-json` y `index.php/wp-json` y cachea el resultado.
- **Consecuencias**: funciona en local y en produccion sin cambios de codigo. Si ambos fallan, el error indica configurar `WP_REST_PATH`.

## ADR-003 - Application Password solo en el servidor

- **Fecha**: 2026-10-27
- **Estado**: aceptada
- **Contexto**: el BFF necesita escribir en WordPress, pero el navegador no debe tener credenciales del CMS.
- **Decision**: `WP_USER` y `WP_APP_PASSWORD` viven en `.env` y solo los usa `apps/api`. En local se habilita `WP_ENVIRONMENT_TYPE=local` para permitir Application Passwords sobre HTTP.
- **Consecuencias**: el frontend nunca ve secretos. En produccion es obligatorio HTTPS y no se debe usar el modo `local`.

## ADR-004 - Auth admin local en el BFF

- **Fecha**: 2026-10-27
- **Estado**: aceptada
- **Contexto**: no se quiere acoplar la sesion del admin a las cookies de WordPress ni exponer el login de WP.
- **Decision**: auth local con `ADMIN_USERNAME` + hash scrypt, JWT en cookie httpOnly (`cms_session`), sameSite lax, TTL 8 h y rate limit en login.
- **Consecuencias**: admin independiente y sencillo. Hay que gestionar el hash, CSRF si cambia el origen y rotacion de `JWT_SECRET`.

## ADR-005 - Contratos compartidos en `packages/shared`

- **Fecha**: 2026-10-27
- **Estado**: aceptada
- **Contexto**: API y web comparten formas de datos y respuestas.
- **Decision**: los tipos publicos viven en `@cms/shared`; ambos workspaces los importan.
- **Consecuencias**: evita duplicacion y desalineacion. Cambiar un contrato impacta a ambos lados y exige typecheck completo.

## ADR-006 - SSR publico y admin client-side

- **Fecha**: 2026-10-27
- **Estado**: aceptada
- **Contexto**: el sitio publico se beneficia de SSR/SEO; el admin depende de una cookie de sesion y no necesita indexarse.
- **Decision**: rutas publicas con `RenderMode.Prerender`; `/admin` y `/admin/**` con `RenderMode.Client`.
- **Consecuencias**: mejor SEO y carga publica; el admin es una SPA protegida. Al migrar el diseno hay que definir que datos se resuelven en servidor.

## ADR-007 - Memoria persistente con agentes, skills y hooks

- **Fecha**: 2026-10-27
- **Estado**: aceptada
- **Contexto**: las sesiones largas pierden contexto y repiten decisiones o rompen lo ya hecho.
- **Decision**: usar `AGENTS.md`, `docs/context/` como fuente de verdad, instrucciones persistentes en `opencode.json`, agentes especializados, skills por dominio, comandos de handoff/verificacion y un hook que registra actividad en `.opencode/state/activity.jsonl`.
- **Consecuencias**: retomar trabajo es mas fiable y auditable. Exige disciplina para actualizar DEVLOG/HANDOFF y reiniciar opencode tras cambiar la configuracion.

## ADR-008 - Git inicializado, commits bajo aprobacion

- **Fecha**: 2026-10-27
- **Estado**: aceptada
- **Contexto**: se necesita historial para auditar cambios y hacer handoff, pero no se deben crear commits sin revision.
- **Decision**: inicializar el repositorio y mantener `.env` y `.opencode/state/` fuera de git; los commits los autoriza el usuario.
- **Consecuencias**: hay base para `git diff` y para un primer commit revisado. Hasta que exista ese commit, el historial es local y no hay red de seguridad remota.

## ADR-009 - WordPress no se versiona en el monorepo

- **Fecha**: 2026-10-27
- **Estado**: aceptada
- **Contexto**: el sitio local es una instalacion stock de 114 MB (98 MB de core, temas por defecto, sin codigo propio) y su contenido vive en MySQL. Versionarlo arrastraria secretos de `wp-config.php`, actualizaciones de core y ruido en el diff.
- **Decision**: WordPress queda fuera de git. Solo se versionaria codigo propio (`wp-content/themes/<tema>`, `mu-plugins`, plugins propios) y, si hiciera falta reproducir el contenido, un dump sanitizado en `wordpress/` con el core y `wp-config.php` ignorados.
- **Consecuencias**: el repo se mantiene ligero y sin secretos. Reconstruir el CMS exige instalar WordPress 7.1.3 e importar el dump por separado; un clone del monorepo no levanta WordPress.
