import type { InboundEmail, EmailCategory, EmailStatus } from "./inbound-types.js";
import { classifyEmail, shouldAutoRespond, shouldFlagForReview, isRefundRequest } from "./classifier.js";
import { routeByRecipient, deriveEmailPriority } from "./inbound-filter.js";
import { sendAutoResponse } from "./auto-responder.js";
import { postHogTrack, sendTelegramAlert } from "./send.js";
import { getPaymentByEmail } from "./payment-storage.js";
import { gcsGet, gcsSet, gcsList, gcsSetWithTTL } from "./gcs-storage.js";

function emailKey(id: string): string {
  return `inbound/${id}.json`;
}

function fromIndexKey(from: string): string {
  return `inbound/from/${from.toLowerCase()}.json`;
}

const flaggedIndexPrefix = "inbound/flagged";

function extractEmailAddress(raw: string): string {
  const match = raw.match(/<([^>]+)>/);
  return (match ? match[1] : raw).trim().toLowerCase();
}

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
  const fromAddr = extractEmailAddress(payload.from);

  const [category, payment] = await Promise.all([
    Promise.resolve(classifyEmail(payload.subject, payload.text, payload.from, payload.html)),
    getPaymentByEmail(fromAddr).catch(() => null),
  ]);

  const isPayingUser = !!payment;
  const priority = deriveEmailPriority(payload.from, payload.subject, isPayingUser);
  const route = routeByRecipient(payload.to);

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
    priority,
    route,
    status: "new",
    autoResponseSent: false,
    autoResponseTemplate: null,
    flaggedForReview,
    reviewReason,
    attachments: payload.attachments,
    receivedAt: now,
    classifiedAt: now,
  };

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

  await gcsSetWithTTL(emailKey(email.id), email, 60 * 60 * 24 * 90);
  await gcsSet(fromIndexKey(payload.from), { emailId: email.id });
  await gcsSet(`inbound/cat/${category}/${email.id}.json`, { emailId: email.id });
  if (flaggedForReview) {
    await gcsSet(`${flaggedIndexPrefix}/${email.id}.json`, { emailId: email.id });
  }

  if (priority === "high" || flaggedForReview) {
    const priorityLabel = priority === "high" ? "🔴 HIGH" : "🟡 MEDIUM";
    const payingLabel = isPayingUser ? " (paying user)" : "";
    await sendTelegramAlert(
      `📬 *Inbound email — ${priorityLabel}*${payingLabel}\n` +
      `From: ${payload.from}\n` +
      `Subject: ${payload.subject}\n` +
      `Category: ${category} | Route: ${route}\n` +
      `ID: ${email.id}`,
    ).catch(() => {});
  }

  await postHogTrack("inbound_email_received", {
    distinct_id: fromAddr,
    email_category: category,
    email_priority: priority,
    email_route: route,
    email_status: email.status,
    auto_responded: email.autoResponseSent,
    flagged_for_review: flaggedForReview,
    is_paying_user: isPayingUser,
  });

  return email;
}

export async function getInboundEmail(id: string): Promise<InboundEmail | null> {
  return gcsGet<InboundEmail>(`inbound/${id}.json`);
}

export async function getInboundEmailsByCategory(category: EmailCategory): Promise<string[]> {
  const keys = await gcsList(`inbound/cat/${category}/`);
  const ids: string[] = [];
  for (const key of keys) {
    const entry = await gcsGet<{ emailId: string }>(key);
    if (entry) ids.push(entry.emailId);
  }
  return ids;
}

export async function getFlaggedEmails(): Promise<string[]> {
  const keys = await gcsList(`${flaggedIndexPrefix}/`);
  const ids: string[] = [];
  for (const key of keys) {
    const entry = await gcsGet<{ emailId: string }>(key);
    if (entry) ids.push(entry.emailId);
  }
  return ids;
}

export async function updateInboundEmailStatus(
  id: string,
  status: EmailStatus,
): Promise<InboundEmail | null> {
  const email = await getInboundEmail(id);
  if (!email) return null;
  email.status = status;
  await gcsSetWithTTL(`inbound/${id}.json`, email, 60 * 60 * 24 * 90);
  return email;
}
