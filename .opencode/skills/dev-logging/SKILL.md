---
name: dev-logging
description: Usar al terminar una tarea, tomar una decision de arquitectura o cerrar una sesion en wp-angular-cms. Registra el trabajo en DEVLOG, DECISIONS y HANDOFF para poder retomarlo.
---

# Registro de desarrollo

## Cuando registrar

- Al terminar una tarea o un cambio significativo.
- Al tomar una decision estructural (stack, auth, cache, contratos, despliegue).
- Al cerrar una sesion o antes de un handoff.
- No registres micro-ediciones ni comandos irrelevantes.

## Entrada de DEVLOG

Añade al final de `docs/context/DEVLOG.md`:

```md
## YYYY-MM-DD - Titulo corto

- **Objetivo**: que se buscaba.
- **Cambios**: archivos/areas y que se hizo.
- **Decisiones**: enlaces a ADR si aplica.
- **Verificacion**: comandos y resultados (p. ej. typecheck OK, tests 2/2).
- **Pendientes**: lo que queda o riesgos.
```

## ADR en DECISIONS

Solo para decisiones que no deberian revertirse sin discusion:

```md
## ADR-NNN - Titulo

- **Fecha**: YYYY-MM-DD
- **Estado**: aceptada | reemplazada por ADR-NNN
- **Contexto**: problema y restricciones.
- **Decision**: que se eligio.
- **Consecuencias**: beneficios, costos y riesgos.
```

## Handoff

`docs/context/HANDOFF.md` es un snapshot, no un historial. Reemplaza su contenido con:

- Fecha y hora.
- Estado actual (funciona / en curso / roto).
- Ultimos cambios.
- Verificacion ejecutada.
- Proximo paso concreto.
- Riesgos y decisiones vigentes.
- Como retomar (comandos).

## Reglas

- No incluyas passwords, tokens ni valores de `.env`.
- No inventes resultados: copia los comandos y su salida real.
- Si algo quedo a medias, dilo explicitamente.
- Mantén las fechas en ISO `YYYY-MM-DD`.
