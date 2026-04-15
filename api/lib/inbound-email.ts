import type { InboundEmail, EmailCategory, EmailStatus } from "./inbound-types";
import { classifyEmail, shouldAutoRespond, shouldFlagForReview, isRefundRequest } from "./classifier";
import { sendAutoResponse } from "./auto-responder";
import { postHogTrack } from "./send";
import { gcsGet, gcsSet, gcsList, gcsSetWithTTL } from "./gcs-storage";

function emailKey(id: string): string {
  return `inbound/${id}.json`;
}

function fromIndexKey(from: string): string {
  return `inbound/from/${from.toLowerCase()}.json`;
}

function categoryIndexKey(cat: EmailCategory): string {
  return `inbound/cat/${cat}`;
}

const flaggedIndexPrefix = "inbound/flagged";

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