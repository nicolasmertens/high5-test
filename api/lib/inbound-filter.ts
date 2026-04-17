import type { ResendInboundPayload } from "./inbound-types.js";
import { gcsSetWithTTL } from "./gcs-storage.js";

export type FilterRule = "precedence_bulk" | "list_unsubscribe" | "sender_noise";

interface HeaderFilterResult {
  filtered: false;
}

interface HeaderFilterResultBlocked {
  filtered: true;
  rule: FilterRule;
}

type FilterResult = HeaderFilterResult | HeaderFilterResultBlocked;

const NOISE_FROM_PATTERNS = [
  /@stripe\.com$/i,
  /@mail\.stripe\.com$/i,
  /@github\.com$/i,
  /@noreply\.github\.com$/i,
  /@posthog\.com$/i,
  /@notifications\.github\.com$/i,
  /^noreply@/i,
  /^no-reply@/i,
  /^mailer-daemon@/i,
  /^postmaster@/i,
  /^bounce[s]?@/i,
  /^do-not-reply@/i,
  /^donotreply@/i,
];

function filterKey(id: string): string {
  return `inbound/filtered/${id}.json`;
}

export function checkInboundHeaders(payload: ResendInboundPayload): FilterResult {
  const from = (payload.from || "").toLowerCase();

  if (NOISE_FROM_PATTERNS.some((p) => p.test(from))) {
    return { filtered: true, rule: "sender_noise" };
  }

  const headers = payload.headers || [];
  for (const h of headers) {
    const name = (h.name || "").toLowerCase();
    const value = (h.value || "").toLowerCase().trim();

    if (name === "precedence" && value === "bulk") {
      return { filtered: true, rule: "precedence_bulk" };
    }

    if (name === "list-unsubscribe") {
      return { filtered: true, rule: "list_unsubscribe" };
    }
  }

  return { filtered: false };
}

export async function logFilteredEmail(
  payload: ResendInboundPayload,
  rule: FilterRule,
): Promise<void> {
  const entry = {
    id: crypto.randomUUID(),
    resendId: payload.id || crypto.randomUUID(),
    from: payload.from,
    subject: payload.subject,
    matchedRule: rule,
    filteredAt: Date.now(),
  };

  await gcsSetWithTTL(filterKey(entry.id), entry, 60 * 60 * 24 * 90);

  console.log(
    `Inbound email filtered: id=${entry.id} resendId=${entry.resendId} from=${entry.from} rule=${rule} subject="${entry.subject}"`,
  );
}

export type EmailRoute = "alex" | "oscar" | "clara" | "leo" | "emma" | "lucas" | "general";

const AGENT_EMAIL_MAP: Record<string, EmailRoute> = {
  "alex@1test.me": "alex",
  "oscar@1test.me": "oscar",
  "clara@1test.me": "clara",
  "leo@1test.me": "leo",
  "emma@1test.me": "emma",
  "lucas@1test.me": "lucas",
  "hello@1test.me": "alex",
  "support@1test.me": "alex",
  "privacy@1test.me": "alex",
};

export function routeByRecipient(to: string[]): EmailRoute {
  for (const addr of to) {
    const normalized = addr.toLowerCase().trim();
    const route = AGENT_EMAIL_MAP[normalized];
    if (route) return route;
  }
  return "alex";
}

const RECRUITER_PATTERNS = [
  /\brecruit/i,
  /\btalent\b/i,
  /\bstaffing\b/i,
  /\bhiring\b/i,
  /\bheadhunt/i,
  /\bopportunit/i,
  /\bposition\b/i,
  /\bopening\b/i,
];

export function deriveEmailPriority(
  from: string,
  subject: string,
  isPayingUser: boolean,
): "high" | "medium" | "low" {
  if (isPayingUser) return "high";
  if (RECRUITER_PATTERNS.some((p) => p.test(subject) || p.test(from))) return "high";
  return "medium";
}
