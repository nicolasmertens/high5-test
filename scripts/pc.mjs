#!/usr/bin/env node
// Paperclip API helper in Node.js
// Usage:
//   node pc.mjs GET /api/agents/me/inbox-lite
//   node pc.mjs PATCH /api/issues/abc '{"status":"done"}'
//   node pc.mjs POST /api/issues/abc/comments -f body.json

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";

const [method, endpoint, ...rest] = process.argv.slice(2);
if (!method || !endpoint) {
  console.error("usage: pc.mjs METHOD /path [JSON_STRING | -f bodyfile]");
  process.exit(2);
}

let body;
if (rest[0] === "-f" && rest[1]) body = readFileSync(rest[1]);
else if (rest[0]) body = rest[0];

const base = process.env.PAPERCLIP_API_URL;
const key = process.env.PAPERCLIP_API_KEY;
const runId = process.env.PAPERCLIP_RUN_ID || "";
if (!base || !key) {
  console.error("missing PAPERCLIP_API_URL or PAPERCLIP_API_KEY");
  process.exit(2);
}

const res = await fetch(base + endpoint, {
  method,
  headers: {
    "Authorization": "Bearer " + key,
    "X-Paperclip-Run-Id": runId,
    "Content-Type": "application/json",
  },
  body,
});
const text = await res.text();

const outDir = "/opt/1test/.pc-cache";
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const stamp = Date.now();
const outFile = `${outDir}/${stamp}.json`;
writeFileSync(outFile, text);
console.log(`status=${res.status} bytes=${text.length} out=${outFile}`);
if (process.env.PC_PRINT === "1") console.log(text);
