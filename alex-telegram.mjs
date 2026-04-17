#!/usr/bin/env node
// Alex CEO — Telegram interface between Nick (founder) and the 1Test agent team
// v2: fixed poll loop, message processing, error recovery

import { execSync, spawn } from 'node:child_process';
import { appendFileSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const DB_URL = process.env.DATABASE_URL || 'postgres://paperclip:paperclip@localhost:5432/paperclip';
const COMPANY_ID = '33d9cfce-bb56-429f-85f5-1c25231f694e';
const LOG_FILE = '/opt/1test/alex-telegram.log';
const OFFSET_FILE = '/opt/1test/.alex-telegram-offset';
const POLL_TIMEOUT = 30;
const CLAUDE_TIMEOUT = 180000; // 3 minutes — long messages need time

const AGENTS = {
  alex:  '0bb043f3-ef4c-455f-842a-49bc12c373a0',
  clara: '78260e05-4cb6-4003-9e2c-aa0f3566ab36',
  oscar: 'db96f691-3b82-42c6-8b57-c3f122317509',
  leo:   '1542ab63-af63-480b-9c45-02dcf91671fa',
  emma:  '03d08268-10ed-42ae-97ab-2a1d5ad31a4d',
  lucas: '84f58e93-c0bc-48fc-a267-3a9432e3001e',
};

function log(level, msg) {
  const ts = new Date().toISOString();
  const line = `${ts} [alex] ${level} ${msg}\n`;
  process.stdout.write(line);
  try { appendFileSync(LOG_FILE, line); } catch {}
}

// === Telegram API ===
async function tg(method, params = {}) {
  const timeout = method === 'getUpdates' ? (POLL_TIMEOUT + 10) * 1000 : 15000;
  try {
    const resp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(timeout),
    });
    const data = await resp.json();
    if (!data.ok) {
      log('WARN', `Telegram ${method} error: ${JSON.stringify(data).slice(0, 200)}`);
      return null;
    }
    return data.result;
  } catch (e) {
    if (method !== 'getUpdates') log('WARN', `Telegram ${method} failed: ${e.message}`);
    return null;
  }
}

async function sendMessage(text) {
  if (!text) return;
  if (text.length > 4000) text = text.slice(0, 3997) + '...';
  const result = await tg('sendMessage', { chat_id: CHAT_ID, text, parse_mode: 'Markdown' });
  if (!result) {
    await tg('sendMessage', { chat_id: CHAT_ID, text });
  }
}

// === Database ===
function dbQuery(sql) {
  try {
    const cleaned = sql.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    return execSync(`psql "${DB_URL}" -t -A -F '|' -c ${JSON.stringify(cleaned)}`, {
      timeout: 10000, encoding: 'utf-8'
    }).trim();
  } catch (e) {
    log('WARN', `DB query failed: ${e.message.slice(0, 200)}`);
    return '';
  }
}

function getOpenIssues() {
  const raw = dbQuery(`
    SELECT identifier, title, status, priority,
      (SELECT name FROM agents WHERE id = assignee_agent_id) as assigned_to
    FROM issues
    WHERE company_id = '${COMPANY_ID}'
      AND status NOT IN ('done', 'cancelled')
    ORDER BY
      CASE priority
        WHEN 'urgent' THEN 0 WHEN 'critical' THEN 1
        WHEN 'high' THEN 2 WHEN 'medium' THEN 3
        WHEN 'low' THEN 4 ELSE 5
      END, created_at DESC
    LIMIT 20;
  `);
  if (!raw) return 'No open issues found.';
  return raw.split('\n').map(line => {
    const [id, title, status, priority, assignee] = line.split('|');
    return `${id} [${priority}] ${title} → ${assignee || 'unassigned'} (${status})`;
  }).join('\n');
}

function getNextIdentifier() {
  const raw = dbQuery(`
    SELECT COALESCE(MAX(CAST(SUBSTRING(identifier FROM 6) AS INTEGER)), 0) + 1
    FROM issues WHERE company_id = '${COMPANY_ID}';
  `);
  return parseInt(raw) || 145;
}

// === Conversation History ===
const conversationHistory = [];

function addToHistory(role, content) {
  conversationHistory.push({ role, content: content.slice(0, 500) });
  while (conversationHistory.length > MAX_HISTORY * 2) conversationHistory.shift();
}
const MAX_HISTORY = 5;

function formatHistory() {
  if (conversationHistory.length === 0) return '';
  return '\n\nRecent conversation:\n' +
    conversationHistory.map(m => `${m.role === 'user' ? 'Nick' : 'Alex'}: ${m.content}`).join('\n');
}

// === Claude CLI ===
function buildSystemPrompt(boardState) {
  return `You are Alex, CEO of 1Test.me, talking to your founder Nick on Telegram.

You are the intelligent interface between Nick and the team. When Nick messages you:

1. RESPOND conversationally — short, clear, like a sharp CEO. No fluff.
2. TRIAGE the message:
   - Process rule ("check builds", "never do X") → Update the relevant agent's AGENTS.md file
   - Product feedback ("add feature X", "the results page needs Y") → Create a Kanban issue with proper priority and assignment
   - Quick unblock ("the site is down", "approve X") → Act immediately
   - Strategic direction ("pivot to recruiters", "kill feature Y") → Create issues and update strategy
   - Style/design ("I hate the font", "change the color") → Create issue for Clara (spec) + Leo (implement)
   - Compliments or casual chat → Respond naturally, briefly
3. CONFIRM what you did — "Created TESA-137 for Leo: fix the mobile nav. P1."
4. If you need clarification, ASK — have a back-and-forth.

Your team (with Paperclip DB agent UUIDs):
- Clara (${AGENTS.clara}) — Product Architect: specs features, fills backlogs
- Oscar (${AGENTS.oscar}) — Engineer: backend, infra, Stripe, database
- Leo (${AGENTS.leo}) — Frontend Engineer: UI, components, test UX
- Emma (${AGENTS.emma}) — Head of Growth: SEO, outbound, all channels
- Lucas (${AGENTS.lucas}) — Lifecycle Agent: email nurture, retention

Your own UUID: ${AGENTS.alex}
Company ID: ${COMPANY_ID}

ACTIONS — use Bash tool to run psql commands when needed:

To create an issue:
  psql "postgres://paperclip:paperclip@localhost:5432/paperclip" -c "INSERT INTO issues (company_id, title, description, status, priority, assignee_agent_id, created_by_agent_id, identifier, created_at, updated_at) VALUES ('${COMPANY_ID}', '<title>', '<description>', 'todo', '<priority>', '<agent_uuid>', '${AGENTS.alex}', 'TESA-<N>', NOW(), NOW());"

Next available identifier number: TESA-${getNextIdentifier()}

Priority values: urgent, critical, high, medium, low

To update an issue:
  psql "postgres://paperclip:paperclip@localhost:5432/paperclip" -c "UPDATE issues SET status='<status>', updated_at=NOW() WHERE identifier='TESA-<N>' AND company_id='${COMPANY_ID}';"

Current board state:
${boardState}

Keep responses short. Nick is busy. 2-3 sentences max unless he asks for detail. Do NOT use markdown headers. Plain text for Telegram.`;
}

function askClaude(userMessage) {
  return new Promise((resolve, reject) => {
    const boardState = getOpenIssues();
    const systemPrompt = buildSystemPrompt(boardState);
    const history = formatHistory();
    const userPrompt = history
      ? `Previous conversation:${history}\n\nNick says: ${userMessage}`
      : `Nick says: ${userMessage}`;

    const args = [
      '--print',
      '--dangerously-skip-permissions',
      '-p', userPrompt,
      '--append-system-prompt', systemPrompt,
      '--allowedTools', 'Bash(read_only:false),Read,Edit,Write',
      '--max-turns', '5',
    ];

    let stdout = '';
    let stderr = '';
    let done = false;

    const proc = spawn('claude', args, {
      env: { ...process.env, HOME: '/root' },
      cwd: '/opt/1test',
    });

    proc.stdout.on('data', (d) => { stdout += d.toString(); });
    proc.stderr.on('data', (d) => { stderr += d.toString(); });

    const finish = (result, err) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      if (err) reject(err);
      else resolve(result);
    };

    const timer = setTimeout(() => {
      log('WARN', 'Claude CLI timeout, killing process');
      proc.kill('SIGTERM');
      setTimeout(() => {
        try { proc.kill('SIGKILL'); } catch {}
      }, 5000);
      finish(null, new Error('Claude CLI timed out after 3 minutes'));
    }, CLAUDE_TIMEOUT);

    proc.on('close', (code) => {
      const text = stdout.trim();
      if (text) {
        finish(text.slice(0, 4000));
      } else {
        log('WARN', `Claude exited ${code}, no output. stderr: ${stderr.slice(0, 300)}`);
        finish(null, new Error(`Claude exited ${code} with no output`));
      }
    });

    proc.on('error', (err) => {
      finish(null, err);
    });
  });
}

// === Image handling ===
const IMG_DIR = '/opt/1test/telegram-images';
try { mkdirSync(IMG_DIR, { recursive: true }); } catch {}

async function downloadTelegramFile(fileId) {
  const fileInfo = await tg('getFile', { file_id: fileId });
  if (!fileInfo?.file_path) return null;
  const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileInfo.file_path}`;
  const resp = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!resp.ok) return null;
  const ext = fileInfo.file_path.split('.').pop() || 'jpg';
  const localPath = join(IMG_DIR, `${fileId}.${ext}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  writeFileSync(localPath, buf);
  log('INFO', `Downloaded image: ${localPath} (${buf.length} bytes)`);
  return localPath;
}

async function getImagePaths(msg) {
  const paths = [];
  if (msg.photo && msg.photo.length > 0) {
    const largest = msg.photo[msg.photo.length - 1];
    const p = await downloadTelegramFile(largest.file_id);
    if (p) paths.push(p);
  }
  if (msg.document && msg.document.mime_type?.startsWith('image/')) {
    const p = await downloadTelegramFile(msg.document.file_id);
    if (p) paths.push(p);
  }
  return paths;
}

// === Message Processing ===
async function processMessage(text, imagePaths = []) {
  const hasImages = imagePaths.length > 0;
  log('INFO', `Processing: ${text.slice(0, 120)}${hasImages ? ` [+${imagePaths.length} images]` : ''}`);
  addToHistory('user', text);

  tg('sendChatAction', { chat_id: CHAT_ID, action: 'typing' });

  try {
    let prompt = text;
    if (hasImages) {
      const imageInstructions = imagePaths.map(p => `Use the Read tool to view the image at ${p} — it contains visual context for this message.`).join('\n');
      prompt = `${text}\n\n${imageInstructions}`;
    }
    const response = await askClaude(prompt);
    addToHistory('assistant', response);
    await sendMessage(response);
    log('INFO', `Sent: ${response.slice(0, 120)}`);
  } catch (e) {
    log('ERROR', `Claude failed: ${e.message}`);
    await sendMessage("Hit a snag processing that. Give me a sec and try again.");
  }
}

// === Offset ===
function loadOffset() {
  try {
    if (existsSync(OFFSET_FILE)) return parseInt(readFileSync(OFFSET_FILE, 'utf-8').trim()) || 0;
  } catch {}
  return 0;
}

function saveOffset(n) {
  try { writeFileSync(OFFSET_FILE, String(n)); } catch {}
}

// === Main ===
let running = true;
process.on('SIGTERM', () => { running = false; log('INFO', 'SIGTERM received'); });
process.on('SIGINT', () => { running = false; log('INFO', 'SIGINT received'); });

async function main() {
  if (!BOT_TOKEN || !CHAT_ID) {
    log('FATAL', 'TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID required');
    process.exit(1);
  }

  log('INFO', `Starting. Chat ID: ${CHAT_ID}`);

  // DO NOT skip pending messages — process them so nothing gets lost
  let offset = loadOffset();
  log('INFO', `Resuming from offset ${offset}`);

  while (running) {
    try {
      const updates = await tg('getUpdates', {
        offset,
        timeout: POLL_TIMEOUT,
        allowed_updates: ['message'],
      });

      if (!updates) {
        // tg() returned null — API error, wait and retry
        await new Promise(r => setTimeout(r, 5000));
        continue;
      }

      for (const update of updates) {
        offset = update.update_id + 1;
        saveOffset(offset);

        const msg = update.message;
        if (!msg) continue;

        if (String(msg.chat?.id) !== CHAT_ID) {
          log('WARN', `Ignoring chat ${msg.chat?.id}`);
          continue;
        }

        const text = msg.text || msg.caption || '';
        const hasMedia = !!(msg.photo || (msg.document && msg.document.mime_type?.startsWith('image/')));

        if (!text && !hasMedia) continue;

        try {
          const imagePaths = hasMedia ? await getImagePaths(msg) : [];
          const messageText = text || '(image sent without caption — describe what you see)';
          await processMessage(messageText, imagePaths);
        } catch (e) {
          log('ERROR', `processMessage crashed: ${e.message}`);
          await sendMessage("Something went wrong. Try again.");
        }
      }
    } catch (e) {
      if (e.name === 'TimeoutError' || e.message?.includes('timeout') || e.message?.includes('abort')) {
        continue;
      }
      log('ERROR', `Poll error: ${e.message}`);
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  log('INFO', 'Stopped');
}

main().catch(e => {
  log('FATAL', e.message);
  process.exit(1);
});
