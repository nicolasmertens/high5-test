#!/bin/bash
curl -sH "Authorization: Bearer $PAPERCLIP_API_KEY" "$PAPERCLIP_API_URL/api/agents/me/inbox-lite"
