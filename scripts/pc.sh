#!/usr/bin/env bash
# Paperclip API helper
# Usage: pc.sh <METHOD> <PATH> [JSON_BODY_FILE|-d JSON_STRING]
set -euo pipefail

METHOD="${1:-GET}"
ENDPOINT="${2:-/api/agents/me}"
shift 2 || true

ARGS=(-sS -X "$METHOD"
  -H "Authorization: Bearer ${PAPERCLIP_API_KEY}"
  -H "X-Paperclip-Run-Id: ${PAPERCLIP_RUN_ID:-}"
  -H "Content-Type: application/json")

if [ $# -gt 0 ]; then
  if [ "$1" = "-d" ]; then
    ARGS+=(-d "$2")
  elif [ "$1" = "-f" ]; then
    ARGS+=(--data-binary "@$2")
  fi
fi

curl "${ARGS[@]}" "${PAPERCLIP_API_URL}${ENDPOINT}"
