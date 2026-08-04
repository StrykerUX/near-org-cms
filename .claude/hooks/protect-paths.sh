#!/bin/bash
# Hook PreToolUse — capa dura adicional, independiente del `deny`
# declarativo de settings.json (que un settings.local.json puede anular).
# Este hook corre ANTES de la evaluación de permisos y bloquea con exit 0 +
# un JSON de decisión — no depende de que el usuario no haya tocado su
# settings.local.json.
#
# Registrado en .claude/settings.json → hooks.PreToolUse, con
# matcher: "Read|Edit|Write".

set -euo pipefail

STDIN=$(cat)
TOOL_NAME=$(echo "$STDIN" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$STDIN" | jq -r '.tool_input.file_path // empty')

if [[ -z "$TOOL_NAME" || -z "$FILE_PATH" ]]; then
  exit 0
fi

LOG_FILE="${CLAUDE_PROJECT_DIR:-.}/.claude/access.log"
mkdir -p "$(dirname "$LOG_FILE")" 2>/dev/null || true
echo "$(date -u +%FT%TZ) ${TOOL_NAME} ${FILE_PATH}" >> "$LOG_FILE" 2>/dev/null || true

# .env: ni siquiera LEER — puede contener credenciales reales.
ENV_ERE='(^|/)\.env'
if [[ "$FILE_PATH" =~ $ENV_ERE ]]; then
  jq -n --arg reason "Nunca se lee ni edita .env* — puede contener credenciales reales." \
    '{hookSpecificOutput: {hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: $reason}}'
  exit 0
fi

# El resto de la zona bloqueada: solo Edit/Write, no Read — leer código
# para entenderlo no es un riesgo, editarlo/escribirlo sí. Mismas zonas que
# .github/scripts/path-guard.sh y eslint.config.zones.mjs — mantener
# sincronizado.
if [[ "$TOOL_NAME" == "Edit" || "$TOOL_NAME" == "Write" ]]; then
  PROTECTED_ERE='(^|/)(packages/cms-core|proxy\.ts|app/admin|app/api|app/[^/]*/page\.tsx|app/[^/]*/layout\.tsx|app/[^/]*/route\.ts|app/sitemap\.ts|app/robots\.ts|app/globals\.css|components/ui|components/site|components/blog|lib|scripts|docs|next\.config\.ts|vercel\.json|package\.json|pnpm-lock\.yaml|tsconfig\.json|\.github|CLAUDE\.md|\.claude)($|/)'
  if [[ "$FILE_PATH" =~ $PROTECTED_ERE ]]; then
    jq -n \
      --arg reason "Ruta protegida para la zona diseñadores: $FILE_PATH. Si necesitás un cambio aquí, pedíselo al ingeniero — no lo edites directamente." \
      '{hookSpecificOutput: {hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: $reason}}'
    exit 0
  fi
fi

exit 0
