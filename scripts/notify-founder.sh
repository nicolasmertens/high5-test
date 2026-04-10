#!/usr/bin/env bash
set -euo pipefail

TOKEN="${TELEGRAM_BOT_TOKEN:?TELEGRAM_BOT_TOKEN is not set}"
CHAT_ID="${TELEGRAM_CHAT_ID:?TELEGRAM_CHAT_ID is not set}"

if [ $# -eq 0 ] && [ -t 0 ]; then
  echo "Usage: notify-founder.sh <message>" >&2
  echo "   or: echo <message> | notify-founder.sh" >&2
  echo "" >&2
  echo "Sends an urgent notification to the Founder via Telegram." >&2
  echo "" >&2
  echo "Required env vars:" >&2
  echo "  TELEGRAM_BOT_TOKEN  - Telegram bot token from @BotFather" >&2
  echo "  TELEGRAM_CHAT_ID    - Founder's Telegram chat ID" >&2
  echo "" >&2
  echo "Options:" >&2
  echo "  --test    Send a test message confirming the integration works" >&2
  echo "  --raw     Skip the [1TEST] prefix (send message as-is)" >&2
  exit 1
fi

RAW=false
TEST=false

while [ $# -gt 0 ]; do
  case "$1" in
    --test) TEST=true; shift ;;
    --raw)  RAW=true; shift ;;
    *)      break ;;
  esac
done

if $TEST; then
  MESSAGE="[1TEST] Integration test — Telegram bot is working. If you received this, urgent notifications are live."
elif [ $# -gt 0 ]; then
  MESSAGE="$*"
else
  MESSAGE="$(cat)"
fi

if ! $RAW && ! $TEST; then
  case "$MESSAGE" in
    "[1TEST]"*) ;;
    "[1TEST BLOCKER]"*) ;;
    *) MESSAGE="[1TEST] $MESSAGE" ;;
  esac
fi

PAYLOAD=$(cat <<EOF
{
  "chat_id": "${CHAT_ID}",
  "text": $(echo "$MESSAGE" | python3 -c 'import sys,json; print(json.dumps(sys.stdin.read()))'),
  "parse_mode": "HTML"
}
EOF
)

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "https://api.telegram.org/bot${TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -ne 200 ]; then
  echo "ERROR: Telegram API returned HTTP $HTTP_CODE" >&2
  echo "$BODY" >&2
  exit 1
fi

OK=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin).get('ok',''))")
if [ "$OK" != "True" ]; then
  echo "ERROR: Telegram API returned an error" >&2
  echo "$BODY" >&2
  exit 1
fi

MSG_ID=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin).get('result',{}).get('message_id',''))")
echo "Message sent successfully (message_id: ${MSG_ID})"