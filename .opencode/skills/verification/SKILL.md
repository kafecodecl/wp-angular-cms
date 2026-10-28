---
name: verification
description: "Usar al validar cambios en wp-angular-cms: typecheck, build, tests, smoke tests de API y comprobaciones de rutas."
---

# Verificacion del proyecto

## Checks obligatorios

```bash
npm run typecheck
npm run build
npm test
```

Si el cambio es de un solo workspace, puedes empezar por ahi y luego ejecutar el total.

## Smoke tests de API

```bash
curl -s http://localhost:4001/health
curl -s http://localhost:4001/api/site | head -c 400
curl -s http://localhost:4001/api/posts | head -c 400
```

Login y sesion. `.env` guarda el hash, no la password; exporta la password solo en tu shell o pide al usuario que haga login en el navegador:

```bash
set -a; . ./.env; set +a
# export ADMIN_PASSWORD='...'  # solo en tu shell, nunca en el chat ni en un archivo
curl -s -c /tmp/cms.cookies -H 'Content-Type: application/json' \
  -d "{\"username\":\"$ADMIN_USERNAME\",\"password\":\"$ADMIN_PASSWORD\"}" \
  http://localhost:4001/api/auth/login
curl -s -b /tmp/cms.cookies http://localhost:4001/api/auth/me
curl -s -b /tmp/cms.cookies http://localhost:4001/api/admin/posts | head -c 400
```

Si no tienes la password, valida `GET /api/auth/me` sin cookie (debe dar 401) y deja el login manual al usuario.

## Rutas web

- `http://localhost:4200/` responde 200.
- `http://localhost:4200/admin/login` responde 200.
- `http://localhost:4200/admin` sin sesion redirige a login.

## Checklist de cierre

- [ ] Typecheck OK.
- [ ] Build OK.
- [ ] Tests OK.
- [ ] Endpoints afectados probados.
- [ ] Sin secretos en el diff.
- [ ] `DEVLOG.md` actualizado.
- [ ] `HANDOFF.md` actualizado si cambio el estado.
