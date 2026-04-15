import { Redis } from "@upstash/redis";
import type { InboundEmail, EmailCategory, EmailStatus } from "./inbound-types";
import { classifyEmail, shouldAutoRespond, shouldFlagForReview, isRefundRequest } from "./classifier";
import { sendAutoResponse } from "./auto-responder";
import { postHogTrack } from "./send";

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error("UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set");
    }
    redis = new Redis({ url, token });
  }
  return redis;
}

const EMAIL_PREFIX = "inbound:";
const EMAIL_INDEX_PREFIX = "inbound_idx:";

function emailKey(id: string): string {
  return `${EMAIL_PREFIX}${id}`;
}

const fromIndexKey = (from: string) => `${EMAIL_INDEX_PREFIX}from:${from.toLowerCase()}`;
const categoryIndexKey = (cat: EmailCategory) => `${EMAIL_INDEX_PREFIX}cat:${cat}`;
const flaggedIndexKey = `${EMAIL_INDEX_PREFIX}flagged`;

export async function storeInboundEmail(
  payload: {
    resendId: string;
    from: string;
    to: string[];
    subject: string;
    html: string;
    text: string;
    replyTo: string[];
    attachments: Array<{ id: string; filename: string; contentType: string; size: number }>;
  },
): Promise<InboundEmail> {
  const now = Date.now();
  const category = classifyEmail(payload.subject, payload.text, payload.from, payload.html);
  const flaggedForReview = shouldFlagForReview(category) || isRefundRequest(payload.subject, payload.text);
  const reviewReason = flaggedForReview
    ? isRefundRequest(payload.subject, payload.text)
      ? "refund_request"
      : category === "billing_finance"
        ? "financial_review"
        : "ceo_review"
    : null;

  const email: InboundEmail = {
    id: crypto.randomUUID(),
    resendId: payload.resendId,
    from: payload.from,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
    replyTo: payload.replyTo,
    category,
    status: "new",
    autoResponseSent: false,
    autoResponseTemplate: null,
    flaggedForReview,
    reviewReason,
    attachments: payload.attachments,
    receivedAt: now,
    classifiedAt: now,
  };

  const kv = getRedis();

  const wantsAutoResponse = shouldAutoRespond(category) || (flaggedForReview && category === "refund");

  if (wantsAutoResponse) {
    const result = await sendAutoResponse(email);
    if (result.success) {
      email.autoResponseSent = true;
      email.autoResponseTemplate = result.templateUsed;
    }
  }

  if (category === "spam_noise") {
    email.status = "closed";
  } else if (flaggedForReview) {
    email.status = "triaged";
  } else if (email.autoResponseSent) {
    email.status = "responded";
  } else {
    email.status = "triaged";
  }

  await kv.set(emailKey(email.id), JSON.stringify(email));
  await kv.set(fromIndexKey(payload.from), email.id);
  await kv.sadd(categoryIndexKey(category), email.id);
  if (flaggedForReview) {
    await kv.sadd(flaggedIndexKey, email.id);
  }

  await postHogTrack("inbound_email_received", {
    distinct_id: payload.from,
    email_category: category,
    email_status: email.status,
    auto_responded: email.autoResponseSent,
    flagged_for_review: flaggedForReview,
  });

  return email;
}

export async function getInboundEmail(id: string): Promise<InboundEmail | null> {
  const kv = getRedis();
  const raw = await kv.get<Record<string, unknown>>(emailKey(id));
  if (!raw) return null;
  return raw as unknown as InboundEmail;
}

export async function getInboundEmailsByCategory(category: EmailCategory): Promise<string[]> {
  const kv = getRedis();
  return kv.smembers<string>(categoryIndexKey(category));
}

export async function getFlaggedEmails(): Promise<string[]> {
  const kv = getRedis();
  return kv.smembers<string>(flaggedIndexKey);
}

export async function updateInboundEmailStatus(
  id: string,
  status: EmailStatus,
): Promise<InboundEmail | null> {
  const email = await getInboundEmail(id);
  if (!email) return null;
  email.status = status;
  const kv = getRedis();
  await kv.set(emailKey(id), JSON.stringify(email));
  return email;
}