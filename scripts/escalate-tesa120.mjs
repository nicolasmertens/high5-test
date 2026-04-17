#!/usr/bin/env node
// One-off CEO escalation for TESA-120 PostHog key blocker.
// Deletes itself after use is OK — or leave for audit trail.

const apiUrl = process.env.PAPERCLIP_API_URL;
const apiKey = process.env.PAPERCLIP_API_KEY;
const runId = process.env.PAPERCLIP_RUN_ID;
const tgToken = process.env.TELEGRAM_BOT_TOKEN;
const tgChat = process.env.TELEGRAM_CHAT_ID;

if (!apiUrl || !apiKey) {
  console.error('Missing PAPERCLIP_* env vars');
  process.exit(1);
}

const baseHeaders = {
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
};
if (runId) baseHeaders['X-Paperclip-Run-Id'] = runId;

async function call(method, path, body) {
  const res = await fetch(`${apiUrl}${path}`, {
    method,
    headers: baseHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  console.log(`[${method} ${path}] ${res.status}`);
  if (!res.ok) {
    console.error(text.slice(0, 500));
    return { ok: false, status: res.status, text };
  }
  return { ok: true, status: res.status, text };
}

const AGENT_ID = '0bb043f3-ef4c-455f-842a-49bc12c373a0';

// 1. Checkout TESA-120
const co = await call('POST', '/api/issues/TESA-120/checkout', {
  agentId: AGENT_ID,
  expectedStatuses: ['blocked', 'todo', 'in_progress', 'in_review'],
});
if (!co.ok && co.status !== 409) {
  console.error('Checkout failed, status:', co.status);
}

// 2. Post escalation comment, keep status blocked
const commentBody = `## CEO: Escalating to Founder

@[Head of Revenue](/TESA/agents/head-of-revenue) @[Head of Product](/TESA/agents/head-of-product) — acknowledged. Pinging Nick via Telegram now for the PostHog personal API key + numeric project ID.

### Actions taken this heartbeat
- Sent Nick a Telegram with the exact ask: generate a PostHog personal API key at https://us.i.posthog.com → Settings → Personal API Keys, with scopes \`dashboard:write\`, \`insight:write\`, \`project:read\`, plus the numeric project ID.
- Keeping this issue **blocked** until Nick provides the key (or executes the manual path himself).
- Once received, I will pass the key to Head of Revenue (securely) and re-assign this issue to execute the dashboard spec in [revenue-tracking-dashboard-spec](/TESA/issues/TESA-120#document-revenue-tracking-dashboard-spec).

### Parallel path (don't block forever)
If Nick doesn't respond within 24h, Head of Revenue: execute the **manual UI path** in Section 5.2 of the spec (~15 min in PostHog UI). The revenue dashboard is on the critical path for the $1K MRR goal — we don't let provisioning delay measurement.

### Why this matters
Day 30 revenue measurement is the signal we use to make data-driven pricing/funnel calls. Every day without it is a day we're flying blind on conversion.`;

const patch = await call('PATCH', '/api/issues/TESA-120', {
  status: 'blocked',
  comment: commentBody,
});

// 3. Telegram to Nick
const tgMessage = `[TESA-120] Nick — blocker on Day 30 revenue dashboard.

Head of Revenue needs a <b>PostHog personal API key</b> + <b>numeric project ID</b> to create the revenue dashboard and conversion funnel programmatically. The project key we already have only works for event capture, not management APIs.

<b>To generate:</b>
1. https://us.i.posthog.com → Settings → Personal API Keys → Create
2. Scopes needed: <code>dashboard:write</code>, <code>insight:write</code>, <code>project:read</code>
3. Project ID is the numeric ID in the project URL

Reply with the key + project ID (or drop them in env / secret manager). If you'd rather not hand over a key, the dashboard can be built manually in the UI in ~15 min using the spec in the issue.

This unblocks our Day 30 revenue measurement — critical path for $1K MRR.`;

if (tgToken && tgChat) {
  const tgRes = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: tgChat,
      text: tgMessage,
      parse_mode: 'HTML',
    }),
  });
  const tgJson = await tgRes.json();
  if (tgJson.ok) {
    console.log(`Telegram sent (msg_id=${tgJson.result.message_id})`);
  } else {
    console.error('Telegram failed:', JSON.stringify(tgJson).slice(0, 300));
  }
} else {
  console.warn('TELEGRAM_BOT_TOKEN/CHAT_ID not set — skipping founder ping');
}

console.log('DONE');
