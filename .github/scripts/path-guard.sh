#!/usr/bin/env bash
set -euo pipefail

: "${GH_REPO:?}" "${PR_NUMBER:?}" "${PR_AUTHOR:?}" "${CORE_OWNER:?}" "${OVERRIDE_LABEL:?}"

# ── Fuente única de verdad de la zona bloqueada (ERE, anclada al inicio).
#    Mantener alineada con .github/CODEOWNERS y eslint.config.zones.mjs.
#    La zona diseñadores es exactamente: components/{primitives,sections,views}/**,
#    app/**/page.meta.ts y public/** — todo lo demás cae en este patrón o
#    en la regla general de page.tsx/layout.tsx/route.ts bajo app/.
BLOCKED_ERE='^(packages/|proxy\.ts$|app/admin/|app/api/|app/.*/page\.tsx$|app/.*/layout\.tsx$|app/.*/route\.ts$|app/page\.tsx$|app/layout\.tsx$|app/sitemap\.ts$|app/robots\.ts$|app/not-found\.tsx$|app/globals\.css$|components/ui/|components/site/|components/blog/|lib/|scripts/|next\.config\.ts$|postcss\.config\.js$|vercel\.json$|package\.json$|pnpm-lock\.yaml$|pnpm-workspace\.yaml$|tsconfig\.json$|next-env\.d\.ts$|\.npmrc$|\.gitignore$|eslint\.config|\.env|\.github/|CLAUDE\.md$|docs/)'

echo "::group::Archivos del PR"
# .filename + previous_filename → cubre renames por ambos lados (un
# `git mv packages/cms-core/lib/prisma.ts app/foo.ts` se atrapa aunque el
# archivo nuevo esté fuera de la zona bloqueada).
mapfile -t FILES < <(
  gh api --paginate "repos/${GH_REPO}/pulls/${PR_NUMBER}/files" \
    --jq '.[] | .filename, (.previous_filename // empty)' | sort -u
)
printf '%s\n' "${FILES[@]}"
echo "::endgroup::"

if [ "${#FILES[@]}" -ge 3000 ]; then
  echo "::error::PR con >=3000 archivos: la API de GitHub trunca la lista. Fallando cerrado."
  exit 1
fi

VIOLATIONS=()
for f in "${FILES[@]}"; do
  if [[ "$f" =~ $BLOCKED_ERE ]]; then VIOLATIONS+=("$f"); fi
done

if [ "${#VIOLATIONS[@]}" -eq 0 ]; then
  echo "✅ Ningún archivo de la zona bloqueada fue tocado."
  exit 0
fi

# ── Overrides. El guard SIEMPRE evalúa e imprime qué se tocó — nunca se
#    auto-oculta. Si el autor es el owner del núcleo, es un "soft pass con
#    rastro" (queda en el log), no una exención silenciosa: el propósito de
#    este check no es solo bloquear, es marcar visiblemente.
if [ "$PR_AUTHOR" = "$CORE_OWNER" ]; then
  echo "::notice::PR autorado por @${CORE_OWNER} (owner del núcleo) — guard informativo."
  printf '::notice::  toca %s\n' "${VIOLATIONS[@]}"
  exit 0
fi

# Label de override: válido SOLO si lo aplicó el owner del núcleo — los
# diseñadores tienen write y podrían ponérselo solos si no se verificara el
# actor del evento, no solo la presencia del label.
LABEL_ACTOR=$(gh api "repos/${GH_REPO}/issues/${PR_NUMBER}/events" \
  --paginate --jq "[.[] | select(.event==\"labeled\" and .label.name==\"${OVERRIDE_LABEL}\") | .actor.login] | last // empty")

if [ "$LABEL_ACTOR" = "$CORE_OWNER" ]; then
  echo "::warning::Override '${OVERRIDE_LABEL}' aplicado por @${CORE_OWNER}. Permitido."
  printf '::warning::  toca %s\n' "${VIOLATIONS[@]}"
  exit 0
fi

if [ -n "$LABEL_ACTOR" ]; then
  echo "::error::El label '${OVERRIDE_LABEL}' lo aplicó @${LABEL_ACTOR}, no @${CORE_OWNER}. Override inválido."
fi

echo "::error::Este PR modifica archivos de la zona bloqueada:"
for f in "${VIOLATIONS[@]}"; do
  echo "::error file=${f},line=1::Zona bloqueada (owner: @${CORE_OWNER}). Revertí este archivo o pedí a @${CORE_OWNER} el label '${OVERRIDE_LABEL}'."
done
exit 1
