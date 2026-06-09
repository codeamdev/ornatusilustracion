# Ornatus — Instrucciones para Claude Code

## Regla de deploy

**Antes de cualquier deploy al servidor** (git pull + docker compose en producción), verifica siempre:

1. Ejecutar `git status` localmente — confirmar que no hay cambios sin commitear
2. Si hay cambios modificados o untracked relevantes al feature en curso, hacer commit y push PRIMERO
3. Solo entonces conectar al servidor y hacer `git pull`

**Por qué:** los cambios sin commitear no viajan con el pull. Se pierden cuando el servidor queda en el estado del remote y los archivos locales no commiteados nunca llegan.

Flujo correcto:
```
git add ... && git commit && git push   # local primero
ssh cafeteria "cd /srv/... && git pull && docker compose down && docker compose build && docker compose up -d"
```
