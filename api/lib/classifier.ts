import type { EmailCategory } from "./inbound-types";

const CATEGORY_KEYWORDS: Record<EmailCategory, string[]> = {
  billing_finance: [
    "invoice",
    "receipt",
    "payment",
    "refund",
    "charge",
    "billing",
    "subscription",
    "cancel subscription",
    "unsubscribe",
    "overcharged",
    "transaction",
    "statement",
    "debit",
    "credit",
    "bank",
    "paypal",
    "stripe",
  ],
  partnership_outreach: [
    "partner",
    "affiliate",
    "press",
    "media",
    "collaboration",
    "sponsor",
    "collab",
    "influencer",
    "brand deal",
    "promotion",
    "guest post",
    "backlink",
    "seo partnership",
  ],
  general_support: [
    "help",
    "question",
    "results",
    "account",
    "test",
    "password",
    "login",
    "access",
    "can't",
    "cannot",
    "broken",
    "error",
    "not working",
    "how do i",
    "where is",
    "gdpr",
    "data",
    "delete my data",
    "privacy",
    "pricing",
    "cost",
    "how much",
    "free",
    "upgrade",
  ],
  spam_noise: [
    "viagra",
    "casino",
    "lottery",
    "winner",
    "congratulations you have won",
    "nigerian",
    "prince",
    "millions",
    "click here",
    "buy cheap",
    "enlargement",
    "pharmacy",
  ],
};

const SPAM_FROM_PATTERNS = [
  /noreply@/i,
  /no-reply@/i,
  /mailer-daemon@/i,
  /postmaster@/i,
];

const SPAM_SUBJECT_PATTERNS = [
  /^\[spam\]/i,
  /^\[bulk\]/i,
  /^undelivered/i,
  /^mail delivery failed/i,
  /^delivery status notification/i,
  /^out of office/i,
  /^auto:/i,
  /^automated reply/i,
];

export function classifyEmail(
  subject: string,
  text: string,
  from: string,
  html: string,
): EmailCategory {
  const combinedText = `${subject} ${text || ""} ${(html || "").replace(/<[^>]*>/g, " ")}`.toLowerCase();

  if (SPAM_FROM_PATTERNS.some((p) => p.test(from))) {
    return "spam_noise";
  }

  if (SPAM_SUBJECT_PATTERNS.some((p) => p.test(subject))) {
    return "spam_noise";
  }

  const spamScore = CATEGORY_KEYWORDS.spam_noise.filter((kw) =>
    combinedText.includes(kw.toLowerCase()),
  ).length;
  if (spamScore >= 2) {
    return "spam_noise";
  }

  const billingScore = CATEGORY_KEYWORDS.billing_finance.filter((kw) =>
    combinedText.includes(kw.toLowerCase()),
  ).length;
  const partnershipScore = CATEGORY_KEYWORDS.partnership_outreach.filter((kw) =>
    combinedText.includes(kw.toLowerCase()),
  ).length;
  const supportScore = CATEGORY_KEYWORDS.general_support.filter((kw) =>
    combinedText.includes(kw.toLowerCase()),
  ).length;

  if (billingScore >= 2 && billingScore > partnershipScore && billingScore > supportScore) {
    return "billing_finance";
  }

  if (partnershipScore >= 2 && partnershipScore > billingScore && partnershipScore > supportScore) {
    return "partnership_outreach";
  }

  if (supportScore >= 1) {
    return "general_support";
  }

  if (billingScore >= 1) {
    return "billing_finance";
  }

  if (partnershipScore >= 1) {
    return "partnership_outreach";
  }

  return "general_support";
}

export function shouldAutoRespond(category: EmailCategory): boolean {
  return category === "general_support";
}

export function shouldFlagForReview(category: EmailCategory): boolean {
  return category === "billing_finance" || category === "partnership_outreach";
}

export function isRefundRequest(subject: string, text: string): boolean {
  const combined = `${subject} ${text || ""}`.toLowerCase();
  return /\brefund\b/.test(combined);
}