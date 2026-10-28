---
name: wordpress-headless
description: Usar cuando se trabaje con WordPress REST, autenticacion, posts, pages, media, categorias, tags o el sitio local localhost/anguldpress en wp-angular-cms.
---

# WordPress headless en este proyecto

## Entorno local

- Sitio: `http://localhost/anguldpress` (XAMPP).
- Document root: `/Applications/XAMPP/htdocs/anguldpress`.
- WordPress 7.1.3 con permalinks planos.
- REST base: `http://localhost/anguldpress/index.php/wp-json`.
- `WP_REST_PATH=index.php/wp-json` en `.env`; `apps/api/src/wordpress/rest-base.ts` autodetecta si falta.
- Application Password del usuario `WP_USER` en `.env` (nunca en el navegador).
- `wp-config.php` tiene `define('WP_ENVIRONMENT_TYPE', 'local');` para permitir Application Passwords sobre HTTP local. **No replicar en produccion.**

## Endpoints usados por el BFF

| Proposito | WordPress |
| --- | --- |
| Posts | `/wp/v2/posts` |
| Post por slug | `/wp/v2/posts?slug=...` |
| Pages | `/wp/v2/pages` |
| Media | `/wp/v2/media` |
| Categorias | `/wp/v2/categories` |
| Tags | `/wp/v2/tags` |
| Usuario autenticado | `/wp/v2/users/me` |

El BFF expone estos datos en `/api/site`, `/api/posts`, `/api/posts/:slug`, `/api/pages`, `/api/pages/:slug`, `/api/media`, `/api/categories`, `/api/tags` y `/api/wp/me`.

## Autenticacion

- Lectura publica: sin credenciales (si el sitio lo permite).
- Escritura/admin: Basic Auth con Application Password, solo desde `apps/api`.
- El frontend nunca recibe `WP_APP_PASSWORD`.
- Prueba manual sin exponer el secreto:

```bash
set -a; . ./.env; set +a
curl -s -u "$WP_USER:$WP_APP_PASSWORD" "$WP_URL/$WP_REST_PATH/wp/v2/users/me" | head -c 400
```

## Gotchas

- Si el REST devuelve 404, comprueba `WP_REST_PATH` y que Apache tenga `mod_rewrite`; con permalinks planos usa `/index.php/wp-json`.
- Application Passwords requieren HTTPS o entorno `local`; en produccion usa HTTPS.
- Los medios requieren subida binaria y cabeceras `Content-Disposition`; aun no implementado en el admin.
- Revisa si el tema usa ACF u otros campos antes de migrar el diseno; documenta el modelo en `PROJECT_STATE.md`.
- Respeta HTML de WordPress: sanitiza o confia solo en contenido de editores autorizados.

## Verificacion

```bash
curl -s http://localhost:4001/health
curl -s http://localhost:4001/api/site | head -c 400
curl -s http://localhost:4001/api/posts | head -c 400
```
